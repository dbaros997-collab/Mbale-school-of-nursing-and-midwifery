"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { AdminFeesBundle } from "@/services/portal/admin/fees-types";
import type { PaginatedResult } from "@/services/portal/admin/fees-query-types";
import type { AdminFeeStudentRow } from "@/services/portal/admin/fees-types";
import type { AdminFeePaymentRow, FinanceStudentQuery } from "@/services/portal/admin/fees-query-types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFeeLedgerSync } from "@/hooks/useFeeLedgerSync";

type StudentQueryState = FinanceStudentQuery;

type ApiErrorBody = { message?: string; code?: string };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store", credentials: "same-origin" });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as ApiErrorBody;
      if (body.message) message = body.message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export function useAdminFinanceLedger(initialSummary?: AdminFeesBundle | null) {
  const [summary, setSummary] = useState<AdminFeesBundle | null>(initialSummary ?? null);
  const [students, setStudents] = useState<PaginatedResult<AdminFeeStudentRow> | null>(null);
  const [payments, setPayments] = useState<PaginatedResult<AdminFeePaymentRow> | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [studentQuery, setStudentQuery] = useState<StudentQueryState>({
    page: 1,
    pageSize: 50,
    sort: "balance",
    sortDir: "desc",
    clearance: "all",
    accountStatus: "all",
  });
  const [paymentQuery, setPaymentQuery] = useState<{
    page: number;
    pageSize: number;
    status: "all" | "completed" | "pending" | "failed";
    method: "all" | "bank" | "mtn" | "airtel" | "online";
  }>({
    page: 1,
    pageSize: 40,
    status: "all",
    method: "all",
  });
  const [studentSearch, setStudentSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const debouncedStudentSearch = useDebouncedValue(studentSearch, 280);
  const debouncedPaymentSearch = useDebouncedValue(paymentSearch, 280);
  const [loadingSummary, setLoadingSummary] = useState(!initialSummary);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [, startTransition] = useTransition();
  const refreshQueue = useRef(0);

  const loadSummary = useCallback(async () => {
    const data = await fetchJson<AdminFeesBundle>("/api/admin/fees/summary");
    startTransition(() => setSummary(data));
    return data;
  }, []);

  const loadStudents = useCallback(async (query: StudentQueryState, q: string) => {
    const params = new URLSearchParams();
    params.set("page", String(query.page ?? 1));
    params.set("pageSize", String(query.pageSize ?? 50));
    params.set("sort", query.sort ?? "balance");
    params.set("sortDir", query.sortDir ?? "desc");
    if (q.trim()) params.set("q", q.trim());
    if (query.clearance && query.clearance !== "all") params.set("clearance", query.clearance);
    if (query.accountStatus && query.accountStatus !== "all") {
      params.set("accountStatus", query.accountStatus);
    }
    if (query.overdueOnly) params.set("overdueOnly", "1");

    const data = await fetchJson<PaginatedResult<AdminFeeStudentRow>>(
      `/api/admin/fees/students?${params.toString()}`,
    );
    startTransition(() => setStudents(data));
  }, []);

  const loadPayments = useCallback(
    async (page: number, q: string) => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(paymentQuery.pageSize ?? 40));
      if (q.trim()) params.set("q", q.trim());
      if (paymentQuery.status !== "all") params.set("status", paymentQuery.status);
      if (paymentQuery.method !== "all") params.set("method", paymentQuery.method);

      const data = await fetchJson<PaginatedResult<AdminFeePaymentRow>>(
        `/api/admin/fees/payments?${params.toString()}`,
      );
      startTransition(() => setPayments(data));
    },
    [paymentQuery.method, paymentQuery.pageSize, paymentQuery.status],
  );

  const refreshAll = useCallback(async () => {
    const ticket = ++refreshQueue.current;
    await loadSummary();
    if (ticket !== refreshQueue.current) return;
    await Promise.all([
      loadStudents(studentQuery, debouncedStudentSearch),
      loadPayments(paymentQuery.page ?? 1, debouncedPaymentSearch),
    ]);
  }, [
    debouncedPaymentSearch,
    debouncedStudentSearch,
    loadPayments,
    loadStudents,
    loadSummary,
    paymentQuery.page,
    studentQuery,
  ]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial / reactive data load
    setLoadingSummary(true);
    setFetchError(null);
    void loadSummary()
      .catch((err: unknown) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Could not load finance summary.");
          setSummary(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSummary(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadSummary]);

  useEffect(() => {
    if (fetchError) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- paginated student query
    setLoadingStudents(true);
    void loadStudents(studentQuery, debouncedStudentSearch)
      .catch((err: unknown) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Could not load student ledger.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingStudents(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedStudentSearch, fetchError, loadStudents, studentQuery]);

  useEffect(() => {
    if (fetchError) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- paginated payment query
    setLoadingPayments(true);
    void loadPayments(paymentQuery.page ?? 1, debouncedPaymentSearch)
      .catch((err: unknown) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Could not load payment history.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPayments(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    debouncedPaymentSearch,
    fetchError,
    loadPayments,
    paymentQuery.page,
    paymentQuery.method,
    paymentQuery.status,
  ]);

  const { liveMode } = useFeeLedgerSync({
    scope: "admin",
    revision: summary?.ledgerRevision ?? 0,
    enabled: Boolean(summary) && !fetchError,
    onRefresh: refreshAll,
  });

  return {
    summary,
    setSummary,
    students,
    payments,
    studentQuery,
    setStudentQuery,
    paymentQuery,
    setPaymentQuery,
    studentSearch,
    setStudentSearch,
    paymentSearch,
    setPaymentSearch,
    loadingSummary,
    loadingStudents,
    loadingPayments,
    liveMode,
    fetchError,
    refreshAll,
  };
}

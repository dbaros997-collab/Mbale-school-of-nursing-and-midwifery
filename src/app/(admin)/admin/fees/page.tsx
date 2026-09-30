"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  adjustStudentBalance,
  recordStudentPayment,
  reviewStudentPayment,
} from "@/services/portal/admin/fees-actions";
import type { AdminFeeStudentRow } from "@/services/portal/admin/fees-types";
import { BankVerificationQueue } from "@/components/admin/fees/BankVerificationQueue";
import { FinanceMonitoringAlerts } from "@/components/admin/fees/FinanceMonitoringAlerts";
import { FinanceOverduePendingPanel } from "@/components/admin/fees/FinanceOverduePendingPanel";
import { FinanceGatewayPanel } from "@/components/admin/fees/FinanceGatewayPanel";
import { FinanceOnboardingPanel } from "@/components/admin/fees/FinanceOnboardingPanel";
import { FinanceExportPdfButton } from "@/components/admin/fees/FinanceExportPdfButton";
import { FinancePaymentsPanel } from "@/components/admin/fees/FinancePaymentsPanel";
import { FinanceStudentLedgerTable } from "@/components/admin/fees/FinanceStudentLedgerTable";
import { LiveFinanceIndicator } from "@/components/portal/fees/LiveFinanceIndicator";
import { CURRENT_SEMESTER_FEE_DUE_ISO } from "@/lib/portal/constants";
import { notifyFeeLedgerClients } from "@/lib/portal/fee-ledger-sync-client";
import { useAdminFinanceLedger } from "@/hooks/useAdminFinanceLedger";
import type { PaymentMethod } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { Button } from "@/components/ui/Button";
import { DataCard } from "@/components/ui/DataCard";
import { cn } from "@/lib/utils";

export default function AdminFeesPage() {
  const {
    summary: data,
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
  } = useAdminFinanceLedger();

  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [studentId, setStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<AdminFeeStudentRow | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("bank");
  const [reference, setReference] = useState("");
  const [newBalance, setNewBalance] = useState("");

  const feeDueDate = new Date(CURRENT_SEMESTER_FEE_DUE_ISO);
  const isOverdueAccount = (balance: number) =>
    balance > 0 && !Number.isNaN(feeDueDate.getTime()) && new Date() > feeDueDate;

  function onStudentChange(id: string, row?: AdminFeeStudentRow) {
    setStudentId(id);
    const resolved = row ?? students?.rows.find((s) => s.id === id) ?? selectedStudent;
    if (resolved && resolved.id === id) {
      setSelectedStudent(resolved);
      setNewBalance(String(resolved.feeBalance));
      if (resolved.feeBalance > 0) {
        setAmount(String(Math.min(resolved.feeBalance, 200_000)));
      } else {
        setAmount("");
      }
    }
  }

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await recordStudentPayment({
      studentId,
      amount: Number(amount.replace(/,/g, "")),
      method,
      reference: reference.trim() || undefined,
    });
    setSummary(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    if (result.ok) {
      notifyFeeLedgerClients({
        type: "ledger_updated",
        studentId,
        revision: result.bundle.ledgerRevision,
        source: "admin",
      });
      setReference("");
      void refreshAll();
    }
    setBusy(false);
  }

  async function handleAdjustBalance(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await adjustStudentBalance({
      studentId,
      newBalance: Number(newBalance.replace(/,/g, "")),
    });
    setSummary(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    if (result.ok) void refreshAll();
    setBusy(false);
  }

  const selected = selectedStudent?.id === studentId ? selectedStudent : null;
  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="admin-page-eyebrow">Finance dashboard</p>
          <h1 className="admin-page-title">Fees, payments &amp; ledger sync</h1>
          <p className="admin-page-desc">
            Live Supabase ledger — students and fee_payments load from the production database on
            every request (no demo or mock roster).
          </p>
          {data ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <LiveFinanceIndicator mode={liveMode} />
              <span className="rounded-full border border-accent-green/40 bg-accent-green-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-green">
                {data.dataSource === "supabase" ? "Supabase live" : "Ledger"}
              </span>
              <span className="text-xs text-muted">
                {data.totalStudentCount.toLocaleString()} students ·{" "}
                {data.totalPaymentCount.toLocaleString()} fee_payments rows ·{" "}
                {formatUgx(data.totalOutstanding)} outstanding
              </span>
            </div>
          ) : null}
        </div>
        <FinanceExportPdfButton bundle={data} disabled={loadingSummary || busy} />
      </div>

      {fetchError ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {fetchError} Sign in at{" "}
          <span className="font-semibold">/admin</span> if your staff session expired, or confirm
          Coolify has <span className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</span> set.
        </p>
      ) : null}

      {flash ? (
        <p
          className={
            flash.ok
              ? "rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
          role="status"
        >
          {flash.text}
        </p>
      ) : null}

      {loadingSummary || (!data && !fetchError) ? (
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl border border-border bg-white" />
          <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
        </div>
      ) : fetchError ? null : data ? (
        <>
          <FinanceMonitoringAlerts
            alerts={data.alerts}
            overdueAccountCount={data.overdueAccountCount}
            staleVerificationCount={data.staleVerificationCount}
            pendingReviewCount={data.pendingReviewCount}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <FinanceOnboardingPanel snapshot={data.onboarding} />
            <FinanceGatewayPanel snapshot={data.gateway} />
          </div>

          <FinanceOverduePendingPanel
            overdueAccounts={data.overdueAccounts}
            stuckVerifications={data.stuckVerifications}
            onSelectStudent={(id) => {
              onStudentChange(id);
              setFlash({
                ok: true,
                text: "Selected overdue account — use the sidebar tools to record or adjust payments.",
              });
            }}
            onSelectVerification={() => {
              document.getElementById("bank-verification-queue")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Total collected · {data.semesterLabel}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-accent-green">
                {formatUgx(data.totalCollected)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Total outstanding
              </p>
              <p className="mt-2 text-2xl font-extrabold text-red-600">
                {formatUgx(data.totalOutstanding)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Awaiting verification
              </p>
              <p className="mt-2 text-2xl font-extrabold text-amber-600">
                {data.pendingReviewCount}
              </p>
            </div>
          </div>

          <div id="bank-verification-queue">
            <BankVerificationQueue
              items={data.pendingVerifications}
              busy={busy}
              onReview={async (input) => {
                setBusy(true);
                setFlash(null);
                const targetStudentId = data.pendingVerifications.find(
                  (row) => row.id === input.paymentId,
                )?.studentId;
                const result = await reviewStudentPayment({
                  paymentId: input.paymentId,
                  decision: input.decision,
                  verifiedReference: input.verifiedReference,
                  reviewNote: input.reviewNote,
                });
                setSummary(result.bundle);
                setFlash({ ok: result.ok, text: result.message });
                if (result.ok) {
                  notifyFeeLedgerClients({
                    type: "ledger_updated",
                    studentId: targetStudentId,
                    revision: result.bundle.ledgerRevision,
                    source: "admin",
                    reviewDecision: input.decision,
                  });
                  void refreshAll();
                }
                setBusy(false);
              }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <DataCard title="Student balances">
                <FinanceStudentLedgerTable
                  page={students}
                  loading={loadingStudents || !students}
                  selectedStudentId={studentId}
                  onSelectStudent={(id) => {
                    const row = students?.rows.find((s) => s.id === id);
                    onStudentChange(id, row);
                  }}
                  search={studentSearch}
                  onSearchChange={(value) => {
                    setStudentSearch(value);
                    setStudentQuery((q) => ({ ...q, page: 1 }));
                  }}
                  query={studentQuery}
                  onQueryChange={(patch) => setStudentQuery((q) => ({ ...q, ...patch }))}
                  isOverdueAccount={isOverdueAccount}
                />
              </DataCard>

              <DataCard title="Payment history">
                <FinancePaymentsPanel
                  page={payments}
                  loading={loadingPayments || !payments}
                  search={paymentSearch}
                  onSearchChange={(value) => {
                    setPaymentSearch(value);
                    setPaymentQuery((q) => ({ ...q, page: 1 }));
                  }}
                  status={paymentQuery.status ?? "all"}
                  onStatusChange={(status) =>
                    setPaymentQuery((q) => ({ ...q, status, page: 1 }))
                  }
                  onPageChange={(page) => setPaymentQuery((q) => ({ ...q, page }))}
                />
              </DataCard>
            </div>

            <div className="space-y-6">
              <form
                onSubmit={handleRecordPayment}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Record payment
                </h2>
                {selected ? (
                  <p className="mt-1 text-xs text-muted">
                    Selected: {selected.fullName} · Balance {formatUgx(selected.feeBalance)}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-muted">
                    Select a student row in the ledger table.
                  </p>
                )}
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-semibold text-muted">
                    Student ID
                    <input
                      className={cn(inputClass, "mt-1 font-mono text-xs")}
                      value={studentId}
                      onChange={(e) => onStudentChange(e.target.value)}
                      required
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Amount (UGX)
                    <input
                      className={cn(inputClass, "mt-1")}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      inputMode="numeric"
                      required
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Method
                    <select
                      className={cn(inputClass, "mt-1")}
                      value={method}
                      onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    >
                      {(["bank"] as PaymentMethod[]).map((m) => (
                        <option key={m} value={m}>
                          {PAYMENT_METHOD_LABELS[m]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Reference (optional)
                    <input
                      className={cn(inputClass, "mt-1")}
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Auto-generated if blank"
                    />
                  </label>
                  <Button
                    type="submit"
                    variant="green"
                    className="w-full"
                    disabled={busy || !studentId || (selected?.feeBalance ?? 0) <= 0}
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Record payment
                  </Button>
                </div>
              </form>

              <form
                onSubmit={handleAdjustBalance}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                  Update balance
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Manually set the outstanding balance (e.g. after waiver or correction).
                </p>
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-semibold text-muted">
                    New balance (UGX)
                    <input
                      className={cn(inputClass, "mt-1")}
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      inputMode="numeric"
                      required
                    />
                  </label>
                  <Button type="submit" variant="ghost" className="w-full" disabled={busy}>
                    Update account balance
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

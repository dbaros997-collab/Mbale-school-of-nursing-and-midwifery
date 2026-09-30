"use client";

import { Search } from "lucide-react";
import type { PaginatedResult } from "@/services/portal/admin/fees-query-types";
import type { AdminFeePaymentRow } from "@/services/portal/admin/fees-query-types";
import type { Payment } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/Button";

type FinancePaymentsPanelProps = {
  page: PaginatedResult<AdminFeePaymentRow> | null;
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  status: Payment["status"] | "all";
  onStatusChange: (status: Payment["status"] | "all") => void;
  onPageChange: (page: number) => void;
};

export function FinancePaymentsPanel({
  page,
  loading,
  search,
  onSearchChange,
  status,
  onStatusChange,
  onPageChange,
}: FinancePaymentsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search payments</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30"
            placeholder="Search student, reference, transaction…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <select
          className="rounded-lg border border-border bg-white px-2 py-2 text-xs font-semibold text-primary"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as Payment["status"] | "all")}
          aria-label="Filter payment status"
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <ul className="max-h-80 space-y-2 overflow-y-auto" aria-busy={loading}>
        {loading && !page?.rows.length ? (
          <li className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            Loading payments…
          </li>
        ) : null}
        {(page?.rows ?? []).map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">
                {formatUgx(p.amount)} · {p.studentName}
              </p>
              <p className="truncate text-xs text-muted">
                {PAYMENT_METHOD_LABELS[p.method]} · {p.reference} ·{" "}
                {new Date(p.paidAt).toLocaleString("en-UG")}
              </p>
            </div>
            <StatusBadge tone={p.status === "completed" ? "success" : "warning"}>
              {p.status}
            </StatusBadge>
          </li>
        ))}
      </ul>

      {page && page.totalPages > 1 ? (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            Page {page.page} / {page.totalPages} · {page.total.toLocaleString()} payments
          </span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2"
              disabled={page.page <= 1}
              onClick={() => onPageChange(page.page - 1)}
            >
              Prev
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2"
              disabled={page.page >= page.totalPages}
              onClick={() => onPageChange(page.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

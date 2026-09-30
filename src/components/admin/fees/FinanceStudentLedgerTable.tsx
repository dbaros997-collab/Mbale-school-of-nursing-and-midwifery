"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { AdminFeeStudentRow } from "@/services/portal/admin/fees-types";
import type { PaginatedResult } from "@/services/portal/admin/fees-query-types";
import type { FinanceStudentQuery } from "@/services/portal/admin/fees-query-types";
import type { FinancialClearanceStatus, StudentAccountStatus } from "@/lib/portal/schema";
import {
  FINANCIAL_CLEARANCE_LABELS,
  formatUgx,
  STUDENT_ACCOUNT_STATUS_LABELS,
} from "@/lib/portal/constants";
import { AccountStatusBadge, StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FinanceStudentLedgerTableProps = {
  page: PaginatedResult<AdminFeeStudentRow> | null;
  loading: boolean;
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  query: FinanceStudentQuery;
  onQueryChange: (patch: Partial<FinanceStudentQuery>) => void;
  isOverdueAccount: (balance: number) => boolean;
};

const ROW_HEIGHT = 56;

export function FinanceStudentLedgerTable({
  page,
  loading,
  selectedStudentId,
  onSelectStudent,
  search,
  onSearchChange,
  query,
  onQueryChange,
  isOverdueAccount,
}: FinanceStudentLedgerTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = page?.rows ?? [];

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual row windowing
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search students</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30"
            placeholder="Search name, number, email…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-lg border border-border bg-white px-2 py-2 text-xs font-semibold text-primary"
            value={query.clearance ?? "all"}
            onChange={(e) =>
              onQueryChange({
                clearance: e.target.value as FinancialClearanceStatus | "all",
                page: 1,
              })
            }
            aria-label="Filter by clearance"
          >
            <option value="all">All clearance</option>
            {Object.entries(FINANCIAL_CLEARANCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-border bg-white px-2 py-2 text-xs font-semibold text-primary"
            value={query.accountStatus ?? "all"}
            onChange={(e) =>
              onQueryChange({
                accountStatus: e.target.value as StudentAccountStatus | "all",
                page: 1,
              })
            }
            aria-label="Filter by account status"
          >
            <option value="all">All accounts</option>
            {Object.entries(STUDENT_ACCOUNT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-border bg-white px-2 py-2 text-xs font-semibold text-primary"
            value={query.sort ?? "balance"}
            onChange={(e) =>
              onQueryChange({
                sort: e.target.value as FinanceStudentQuery["sort"],
                page: 1,
              })
            }
            aria-label="Sort students"
          >
            <option value="balance">Sort: balance</option>
            <option value="name">Sort: name</option>
            <option value="paid">Sort: paid</option>
            <option value="billed">Sort: billed</option>
          </select>
          <label className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-2 text-xs font-semibold text-primary">
            <input
              type="checkbox"
              checked={Boolean(query.overdueOnly)}
              onChange={(e) => onQueryChange({ overdueOnly: e.target.checked, page: 1 })}
            />
            Overdue only
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))] bg-surface px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-muted">
          <span>Student</span>
          <span>Billed</span>
          <span>Paid</span>
          <span>Balance</span>
          <span>Account</span>
          <span>Clearance</span>
        </div>
        <div
          ref={parentRef}
          className="max-h-[min(520px,60vh)] overflow-y-auto bg-white"
          role="rowgroup"
          aria-busy={loading}
        >
          {loading && rows.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">Loading students…</p>
          ) : rows.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              {search.trim()
                ? "No students match your filters."
                : "No students in the ledger yet. Add students in Supabase and issue portal activation credentials from admissions."}
            </p>
          ) : (
            <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
              {virtualizer.getVirtualItems().map((item) => {
                const s = rows[item.index]!;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="row"
                    className={cn(
                      "absolute left-0 grid w-full grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))] items-center border-b border-border/60 px-3 text-left text-sm transition hover:bg-surface/80",
                      selectedStudentId === s.id && "bg-[var(--tint-sky-100)]",
                      isOverdueAccount(s.feeBalance) && "bg-red-50/50",
                    )}
                    style={{
                      height: ROW_HEIGHT,
                      transform: `translateY(${item.start}px)`,
                    }}
                    onClick={() => onSelectStudent(s.id)}
                  >
                    <span className="min-w-0 pr-2">
                      <span className="block truncate font-semibold text-primary">{s.fullName}</span>
                      <span className="block truncate text-xs text-muted">{s.studentNumber}</span>
                    </span>
                    <span className="text-muted">{formatUgx(s.feeTotalBilled)}</span>
                    <span className="text-muted">{formatUgx(s.feeTotalPaid)}</span>
                    <span className="font-semibold text-primary">
                      {formatUgx(s.feeBalance)}
                      {isOverdueAccount(s.feeBalance) ? (
                        <span className="ml-1 text-[10px] font-bold uppercase text-red-600">
                          Due
                        </span>
                      ) : null}
                    </span>
                    <span>
                      <AccountStatusBadge status={s.accountStatus} />
                    </span>
                    <span>
                      <StatusBadge
                        tone={
                          s.financialClearance === "cleared"
                            ? "success"
                            : s.financialClearance === "pending_verification"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {FINANCIAL_CLEARANCE_LABELS[s.financialClearance]}
                      </StatusBadge>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {page ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <p>
            Showing {(page.page - 1) * page.pageSize + 1}–
            {Math.min(page.page * page.pageSize, page.total)} of {page.total.toLocaleString()} students
          </p>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2"
              disabled={page.page <= 1}
              onClick={() => onQueryChange({ page: page.page - 1 })}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Prev
            </Button>
            <span className="px-2 font-semibold text-primary">
              Page {page.page} / {page.totalPages}
            </span>
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2"
              disabled={page.page >= page.totalPages}
              onClick={() => onQueryChange({ page: page.page + 1 })}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { AlertCircle, Clock } from "lucide-react";
import type {
  OverdueAccountRow,
  StuckVerificationRow,
} from "@/services/portal/fees-finance-alerts";
import { FINANCIAL_CLEARANCE_LABELS } from "@/lib/portal/constants";
import { formatUgx } from "@/lib/portal/constants";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { DataCard } from "@/components/ui/DataCard";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";

type FinanceOverduePendingPanelProps = {
  overdueAccounts: OverdueAccountRow[];
  stuckVerifications: StuckVerificationRow[];
  onSelectStudent?: (studentId: string) => void;
  onSelectVerification?: (queueId: string) => void;
  className?: string;
};

export function FinanceOverduePendingPanel({
  overdueAccounts,
  stuckVerifications,
  onSelectStudent,
  onSelectVerification,
  className,
}: FinanceOverduePendingPanelProps) {
  const staleRows = stuckVerifications.filter((row) => row.isStale);

  return (
    <section
      className={cn("grid gap-6 lg:grid-cols-2", className)}
      aria-label="Overdue accounts and stuck verification queue"
    >
      <DataCard title="Overdue & delayed payments">
        <p className="text-sm text-muted">
          Students with outstanding balances past the semester due date — follow up for payment or
          payment plans.
        </p>
        {overdueAccounts.length === 0 ? (
          <p className="mt-4 rounded-lg border border-accent-green/30 bg-accent-green-soft px-3 py-2 text-sm text-accent-green">
            No overdue accounts at this time.
          </p>
        ) : (
          <DataTable className="mt-4" caption="Overdue student fee accounts">
            <DataTableHead>
              <tr>
                <th className="font-semibold">Student</th>
                <th className="text-right font-semibold">Balance</th>
                <th className="font-semibold">Past due</th>
                <th className="font-semibold">Clearance</th>
              </tr>
            </DataTableHead>
            <DataTableBody>
              {overdueAccounts.map((row) => (
                <tr
                  key={row.studentId}
                  className={cn(onSelectStudent && "cursor-pointer hover:bg-red-50/50")}
                  onClick={() => onSelectStudent?.(row.studentId)}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary">{row.fullName}</p>
                    <p className="text-xs text-muted">{row.studentNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-red-700">
                    {formatUgx(row.feeBalance)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">
                    {row.daysPastDue}d
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      tone={
                        row.financialClearance === "cleared"
                          ? "success"
                          : row.financialClearance === "pending_verification"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {FINANCIAL_CLEARANCE_LABELS[row.financialClearance]}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </DataCard>

      <DataCard title="Stuck verification queue">
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          Pending bank slips — prioritize items delayed in review.
          {staleRows.length > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
              <AlertCircle className="h-3 w-3" aria-hidden />
              {staleRows.length} delayed
            </span>
          ) : null}
        </p>
        {stuckVerifications.length === 0 ? (
          <p className="mt-4 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted">
            Verification queue is clear.
          </p>
        ) : (
          <DataTable className="mt-4" caption="Pending bank verification submissions">
            <DataTableHead>
              <tr>
                <th className="font-semibold">Student</th>
                <th className="text-right font-semibold">Amount</th>
                <th className="font-semibold">Waiting</th>
                <th className="font-semibold">Reference</th>
              </tr>
            </DataTableHead>
            <DataTableBody>
              {stuckVerifications.map((row) => (
                <tr
                  key={row.queueId}
                  className={cn(
                    onSelectVerification && "cursor-pointer hover:bg-amber-50/40",
                    row.isStale && "bg-amber-50/30",
                  )}
                  onClick={() => onSelectVerification?.(row.queueId)}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary">{row.studentName}</p>
                    <p className="text-xs text-muted">{row.studentNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">
                    {formatUgx(row.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        row.isStale ? "text-amber-800" : "text-muted",
                      )}
                    >
                      {row.daysPending}d
                      {row.isStale ? " · Delayed" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {row.transactionReference}
                  </td>
                </tr>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </DataCard>
    </section>
  );
}

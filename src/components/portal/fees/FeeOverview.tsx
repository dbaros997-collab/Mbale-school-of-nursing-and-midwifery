import type { ReactNode } from "react";
import { formatUgx, FINANCIAL_CLEARANCE_LABELS } from "@/lib/portal/constants";
import type { FeeCategorySummary, FeeInvoice, FinancialClearanceStatus } from "@/lib/portal/schema";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { DataCard } from "@/components/ui/DataCard";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";

type FeeOverviewProps = {
  invoice: FeeInvoice;
  categories: FeeCategorySummary[];
  financialClearance: FinancialClearanceStatus;
  studentName: string;
  studentNumber: string;
  liveIndicator?: ReactNode;
};

function clearanceTone(
  status: FinancialClearanceStatus,
): "success" | "danger" | "warning" {
  if (status === "cleared") return "success";
  if (status === "pending_verification") return "warning";
  return "danger";
}

export function FeeOverview({
  invoice,
  categories,
  financialClearance,
  studentName,
  studentNumber,
  liveIndicator,
}: FeeOverviewProps) {
  return (
    <DataCard title="Payment overview">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted">
          {invoice.semesterLabel} · {studentName} ({studentNumber})
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {liveIndicator}
          <StatusBadge tone={clearanceTone(financialClearance)}>
            {FINANCIAL_CLEARANCE_LABELS[financialClearance]}
          </StatusBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total billed", value: invoice.totalBilled },
          { label: "Total paid", value: invoice.totalPaid },
          { label: "Outstanding", value: invoice.balance },
        ].map((row) => (
          <div
            key={row.label}
            className="rounded-lg border border-border bg-[var(--tint-navy-50)] px-3 py-3"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {row.label}
            </p>
            <p className="mt-1 text-lg font-extrabold text-primary">{formatUgx(row.value)}</p>
          </div>
        ))}
      </div>

      <DataTable className="mt-6" caption="Outstanding balances by category">
        <DataTableHead>
          <tr>
            <th className="font-semibold">Category</th>
            <th className="text-right font-semibold">Billed</th>
            <th className="text-right font-semibold">Paid</th>
            <th className="text-right font-semibold">Outstanding</th>
          </tr>
        </DataTableHead>
        <DataTableBody>
          {categories.map((row) => (
            <tr key={row.category}>
              <td className="font-medium text-foreground">{row.category}</td>
              <td className="text-right text-muted">{formatUgx(row.billed)}</td>
              <td className="text-right text-muted">{formatUgx(row.paid)}</td>
              <td className="text-right font-semibold text-primary">
                {formatUgx(row.outstanding)}
              </td>
            </tr>
          ))}
          <tr>
            <td className="font-bold text-primary">Semester total</td>
            <td className="text-right font-bold text-primary">{formatUgx(invoice.totalBilled)}</td>
            <td className="text-right font-bold text-primary">{formatUgx(invoice.totalPaid)}</td>
            <td className="text-right font-extrabold text-primary">
              {formatUgx(invoice.balance)}
            </td>
          </tr>
        </DataTableBody>
      </DataTable>
    </DataCard>
  );
}

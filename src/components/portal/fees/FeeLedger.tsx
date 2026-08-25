import { formatUgx } from "@/lib/portal/constants";
import type { FeeInvoice, FeeLineItem } from "@/lib/portal/schema";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { DataCard } from "@/components/ui/DataCard";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";

type FeeLedgerProps = {
  invoice: FeeInvoice;
  lineItems: FeeLineItem[];
  studentName: string;
  studentNumber: string;
};

export function FeeLedger({
  invoice,
  lineItems,
  studentName,
  studentNumber,
}: FeeLedgerProps) {
  const due = invoice.balance > 0;

  return (
    <DataCard title="Financial ledger">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted">
          {invoice.semesterLabel} · {studentName} ({studentNumber})
        </p>
        {due ? (
          <StatusBadge tone="danger">Balance due</StatusBadge>
        ) : (
          <StatusBadge tone="success">Fully paid</StatusBadge>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tuition", value: invoice.tuition },
          { label: "Functional fees", value: invoice.functionalFees },
          { label: "Total billed", value: invoice.totalBilled },
          { label: "Total paid", value: invoice.totalPaid },
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

      <div
        className={cn(
          "mt-4 rounded-lg px-4 py-3",
          due ? "bg-red-50 text-red-800" : "bg-[var(--tint-green-50)] text-accent-green",
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          Current balance
        </p>
        <p className="mt-0.5 text-2xl font-extrabold">{formatUgx(invoice.balance)}</p>
      </div>

      <DataTable className="mt-6" caption="Fee line items">
        <DataTableHead>
          <tr>
            <th className="font-semibold">Charge</th>
            <th className="text-right font-semibold">Amount</th>
          </tr>
        </DataTableHead>
        <DataTableBody>
          {lineItems.map((line) => (
            <tr key={line.id}>
              <td className="text-foreground">{line.label}</td>
              <td className="text-right font-semibold text-primary">
                {formatUgx(line.amount)}
              </td>
            </tr>
          ))}
          <tr>
            <td className="font-bold text-primary">Total billed</td>
            <td className="text-right font-extrabold text-primary">
              {formatUgx(invoice.totalBilled)}
            </td>
          </tr>
        </DataTableBody>
      </DataTable>
    </DataCard>
  );
}

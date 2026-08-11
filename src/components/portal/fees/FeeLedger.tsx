import { formatUgx } from "@/lib/portal/constants";
import type { FeeInvoice, FeeLineItem } from "@/lib/portal/schema";
import { StatusBadge } from "@/components/portal/StatusBadge";
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
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Financial ledger
          </h2>
          <p className="mt-1 text-sm text-muted">
            {invoice.semesterLabel} · {studentName} ({studentNumber})
          </p>
        </div>
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
          <div key={row.label} className="rounded-lg border border-border bg-surface/50 px-3 py-3">
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
          due ? "bg-red-50 text-red-800" : "bg-accent-green-soft text-accent-green",
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          Current balance
        </p>
        <p className="mt-0.5 text-2xl font-extrabold">{formatUgx(invoice.balance)}</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4 font-semibold">Charge</th>
              <th className="py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((line) => (
              <tr key={line.id} className="border-b border-border/70">
                <td className="py-2.5 pr-4 text-foreground">{line.label}</td>
                <td className="py-2.5 text-right font-semibold text-primary">
                  {formatUgx(line.amount)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-3 pr-4 font-bold text-primary">Total billed</td>
              <td className="py-3 text-right font-extrabold text-primary">
                {formatUgx(invoice.totalBilled)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

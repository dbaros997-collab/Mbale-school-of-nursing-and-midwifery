"use client";

import { useState } from "react";
import { Receipt, X } from "lucide-react";
import type { Payment } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { DataCard } from "@/components/ui/DataCard";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";

type PaymentHistoryProps = {
  payments: Payment[];
  studentName: string;
  studentNumber: string;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PaymentHistory({
  payments,
  studentName,
  studentNumber,
}: PaymentHistoryProps) {
  const [receipt, setReceipt] = useState<Payment | null>(null);

  return (
    <DataCard title="Transaction history">
      <p className="text-sm text-muted">Bank transfer receipts for this invoice.</p>

      {payments.length === 0 ? (
        <p className="mt-5 text-sm text-muted">No payments recorded yet.</p>
      ) : (
        <DataTable className="mt-4" caption="Payment transaction history">
          <DataTableHead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Method</th>
              <th scope="col">Reference</th>
              <th scope="col" className="text-right">
                Amount
              </th>
              <th scope="col">Status</th>
              <th scope="col" className="text-right">
                Receipt
              </th>
            </tr>
          </DataTableHead>
          <DataTableBody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap text-muted">{formatWhen(p.paidAt)}</td>
                <td className="font-medium text-foreground">
                  {PAYMENT_METHOD_LABELS[p.method]}
                </td>
                <td className="font-mono text-xs text-muted">{p.reference}</td>
                <td className="text-right font-semibold text-primary">
                  {formatUgx(p.amount)}
                </td>
                <td>
                  <StatusBadge
                    tone={
                      p.status === "completed"
                        ? "success"
                        : p.status === "failed"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {p.status}
                  </StatusBadge>
                </td>
                <td className="text-right">
                  <button
                    type="button"
                    onClick={() => setReceipt(p)}
                    className="btn-pill inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-primary hover:bg-accent-cyan-soft focus-ring"
                  >
                    <Receipt className="h-3.5 w-3.5" aria-hidden />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </DataTableBody>
        </DataTable>
      )}

      {receipt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-title"
          onClick={() => setReceipt(null)}
        >
          <div
            className="data-card w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="receipt-title" className="text-lg font-bold text-primary">
                  Payment receipt
                </h3>
                <p className="mt-1 text-xs text-muted">MBSNM Finance · Mock gateway</p>
              </div>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="rounded-md p-1.5 text-muted hover:bg-surface focus-ring"
                aria-label="Close receipt"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Student</dt>
                <dd className="text-right font-semibold text-foreground">
                  {studentName}
                  <br />
                  <span className="text-xs font-normal text-muted">{studentNumber}</span>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Reference</dt>
                <dd className="font-mono text-xs font-semibold">{receipt.reference}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Method</dt>
                <dd className="font-semibold">{PAYMENT_METHOD_LABELS[receipt.method]}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Date</dt>
                <dd className="font-semibold">{formatWhen(receipt.paidAt)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="font-bold text-primary">Amount paid</dt>
                <dd className="text-lg font-extrabold text-primary">
                  {formatUgx(receipt.amount)}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-center text-[11px] text-muted">
              This is a simulated receipt for demonstration purposes.
            </p>
          </div>
        </div>
      ) : null}
    </DataCard>
  );
}

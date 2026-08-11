"use client";

import { useState } from "react";
import { Receipt, X } from "lucide-react";
import type { Payment } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { StatusBadge } from "@/components/portal/StatusBadge";

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
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        Transaction history
      </h2>
      <p className="mt-1 text-sm text-muted">Mobile Money and bank receipts for this invoice.</p>

      {payments.length === 0 ? (
        <p className="mt-5 text-sm text-muted">No payments recorded yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-3 font-semibold">Date</th>
                <th className="py-2 pr-3 font-semibold">Method</th>
                <th className="py-2 pr-3 font-semibold">Reference</th>
                <th className="py-2 pr-3 text-right font-semibold">Amount</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 text-right font-semibold">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border/70">
                  <td className="whitespace-nowrap py-2.5 pr-3 text-muted">
                    {formatWhen(p.paidAt)}
                  </td>
                  <td className="py-2.5 pr-3 font-medium text-foreground">
                    {PAYMENT_METHOD_LABELS[p.method]}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-muted">{p.reference}</td>
                  <td className="py-2.5 pr-3 text-right font-semibold text-primary">
                    {formatUgx(p.amount)}
                  </td>
                  <td className="py-2.5">
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
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => setReceipt(p)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-accent-cyan-soft focus-ring"
                    >
                      <Receipt className="h-3.5 w-3.5" aria-hidden />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
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
    </div>
  );
}

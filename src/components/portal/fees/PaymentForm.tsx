"use client";

import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import type { PaymentMethod } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { Button } from "@/components/ui/Button";

type PaymentFormProps = {
  balance: number;
  busy: boolean;
  onPay: (input: {
    amount: number;
    method: PaymentMethod;
    phoneOrAccount: string;
  }) => Promise<void>;
};

export function PaymentForm({ balance, busy, onPay }: PaymentFormProps) {
  const [amount, setAmount] = useState(balance > 0 ? String(Math.min(balance, 150_000)) : "");
  const [phoneOrAccount, setPhoneOrAccount] = useState("");

  const cleared = balance <= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cleared || busy) return;
    await onPay({
      amount: Number(amount.replace(/,/g, "")),
      method: "bank",
      phoneOrAccount,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        Make a payment
      </h2>
      <p className="mt-1 text-sm text-muted">
        Pay your fees by bank transfer. Enter the amount and your transfer reference below.
      </p>

      {cleared ? (
        <p className="mt-5 rounded-lg border border-accent-green/30 bg-accent-green-soft px-3 py-3 text-sm font-medium text-accent-green">
          No outstanding balance. You are fully paid for this semester.
        </p>
      ) : (
        <>
          <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-bold text-primary">
              <Building2 className="h-4 w-4" aria-hidden />
              {PAYMENT_METHOD_LABELS.bank}
            </span>
            <p className="mt-1 text-xs text-muted">
              Transfer to the school bank account and enter your transaction reference to confirm
              payment.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Amount (UGX)
              </span>
              <input
                type="number"
                min={1000}
                max={balance}
                step={1000}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
              />
              <button
                type="button"
                className="mt-1.5 text-xs font-semibold text-primary hover:underline"
                onClick={() => setAmount(String(balance))}
              >
                Pay full balance ({formatUgx(balance)})
              </button>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Transfer reference
              </span>
              <input
                type="text"
                required
                value={phoneOrAccount}
                onChange={(e) => setPhoneOrAccount(e.target.value)}
                placeholder="e.g. 9030012345678"
                className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
              />
            </label>
          </div>

          <Button type="submit" variant="primary" disabled={busy} className="mt-5 w-full sm:w-auto">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {busy ? "Processing…" : `Pay with ${PAYMENT_METHOD_LABELS.bank}`}
          </Button>
        </>
      )}
    </form>
  );
}

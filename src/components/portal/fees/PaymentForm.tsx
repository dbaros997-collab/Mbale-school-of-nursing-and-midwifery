"use client";

import { useState } from "react";
import { Loader2, Smartphone, Building2 } from "lucide-react";
import type { PaymentMethod } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { cn } from "@/lib/utils";

type PaymentFormProps = {
  balance: number;
  busy: boolean;
  onPay: (input: {
    amount: number;
    method: PaymentMethod;
    phoneOrAccount: string;
  }) => Promise<void>;
};

const methods: { id: PaymentMethod; hint: string }[] = [
  { id: "mtn", hint: "MTN MoMo — prompt on your phone" },
  { id: "airtel", hint: "Airtel Money — USSD / app approval" },
  { id: "bank", hint: "Stanbic / Centenary mock transfer" },
];

export function PaymentForm({ balance, busy, onPay }: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethod>("mtn");
  const [amount, setAmount] = useState(balance > 0 ? String(Math.min(balance, 150_000)) : "");
  const [phoneOrAccount, setPhoneOrAccount] = useState("0700123456");

  const cleared = balance <= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cleared || busy) return;
    await onPay({
      amount: Number(amount.replace(/,/g, "")),
      method,
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
        Simulated gateway for MTN, Airtel Money, and bank transfers.
      </p>

      {cleared ? (
        <p className="mt-5 rounded-lg border border-accent-green/30 bg-accent-green-soft px-3 py-3 text-sm font-medium text-accent-green">
          No outstanding balance. You are fully paid for this semester.
        </p>
      ) : (
        <>
          <fieldset className="mt-5">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
              Payment method
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "rounded-lg border px-3 py-3 text-left transition focus-ring",
                    method === m.id
                      ? "border-primary bg-accent-cyan-soft"
                      : "border-border bg-white hover:bg-surface",
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-primary">
                    {m.id === "bank" ? (
                      <Building2 className="h-4 w-4" aria-hidden />
                    ) : (
                      <Smartphone className="h-4 w-4" aria-hidden />
                    )}
                    {PAYMENT_METHOD_LABELS[m.id]}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted">{m.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

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
                {method === "bank" ? "Account / transfer ref" : "Mobile Money number"}
              </span>
              <input
                type="text"
                required
                value={phoneOrAccount}
                onChange={(e) => setPhoneOrAccount(e.target.value)}
                placeholder={method === "bank" ? "e.g. 9030012345678" : "07XX XXX XXX"}
                className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50 focus-ring sm:w-auto"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {busy ? "Processing…" : `Pay with ${PAYMENT_METHOD_LABELS[method]}`}
          </button>
        </>
      )}
    </form>
  );
}

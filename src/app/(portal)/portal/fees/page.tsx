"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getFeesBundle,
  payFees,
  type FeesBundle,
} from "@/services/portal/fees";
import type { PaymentMethod } from "@/lib/portal/schema";
import { FeeLedger } from "@/components/portal/fees/FeeLedger";
import { PaymentForm } from "@/components/portal/fees/PaymentForm";
import { PaymentHistory } from "@/components/portal/fees/PaymentHistory";

export default function FeesPage() {
  const [data, setData] = useState<FeesBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const bundle = await getFeesBundle();
    setData(bundle);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handlePay(input: {
    amount: number;
    method: PaymentMethod;
    phoneOrAccount: string;
  }) {
    setBusy(true);
    setFlash(null);
    const result = await payFees(input);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
          Fees & finance
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
          Fee payments
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          View your semester ledger, pay by bank transfer, and download mock receipts from your
          transaction history.
        </p>
      </div>

      {flash ? (
        <p
          className={
            flash.ok
              ? "rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
          role="status"
        >
          {flash.text}
        </p>
      ) : null}

      {loading || !data ? (
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-white" />
        </div>
      ) : (
        <>
          <FeeLedger
            invoice={data.invoice}
            lineItems={data.lineItems}
            studentName={data.studentName}
            studentNumber={data.studentNumber}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <PaymentForm
              balance={data.invoice.balance}
              busy={busy}
              onPay={handlePay}
            />
            <PaymentHistory
              payments={data.payments}
              studentName={data.studentName}
              studentNumber={data.studentNumber}
            />
          </div>
        </>
      )}
    </div>
  );
}

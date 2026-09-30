"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFeesBundle, submitFeePayment } from "@/services/portal/fees-actions";
import type { FeesBundle } from "@/services/portal/fees-shared";
import { detectFeeReviewOutcome } from "@/services/portal/fee-ledger-events";
import type { PaymentMethod } from "@/lib/portal/schema";
import { FeeOverview } from "@/components/portal/fees/FeeOverview";
import { FeeLedger } from "@/components/portal/fees/FeeLedger";
import { PaymentForm } from "@/components/portal/fees/PaymentForm";
import { PaymentHistory } from "@/components/portal/fees/PaymentHistory";
import { FeeFinanceAlerts } from "@/components/portal/fees/FeeFinanceAlerts";
import { FeeFinanceAlertBanner } from "@/components/portal/fees/FeeFinanceAlertBanner";
import { LiveFinanceIndicator } from "@/components/portal/fees/LiveFinanceIndicator";
import { useFeeLedgerSync } from "@/hooks/useFeeLedgerSync";
import {
  notifyFeeLedgerClients,
  type FeeLedgerSyncEvent,
} from "@/lib/portal/fee-ledger-sync-client";
import { useAuth } from "@/contexts/AuthContext";

export default function FeesPage() {
  const searchParams = useSearchParams();
  const { profile, ready: authReady } = useAuth();
  const portalStudentId = profile?.id ?? null;
  const [data, setData] = useState<FeesBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const bundleRef = useRef<FeesBundle | null>(null);
  const revisionRef = useRef(-1);

  const applyBundle = useCallback(
    (bundle: FeesBundle, options?: { notifyReview?: boolean; reviewHint?: FeeLedgerSyncEvent }) => {
      const previous = bundleRef.current;
      let reviewOutcome = options?.reviewHint?.reviewDecision ?? null;

      if (options?.notifyReview && !reviewOutcome) {
        reviewOutcome = detectFeeReviewOutcome(previous, bundle);
      }

      if (options?.notifyReview && reviewOutcome === "approved") {
        setFlash({
          ok: true,
          text: "Finance approved your bank payment — your fee ledger, balances, and clearance updated instantly.",
        });
      } else if (options?.notifyReview && reviewOutcome === "rejected") {
        setFlash({
          ok: false,
          text: "Finance rejected your payment submission. Review the alert below and resubmit with a corrected slip or reference.",
        });
      }

      bundleRef.current = bundle;
      revisionRef.current = bundle.ledgerRevision;
      setData(bundle);
    },
    [],
  );

  const load = useCallback(async () => {
    if (!portalStudentId) return;
    setLoading(true);
    const bundle = await getFeesBundle(portalStudentId);
    applyBundle(bundle);
    setLoading(false);
  }, [applyBundle, portalStudentId]);

  const loadSilent = useCallback(
    async (hint?: FeeLedgerSyncEvent) => {
      if (!portalStudentId) return;
      const rev = revisionRef.current;
      try {
        const res = await fetch(
          `/api/portal/fees/sync?revision=${rev}&studentId=${encodeURIComponent(portalStudentId)}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const json = (await res.json()) as { changed?: boolean; bundle?: FeesBundle };
          if (json.changed && json.bundle) {
            applyBundle(json.bundle, { notifyReview: true, reviewHint: hint });
            return;
          }
        }
      } catch {
        // fall back to server action
      }
      const bundle = await getFeesBundle(portalStudentId);
      applyBundle(bundle, { notifyReview: true, reviewHint: hint });
    },
    [applyBundle, portalStudentId],
  );

  useEffect(() => {
    if (!authReady || !portalStudentId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load fees bundle when session is ready
    void load();
  }, [authReady, load, portalStudentId]);

  useEffect(() => {
    if (searchParams.get("online_payment") !== "return") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-redirect UX + sync after gateway return
    setFlash({
      ok: true,
      text: "Thanks — we are confirming your online payment. Your balance will update automatically in a few seconds.",
    });
    void loadSilent({ type: "ledger_updated", source: "system" });
  }, [loadSilent, searchParams]);

  const { liveMode } = useFeeLedgerSync({
    scope: "portal",
    revision: data?.ledgerRevision ?? 0,
    studentId: data?.invoice.studentId,
    enabled: Boolean(data),
    onRefresh: (event) => loadSilent(event),
  });

  async function handleSubmit(input: {
    amount: number;
    method: PaymentMethod;
    transactionReference: string;
    depositSlipDataUrl?: string | null;
    depositSlipFileName?: string | null;
  }) {
    setBusy(true);
    setFlash(null);
    if (!portalStudentId) return;
    const result = await submitFeePayment(input, portalStudentId);
    applyBundle(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    if (result.ok) {
      notifyFeeLedgerClients({
        type: "ledger_updated",
        studentId: portalStudentId,
        revision: result.bundle.ledgerRevision,
        source: "student",
      });
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
            Fees & finance
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
            Fee payments
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Pay online with card or mobile money, or submit offline bank and mobile money proof for
            finance verification.
          </p>
        </div>
        {data ? <LiveFinanceIndicator mode={liveMode} /> : null}
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

      {!authReady || !portalStudentId ? (
        <p className="rounded-xl border border-dashed border-border bg-white px-6 py-10 text-center text-sm text-muted">
          Sign in to view your live fee ledger from Supabase.
        </p>
      ) : loading || !data ? (
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-white" />
        </div>
      ) : data.invoice.totalBilled === 0 && data.payments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-white px-6 py-10 text-center text-sm text-muted">
          No fee ledger entries yet for your account. Finance will publish semester billing or record
          payments after registry enrolment.
        </p>
      ) : (
        <>
          <FeeFinanceAlertBanner alerts={data.alerts} />
          <FeeFinanceAlerts alerts={data.alerts} />
          <FeeOverview
            invoice={data.invoice}
            categories={data.categories}
            financialClearance={data.financialClearance}
            studentName={data.studentName}
            studentNumber={data.studentNumber}
            liveIndicator={<LiveFinanceIndicator mode={liveMode} className="hidden sm:inline-flex" />}
          />
          <FeeLedger
            invoice={data.invoice}
            lineItems={data.lineItems}
            studentName={data.studentName}
            studentNumber={data.studentNumber}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <PaymentForm
              balance={data.invoice.balance}
              payableBalance={data.payableBalance}
              busy={busy}
              studentId={data.invoice.studentId}
              invoiceId={data.invoice.id}
              studentName={data.studentName}
              studentEmail={data.studentEmail}
              onSubmit={handleSubmit}
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

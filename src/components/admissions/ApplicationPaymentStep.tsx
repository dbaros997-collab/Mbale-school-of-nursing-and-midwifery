"use client";

import { AlertTriangle, Building2, Loader2, Lock, CheckCircle2 } from "lucide-react";
import { APPLICATION_BANK_ACCOUNT } from "@/lib/data";
import { formatUgx } from "@/lib/portal/constants";
import { cn } from "@/lib/utils";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";

type ApplicationPaymentStepProps = {
  feeUgx: number;
  paymentReference: string;
  onPaymentReferenceChange: (reference: string) => void;
  feeAcknowledged: boolean;
  onFeeAcknowledgedChange: (acknowledged: boolean) => void;
  paying: boolean;
  verifying?: boolean;
  paymentConfirmed: boolean;
  transactionReference: string | null;
  paymentError: string | null;
  onPay: () => void;
};

export function ApplicationPaymentStep({
  feeUgx,
  paymentReference,
  onPaymentReferenceChange,
  feeAcknowledged,
  onFeeAcknowledgedChange,
  paying,
  verifying = false,
  paymentConfirmed,
  transactionReference,
  paymentError,
  onPay,
}: ApplicationPaymentStepProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-4 w-4 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-primary">Application fee payment</h3>
          <p className="mt-1 text-sm text-muted">
            A non-refundable application fee of{" "}
            <span className="font-semibold text-foreground">{formatUgx(feeUgx)}</span> is required
            before your qualifications are checked automatically.
          </p>
        </div>
      </div>

      {verifying ? (
        <Callout className="mt-5" role="status">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
            <p className="text-sm font-bold text-primary">Verifying academic qualifications…</p>
          </div>
          <p className="mt-2 text-xs text-muted">
            Payment confirmed. Checking your results against programme entry requirements.
          </p>
        </Callout>
      ) : paymentConfirmed ? (
        <div
          className="mt-5 rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-4"
          role="status"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent-green" aria-hidden />
            <p className="text-sm font-bold text-accent-green">Payment Confirmed — Non-Refundable</p>
          </div>
          {transactionReference ? (
            <p className="mt-2 font-mono text-xs text-primary">
              Receipt: {transactionReference}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted">
            Status: Completed. This fee will not be refunded regardless of qualification outcome.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <Building2 className="h-4 w-4" aria-hidden />
              Bank transfer details
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Bank</dt>
                <dd className="font-medium text-foreground">{APPLICATION_BANK_ACCOUNT.bankName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Branch</dt>
                <dd className="font-medium text-foreground">{APPLICATION_BANK_ACCOUNT.branch}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Account name
                </dt>
                <dd className="font-medium text-foreground">{APPLICATION_BANK_ACCOUNT.accountName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Account number
                </dt>
                <dd className="font-mono font-semibold text-primary">
                  {APPLICATION_BANK_ACCOUNT.accountNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">SWIFT</dt>
                <dd className="font-mono text-foreground">{APPLICATION_BANK_ACCOUNT.swiftCode}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted">
              Transfer exactly {formatUgx(feeUgx)} and use your full name as the payment narrative
              where possible.
            </p>
          </div>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Bank transfer reference
            </span>
            <input
              type="text"
              required
              disabled={paying}
              value={paymentReference}
              onChange={(e) => onPaymentReferenceChange(e.target.value)}
              placeholder="e.g. TXN123456789 or bank slip number"
              className="mt-1.5 w-full rounded-lg border border-border bg-panel px-3 py-2.5 text-sm outline-none transition focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30 disabled:bg-surface disabled:text-muted"
            />
          </label>

          {paymentError ? (
            <p className="mt-3 text-sm font-medium text-red-600" role="alert">
              {paymentError}
            </p>
          ) : null}

          <div
            className="mt-4 rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3"
            role="note"
          >
            <div className="flex gap-2">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                aria-hidden
              />
              <p className="text-sm text-amber-950">
                <span className="font-semibold">Note:</span> The {formatUgx(feeUgx)} application
                processing fee is strictly non-refundable, even if academic qualifications do not
                meet the minimum entry requirements.
              </p>
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-panel px-3 py-3">
            <input
              type="checkbox"
              checked={feeAcknowledged}
              disabled={paying}
              onChange={(e) => onFeeAcknowledgedChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus-ring"
            />
            <span className="text-sm text-foreground">
              I understand that this application fee is non-refundable
            </span>
          </label>

          <Button
            type="button"
            variant="primary"
            disabled={paying || verifying || !paymentReference.trim() || !feeAcknowledged}
            onClick={onPay}
            className="mt-5 w-full sm:w-auto"
          >
            {paying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {paying ? "Confirming bank transfer…" : `Confirm ${formatUgx(feeUgx)} payment`}
          </Button>
        </>
      )}
    </div>
  );
}

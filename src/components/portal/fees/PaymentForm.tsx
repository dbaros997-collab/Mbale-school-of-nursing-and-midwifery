"use client";

import { useState } from "react";
import { Building2, CreditCard, Loader2, Smartphone } from "lucide-react";
import type { PaymentMethod } from "@/lib/portal/schema";
import { formatUgx, SCHOOL_FEE_BANK_DETAILS } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { BankDepositSlipUpload } from "@/components/portal/fees/BankDepositSlipUpload";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const MANUAL_METHODS = ["bank", "mtn", "airtel"] as const satisfies readonly PaymentMethod[];
type ManualPaymentMethod = (typeof MANUAL_METHODS)[number];

type PaymentFormProps = {
  balance: number;
  /** Max pay amount after unverified pending submissions (defaults to balance). */
  payableBalance?: number;
  busy: boolean;
  studentId: string;
  invoiceId: string;
  studentName?: string;
  studentEmail?: string;
  onSubmit: (input: {
    amount: number;
    method: PaymentMethod;
    transactionReference: string;
    depositSlipDataUrl?: string | null;
    depositSlipFileName?: string | null;
  }) => Promise<void>;
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function methodIcon(method: PaymentMethod) {
  if (method === "bank") return Building2;
  if (method === "online") return CreditCard;
  return Smartphone;
}

export function PaymentForm({
  balance,
  payableBalance,
  busy,
  studentId,
  invoiceId,
  studentName,
  studentEmail,
  onSubmit,
}: PaymentFormProps) {
  const payCap = payableBalance ?? balance;
  const [amount, setAmount] = useState(() =>
    payCap > 0 ? String(Math.min(payCap, 150_000)) : "",
  );
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [transactionReference, setTransactionReference] = useState("");
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipFileName, setSlipFileName] = useState<string | null>(null);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const [onlineBusy, setOnlineBusy] = useState(false);
  const cleared = payCap <= 0;
  const isOnline = method === "online";
  const isBank = method === "bank";
  const formBusy = busy || onlineBusy;

  function selectMethod(next: PaymentMethod) {
    setMethod(next);
    setOnlineError(null);
    if (next !== "bank") {
      setSlipFile(null);
      setSlipFileName(null);
    }
    if (next === "online") {
      setTransactionReference("");
    }
  }

  async function handleSlipSelect(file: File | null) {
    setSlipFile(file);
    setSlipFileName(file?.name ?? null);
  }

  async function launchOnlineCheckout(payAmount: number) {
    setOnlineBusy(true);
    setOnlineError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          invoiceId,
          amount: payAmount,
          studentName,
          studentEmail,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        checkoutUrl?: string;
        message?: string;
        redirectMode?: string;
      };

      const checkoutUrl = json.checkoutUrl?.trim();
      if (!res.ok || !json.ok || !checkoutUrl || !checkoutUrl.startsWith("https://")) {
        setOnlineError(
          json.message ?? "Could not start online payment. Try again or use bank transfer.",
        );
        setOnlineBusy(false);
        return;
      }

      window.location.assign(checkoutUrl);
    } catch {
      setOnlineError("Network error. Check your connection and try again.");
      setOnlineBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cleared || formBusy) return;

    const payAmount = Number(amount.replace(/,/g, ""));
    if (!Number.isFinite(payAmount) || payAmount <= 0) return;

    if (isOnline) {
      await launchOnlineCheckout(payAmount);
      return;
    }

    if (isBank && !slipFile) {
      return;
    }

    let depositSlipDataUrl: string | null = null;
    if (isBank && slipFile) {
      depositSlipDataUrl = await fileToDataUrl(slipFile);
    }

    await onSubmit({
      amount: payAmount,
      method: method as ManualPaymentMethod,
      transactionReference,
      depositSlipDataUrl,
      depositSlipFileName: slipFileName,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        {isOnline ? "Pay online" : "Submit payment proof"}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {isOnline
          ? "Pay with UGX card or mobile money via Flutterwave. Your balance updates automatically — no deposit slip or finance review."
          : "Pay at the bank or via mobile money, then submit your transaction reference for finance verification."}
      </p>

      {cleared ? (
        <p className="mt-5 rounded-lg border border-accent-green/30 bg-accent-green-soft px-3 py-3 text-sm font-medium text-accent-green">
          No outstanding balance. You are fully paid for this semester.
        </p>
      ) : (
        <>
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Payment method
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["online", ...MANUAL_METHODS] as PaymentMethod[]).map((m) => {
                const Icon = methodIcon(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectMethod(m)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition focus-ring",
                      method === m
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-white text-muted hover:border-primary/30",
                    )}
                  >
                    <Icon className="mb-1 h-4 w-4" aria-hidden />
                    {PAYMENT_METHOD_LABELS[m]}
                  </button>
                );
              })}
            </div>
          </div>

          {isOnline ? (
            <p className="mt-4 rounded-lg border border-accent-green/30 bg-accent-green-soft/50 px-3 py-2 text-xs text-muted">
              You will be redirected to our payment partner to complete card or mobile money payment.
              No deposit slip upload is required for online payments.
            </p>
          ) : isBank ? (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              <p className="font-bold text-primary">{SCHOOL_FEE_BANK_DETAILS.bankName}</p>
              <p className="mt-1 text-muted">
                {SCHOOL_FEE_BANK_DETAILS.accountName} · A/C{" "}
                <span className="font-mono font-semibold text-foreground">
                  {SCHOOL_FEE_BANK_DETAILS.accountNumber}
                </span>
              </p>
              <p className="text-xs text-muted">
                {SCHOOL_FEE_BANK_DETAILS.branch} · SWIFT {SCHOOL_FEE_BANK_DETAILS.swift}
              </p>
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted">
              Use the school merchant code on {PAYMENT_METHOD_LABELS[method]} and keep your SMS
              confirmation for the reference number below.
            </p>
          )}

          <div
            className={cn(
              "mt-4 grid gap-4",
              isOnline ? "sm:grid-cols-1" : "sm:grid-cols-2",
            )}
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Amount (UGX)
              </span>
              <input
                type="number"
                min={1000}
                max={payCap}
                step={1000}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
              />
              <button
                type="button"
                className="mt-1.5 text-xs font-semibold text-primary hover:underline"
                onClick={() => setAmount(String(payCap))}
              >
                Pay full available ({formatUgx(payCap)})
              </button>
            </label>

            {!isOnline ? (
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Transaction reference
                </span>
                <input
                  type="text"
                  required
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder={isBank ? "e.g. 9030012345678" : "e.g. MTN receipt code"}
                  className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                />
              </label>
            ) : null}
          </div>

          {isBank ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Bank deposit slip <span className="text-red-600">*</span>
              </p>
              <BankDepositSlipUpload
                className="mt-2"
                fileName={slipFileName}
                onFileSelect={handleSlipSelect}
                disabled={formBusy}
              />
              {!slipFile && !formBusy ? (
                <p className="mt-1 text-xs text-muted">Required for bank transfer verification only.</p>
              ) : null}
            </div>
          ) : null}

          {onlineError ? (
            <p className="mt-4 text-sm font-medium text-red-700" role="alert">
              {onlineError}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            disabled={formBusy || (isBank && !slipFile)}
            className="mt-5 w-full sm:w-auto"
          >
            {formBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {formBusy
              ? isOnline
                ? "Redirecting to gateway…"
                : "Submitting…"
              : isOnline
                ? "Continue to secure checkout"
                : "Submit for verification"}
          </Button>
        </>
      )}
    </form>
  );
}

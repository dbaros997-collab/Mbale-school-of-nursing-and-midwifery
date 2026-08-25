"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Package, Pill } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPrescriptionsBundle,
  submitPrescriptionOrder,
  validatePrescriptionStock,
} from "@/services/portal/prescriptions";
import type { PrescriptionLineItem, PrescriptionsBundle, StockValidationResult } from "@/lib/pharmacy/types";
import {
  PHARMACY_ORDER_STATUS_LABELS,
  PRESCRIPTION_STATUS_LABELS,
} from "@/lib/pharmacy/types";
import { formatUgx } from "@/lib/portal/constants";
import { MedicationPicker } from "@/components/pharmacy/MedicationPicker";
import { PrescriptionUploadZone } from "@/components/pharmacy/PrescriptionUploadZone";
import { StockValidationPanel } from "@/components/pharmacy/StockValidationPanel";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/Button";
import { DataCard } from "@/components/ui/DataCard";
import { cn } from "@/lib/utils";

type Step = "upload" | "medications" | "review";

const STEPS: { id: Step; label: string }[] = [
  { id: "upload", label: "Upload prescription" },
  { id: "medications", label: "Select medications" },
  { id: "review", label: "Review & submit" },
];

function orderTone(status: string): "success" | "warning" | "info" | "neutral" | "danger" {
  if (status === "fulfilled") return "success";
  if (status === "ready") return "success";
  if (status === "processing" || status === "validated") return "info";
  if (status === "stock_failed" || status === "cancelled") return "danger";
  return "warning";
}

export default function PrescriptionsPage() {
  const { profile } = useAuth();
  const [bundle, setBundle] = useState<PrescriptionsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<PrescriptionLineItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [validation, setValidation] = useState<StockValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);

  const customerId = profile?.id ?? "stu-sarah";
  const customerName = profile?.fullName ?? "Student";

  const load = useCallback(async () => {
    const data = await getPrescriptionsBundle(customerId, customerName);
    setBundle(data);
    setLoading(false);
  }, [customerId, customerName]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (step !== "review" || lineItems.length === 0) {
      setValidation(null);
      return;
    }
    let cancelled = false;
    setValidating(true);
    void validatePrescriptionStock(lineItems).then((result) => {
      if (!cancelled) {
        setValidation(result);
        setValidating(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [step, lineItems]);

  const cartTotal = useMemo(() => {
    if (!bundle) return 0;
    return lineItems.reduce((sum, line) => {
      const med = bundle.medications.find((m) => m.id === line.medicationId);
      return sum + (med ? med.unitPriceUgx * line.quantity : 0);
    }, 0);
  }, [bundle, lineItems]);

  async function handleSubmit() {
    if (!fileName) {
      setFlash({ ok: false, text: "Upload your prescription before submitting." });
      setStep("upload");
      return;
    }
    setSubmitting(true);
    setFlash(null);
    const result = await submitPrescriptionOrder(
      { fileName, notes, lineItems },
      customerId,
      customerName,
    );
    setBundle(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    if (result.ok) {
      setFileName(null);
      setNotes("");
      setLineItems([]);
      setStep("upload");
    }
    setSubmitting(false);
  }

  const canProceedUpload = Boolean(fileName);
  const canProceedMeds = lineItems.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
          Campus pharmacy
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
          Prescription orders
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Upload your prescription, select medications, and submit — stock is validated
          automatically and your order is created without manual coordination.
        </p>
      </div>

      {flash ? (
        <p
          role="status"
          className={cn(
            "rounded-lg border px-4 py-3 text-sm font-medium",
            flash.ok
              ? "border-accent-green/30 bg-accent-green-soft text-accent-green"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {flash.text}
        </p>
      ) : null}

      <ol className="flex flex-wrap gap-2" aria-label="Order steps">
        {STEPS.map((s, i) => {
          const active = step === s.id;
          const done =
            (s.id === "upload" && canProceedUpload && step !== "upload") ||
            (s.id === "medications" && canProceedMeds && step === "review");
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  if (s.id === "medications" && !canProceedUpload) return;
                  if (s.id === "review" && !canProceedMeds) return;
                  setStep(s.id);
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-bold transition focus-ring",
                  active && "bg-primary text-white",
                  !active && done && "bg-accent-green-soft text-accent-green",
                  !active && !done && "bg-surface text-muted",
                )}
              >
                {i + 1}. {s.label}
              </button>
            </li>
          );
        })}
      </ol>

      <DataCard title={STEPS.find((s) => s.id === step)?.label ?? "Order"}>
        {step === "upload" ? (
          <div className="space-y-4">
            <PrescriptionUploadZone
              fileName={fileName}
              onFileSelect={(file) => setFileName(file?.name ?? null)}
            />
            <div>
              <label htmlFor="rx-notes" className="text-xs font-semibold uppercase tracking-wider text-muted">
                Notes (optional)
              </label>
              <textarea
                id="rx-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Clinic name, doctor, special instructions…"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus-ring"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              disabled={!canProceedUpload}
              onClick={() => setStep("medications")}
            >
              Continue to medications
            </Button>
          </div>
        ) : null}

        {step === "medications" && bundle ? (
          <div className="space-y-4">
            <MedicationPicker
              medications={bundle.medications}
              lineItems={lineItems}
              onChange={setLineItems}
              query={searchQuery}
              onQueryChange={setSearchQuery}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={!canProceedMeds}
                onClick={() => setStep("review")}
              >
                Review order ({lineItems.length} item{lineItems.length === 1 ? "" : "s"})
              </Button>
            </div>
          </div>
        ) : null}

        {step === "review" && bundle ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-surface/50 px-4 py-3 text-sm">
              <p>
                <span className="font-semibold text-primary">Prescription:</span> {fileName}
              </p>
              {notes ? (
                <p className="mt-1 text-muted">
                  <span className="font-semibold text-foreground">Notes:</span> {notes}
                </p>
              ) : null}
            </div>

            <StockValidationPanel validation={validation} loading={validating} />

            <p className="text-right text-lg font-extrabold text-primary">
              Estimated total: {formatUgx(cartTotal)}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" onClick={() => setStep("medications")}>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={submitting || validating || !validation?.valid}
                onClick={() => void handleSubmit()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden />
                    Submit automated order
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null}
      </DataCard>

      {loading || !bundle ? (
        <div className="h-40 animate-pulse rounded-xl data-card" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <DataCard
            title={
              <span className="flex items-center gap-2">
                <Pill className="h-4 w-4" aria-hidden />
                My prescriptions
              </span>
            }
          >
            {bundle.prescriptions.length === 0 ? (
              <p className="text-sm text-muted">No prescriptions submitted yet.</p>
            ) : (
              <ul className="divide-y divide-border" role="list">
                {bundle.prescriptions.map((rx) => (
                  <li key={rx.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-primary">{rx.fileName}</p>
                      <p className="text-xs text-muted">
                        {new Date(rx.submittedAt ?? rx.createdAt).toLocaleDateString("en-UG")}
                      </p>
                    </div>
                    <StatusBadge
                      tone={
                        rx.status === "fulfilled" || rx.status === "ready"
                          ? "success"
                          : rx.status === "stock_unavailable"
                            ? "danger"
                            : "info"
                      }
                    >
                      {PRESCRIPTION_STATUS_LABELS[rx.status]}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </DataCard>

          <DataCard
            title={
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" aria-hidden />
                My orders
              </span>
            }
          >
            {bundle.orders.length === 0 ? (
              <p className="text-sm text-muted">Orders appear here after successful submission.</p>
            ) : (
              <ul className="divide-y divide-border" role="list">
                {bundle.orders.map((ord) => (
                  <li key={ord.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-primary">{ord.orderReference}</p>
                        <p className="text-xs text-muted">{formatUgx(ord.totalAmountUgx)}</p>
                      </div>
                      <StatusBadge tone={orderTone(ord.status)}>
                        {PHARMACY_ORDER_STATUS_LABELS[ord.status]}
                      </StatusBadge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DataCard>
        </div>
      )}
    </div>
  );
}

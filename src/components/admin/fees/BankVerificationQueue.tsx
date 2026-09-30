"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import type { PendingVerificationRow } from "@/services/portal/admin/fees-types";
import { formatUgx } from "@/lib/portal/constants";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/Button";
import { DataCard } from "@/components/ui/DataCard";
import { cn } from "@/lib/utils";

type BankVerificationQueueProps = {
  items: PendingVerificationRow[];
  busy: boolean;
  onReview: (input: {
    paymentId: string;
    decision: "approved" | "rejected";
    verifiedReference: string;
    reviewNote: string;
  }) => Promise<void>;
};

export function BankVerificationQueue({ items, busy, onReview }: BankVerificationQueueProps) {
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [verifiedReference, setVerifiedReference] = useState(items[0]?.transactionReference ?? "");
  const [reviewNote, setReviewNote] = useState("");

  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? null;

  function selectItem(item: PendingVerificationRow) {
    setSelectedId(item.id);
    setVerifiedReference(item.transactionReference ?? "");
    setReviewNote("");
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30";

  return (
    <DataCard title="Bank verification queue">
      <p className="text-sm text-muted">
        Review uploaded deposit slips, confirm transaction references, and approve or reject
        submissions to update each student&apos;s financial clearance.
      </p>

      {items.length === 0 ? (
        <p className="mt-5 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
          No payments awaiting verification.
        </p>
      ) : (
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ul className="max-h-[420px] space-y-2 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectItem(item)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-3 text-left transition hover:border-primary/30",
                    selected?.id === item.id
                      ? "border-primary bg-[var(--tint-sky-100)]"
                      : "border-border bg-white",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-primary">{item.studentName}</p>
                    <StatusBadge tone="warning">Pending review</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {formatUgx(item.amount)} · {PAYMENT_METHOD_LABELS[item.method]} · Ref{" "}
                    {item.transactionReference ?? item.reference}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Submitted{" "}
                    {new Date(item.submittedAt ?? item.paidAt).toLocaleString("en-UG")}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <div className="space-y-4 rounded-xl border border-border bg-white p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Selected submission
                </p>
                <p className="mt-1 text-sm font-bold text-primary">
                  {selected.studentName} ({selected.studentNumber})
                </p>
                <p className="text-xs text-muted">
                  {formatUgx(selected.amount)} via {PAYMENT_METHOD_LABELS[selected.method]}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Deposit slip
                </p>
                {selected.depositSlipDataUrl ? (
                  selected.depositSlipDataUrl.startsWith("data:application/pdf") ? (
                    <a
                      href={selected.depositSlipDataUrl}
                      download={selected.depositSlipFileName ?? "deposit-slip.pdf"}
                      className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                    >
                      Download {selected.depositSlipFileName ?? "PDF slip"}
                    </a>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- data URL preview from student upload
                    <img
                      src={selected.depositSlipDataUrl}
                      alt="Bank deposit slip"
                      className="mt-2 max-h-48 w-full rounded-md border border-border object-contain bg-white"
                    />
                  )
                ) : (
                  <p className="mt-2 text-sm text-muted">
                    {selected.depositSlipFileName
                      ? `File on record: ${selected.depositSlipFileName} (preview not stored in demo data).`
                      : "No slip attached — verify using the transaction reference only."}
                  </p>
                )}
              </div>

              <label className="block text-xs font-semibold text-muted">
                Verified transaction reference
                <input
                  className={cn(inputClass, "mt-1 font-mono")}
                  value={verifiedReference}
                  onChange={(e) => setVerifiedReference(e.target.value)}
                  required
                />
              </label>

              <label className="block text-xs font-semibold text-muted">
                Review note (optional)
                <textarea
                  className={cn(inputClass, "mt-1 min-h-[72px] resize-y")}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Reason for rejection or internal note"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="green"
                  disabled={busy || !verifiedReference.trim()}
                  onClick={() =>
                    void onReview({
                      paymentId: selected.id,
                      decision: "approved",
                      verifiedReference: verifiedReference.trim(),
                      reviewNote: reviewNote.trim(),
                    })
                  }
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Approve &amp; clear
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={busy}
                  onClick={() =>
                    void onReview({
                      paymentId: selected.id,
                      decision: "rejected",
                      verifiedReference: verifiedReference.trim(),
                      reviewNote: reviewNote.trim(),
                    })
                  }
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  Reject
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </DataCard>
  );
}

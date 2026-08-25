"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";
import type { ApplicationTrackingStatus, InterviewDetails } from "@/lib/admissions/types";
import { TRACKING_STATUS_LABELS } from "@/lib/admissions/tracking";
import { InterviewInformationCard } from "@/components/admissions/InterviewInformationCard";
import { SCHOOL } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ApplicationStatusCardData = {
  applicationReference: string;
  transactionReference: string;
  trackingStatus: ApplicationTrackingStatus;
  qualificationSummary: string;
  qualificationReasons: string[];
  programTitle?: string;
  /** When true, show celebratory qualified headline (auto-check passed) */
  autoQualified?: boolean;
  /** Extension / manual review path */
  manualReview?: boolean;
  interview?: InterviewDetails | null;
};

type ApplicationStatusCardProps = {
  data: ApplicationStatusCardData;
  mode?: "outcome" | "tracking";
  onEditResults?: () => void;
  onStartOver?: () => void;
};

export function ApplicationStatusCard({
  data,
  mode = "outcome",
  onEditResults,
  onStartOver,
}: ApplicationStatusCardProps) {
  const {
    applicationReference,
    transactionReference,
    trackingStatus,
    qualificationSummary,
    qualificationReasons,
    programTitle,
    autoQualified,
    manualReview,
    interview,
  } = data;

  if (trackingStatus === "qualified" || (autoQualified && !manualReview)) {
    return (
      <div
        className="rounded-2xl border border-accent-green/40 bg-accent-green-soft p-6 sm:p-8"
        role="status"
      >
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-green px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Congratulations! You Qualify for the Next Stage
          </span>
          <CheckCircle2 className="mt-5 h-12 w-12 text-accent-green" aria-hidden />
          <p className="mt-3 max-w-lg text-sm font-medium text-primary">
            Please get ready for your interview.
          </p>
          <p className="mt-2 max-w-lg text-sm text-muted">{qualificationSummary}</p>
        </div>

        <ReferenceBlock
          applicationReference={applicationReference}
          transactionReference={transactionReference}
          tone="success"
        />

        {interview ? (
          <InterviewInformationCard
            interview={interview}
            transactionReference={transactionReference}
            className="mt-5"
          />
        ) : (
          <div className="mt-5 rounded-xl border border-accent-green/25 bg-white/70 p-4 text-sm">
            <p className="font-bold text-primary">Next steps</p>
            <ol className="mt-2 list-inside list-decimal space-y-1.5 text-muted">
              <li>Your application is in the admissions review queue.</li>
              <li>Watch for an interview invitation or document verification request.</li>
              <li>A final admission letter will be issued after admin approval.</li>
            </ol>
            {programTitle ? (
              <p className="mt-3 text-xs text-muted">
                Programme: <span className="font-semibold text-primary">{programTitle}</span>
              </p>
            ) : null}
          </div>
        )}

        {qualificationReasons.length ? (
          <ul className="mt-4 space-y-1 text-xs text-muted">
            {qualificationReasons.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="text-accent-green">✓</span>
                {r}
              </li>
            ))}
          </ul>
        ) : null}

        <StatusFooter mode={mode} onStartOver={onStartOver} trackingStatus={trackingStatus} />
      </div>
    );
  }

  if (manualReview && trackingStatus === "pending") {
    return (
      <div
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8 text-center"
        role="status"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {TRACKING_STATUS_LABELS.pending} — Manual Review
        </span>
        <Clock className="mx-auto mt-5 h-10 w-10 text-amber-600" aria-hidden />
        <p className="mt-3 text-sm text-muted">{qualificationSummary}</p>
        <ReferenceBlock
          applicationReference={applicationReference}
          transactionReference={transactionReference}
          tone="warning"
        />
        <p className="mt-4 text-sm text-muted">
          An admissions officer will verify your certificate and license. You will be notified by
          email when your status changes.
        </p>
        <StatusFooter mode={mode} onStartOver={onStartOver} trackingStatus={trackingStatus} />
      </div>
    );
  }

  if (trackingStatus === "pending") {
    return (
      <div
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8"
        role="status"
      >
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Status: {TRACKING_STATUS_LABELS.pending}
          </span>
          <p className="mt-4 text-sm text-muted">{qualificationSummary}</p>
        </div>
        <ReferenceBlock
          applicationReference={applicationReference}
          transactionReference={transactionReference}
          tone="warning"
        />
        <StatusFooter mode={mode} onStartOver={onStartOver} trackingStatus={trackingStatus} />
      </div>
    );
  }

  if (trackingStatus === "unsuccessful_fee_processed") {
    return (
      <div
        className="rounded-2xl border border-red-200 bg-red-50/80 p-6 sm:p-8"
        role="status"
      >
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            {TRACKING_STATUS_LABELS.unsuccessful_fee_processed}
          </span>
          <p className="mt-4 text-sm text-muted">
            Thank you for your payment. Based on the results submitted, you do not currently meet
            the minimum academic criteria
            {programTitle ? ` for ${programTitle}` : " for your selected programme"}. Your
            application processing fee has been received and is non-refundable. Save your payment
            receipt below for your records.
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-red-200/70 bg-white/80 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-red-700">
            Criteria not met
          </p>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {qualificationReasons.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="shrink-0 text-red-600">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <ReferenceBlock
          applicationReference={applicationReference}
          transactionReference={transactionReference}
          tone="danger"
          showReference={mode === "tracking"}
        />

        {mode === "outcome" ? (
          <>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {onEditResults ? (
                <Button variant="green" onClick={onEditResults}>
                  Edit my results
                </Button>
              ) : null}
              {onStartOver ? (
                <Button variant="ghost" onClick={onStartOver}>
                  Start over
                </Button>
              ) : null}
            </div>

            <SupportPanel />
          </>
        ) : (
          <SupportPanel className="mt-5" />
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50/80 p-6 sm:p-8"
      role="status"
    >
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden />
          Application Rejected
        </span>
        <p className="mt-4 text-sm text-muted">
          Thank you for your payment. Based on the results submitted, you do not currently meet
          the minimum academic criteria
          {programTitle ? ` for ${programTitle}` : " for your selected programme"}. Save your
          payment receipt below for your records.
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-red-200/70 bg-white/80 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
          Criteria not met
        </p>
        <ul className="mt-2 space-y-2 text-sm text-muted">
          {qualificationReasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="shrink-0 text-red-600">•</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      <ReferenceBlock
        applicationReference={applicationReference}
        transactionReference={transactionReference}
        tone="danger"
        showReference={mode === "tracking"}
      />

      {mode === "outcome" ? (
        <>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {onEditResults ? (
              <Button variant="green" onClick={onEditResults}>
                Edit my results
              </Button>
            ) : null}
            {onStartOver ? (
              <Button variant="ghost" onClick={onStartOver}>
                Start over
              </Button>
            ) : null}
          </div>

          <SupportPanel />
        </>
      ) : (
        <SupportPanel className="mt-5" />
      )}
    </div>
  );
}

function ReferenceBlock({
  applicationReference,
  transactionReference,
  tone,
  showReference = true,
}: {
  applicationReference: string;
  transactionReference: string;
  tone: "success" | "warning" | "danger";
  showReference?: boolean;
}) {
  const border =
    tone === "success"
      ? "border-accent-green/20"
      : tone === "warning"
        ? "border-amber-200/60"
        : "border-red-200/60";

  return (
    <dl
      className={cn(
        "mx-auto mt-5 max-w-md space-y-3 rounded-xl border bg-white/70 px-4 py-4 text-left text-sm",
        border,
      )}
    >
      {showReference ? (
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Application reference
          </dt>
          <dd className="mt-0.5 font-mono font-bold text-primary">{applicationReference}</dd>
        </div>
      ) : null}
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
          Payment receipt
        </dt>
        <dd className="mt-0.5 font-mono font-bold text-primary">{transactionReference}</dd>
      </div>
    </dl>
  );
}

function SupportPanel({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-white p-4 text-sm", className)}>
      <p className="font-semibold text-primary">Need help? Contact admissions support</p>
      <ul className="mt-3 space-y-2 text-muted">
        <li className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <a
            href={`mailto:${SCHOOL.admissionsEmail}`}
            className="font-medium text-primary hover:underline"
          >
            {SCHOOL.admissionsEmail}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <a href={`tel:${SCHOOL.phone}`} className="font-medium text-primary hover:underline">
            {SCHOOL.phone}
          </a>
        </li>
      </ul>
      <Link
        href="/contact"
        className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
      >
        Visit contact page →
      </Link>
    </div>
  );
}

function StatusFooter({
  mode,
  onStartOver,
  trackingStatus,
}: {
  mode: "outcome" | "tracking";
  onStartOver?: () => void;
  trackingStatus: ApplicationTrackingStatus;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      {mode === "outcome" && onStartOver ? (
        <Button variant="ghost" onClick={onStartOver}>
          {trackingStatus === "rejected" || trackingStatus === "unsuccessful_fee_processed"
            ? "Start over"
            : "Submit another application"}
        </Button>
      ) : null}
      <Button href="/admissions/track" variant="green">
        Track application status
      </Button>
    </div>
  );
}

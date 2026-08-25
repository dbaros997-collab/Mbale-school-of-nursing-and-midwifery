"use client";

import { Calendar, ClipboardList, MapPin, Monitor, Users } from "lucide-react";
import type { InterviewDetails } from "@/lib/admissions/types";
import {
  DEFAULT_INTERVIEW_VENUES,
  formatInterviewDateTime,
  INTERVIEW_REQUIRED_DOCUMENTS,
  INTERVIEW_STATUS_LABELS,
  SUGGESTED_INTERVIEW_SLOTS,
} from "@/lib/admissions/interview";
import { cn } from "@/lib/utils";
import { Callout } from "@/components/ui/Callout";

type InterviewInformationCardProps = {
  interview: InterviewDetails;
  transactionReference?: string;
  className?: string;
};

export function InterviewInformationCard({
  interview,
  transactionReference,
  className,
}: InterviewInformationCardProps) {
  const isScheduled = interview.status === "interview_scheduled";
  const isCompleted = interview.status === "interview_completed";
  const isAdmitted = interview.status === "admitted";
  const scheduledLabel = formatInterviewDateTime(interview.scheduledDate, interview.scheduledTime);

  return (
    <div
      className={cn(
        "rounded-xl border border-primary/20 bg-white p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-4 w-4 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-primary">Interview Information</h3>
          <p className="mt-1 text-sm text-muted">
            You have been invited to the next stage of the admissions process.
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-4">
        <div className="rounded-lg border border-border bg-surface/60 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Status</dt>
          <dd className="mt-1 text-sm font-bold text-primary">
            {INTERVIEW_STATUS_LABELS[interview.status]}
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <ClipboardList className="h-3.5 w-3.5" aria-hidden />
            Required documents
          </dt>
          <dd className="mt-2">
            <ul className="space-y-1.5 text-sm text-muted">
              {INTERVIEW_REQUIRED_DOCUMENTS.map((doc) => (
                <li key={doc} className="flex gap-2">
                  <span className="shrink-0 text-primary">•</span>
                  {doc}
                  {doc.includes("payment receipt") && transactionReference ? (
                    <span className="font-mono text-xs text-primary">({transactionReference})</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            Date &amp; venue
          </dt>
          <dd className="mt-2 space-y-3 text-sm">
            {isScheduled && scheduledLabel ? (
              <div className="rounded-lg border border-accent-green/30 bg-accent-green-soft/40 px-4 py-3">
                <p className="font-semibold text-primary">{scheduledLabel}</p>
                <p className="mt-1 flex items-start gap-2 text-muted">
                  {interview.mode === "online" ? (
                    <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  ) : (
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  )}
                  {interview.venue ??
                    (interview.mode === "online"
                      ? DEFAULT_INTERVIEW_VENUES.online
                      : DEFAULT_INTERVIEW_VENUES.physical)}
                </p>
                {interview.adminNotes ? (
                  <p className="mt-2 text-xs text-muted">{interview.adminNotes}</p>
                ) : null}
              </div>
            ) : (
              <>
                <p className="text-muted">
                  Your interview date will be confirmed by the admissions office. Typical options
                  include on-campus sessions or online interviews.
                </p>
                <ul className="space-y-2">
                  {SUGGESTED_INTERVIEW_SLOTS.map((slot) => (
                    <li
                      key={`${slot.date}-${slot.time}`}
                      className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs"
                    >
                      <span className="font-semibold text-primary">
                        {formatInterviewDateTime(slot.date, slot.time)}
                      </span>
                      <span className="text-muted">
                        {slot.mode === "online"
                          ? DEFAULT_INTERVIEW_VENUES.online
                          : DEFAULT_INTERVIEW_VENUES.physical}
                      </span>
                      <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                        Sample slot
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </dd>
        </div>
      </dl>

      {isCompleted ? (
        <Callout className="mt-4 text-sm" role="status">
          Your interview has been completed. Admissions will notify you of the final decision.
        </Callout>
      ) : null}

      {isAdmitted ? (
        <p className="mt-4 rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green">
          Congratulations — you have been admitted! Watch for your admission letter and portal
          activation instructions.
        </p>
      ) : null}
    </div>
  );
}

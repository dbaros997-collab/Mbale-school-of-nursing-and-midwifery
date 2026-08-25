import { cn } from "@/lib/utils";
import type {
  DocumentRequestStatus,
  RegistrationStatus,
  StudentAccountStatus,
  SubmissionStatus,
} from "@/lib/portal/schema";
import type { ApplicationTrackingStatus, QualificationStatus, InterviewStatus } from "@/lib/admissions/types";
import { TRACKING_STATUS_LABELS } from "@/lib/admissions/tracking";
import { INTERVIEW_STATUS_LABELS, interviewStatusTone } from "@/lib/admissions/interview";
import {
  DOCUMENT_STATUS_LABELS,
  REGISTRATION_STATUS_LABELS,
  STUDENT_ACCOUNT_STATUS_LABELS,
  SUBMISSION_STATUS_LABELS,
} from "@/lib/portal/constants";

type BadgeTone = "success" | "warning" | "danger" | "neutral" | "info";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-accent-green-soft text-accent-green",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  neutral: "bg-surface text-muted",
  info: "bg-accent-cyan-soft text-primary",
};

export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function submissionTone(status: SubmissionStatus): BadgeTone {
  if (status === "graded") return "success";
  if (status === "submitted") return "info";
  return "warning";
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <StatusBadge tone={submissionTone(status)}>
      {SUBMISSION_STATUS_LABELS[status]}
    </StatusBadge>
  );
}

export function registrationTone(status: RegistrationStatus): BadgeTone {
  if (status === "approved") return "success";
  if (status === "submitted") return "info";
  if (status === "rejected") return "danger";
  return "warning";
}

export function RegistrationStatusBadge({ status }: { status: RegistrationStatus }) {
  return (
    <StatusBadge tone={registrationTone(status)}>
      {REGISTRATION_STATUS_LABELS[status]}
    </StatusBadge>
  );
}

export function documentTone(status: DocumentRequestStatus): BadgeTone {
  if (status === "downloaded" || status === "ready") return "success";
  if (status === "processing") return "warning";
  return "neutral";
}

export function DocumentStatusBadge({ status }: { status: DocumentRequestStatus }) {
  return (
    <StatusBadge tone={documentTone(status)}>
      {DOCUMENT_STATUS_LABELS[status]}
    </StatusBadge>
  );
}

export function accountStatusTone(status: StudentAccountStatus): BadgeTone {
  if (status === "active") return "success";
  if (status === "pending_approval") return "warning";
  return "neutral";
}

export function AccountStatusBadge({ status }: { status: StudentAccountStatus }) {
  return (
    <StatusBadge tone={accountStatusTone(status)}>
      {STUDENT_ACCOUNT_STATUS_LABELS[status]}
    </StatusBadge>
  );
}

export function qualificationStatusTone(status: QualificationStatus): BadgeTone {
  if (status === "qualified") return "success";
  if (status === "manual_review") return "warning";
  return "danger";
}

const QUALIFICATION_STATUS_LABELS: Record<QualificationStatus, string> = {
  qualified: "Auto-qualified",
  manual_review: "Manual review",
  not_qualified: "Not qualified",
};

export function QualificationStatusBadge({ status }: { status: QualificationStatus }) {
  return (
    <StatusBadge tone={qualificationStatusTone(status)}>
      {QUALIFICATION_STATUS_LABELS[status]}
    </StatusBadge>
  );
}

export function TrackingStatusBadge({ status }: { status: ApplicationTrackingStatus }) {
  return (
    <StatusBadge tone={trackingStatusTone(status)}>
      {TRACKING_STATUS_LABELS[status]}
    </StatusBadge>
  );
}

function trackingStatusTone(status: ApplicationTrackingStatus): BadgeTone {
  if (status === "qualified") return "success";
  if (status === "rejected" || status === "unsuccessful_fee_processed") return "danger";
  return "warning";
}

export function InterviewStatusBadge({ status }: { status: InterviewStatus }) {
  return (
    <StatusBadge tone={interviewStatusTone(status)}>
      {INTERVIEW_STATUS_LABELS[status]}
    </StatusBadge>
  );
}

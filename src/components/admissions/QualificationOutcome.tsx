"use client";

import type { EligibilityResult, ApplicationTrackingStatus, InterviewDetails } from "@/lib/admissions/types";
import { ApplicationStatusCard } from "@/components/admissions/ApplicationStatusCard";
import { NotificationDispatchPanel } from "@/components/admissions/NotificationDispatchPanel";

export type QualificationOutcomeData = {
  applicationReference: string;
  transactionReference: string;
  eligibility: EligibilityResult;
  queuedForReview: boolean;
  trackingStatus: ApplicationTrackingStatus;
  email: string;
  phone: string;
  programTitle: string;
  interview?: InterviewDetails | null;
  notificationSent?: boolean;
};

type QualificationOutcomeProps = {
  outcome: QualificationOutcomeData;
  onEditResults: () => void;
  onStartOver: () => void;
};

export function QualificationOutcome({
  outcome,
  onEditResults,
  onStartOver,
}: QualificationOutcomeProps) {
  const { eligibility, applicationReference, transactionReference, trackingStatus, email, phone, programTitle, interview } =
    outcome;

  return (
    <div className="mt-8 space-y-5">
      <ApplicationStatusCard
        mode="outcome"
        data={{
          applicationReference,
          transactionReference,
          trackingStatus,
          qualificationSummary: eligibility.summary,
          qualificationReasons: eligibility.reasons,
          programTitle,
          autoQualified: eligibility.status === "qualified",
          manualReview: eligibility.status === "manual_review",
          interview,
        }}
        onEditResults={
          trackingStatus === "unsuccessful_fee_processed" ? onEditResults : undefined
        }
        onStartOver={onStartOver}
      />

      <NotificationDispatchPanel
        applicationReference={applicationReference}
        email={email}
        phone={phone}
      />
    </div>
  );
}

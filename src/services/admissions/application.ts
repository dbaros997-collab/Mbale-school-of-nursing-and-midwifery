import { mockDelay } from "@/lib/mock-delay";
import type { ApplicationPayload } from "@/lib/data";
import { addMockApplication } from "@/lib/admissions/applications-store";
import {
  APPLICATION_FEE_NON_REFUNDABLE,
  type ApplicationRecord,
  type ApplicationTrackingStatus,
  type EligibilityResult,
} from "@/lib/admissions/types";
import { evaluateEligibility, getProgramTitle } from "@/services/admissions/eligibility";
import { createInterviewInvitation } from "@/lib/admissions/interview";
import { dispatchApplicationNotification } from "@/services/admissions/notifications";

export type ApplicationPaymentMethod = "bank";

export const APPLICATION_PAYMENT_LABELS: Record<ApplicationPaymentMethod, string> = {
  bank: "Bank transfer",
};

export function generateApplicationReference(): string {
  const seq = Math.floor(Math.random() * 9000 + 1000);
  return `MBSNM/APP/2026/${seq}`;
}

function generateTransactionReference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(Math.random() * 90000 + 10000);
  return `BNK-${date}-${suffix}`;
}

export type ApplicationPaymentResult = {
  ok: boolean;
  message: string;
  transactionReference?: string;
  paymentStatus?: ApplicationRecord["paymentStatus"];
  paymentRefundable?: ApplicationRecord["paymentRefundable"];
};

/** Simulated bank transfer verification for the application fee */
export async function mockApplicationPayment(input: {
  transferReference: string;
}): Promise<ApplicationPaymentResult> {
  await mockDelay(2800);

  const reference = input.transferReference.replace(/\s/g, "");
  if (reference.length < 6) {
    return {
      ok: false,
      message: "Enter a valid bank transfer reference (at least 6 characters).",
    };
  }

  return {
    ok: true,
    message: "Payment Confirmed",
    transactionReference: generateTransactionReference(),
    paymentStatus: "completed",
    paymentRefundable: APPLICATION_FEE_NON_REFUNDABLE,
  };
}

export type ApplicationProcessResult = {
  ok: boolean;
  message: string;
  applicationReference?: string;
  transactionReference?: string;
  eligibility?: EligibilityResult;
  applicationId?: string;
  queuedForReview?: boolean;
  trackingStatus?: ApplicationTrackingStatus;
  paymentStatus?: ApplicationRecord["paymentStatus"];
  paymentRefundable?: ApplicationRecord["paymentRefundable"];
  interview?: ApplicationRecord["interview"];
};

function initialTrackingStatus(
  eligibility: EligibilityResult,
  queuedForReview: boolean,
): ApplicationTrackingStatus {
  if (eligibility.status === "not_qualified") return "unsuccessful_fee_processed";
  if (queuedForReview) return "pending";
  return "rejected";
}

/** Runs eligibility check and persists the application after successful payment */
export async function processApplicationAfterPayment(
  payload: ApplicationPayload & {
    transactionReference: string;
    paymentMethod: ApplicationPaymentMethod;
    paymentReference: string;
  },
): Promise<ApplicationProcessResult> {
  await mockDelay(1200);

  if (
    !payload.fullName ||
    !payload.email ||
    !payload.intakeId ||
    !payload.programId ||
    !payload.paymentConfirmed ||
    !payload.feePolicyAcknowledged
  ) {
    return {
      ok: false,
      message: "Please complete all required fields, acknowledge the non-refundable fee policy, and pay the application fee.",
    };
  }

  const eligibility = evaluateEligibility({
    programId: payload.programId,
    educationLevel: payload.educationLevel,
    academicResults: payload.academicResults,
  });

  const applicationReference = generateApplicationReference();
  const queuedForReview =
    eligibility.status === "qualified" || eligibility.status === "manual_review";
  const trackingStatus = initialTrackingStatus(eligibility, queuedForReview);
  const interview =
    eligibility.status === "qualified" ? createInterviewInvitation() : null;

  const record: ApplicationRecord = {
    id: `app-${Date.now()}`,
    applicationReference,
    transactionReference: payload.transactionReference,
    submittedAt: new Date().toISOString(),
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    gender: payload.gender,
    dateOfBirth: payload.dateOfBirth,
    intakeId: payload.intakeId,
    programId: payload.programId,
    programTitle: getProgramTitle(payload.programId),
    educationLevel: payload.educationLevel,
    academicResults: { ...payload.academicResults },
    qualificationStatus: eligibility.status,
    qualificationSummary: eligibility.summary,
    qualificationReasons: [...eligibility.reasons],
    reviewStatus: queuedForReview ? "pending_approval" : "rejected",
    trackingStatus,
    notifications: [],
    paymentMethod: payload.paymentMethod,
    paymentReference: payload.paymentReference,
    paymentStatus: "completed",
    paymentRefundable: APPLICATION_FEE_NON_REFUNDABLE,
    interview,
    message: payload.message,
  };

  addMockApplication(record);

  if (payload.sendNotifications) {
    await dispatchApplicationNotification({
      applicationReference,
      channels: payload.notifySms ? ["email", "sms"] : ["email"],
    });
  }

  console.info("Application processed", {
    applicationReference,
    qualificationStatus: eligibility.status,
    queuedForReview,
  });

  if (eligibility.status === "not_qualified") {
    return {
      ok: true,
      message: eligibility.summary,
      applicationReference,
      transactionReference: payload.transactionReference,
      eligibility,
      applicationId: record.id,
      queuedForReview: false,
      trackingStatus,
      paymentStatus: record.paymentStatus,
      paymentRefundable: record.paymentRefundable,
    };
  }

  return {
    ok: true,
    message:
      eligibility.status === "qualified"
        ? "Congratulations! You qualify for the next stage. Please get ready for your interview."
        : eligibility.summary,
    applicationReference,
    transactionReference: payload.transactionReference,
    eligibility,
    applicationId: record.id,
    queuedForReview,
    trackingStatus,
    interview: record.interview,
  };
}

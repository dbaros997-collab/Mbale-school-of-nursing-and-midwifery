import { mockDelay } from "@/lib/mock-delay";
import { findApplicationByReference } from "@/lib/admissions/applications-store";
import type { ApplicationRecord } from "@/lib/admissions/types";
import { deriveTrackingStatus } from "@/lib/admissions/tracking";
import { applicationIntakes } from "@/lib/data";

export type ApplicationTrackingView = {
  applicationReference: string;
  fullName: string;
  email: string;
  phone: string;
  programTitle: string;
  intakeLabel: string;
  submittedAt: string;
  transactionReference: string;
  paymentStatus: ApplicationRecord["paymentStatus"];
  paymentRefundable: ApplicationRecord["paymentRefundable"];
  trackingStatus: ReturnType<typeof deriveTrackingStatus>;
  qualificationStatus: ApplicationRecord["qualificationStatus"];
  qualificationSummary: string;
  qualificationReasons: string[];
  interview: ApplicationRecord["interview"];
  notifications: ApplicationRecord["notifications"];
};

function toView(record: ApplicationRecord): ApplicationTrackingView {
  return {
    applicationReference: record.applicationReference,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    programTitle: record.programTitle,
    intakeLabel:
      applicationIntakes.find((i) => i.id === record.intakeId)?.label ?? record.intakeId,
    submittedAt: record.submittedAt,
    transactionReference: record.transactionReference,
    paymentStatus: record.paymentStatus,
    paymentRefundable: record.paymentRefundable,
    trackingStatus: deriveTrackingStatus(record),
    qualificationStatus: record.qualificationStatus,
    qualificationSummary: record.qualificationSummary,
    qualificationReasons: [...record.qualificationReasons],
    interview: record.interview,
    notifications: [...record.notifications],
  };
}

/** Ready for GET /api/admissions/track?reference= */
export async function lookupApplicationByReference(
  reference: string,
): Promise<{ ok: boolean; message: string; application?: ApplicationTrackingView }> {
  await mockDelay(450);

  const trimmed = reference.trim();
  if (!trimmed) {
    return { ok: false, message: "Enter your application reference number." };
  }

  const record = findApplicationByReference(trimmed);
  if (!record) {
    return {
      ok: false,
      message:
        "No application found with that reference. Check the number and try again (e.g. MBSNM/APP/2026/1234).",
    };
  }

  return {
    ok: true,
    message: "Application found.",
    application: toView(record),
  };
}

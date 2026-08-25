import type { ApplicationRecord, ApplicationTrackingStatus } from "@/lib/admissions/types";

export type { ApplicationTrackingStatus };

export function deriveTrackingStatus(record: ApplicationRecord): ApplicationTrackingStatus {
  if (record.trackingStatus) return record.trackingStatus;
  if (record.reviewStatus === "approved") return "qualified";
  if (record.qualificationStatus === "not_qualified" && record.paymentStatus === "completed") {
    return "unsuccessful_fee_processed";
  }
  if (record.reviewStatus === "rejected") return "rejected";
  return "pending";
}

export const TRACKING_STATUS_LABELS: Record<ApplicationTrackingStatus, string> = {
  pending: "Pending",
  qualified: "Qualified",
  rejected: "Rejected",
  unsuccessful_fee_processed: "Unsuccessful / Fee Processed",
};

export function trackingStatusTone(
  status: ApplicationTrackingStatus,
): "success" | "warning" | "danger" {
  if (status === "qualified") return "success";
  if (status === "rejected" || status === "unsuccessful_fee_processed") return "danger";
  return "warning";
}

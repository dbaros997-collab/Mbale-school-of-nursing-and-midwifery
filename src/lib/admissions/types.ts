/** Admissions application & qualification types */

export const UCE_GRADES = [
  "D1",
  "D2",
  "C3",
  "C4",
  "C5",
  "C6",
  "P7",
  "P8",
  "F9",
] as const;

export type UceGrade = (typeof UCE_GRADES)[number];

export type AcademicResults = {
  uceIndexNumber: string;
  englishGrade: string;
  mathematicsGrade: string;
  biologyGrade: string;
  /** Total UCE subject passes (excluding F9) — required for direct diploma entry */
  totalPasses: string;
  /** Practicing license / certificate ref for extension programmes */
  certificateLicenseRef: string;
};

export type QualificationStatus = "qualified" | "not_qualified" | "manual_review";

export type ApplicationReviewStatus = "pending_approval" | "approved" | "rejected";

export type InterviewStatus =
  | "interview_pending"
  | "interview_scheduled"
  | "interview_completed"
  | "admitted";

export type InterviewMode = "physical" | "online";

export type InterviewDetails = {
  status: InterviewStatus;
  invitedAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  venue?: string;
  mode?: InterviewMode;
  adminNotes?: string;
};

/** Applicant-facing status for reference lookup */
export type ApplicationTrackingStatus =
  | "pending"
  | "qualified"
  | "rejected"
  | "unsuccessful_fee_processed";

/** Application fee payment is always completed and non-refundable once processed */
export type ApplicationFeePaymentStatus = "completed";

export const APPLICATION_FEE_NON_REFUNDABLE = false as const;

export type NotificationChannel = "email" | "sms";

export type ApplicationNotificationLog = {
  id: string;
  sentAt: string;
  channels: NotificationChannel[];
  email: string;
  phone: string;
  subject: string;
  preview: string;
};

export type EligibilityResult = {
  status: QualificationStatus;
  qualified: boolean;
  summary: string;
  reasons: string[];
};

export type ApplicationRecord = {
  id: string;
  applicationReference: string;
  transactionReference: string;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  intakeId: string;
  programId: string;
  programTitle: string;
  educationLevel: string;
  academicResults: AcademicResults;
  qualificationStatus: QualificationStatus;
  qualificationSummary: string;
  qualificationReasons: string[];
  reviewStatus: ApplicationReviewStatus;
  /** Denormalised applicant tracking status — updated when admin acts */
  trackingStatus: ApplicationTrackingStatus;
  notifications: ApplicationNotificationLog[];
  paymentMethod: "bank";
  paymentReference: string;
  /** Always "completed" after successful bank transfer verification */
  paymentStatus: ApplicationFeePaymentStatus;
  /** Application fees are never refundable — retained even when qualification fails */
  paymentRefundable: typeof APPLICATION_FEE_NON_REFUNDABLE;
  /** Set automatically when auto-qualification passes; managed by admin thereafter */
  interview: InterviewDetails | null;
  message: string;
};

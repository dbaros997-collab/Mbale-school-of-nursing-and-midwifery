import type {
  ApplicationRecord,
  ApplicationReviewStatus,
  ApplicationTrackingStatus,
  InterviewDetails,
  InterviewMode,
  InterviewStatus,
} from "@/lib/admissions/types";
import { deriveTrackingStatus } from "@/lib/admissions/tracking";

export const mockApplications: ApplicationRecord[] = [];

export function addMockApplication(record: ApplicationRecord): ApplicationRecord {
  mockApplications.unshift(record);
  return record;
}

export function findApplicationByReference(
  reference: string,
): ApplicationRecord | undefined {
  const normalized = reference.trim().toUpperCase();
  return mockApplications.find(
    (a) => a.applicationReference.toUpperCase() === normalized,
  );
}

export function updateApplicationReviewStatus(
  applicationId: string,
  reviewStatus: ApplicationReviewStatus,
): ApplicationRecord | null {
  const row = mockApplications.find((a) => a.id === applicationId);
  if (!row) return null;
  row.reviewStatus = reviewStatus;
  if (reviewStatus === "approved") {
    row.trackingStatus = "qualified";
  } else if (reviewStatus === "rejected") {
    // Admin rejection — fee remains non-refundable; never trigger a refund workflow.
    row.trackingStatus = "rejected";
  }
  return row;
}

export function updateApplicationTrackingStatus(
  applicationId: string,
  trackingStatus: ApplicationTrackingStatus,
): ApplicationRecord | null {
  const row = mockApplications.find((a) => a.id === applicationId);
  if (!row) return null;
  row.trackingStatus = trackingStatus;
  return row;
}

export function appendApplicationNotification(
  applicationId: string,
  log: ApplicationRecord["notifications"][number],
): ApplicationRecord | null {
  const row = mockApplications.find((a) => a.id === applicationId);
  if (!row) return null;
  row.notifications.push(log);
  return row;
}

export function getPendingApplicationCount(): number {
  return mockApplications.filter(
    (a) =>
      deriveTrackingStatus(a) === "pending" &&
      (a.qualificationStatus === "qualified" || a.qualificationStatus === "manual_review"),
  ).length;
}

export function getInterviewQueueCount(): number {
  return mockApplications.filter(
    (a) =>
      a.qualificationStatus === "qualified" &&
      a.interview &&
      (a.interview.status === "interview_pending" || a.interview.status === "interview_scheduled"),
  ).length;
}

export function updateApplicationInterview(
  applicationId: string,
  patch: Partial<InterviewDetails>,
): ApplicationRecord | null {
  const row = mockApplications.find((a) => a.id === applicationId);
  if (!row?.interview) return null;

  row.interview = { ...row.interview, ...patch };

  if (patch.status === "admitted") {
    row.reviewStatus = "approved";
    row.trackingStatus = "qualified";
  }

  return row;
}

export function updateApplicationInterviewStatus(
  applicationId: string,
  status: InterviewStatus,
): ApplicationRecord | null {
  return updateApplicationInterview(applicationId, { status });
}

export type InterviewScheduleInput = {
  scheduledDate: string;
  scheduledTime: string;
  venue: string;
  mode: InterviewMode;
  adminNotes?: string;
};

export function scheduleApplicationInterview(
  applicationId: string,
  schedule: InterviewScheduleInput,
): ApplicationRecord | null {
  return updateApplicationInterview(applicationId, {
    status: "interview_scheduled",
    scheduledDate: schedule.scheduledDate,
    scheduledTime: schedule.scheduledTime,
    venue: schedule.venue,
    mode: schedule.mode,
    adminNotes: schedule.adminNotes,
  });
}

export function bulkScheduleInterviews(
  applicationIds: string[],
  schedule: InterviewScheduleInput,
): ApplicationRecord[] {
  const updated: ApplicationRecord[] = [];
  for (const id of applicationIds) {
    const row = scheduleApplicationInterview(id, schedule);
    if (row) updated.push(row);
  }
  return updated;
}

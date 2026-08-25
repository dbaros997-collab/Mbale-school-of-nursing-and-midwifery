import { mockDelay } from "@/lib/mock-delay";
import {
  bulkScheduleInterviews,
  getInterviewQueueCount,
  mockApplications,
  scheduleApplicationInterview,
  updateApplicationInterviewStatus,
  updateApplicationReviewStatus,
  type InterviewScheduleInput,
} from "@/lib/admissions/applications-store";
import type { ApplicationRecord, InterviewStatus, QualificationStatus } from "@/lib/admissions/types";

export type AdminApplicationRow = ApplicationRecord;

export type AdminApplicationsBundle = {
  applications: AdminApplicationRow[];
  pendingCount: number;
  qualifiedCount: number;
  manualReviewCount: number;
  notQualifiedCount: number;
  interviewQueueCount: number;
};

function snapshot(): AdminApplicationsBundle {
  const applications = [...mockApplications].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  return {
    applications,
    pendingCount: applications.filter((a) => a.reviewStatus === "pending_approval").length,
    qualifiedCount: applications.filter((a) => a.qualificationStatus === "qualified").length,
    manualReviewCount: applications.filter((a) => a.qualificationStatus === "manual_review").length,
    notQualifiedCount: applications.filter((a) => a.qualificationStatus === "not_qualified").length,
    interviewQueueCount: getInterviewQueueCount(),
  };
}

/** Ready for GET /api/portal/admin/applications */
export async function getAdminApplicationsBundle(): Promise<AdminApplicationsBundle> {
  await mockDelay(260);
  return snapshot();
}

/** Ready for POST /api/portal/admin/applications/:id/approve */
export async function approveApplication(
  applicationId: string,
): Promise<{ ok: boolean; message: string; bundle: AdminApplicationsBundle }> {
  await mockDelay(400);
  const updated = updateApplicationReviewStatus(applicationId, "approved");
  if (!updated) {
    return { ok: false, message: "Application not found.", bundle: snapshot() };
  }
  return {
    ok: true,
    message: `Application ${updated.applicationReference} approved.`,
    bundle: snapshot(),
  };
}

/** Ready for POST /api/portal/admin/applications/:id/reject */
export async function rejectApplication(
  applicationId: string,
): Promise<{ ok: boolean; message: string; bundle: AdminApplicationsBundle }> {
  await mockDelay(400);
  const updated = updateApplicationReviewStatus(applicationId, "rejected");
  if (!updated) {
    return { ok: false, message: "Application not found.", bundle: snapshot() };
  }
  return {
    ok: true,
    message: `Application ${updated.applicationReference} marked as rejected.`,
    bundle: snapshot(),
  };
}

/** Ready for POST /api/portal/admin/applications/:id/interview/schedule */
export async function scheduleInterview(
  applicationId: string,
  schedule: InterviewScheduleInput,
): Promise<{ ok: boolean; message: string; bundle: AdminApplicationsBundle }> {
  await mockDelay(400);
  const updated = scheduleApplicationInterview(applicationId, schedule);
  if (!updated) {
    return { ok: false, message: "Application not found or not in interview queue.", bundle: snapshot() };
  }
  return {
    ok: true,
    message: `Interview scheduled for ${updated.fullName} (${updated.applicationReference}).`,
    bundle: snapshot(),
  };
}

/** Ready for POST /api/portal/admin/applications/interview/bulk-schedule */
export async function bulkInviteToInterview(
  applicationIds: string[],
  schedule: InterviewScheduleInput,
): Promise<{ ok: boolean; message: string; bundle: AdminApplicationsBundle; count: number }> {
  await mockDelay(500);
  if (!applicationIds.length) {
    return { ok: false, message: "Select at least one applicant.", bundle: snapshot(), count: 0 };
  }
  const updated = bulkScheduleInterviews(applicationIds, schedule);
  return {
    ok: true,
    message: `${updated.length} applicant(s) invited to interview on ${schedule.scheduledDate} at ${schedule.scheduledTime}.`,
    bundle: snapshot(),
    count: updated.length,
  };
}

/** Ready for PATCH /api/portal/admin/applications/:id/interview/status */
export async function updateInterviewStatus(
  applicationId: string,
  status: InterviewStatus,
): Promise<{ ok: boolean; message: string; bundle: AdminApplicationsBundle }> {
  await mockDelay(350);
  const updated = updateApplicationInterviewStatus(applicationId, status);
  if (!updated) {
    return { ok: false, message: "Application not found or has no interview record.", bundle: snapshot() };
  }
  return {
    ok: true,
    message: `Interview status updated to "${status.replace(/_/g, " ")}" for ${updated.applicationReference}.`,
    bundle: snapshot(),
  };
}

export function qualificationFilterLabel(status: QualificationStatus): string {
  if (status === "qualified") return "Auto-qualified";
  if (status === "manual_review") return "Manual review";
  return "Not qualified";
}

export type { InterviewScheduleInput };

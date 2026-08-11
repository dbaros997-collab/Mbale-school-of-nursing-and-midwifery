import {
  MOCK_ANNOUNCEMENTS,
  MOCK_ASSIGNMENTS,
  MOCK_PROFILE,
  MOCK_PROGRAM,
  MOCK_SUBMISSIONS,
  MOCK_UNITS,
  MOCK_ENROLLMENTS,
  mockInvoice,
} from "@/lib/portal/mock-store";
import type { DashboardSummary, DeadlineItem } from "@/lib/portal/schema";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock dashboard service — ready for GET /api/portal/dashboard
 */
export async function getDashboardSummary(
  studentId = MOCK_PROFILE.id,
): Promise<DashboardSummary> {
  await delay(350);

  const unitMap = Object.fromEntries(MOCK_UNITS.map((u) => [u.id, u]));
  const submissionByAssignment = Object.fromEntries(
    MOCK_SUBMISSIONS.filter((s) => s.studentId === studentId).map((s) => [
      s.assignmentId,
      s,
    ]),
  );

  const upcomingDeadlines: DeadlineItem[] = MOCK_ASSIGNMENTS.map((asg) => {
    const unit = unitMap[asg.courseUnitId];
    const sub = submissionByAssignment[asg.id];
    return {
      id: asg.id,
      title: asg.title,
      courseCode: unit?.code ?? "—",
      dueAt: asg.dueAt,
      status: sub?.status ?? "pending",
    };
  })
    .filter((d) => d.status !== "graded")
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 5);

  const enrolledUnits = MOCK_ENROLLMENTS.filter(
    (e) => e.studentId === studentId && e.status === "active",
  ).length;

  return {
    studentName: MOCK_PROFILE.fullName,
    studentId: MOCK_PROFILE.studentNumber,
    program: MOCK_PROGRAM.title,
    gpa: MOCK_PROFILE.semesterGpa,
    feeBalance: mockInvoice.balance,
    enrolledUnits,
    upcomingDeadlines,
    announcements: MOCK_ANNOUNCEMENTS,
  };
}

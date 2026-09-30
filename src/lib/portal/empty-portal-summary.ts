import type { StudentProfile } from "./schema";
import type { DashboardSummary } from "./schema";

export function buildEmptyDashboardSummary(profile: StudentProfile | null): DashboardSummary {
  return {
    studentName: profile?.fullName ?? "Student",
    studentId: profile?.studentNumber ?? "—",
    program: "—",
    gpa: profile?.semesterGpa ?? 0,
    feeBalance: 0,
    upcomingDeadlines: [],
    enrolledUnits: 0,
    announcements: [],
  };
}

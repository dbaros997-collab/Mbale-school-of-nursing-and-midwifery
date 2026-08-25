import { mockDelay } from "@/lib/mock-delay";
import {
  CURRENT_SEMESTER,
  MOCK_UNITS,
  mockAdminPayments,
  mockAdminStudents,
  mockPayments,
} from "@/lib/portal/mock-store";
import { getPendingApplicationCount, mockApplications } from "@/lib/admissions/applications-store";
import type { AdminOverviewSummary, Payment } from "@/lib/portal/schema";

function allPayments(): Payment[] {
  const byId = new Map<string, Payment>();
  for (const p of [...mockAdminPayments, ...mockPayments]) {
    byId.set(p.id, p);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
  );
}

/** Ready for GET /api/portal/admin/overview */
export async function getAdminOverview(): Promise<AdminOverviewSummary> {
  await mockDelay(280);

  const activeStudents = mockAdminStudents.filter((s) => s.accountStatus === "active").length;
  const pendingStudents = mockAdminStudents.filter(
    (s) => s.accountStatus === "pending_approval",
  );
  const payments = allPayments().filter((p) => p.status === "completed");
  const totalFeeCollections = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalances = mockAdminStudents.reduce((sum, s) => sum + s.feeBalance, 0);

  return {
    activeStudents,
    pendingApprovals: pendingStudents.length,
    pendingApplications: getPendingApplicationCount(),
    totalFeeCollections,
    activeCourses: MOCK_UNITS.length,
    outstandingBalances,
    recentPayments: payments.slice(0, 5),
    pendingStudents: pendingStudents.map((s) => ({ ...s })),
    pendingApplicationQueue: mockApplications
      .filter((a) => a.reviewStatus === "pending_approval")
      .slice(0, 5)
      .map((a) => ({ ...a, qualificationReasons: [...a.qualificationReasons], academicResults: { ...a.academicResults } })),
  };
}

export { CURRENT_SEMESTER };

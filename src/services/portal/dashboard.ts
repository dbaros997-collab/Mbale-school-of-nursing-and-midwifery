import type { DashboardSummary, StudentProfile } from "@/lib/portal/schema";
import { buildEmptyDashboardSummary } from "@/lib/portal/empty-portal-summary";

export async function getDashboardSummary(
  _studentId?: string | null,
  profile?: StudentProfile | null,
): Promise<DashboardSummary> {
  return buildEmptyDashboardSummary(profile ?? null);
}

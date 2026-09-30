import { withAdminFinanceAccess } from "@/lib/api/admin-finance-route";
import { getAdminFeesBundleDataFast } from "@/services/portal/admin/fees-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store" } as const;

/** Lightweight finance dashboard payload (no full student/payment arrays). */
export async function GET() {
  return withAdminFinanceAccess(async () => {
    const summary = await getAdminFeesBundleDataFast();
    return Response.json(summary, { headers: HEADERS });
  });
}

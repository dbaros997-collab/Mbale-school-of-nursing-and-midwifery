import { withAdminFinanceAccess } from "@/lib/api/admin-finance-route";
import { queryAdminFeeStudents } from "@/services/portal/admin/fees-pagination";
import type { FinanceStudentQuery } from "@/services/portal/admin/fees-query-types";
import type { FinancialClearanceStatus, StudentAccountStatus } from "@/lib/portal/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store" } as const;

function parseQuery(url: URL): FinanceStudentQuery {
  const clearance = url.searchParams.get("clearance");
  const accountStatus = url.searchParams.get("accountStatus");
  return {
    page: Number(url.searchParams.get("page") ?? "1"),
    pageSize: Number(url.searchParams.get("pageSize") ?? "50"),
    q: url.searchParams.get("q") ?? undefined,
    sort: (url.searchParams.get("sort") as FinanceStudentQuery["sort"]) ?? "balance",
    sortDir: url.searchParams.get("sortDir") === "asc" ? "asc" : "desc",
    clearance: (clearance as FinancialClearanceStatus | "all" | null) ?? "all",
    accountStatus: (accountStatus as StudentAccountStatus | "all" | null) ?? "all",
    overdueOnly: url.searchParams.get("overdueOnly") === "1",
  };
}

export async function GET(request: Request) {
  return withAdminFinanceAccess(async () => {
    const result = await queryAdminFeeStudents(parseQuery(new URL(request.url)));
    return Response.json(result, { headers: HEADERS });
  });
}

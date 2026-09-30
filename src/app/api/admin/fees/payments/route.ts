import { withAdminFinanceAccess } from "@/lib/api/admin-finance-route";
import { queryAdminFeePayments } from "@/services/portal/admin/fees-pagination";
import type { FinancePaymentQuery } from "@/services/portal/admin/fees-query-types";
import type { Payment } from "@/lib/portal/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store" } as const;

function parseQuery(url: URL): FinancePaymentQuery {
  const status = url.searchParams.get("status");
  const method = url.searchParams.get("method");
  return {
    page: Number(url.searchParams.get("page") ?? "1"),
    pageSize: Number(url.searchParams.get("pageSize") ?? "40"),
    q: url.searchParams.get("q") ?? undefined,
    status: (status as Payment["status"] | "all" | null) ?? "all",
    method: (method as Payment["method"] | "all" | null) ?? "all",
  };
}

export async function GET(request: Request) {
  return withAdminFinanceAccess(async () => {
    const result = await queryAdminFeePayments(parseQuery(new URL(request.url)));
    return Response.json(result, { headers: HEADERS });
  });
}

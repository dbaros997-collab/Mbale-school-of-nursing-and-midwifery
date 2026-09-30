import { getFeesBundleDataFast, peekFeesLedgerRevision } from "@/services/portal/fees-data";
import { feeAlertSummary } from "@/services/portal/fee-ledger-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/portal/fees/summary?studentId= — alert badge + revision for nav and lightweight polling */
export async function GET(request: Request) {
  const studentId = new URL(request.url).searchParams.get("studentId");
  const bundle = await getFeesBundleDataFast(studentId);
  const { count } = feeAlertSummary(bundle.alerts);
  const revision = await peekFeesLedgerRevision(studentId);

  return Response.json({
    alertCount: count,
    revision,
    financialClearance: bundle.financialClearance,
  });
}

import { withAdminFinanceAccess } from "@/lib/api/admin-finance-route";
import { peekAdminFeesLedgerRevision } from "@/services/portal/admin/fees-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYNC_HEADERS = { "Cache-Control": "no-store" } as const;

/** GET /api/admin/fees/sync?revision=N — revision-only heartbeat (fetch /summary when changed). */
export async function GET(request: Request) {
  return withAdminFinanceAccess(async () => {
    const revisionParam = new URL(request.url).searchParams.get("revision");
    const clientRevision = revisionParam === null ? -1 : Number(revisionParam);
    const revision = await peekAdminFeesLedgerRevision();

    if (Number.isFinite(clientRevision) && clientRevision === revision) {
      return Response.json({ changed: false, revision }, { headers: SYNC_HEADERS });
    }

    return Response.json({ changed: true, revision }, { headers: SYNC_HEADERS });
  });
}

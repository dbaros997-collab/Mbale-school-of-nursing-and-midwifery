import {
  getFeesBundleDataFast,
  peekFeesLedgerRevision,
} from "@/services/portal/fees-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYNC_HEADERS = { "Cache-Control": "no-store" } as const;

/** GET /api/portal/fees/sync?revision=N&studentId= — per-student ledger change detection */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const revisionParam = url.searchParams.get("revision");
  const studentId = url.searchParams.get("studentId");
  const clientRevision = revisionParam === null ? -1 : Number(revisionParam);
  const revision = await peekFeesLedgerRevision(studentId);

  if (Number.isFinite(clientRevision) && clientRevision === revision) {
    return Response.json({ changed: false, revision }, { headers: SYNC_HEADERS });
  }

  const bundle = await getFeesBundleDataFast(studentId);
  return Response.json(
    { changed: true, revision: bundle.ledgerRevision, bundle },
    { headers: SYNC_HEADERS },
  );
}

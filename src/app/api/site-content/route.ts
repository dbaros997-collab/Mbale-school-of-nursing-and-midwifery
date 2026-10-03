import { readSiteContent } from "@/lib/site-content/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
} as const;

/** Public read of homepage / marketing content (no auth). */
export async function GET() {
  const content = await readSiteContent();
  return Response.json(content, { headers: HEADERS });
}

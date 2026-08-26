/** Lightweight health probe for Coolify / Docker healthchecks. */
export async function GET() {
  return Response.json({ ok: true });
}

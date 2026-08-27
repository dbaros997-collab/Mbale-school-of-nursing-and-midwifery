/** Lightweight health probe for Coolify / Docker healthchecks. */
export async function GET() {
  return Response.json({
    ok: true,
    build: process.env.NEXT_PUBLIC_LOGO_VERSION ?? "unknown",
  });
}

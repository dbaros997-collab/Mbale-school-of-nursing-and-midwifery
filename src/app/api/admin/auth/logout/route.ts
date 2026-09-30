import { clearStaffSession } from "@/lib/admin/staff-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/admin/auth/logout — clears HttpOnly staff session cookie. */
export async function POST() {
  await clearStaffSession();
  return Response.json(
    { ok: true, message: "Staff session cleared." },
    { headers: { "Cache-Control": "no-store" } },
  );
}

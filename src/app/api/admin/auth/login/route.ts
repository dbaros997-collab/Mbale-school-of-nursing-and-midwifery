import { buildStaffLoginPayload, verifyStaffCredentials } from "@/lib/admin/staff-credentials";
import { saveStaffSession } from "@/lib/admin/staff-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = { email?: string; password?: string };

/** POST /api/admin/auth/login — sets HttpOnly staff session cookie. */
export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return Response.json(
      { ok: false, message: "Invalid request body." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const email = body.email ?? "";
  const password = body.password ?? "";

  if (!verifyStaffCredentials(email, password)) {
    return Response.json(
      {
        ok: false,
        message: "Invalid staff credentials. Access is limited to authorised registry staff.",
      },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const payload = buildStaffLoginPayload(email);
  await saveStaffSession({
    staffId: payload.user.id,
    email: payload.user.email,
    fullName: payload.adminProfile.fullName,
    role: "admin",
    loginAt: new Date().toISOString(),
  });

  return Response.json(
    {
      ok: true,
      message: "Welcome to the staff control panel.",
      user: payload.user,
      session: payload.session,
      adminProfile: payload.adminProfile,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

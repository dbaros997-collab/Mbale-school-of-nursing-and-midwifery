import { loginPortalStudentInDb } from "@/lib/supabase/student-portal-auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      {
        ok: false,
        message: "Student sign-in requires a live Supabase connection.",
      },
      { status: 503 },
    );
  }

  let body: { identifier?: string; password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = await loginPortalStudentInDb(body.identifier ?? "", body.password ?? "");
  if (!result.ok) {
    return Response.json({ ok: false, message: result.message });
  }

  return Response.json({
    ok: true,
    message: "Signed in successfully.",
    data: {
      user: result.user,
      profile: result.profile,
      programTitle: "Diploma in Nursing (Direct)",
    },
  });
}

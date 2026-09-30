import { isValidAdmissionLetterRef, isValidTempRegistrationNumber } from "@/lib/portal/activation-credentials";
import { findPendingActivationInDb } from "@/lib/supabase/student-portal-auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      {
        ok: false,
        message:
          "Portal activation is unavailable until Supabase is configured. Contact the registry office.",
      },
      { status: 503 },
    );
  }

  let body: { tempRegistrationNumber?: string; admissionLetterRef?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const tempRegistrationNumber = body.tempRegistrationNumber?.trim() ?? "";
  const admissionLetterRef = body.admissionLetterRef?.trim() ?? "";

  if (!isValidTempRegistrationNumber(tempRegistrationNumber)) {
    return Response.json({
      ok: false,
      message:
        "Temporary registration number must match the format TMP/MBSNM/YYYY/XXX (for example TMP/MBSNM/2026/042).",
    });
  }
  if (!isValidAdmissionLetterRef(admissionLetterRef)) {
    return Response.json({
      ok: false,
      message:
        "Admission letter reference must match ADM-MBSNM-YYYY-XXXX (for example ADM-MBSNM-2026-1184).",
    });
  }

  const pending = await findPendingActivationInDb(tempRegistrationNumber, admissionLetterRef);
  if (!pending) {
    return Response.json({
      ok: false,
      message:
        "We could not verify those details. Check your temporary registration number and admission letter reference.",
    });
  }

  return Response.json({
    ok: true,
    message: "Identity verified. Continue to set your password.",
    data: pending,
  });
}

import { NextResponse } from "next/server";
import { evaluateStudentPortalAccess } from "@/lib/microsoft/access-policy";
import { isMicrosoftConfigured } from "@/lib/microsoft/config";
import { saveMicrosoftSession } from "@/lib/microsoft/session";
import { verifyMicrosoftIdToken } from "@/lib/microsoft/token";
import type { MicrosoftAuthCallbackPayload } from "@/lib/microsoft/types";

export const maxDuration = 30;

export async function POST(request: Request) {
  if (!isMicrosoftConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Microsoft 365 sign-in is not configured on this server." },
      { status: 503 },
    );
  }

  let body: MicrosoftAuthCallbackPayload;
  try {
    body = (await request.json()) as MicrosoftAuthCallbackPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const { idToken, accessToken, refreshToken, expiresIn } = body;

  if (!idToken || !accessToken || !expiresIn) {
    return NextResponse.json(
      { ok: false, message: "Missing Microsoft authentication tokens." },
      { status: 400 },
    );
  }

  try {
    const verified = await verifyMicrosoftIdToken(idToken);
    const access = await evaluateStudentPortalAccess({
      email: verified.profile.email,
      idTokenPayload: verified.idTokenPayload,
      accessToken,
    });

    if (!access.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: access.reason,
        },
        { status: 403 },
      );
    }

    await saveMicrosoftSession({
      microsoftUserId: verified.profile.id,
      email: verified.profile.email,
      displayName: verified.profile.displayName,
      givenName: verified.profile.givenName,
      surname: verified.profile.surname,
      jobTitle: verified.profile.jobTitle,
      institutionalRole: verified.profile.institutionalRole,
      accessToken,
      refreshToken,
      accessTokenExpiresAt: Date.now() + expiresIn * 1000,
      idToken,
    });

    return NextResponse.json({
      ok: true,
      message: "Signed in with Microsoft successfully.",
      profile: verified.profile,
      access: {
        matchedBy: access.matchedBy,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error
            ? err.message
            : "Microsoft sign-in verification failed. Try again or contact ICT support.",
      },
      { status: 401 },
    );
  }
}

import { NextResponse } from "next/server";
import { readMicrosoftSession, saveMicrosoftSession } from "@/lib/microsoft/session";
import { isAccessTokenExpired, refreshMicrosoftAccessToken } from "@/lib/microsoft/token";
import { isMicrosoftConfigured } from "@/lib/microsoft/config";

export async function POST() {
  if (!isMicrosoftConfigured()) {
    return NextResponse.json({ ok: false, message: "Microsoft 365 is not configured." }, { status: 503 });
  }

  const session = await readMicrosoftSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "No Microsoft session found." }, { status: 401 });
  }

  if (!isAccessTokenExpired(session.accessTokenExpiresAt)) {
    return NextResponse.json({
      ok: true,
      message: "Access token is still valid.",
      expiresAt: session.accessTokenExpiresAt,
    });
  }

  if (!session.refreshToken) {
    return NextResponse.json(
      { ok: false, message: "Session expired. Sign in with Microsoft again." },
      { status: 401 },
    );
  }

  try {
    const refreshed = await refreshMicrosoftAccessToken(session.refreshToken);
    await saveMicrosoftSession({
      ...session,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      accessTokenExpiresAt: refreshed.expiresAt,
    });

    return NextResponse.json({
      ok: true,
      message: "Access token refreshed.",
      expiresAt: refreshed.expiresAt,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error ? err.message : "Token refresh failed. Sign in again.",
      },
      { status: 401 },
    );
  }
}

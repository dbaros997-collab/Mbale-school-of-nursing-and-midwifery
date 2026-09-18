import { NextResponse } from "next/server";
import { isMicrosoftConfigured } from "@/lib/microsoft/config";
import { clearMicrosoftSession, readMicrosoftSession } from "@/lib/microsoft/session";

export async function GET() {
  const configured = isMicrosoftConfigured();
  let session = null;
  if (configured) {
    try {
      session = await readMicrosoftSession();
    } catch (error) {
      console.error("[microsoft/session]", error);
      return NextResponse.json({ authenticated: false, configured: true, error: "session_unavailable" });
    }
  }

  if (!session) {
    return NextResponse.json({
      authenticated: false,
      configured,
    });
  }

  return NextResponse.json({
    authenticated: true,
    configured,
    profile: {
      id: session.microsoftUserId,
      email: session.email,
      displayName: session.displayName,
      givenName: session.givenName,
      surname: session.surname,
      jobTitle: session.jobTitle,
      institutionalRole: session.institutionalRole,
    },
    expiresAt: session.accessTokenExpiresAt,
  });
}

export async function DELETE() {
  try {
    await clearMicrosoftSession();
    return NextResponse.json({ ok: true, message: "Microsoft session cleared." });
  } catch (error) {
    console.error("[microsoft/session] DELETE", error);
    return NextResponse.json({ ok: false, message: "Could not clear Microsoft session." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { isMicrosoftConfigured } from "@/lib/microsoft/config";
import { clearMicrosoftSession, readMicrosoftSession } from "@/lib/microsoft/session";

export async function GET() {
  const configured = isMicrosoftConfigured();
  const session = configured ? await readMicrosoftSession() : null;

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
  await clearMicrosoftSession();
  return NextResponse.json({ ok: true, message: "Microsoft session cleared." });
}

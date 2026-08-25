import { NextResponse } from "next/server";
import { readMicrosoftSession, saveMicrosoftSession } from "@/lib/microsoft/session";
import { isMicrosoftConfigured } from "@/lib/microsoft/config";

type TokenUpdatePayload = {
  accessToken: string;
  expiresIn: number;
};

export async function POST(request: Request) {
  if (!isMicrosoftConfigured()) {
    return NextResponse.json({ ok: false, message: "Microsoft 365 is not configured." }, { status: 503 });
  }

  const session = await readMicrosoftSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "No Microsoft session found." }, { status: 401 });
  }

  let body: TokenUpdatePayload;
  try {
    body = (await request.json()) as TokenUpdatePayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  if (!body.accessToken || !body.expiresIn) {
    return NextResponse.json({ ok: false, message: "Missing access token." }, { status: 400 });
  }

  await saveMicrosoftSession({
    ...session,
    accessToken: body.accessToken,
    accessTokenExpiresAt: Date.now() + body.expiresIn * 1000,
  });

  return NextResponse.json({
    ok: true,
    message: "Access token updated.",
    expiresAt: Date.now() + body.expiresIn * 1000,
  });
}

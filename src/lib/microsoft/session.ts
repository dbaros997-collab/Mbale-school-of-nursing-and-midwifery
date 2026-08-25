import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { MicrosoftSessionData } from "./types";
import { getMicrosoftServerConfig } from "./config";

export const MICROSOFT_SESSION_COOKIE = "mbsnm_microsoft_session";

export type MicrosoftIronSession = {
  microsoft?: MicrosoftSessionData;
};

function getSessionOptions(): SessionOptions {
  const { sessionSecret } = getMicrosoftServerConfig();
  return {
    password: sessionSecret || "development-only-insecure-session-secret-32chars",
    cookieName: MICROSOFT_SESSION_COOKIE,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    },
  };
}

export async function getMicrosoftIronSession() {
  return getIronSession<MicrosoftIronSession>(await cookies(), getSessionOptions());
}

export async function saveMicrosoftSession(data: MicrosoftSessionData) {
  const session = await getMicrosoftIronSession();
  session.microsoft = data;
  await session.save();
}

export async function clearMicrosoftSession() {
  const session = await getMicrosoftIronSession();
  session.microsoft = undefined;
  await session.destroy();
}

export async function readMicrosoftSession(): Promise<MicrosoftSessionData | null> {
  const session = await getMicrosoftIronSession();
  return session.microsoft ?? null;
}

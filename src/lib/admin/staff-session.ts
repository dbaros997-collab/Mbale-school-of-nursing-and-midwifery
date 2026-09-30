import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { getMicrosoftServerConfig } from "@/lib/microsoft/config";

export const STAFF_SESSION_COOKIE = "mbsnm_staff_session";

export type StaffSessionData = {
  staffId: string;
  email: string;
  fullName: string;
  role: "admin";
  loginAt: string;
};

export type StaffIronSession = {
  staff?: StaffSessionData;
};

const IRON_SESSION_DEV_PASSWORD = "development-only-insecure-session-secret-32chars";

function resolveIronSessionPassword(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length >= 32) return trimmed;
  return IRON_SESSION_DEV_PASSWORD;
}

function getSessionOptions(): SessionOptions {
  const { sessionSecret } = getMicrosoftServerConfig();
  return {
    password: resolveIronSessionPassword(sessionSecret),
    cookieName: STAFF_SESSION_COOKIE,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 8,
      path: "/",
    },
  };
}

export async function getStaffIronSession() {
  return getIronSession<StaffIronSession>(await cookies(), getSessionOptions());
}

export async function saveStaffSession(data: StaffSessionData) {
  const session = await getStaffIronSession();
  session.staff = data;
  await session.save();
}

export async function clearStaffSession() {
  const session = await getStaffIronSession();
  session.staff = undefined;
  await session.destroy();
}

export async function readStaffSession(): Promise<StaffSessionData | null> {
  const session = await getStaffIronSession();
  return session.staff ?? null;
}

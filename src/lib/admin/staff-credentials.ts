import {
  MOCK_ADMIN_PROFILE,
  MOCK_ADMIN_SESSION,
  MOCK_ADMIN_USER,
} from "@/lib/portal/mock-store";
import type { AdminProfile, Session, User } from "@/lib/portal/schema";

/** Demo staff credentials — registry officers only (replace with Entra / DB when ready). */
export const STAFF_DEMO_CREDENTIALS = {
  email: "registry@mbsnm.org",
  password: "Staff@2026",
} as const;

const LEGACY_STAFF_DEMO_CREDENTIALS = {
  email: "admin@mbsnm.org",
  password: "admin123",
} as const;

const STAFF_LOGIN_ACCOUNTS = [STAFF_DEMO_CREDENTIALS, LEGACY_STAFF_DEMO_CREDENTIALS] as const;

export function verifyStaffCredentials(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return false;
  return STAFF_LOGIN_ACCOUNTS.some(
    (account) => normalized === account.email && password === account.password,
  );
}

export type StaffLoginPayload = {
  user: User;
  session: Session;
  adminProfile: AdminProfile;
};

/** Client + session cookie payload after successful staff verification. */
export function buildStaffLoginPayload(email: string): StaffLoginPayload {
  const normalized = email.trim().toLowerCase();
  return {
    user: { ...MOCK_ADMIN_USER, email: normalized },
    session: { ...MOCK_ADMIN_SESSION },
    adminProfile: { ...MOCK_ADMIN_PROFILE, email: normalized },
  };
}

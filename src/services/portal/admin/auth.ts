import { mockDelay } from "@/lib/mock-delay";
import {
  MOCK_ADMIN_PROFILE,
  MOCK_ADMIN_SESSION,
  MOCK_ADMIN_USER,
} from "@/lib/portal/mock-store";
import type { AdminProfile, Session, User } from "@/lib/portal/schema";

/** Demo staff credentials — registry officers only */
export const STAFF_DEMO_CREDENTIALS = {
  email: "registry@mbsnm.org",
  password: "Staff@2026",
} as const;

export type StaffLoginResult =
  | {
      ok: true;
      message: string;
      user: User;
      session: Session;
      adminProfile: AdminProfile;
    }
  | { ok: false; message: string };

/** Ready for POST /api/admin/auth/login */
export async function loginStaff(
  email: string,
  password: string,
): Promise<StaffLoginResult> {
  await mockDelay(450);

  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    return { ok: false, message: "Enter your staff email and password." };
  }

  if (
    normalized !== STAFF_DEMO_CREDENTIALS.email ||
    password !== STAFF_DEMO_CREDENTIALS.password
  ) {
    return {
      ok: false,
      message: "Invalid staff credentials. Access is limited to authorised registry staff.",
    };
  }

  return {
    ok: true,
    message: "Welcome to the staff control panel.",
    user: { ...MOCK_ADMIN_USER },
    session: { ...MOCK_ADMIN_SESSION },
    adminProfile: { ...MOCK_ADMIN_PROFILE },
  };
}

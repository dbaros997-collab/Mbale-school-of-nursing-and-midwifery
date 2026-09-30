import { STAFF_DEMO_CREDENTIALS } from "@/lib/admin/staff-credentials";
import type { AdminProfile, Session, User } from "@/lib/portal/schema";

export { STAFF_DEMO_CREDENTIALS };

export type StaffLoginResult =
  | {
      ok: true;
      message: string;
      user: User;
      session: Session;
      adminProfile: AdminProfile;
    }
  | { ok: false; message: string };

/** Staff sign-in — verifies on server and sets HttpOnly session cookie. */
export async function loginStaff(email: string, password: string): Promise<StaffLoginResult> {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ email, password }),
  });

  const json = (await res.json()) as {
    ok?: boolean;
    message?: string;
    user?: User;
    session?: Session;
    adminProfile?: AdminProfile;
  };

  if (!res.ok || !json.user || !json.session || !json.adminProfile) {
    return {
      ok: false,
      message: json.message ?? "Invalid staff credentials. Access is limited to authorised registry staff.",
    };
  }

  return {
    ok: true,
    message: json.message ?? "Welcome to the staff control panel.",
    user: json.user,
    session: json.session,
    adminProfile: json.adminProfile,
  };
}

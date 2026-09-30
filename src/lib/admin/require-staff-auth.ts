import { isStaffInstitutionalRole } from "@/lib/microsoft/roles";
import { readMicrosoftSession } from "@/lib/microsoft/session";
import { readStaffSession } from "@/lib/admin/staff-session";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export type StaffAuthContext = {
  staffId: string;
  email: string;
  fullName: string;
  source: "staff-session" | "microsoft";
};

export type StaffAuthResult =
  | { authorized: true; staff: StaffAuthContext }
  | { authorized: false; response: Response };

/** JSON 401 for admin finance and staff API routes. */
export function staffUnauthorizedResponse(
  message = "Unauthorized. Staff sign-in is required.",
): Response {
  return Response.json(
    { ok: false, code: "UNAUTHORIZED", message },
    { status: 401, headers: NO_STORE },
  );
}

/**
 * Verifies an incoming App Router request has a staff session:
 * - HttpOnly iron-session cookie from POST /api/admin/auth/login, or
 * - Microsoft 365 session with an institutional staff/lecturer role.
 */
export async function requireStaffAuth(): Promise<StaffAuthResult> {
  const staffSession = await readStaffSession();
  if (staffSession?.role === "admin") {
    return {
      authorized: true,
      staff: {
        staffId: staffSession.staffId,
        email: staffSession.email,
        fullName: staffSession.fullName,
        source: "staff-session",
      },
    };
  }

  const microsoft = await readMicrosoftSession();
  if (microsoft && isStaffInstitutionalRole(microsoft.institutionalRole)) {
    return {
      authorized: true,
      staff: {
        staffId: microsoft.microsoftUserId,
        email: microsoft.email,
        fullName: microsoft.displayName,
        source: "microsoft",
      },
    };
  }

  return { authorized: false, response: staffUnauthorizedResponse() };
}

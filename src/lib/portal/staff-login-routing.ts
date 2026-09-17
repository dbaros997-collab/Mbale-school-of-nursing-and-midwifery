import { isOfficialStudentEmail } from "@/lib/site-url";

const STAFF_EMAIL_SUFFIXES = ["@mbsnm.org", "@staff.mbsnm.org"] as const;

/** True when the identifier is a staff mailbox — not the student portal. */
export function isStaffPortalLoginIdentifier(identifier: string): boolean {
  const normalized = identifier.trim().toLowerCase();
  if (!normalized.includes("@")) return false;
  if (isOfficialStudentEmail(normalized)) return false;
  return STAFF_EMAIL_SUFFIXES.some((suffix) => normalized.endsWith(suffix));
}

export const STAFF_LOGIN_HINT_KEY = "mbsnm-staff-login-hint";

export function saveStaffLoginHint(email: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STAFF_LOGIN_HINT_KEY,
      JSON.stringify({ email: email.trim().toLowerCase() }),
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function readStaffLoginHint(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STAFF_LOGIN_HINT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string };
    return parsed.email?.trim() || null;
  } catch {
    return null;
  }
}

export function clearStaffLoginHint() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STAFF_LOGIN_HINT_KEY);
  } catch {
    /* ignore */
  }
}

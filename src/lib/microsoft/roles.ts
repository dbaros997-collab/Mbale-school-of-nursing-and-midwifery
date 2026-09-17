import type { JWTPayload } from "jose";
import { getAllowedStudentEmailDomains } from "./config";
import type { MicrosoftInstitutionalRole } from "./types";

function emailMatchesAllowedStudentDomain(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at < 0) return false;
  const domain = email.slice(at + 1).toLowerCase();
  return getAllowedStudentEmailDomains().some(
    (allowed) => domain === allowed.replace(/^@/, "").toLowerCase(),
  );
}

/** Resolve student vs staff from Azure AD token claims and email UPN. */
export function resolveInstitutionalRole(payload: JWTPayload): MicrosoftInstitutionalRole {
  const roles = Array.isArray(payload.roles) ? payload.roles.map(String) : [];
  const lower = roles.map((r) => r.toLowerCase());

  if (lower.some((r) => r.includes("student"))) return "student";
  if (lower.some((r) => r.includes("lecturer") || r.includes("faculty"))) return "lecturer";
  if (lower.some((r) => r.includes("staff") || r.includes("admin"))) return "staff";

  const email = String(payload.preferred_username ?? payload.email ?? payload.upn ?? "").toLowerCase();

  if (email && emailMatchesAllowedStudentDomain(email)) return "student";
  if (email.endsWith("@mbsnm.org") || email.endsWith("@staff.mbsnm.org")) return "staff";

  return "unknown";
}

export function isStaffInstitutionalRole(role: MicrosoftInstitutionalRole): boolean {
  return role === "staff" || role === "lecturer";
}

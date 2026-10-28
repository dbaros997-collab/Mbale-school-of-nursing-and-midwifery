import { OFFICIAL_EMAIL_DOMAIN } from "@/lib/site-url";

/** Shared mailboxes — create these in Microsoft 365 for the official domain. */
export const schoolEmail = {
  info: `info@${OFFICIAL_EMAIL_DOMAIN}`,
  admissions: `admissions@${OFFICIAL_EMAIL_DOMAIN}`,
  registry: `registry@${OFFICIAL_EMAIL_DOMAIN}`,
  admin: `admin@${OFFICIAL_EMAIL_DOMAIN}`,
} as const;

/** All shared inboxes (staff / public desks, not student UPNs). */
export const STAFF_SHARED_MAILBOXES = new Set<string>([
  schoolEmail.info,
  schoolEmail.admissions,
  schoolEmail.registry,
  schoolEmail.admin,
]);

const LEGACY_EMAIL_REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
  [/info@mbsnm\.org/gi, schoolEmail.info],
  [/admissions@mbsnm\.org/gi, schoolEmail.admissions],
  [/registry@mbsnm\.org/gi, schoolEmail.registry],
  [/admin@mbsnm\.org/gi, schoolEmail.admin],
];

/** Rewrite legacy @mbsnm.org addresses in CMS / status-bar copy. */
export function migrateLegacySchoolEmailsInText(text: string): string {
  let out = text;
  for (const [pattern, replacement] of LEGACY_EMAIL_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function studentSchoolEmail(localPart: string): string {
  return `${localPart}@${OFFICIAL_EMAIL_DOMAIN}`;
}

export function isStaffSharedMailbox(email: string): boolean {
  return STAFF_SHARED_MAILBOXES.has(email.trim().toLowerCase());
}

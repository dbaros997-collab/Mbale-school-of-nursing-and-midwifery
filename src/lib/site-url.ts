/** Official public website (no trailing slash). */
export const OFFICIAL_SITE_URL = "https://mbaleschoolofnursing.ac.ug";

export const OFFICIAL_SITE_HOST = new URL(OFFICIAL_SITE_URL).host;

/** Official Azure AD / student mailbox domain (no leading @). */
export const OFFICIAL_EMAIL_DOMAIN = "mbaleschoolofnursing.ac.ug";

/** Former public WordPress marketing hostnames (DNS may still point at our app). */
export const LEGACY_MARKETING_HOSTS = new Set(["mbsnm.org", "www.mbsnm.org"]);

export function isOfficialStudentEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(`@${OFFICIAL_EMAIL_DOMAIN}`);
}

/** Former student admin hostname — redirect to Staff Admin when requests hit this host. */
const LEGACY_STUDENT_ADMIN_HOST = "student.mbsnm.org";

export const STAFF_ADMIN_PATH = "/admin";

export function getPublicSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return OFFICIAL_SITE_URL;
}

export function getStaffAdminUrl(): string {
  return `${getPublicSiteUrl()}${STAFF_ADMIN_PATH}`;
}

const LEGACY_STUDENT_ADMIN_HOSTS = new Set([
  LEGACY_STUDENT_ADMIN_HOST,
  `www.${LEGACY_STUDENT_ADMIN_HOST}`,
]);

export function isLegacyStudentAdminHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return LEGACY_STUDENT_ADMIN_HOSTS.has(host.split(":")[0]?.toLowerCase() ?? "");
}

export function normalizeRequestHost(hostHeader: string | null): string | null {
  if (!hostHeader) return null;
  return hostHeader.split(":")[0]?.toLowerCase() ?? null;
}

export function isLegacyMarketingHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return LEGACY_MARKETING_HOSTS.has(host);
}

/** www.mbaleschoolofnursing.ac.ug → apex (Search Console property consolidation). */
export function isOfficialSiteWwwHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return host === `www.${OFFICIAL_SITE_HOST}`;
}

/** Absolute URL on the official site (legacy host redirects always use this, not env overrides). */
export function officialSiteUrl(pathnameWithSearch: string): URL {
  return new URL(pathnameWithSearch, OFFICIAL_SITE_URL);
}

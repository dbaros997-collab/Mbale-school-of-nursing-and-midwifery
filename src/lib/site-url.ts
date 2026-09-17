/** Official public website (no trailing slash). */
export const OFFICIAL_SITE_URL = "https://mbaleschoolofnursing.ac.ug";

/** Former SitePad / registry admin host — send to Staff Admin once DNS points here. */
export const LEGACY_STUDENT_ADMIN_HOST = "student.mbsnm.org";

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

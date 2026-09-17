/** Official public website (no trailing slash). */
export const OFFICIAL_SITE_URL = "https://mbaleschoolofnursing.ac.ug";

export function getPublicSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return OFFICIAL_SITE_URL;
}

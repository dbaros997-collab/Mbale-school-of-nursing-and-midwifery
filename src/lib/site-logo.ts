import { SCHOOL } from "@/lib/data";

/** Official crest used in the header, footer, and social/search previews. */
export const OFFICIAL_SITE_LOGO = {
  path: "/images/logo-lockup.png",
  width: 1022,
  height: 721,
  alt: SCHOOL.name,
} as const;

/** PNG favicons derived from the official crest (see scripts/generate-site-icons.mjs). */
export const SITE_ICON_PATHS = {
  favicon: "/favicon.ico",
  appleTouch: "/apple-touch-icon.png",
  icon48: "/icons/site-icon-48.png",
  icon96: "/icons/site-icon-96.png",
  icon192: "/icons/site-icon-192.png",
} as const;

export function officialSiteLogoOpenGraphImage() {
  return {
    url: OFFICIAL_SITE_LOGO.path,
    secureUrl: OFFICIAL_SITE_LOGO.path,
    width: OFFICIAL_SITE_LOGO.width,
    height: OFFICIAL_SITE_LOGO.height,
    alt: OFFICIAL_SITE_LOGO.alt,
    type: "image/png" as const,
  };
}

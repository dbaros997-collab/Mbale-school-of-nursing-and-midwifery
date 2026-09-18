import { SCHOOL } from "@/lib/data";

/** Official crest used in the header, footer, and social/search previews. */
export const OFFICIAL_SITE_LOGO = {
  path: "/images/logo-lockup.png",
  width: 1022,
  height: 721,
  alt: SCHOOL.name,
} as const;

/** Same crest at site root for static links and PWA manifests. */
export const PUBLIC_SCHOOL_LOGO_PATH = "/school-logo.png" as const;

/** PNG favicons derived from the official crest (see scripts/generate-site-icons.mjs). */
export const SITE_ICON_PATHS = {
  favicon: "/favicon.ico",
  appleTouch: "/apple-touch-icon.png",
  icon32: "/icons/site-icon-32.png",
  icon48: "/icons/site-icon-48.png",
  icon96: "/icons/site-icon-96.png",
  icon192: "/icons/site-icon-192.png",
} as const;

/** Tab / browser chrome icons — square sizes only (not the wide lockup). */
export function siteTabIconMetadata() {
  return {
    icon: [
      { url: SITE_ICON_PATHS.favicon, sizes: "any" },
      { url: SITE_ICON_PATHS.icon32, sizes: "32x32", type: "image/png" },
      { url: SITE_ICON_PATHS.icon48, sizes: "48x48", type: "image/png" },
      { url: SITE_ICON_PATHS.icon96, sizes: "96x96", type: "image/png" },
      { url: SITE_ICON_PATHS.icon192, sizes: "192x192", type: "image/png" },
    ],
    apple: [
      {
        url: SITE_ICON_PATHS.appleTouch,
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [SITE_ICON_PATHS.favicon],
  } satisfies import("next").Metadata["icons"];
}

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

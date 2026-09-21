import { SCHOOL } from "@/lib/data";

/** Master crest PNG in public/ (replace to update all favicons via generate-site-icons.mjs). */
export const SCHOOL_CREST_SOURCE_PATH = "/images/school-crest-source.png" as const;

/** Published copy of the official crest PNG (same art as the source file). */
export const PUBLIC_SCHOOL_LOGO_PNG_PATH = "/images/school-logo.png" as const;

/** Transparent PNG crest (Open Graph, downloads). */
export const OFFICIAL_SITE_LOGO_PNG = {
  path: "/images/logo-lockup.png",
  width: 1024,
  height: 723,
  alt: SCHOOL.name,
} as const;

/** SVG with embedded transparent PNG — used in header/footer (avoids JPEG mis-serves of .png). */
export const OFFICIAL_SITE_LOGO = {
  path: "/images/logo-crest.svg",
  width: OFFICIAL_SITE_LOGO_PNG.width,
  height: OFFICIAL_SITE_LOGO_PNG.height,
  alt: SCHOOL.name,
} as const;

/** Same crest at site root for static links and PWA manifests. */
export const PUBLIC_SCHOOL_LOGO_PATH = "/school-logo.png" as const;

/** Tab/search icons — PNG crest sizes (see scripts/generate-site-icons.mjs). */
export const SITE_ICON_PATHS = {
  /** Primary browser tab icon (PNG crest, not the Next.js default). */
  favicon: "/icons/site-icon-48.png",
  faviconIco: "/favicon.ico",
  appleTouch: "/apple-touch-icon.png",
  icon16: "/icons/site-icon-16.png",
  icon32: "/icons/site-icon-32.png",
  icon48: "/icons/site-icon-48.png",
  icon96: "/icons/site-icon-96.png",
  icon192: "/icons/site-icon-192.png",
  icon512: "/icons/site-icon-512.png",
} as const;

/** Bust favicon cache in dev and production (Docker sets NEXT_PUBLIC_LOGO_VERSION). */
export const SITE_ICON_CACHE_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "crest-2026-09-21-v8";

export function siteIconHref(path: string): string {
  return `${path}?v=${encodeURIComponent(SITE_ICON_CACHE_VERSION)}`;
}

/** Same URLs as SiteIconHeadLinks in layout — for Next.js Metadata API. */
export function siteTabIconMetadata() {
  return {
    icon: [
      {
        url: siteIconHref(SITE_ICON_PATHS.icon192),
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: siteIconHref(SITE_ICON_PATHS.icon48),
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: siteIconHref(SITE_ICON_PATHS.icon512),
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: siteIconHref(SITE_ICON_PATHS.icon32),
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: siteIconHref(SITE_ICON_PATHS.icon16),
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: siteIconHref(SITE_ICON_PATHS.icon96),
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: siteIconHref(SITE_ICON_PATHS.appleTouch),
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [siteIconHref(SITE_ICON_PATHS.favicon)],
  } satisfies import("next").Metadata["icons"];
}

export function officialSiteLogoOpenGraphImage() {
  return {
    url: OFFICIAL_SITE_LOGO_PNG.path,
    secureUrl: OFFICIAL_SITE_LOGO_PNG.path,
    width: OFFICIAL_SITE_LOGO_PNG.width,
    height: OFFICIAL_SITE_LOGO_PNG.height,
    alt: OFFICIAL_SITE_LOGO_PNG.alt,
    type: "image/png" as const,
  };
}

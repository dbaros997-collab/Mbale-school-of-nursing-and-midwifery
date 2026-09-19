import { SCHOOL } from "@/lib/data";

/** Transparent PNG crest (Open Graph, downloads). */
export const OFFICIAL_SITE_LOGO_PNG = {
  path: "/images/logo-lockup.png",
  width: 1021,
  height: 719,
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

/** PNG favicons derived from the official crest (see scripts/generate-site-icons.mjs). */
export const SITE_ICON_PATHS = {
  favicon: "/favicon.ico",
  appleTouch: "/apple-touch-icon.png",
  icon16: "/icons/site-icon-16.png",
  icon32: "/icons/site-icon-32.png",
  icon48: "/icons/site-icon-48.png",
  icon96: "/icons/site-icon-96.png",
  icon192: "/icons/site-icon-192.png",
} as const;

/** Cache-bust icon URLs after deploy (set NEXT_PUBLIC_LOGO_VERSION in Docker build). */
export function siteIconHref(path: string): string {
  const version = process.env.NEXT_PUBLIC_LOGO_VERSION?.trim();
  if (!version) return path;
  return `${path}?v=${encodeURIComponent(version)}`;
}

/** Same URLs as SiteIconHeadLinks in layout — for Next.js Metadata API. */
export function siteTabIconMetadata() {
  return {
    icon: [
      { url: SITE_ICON_PATHS.icon48, sizes: "48x48", type: "image/png" },
      { url: SITE_ICON_PATHS.icon32, sizes: "32x32", type: "image/png" },
      { url: SITE_ICON_PATHS.icon16, sizes: "16x16", type: "image/png" },
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
    url: OFFICIAL_SITE_LOGO_PNG.path,
    secureUrl: OFFICIAL_SITE_LOGO_PNG.path,
    width: OFFICIAL_SITE_LOGO_PNG.width,
    height: OFFICIAL_SITE_LOGO_PNG.height,
    alt: OFFICIAL_SITE_LOGO_PNG.alt,
    type: "image/png" as const,
  };
}

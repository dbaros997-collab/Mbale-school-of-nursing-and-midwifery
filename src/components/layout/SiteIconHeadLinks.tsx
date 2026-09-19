import { SITE_ICON_PATHS } from "@/lib/site-logo";

/**
 * Explicit favicon / Apple touch links for crawlers (e.g. Google Search favicon).
 * Google recommends a square icon that is a multiple of 48px; see site-icon-48.png.
 */
export function SiteIconHeadLinks() {
  return (
    <>
      <link rel="icon" href={SITE_ICON_PATHS.favicon} sizes="any" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={SITE_ICON_PATHS.icon32}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="48x48"
        href={SITE_ICON_PATHS.icon48}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href={SITE_ICON_PATHS.icon96}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href={SITE_ICON_PATHS.icon192}
      />
      <link
        rel="apple-touch-icon"
        href={SITE_ICON_PATHS.appleTouch}
        sizes="180x180"
      />
    </>
  );
}

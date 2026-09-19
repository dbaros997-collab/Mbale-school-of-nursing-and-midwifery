import { SITE_ICON_PATHS, siteIconHref } from "@/lib/site-logo";

/**
 * Explicit favicon / Apple touch links for crawlers (e.g. Google Search favicon).
 * PNG 48×48 is listed first — Google recommends a square icon in multiples of 48px.
 */
export function SiteIconHeadLinks() {
  return (
    <>
      <link
        rel="icon"
        type="image/png"
        sizes="48x48"
        href={siteIconHref(SITE_ICON_PATHS.icon48)}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href={siteIconHref(SITE_ICON_PATHS.icon96)}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href={siteIconHref(SITE_ICON_PATHS.icon192)}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={siteIconHref(SITE_ICON_PATHS.icon32)}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={siteIconHref(SITE_ICON_PATHS.icon16)}
      />
      <link
        rel="shortcut icon"
        type="image/png"
        href={siteIconHref(SITE_ICON_PATHS.icon48)}
      />
      <link
        rel="apple-touch-icon"
        href={siteIconHref(SITE_ICON_PATHS.appleTouch)}
        sizes="180x180"
      />
    </>
  );
}

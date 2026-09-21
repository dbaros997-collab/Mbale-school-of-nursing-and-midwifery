import { OFFICIAL_SITE_URL } from "@/lib/site-url";
import { SITE_ICON_PATHS, siteIconHref } from "@/lib/site-logo";

function absoluteIcon(path: string): string {
  const href = siteIconHref(path);
  if (href.startsWith("http")) return href;
  return `${OFFICIAL_SITE_URL}${href}`;
}

/**
 * Explicit favicon / Apple touch links for crawlers (e.g. Google Search favicon).
 * Absolute URLs help Google Search Console pick up the school crest (48×48 minimum).
 */
export function SiteIconHeadLinks() {
  return (
    <>
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href={absoluteIcon(SITE_ICON_PATHS.icon192)}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="48x48"
        href={absoluteIcon(SITE_ICON_PATHS.icon48)}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href={absoluteIcon(SITE_ICON_PATHS.icon512)}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href={absoluteIcon(SITE_ICON_PATHS.icon96)}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={absoluteIcon(SITE_ICON_PATHS.icon32)}
      />
      <link
        rel="shortcut icon"
        type="image/png"
        href={absoluteIcon(SITE_ICON_PATHS.favicon)}
      />
      <link
        rel="icon"
        href={absoluteIcon(SITE_ICON_PATHS.faviconIco)}
        sizes="any"
        type="image/x-icon"
      />
      <link
        rel="apple-touch-icon"
        href={absoluteIcon(SITE_ICON_PATHS.appleTouch)}
        sizes="180x180"
      />
    </>
  );
}

/**
 * Path-only redirects for old WordPress / Sitepad URLs on the official host.
 * Imported by next.config.ts — keep sources lowercase (Next matches case-insensitively).
 */
export const LEGACY_PATH_REDIRECTS = [
  { source: "/sitepad-data/:path*", destination: "/", permanent: true },
  { source: "/wp-content/:path*", destination: "/", permanent: true },
  { source: "/wp-includes/:path*", destination: "/", permanent: true },
  { source: "/wp-json/:path*", destination: "/", permanent: true },
  { source: "/feed", destination: "/", permanent: true },
  { source: "/feed/:path*", destination: "/", permanent: true },
  { source: "/xmlrpc.php", destination: "/", permanent: true },
  { source: "/index.php", destination: "/", permanent: true },
  { source: "/category/:path*", destination: "/#campus-news", permanent: false },
  { source: "/tag/:path*", destination: "/#campus-news", permanent: false },
  { source: "/author/:path*", destination: "/#about", permanent: false },
] as const;

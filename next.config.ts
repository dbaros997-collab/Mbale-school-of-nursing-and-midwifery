import type { NextConfig } from "next";
import { LEGACY_PATH_REDIRECTS } from "./src/lib/legacy-path-redirects";

/** Keep in sync with src/lib/site-url.ts and src/lib/microsoft/env-vars.ts */
const OFFICIAL_SITE_URL = "https://mbaleschoolofnursing.ac.ug";
const MICROSOFT_PRODUCTION_CALLBACK_URL = `${OFFICIAL_SITE_URL}/auth/microsoft/callback`;

function configEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

const bakedAzureClientId =
  configEnv("NEXT_PUBLIC_AZURE_CLIENT_ID") ?? configEnv("MICROSOFT_CLIENT_ID");
const bakedAzureTenantId =
  configEnv("NEXT_PUBLIC_AZURE_TENANT_ID") ?? configEnv("MICROSOFT_TENANT_ID");

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Keep static generation sequential on small Coolify VPS builds.
    cpus: 1,
  },
  env: {
    // Baked for browser MSAL at build; server reads runtime snapshot via read-env.ts.
    NEXT_PUBLIC_AZURE_CLIENT_ID: bakedAzureClientId,
    NEXT_PUBLIC_AZURE_TENANT_ID: bakedAzureTenantId,
    ALLOWED_EMAIL_DOMAIN: process.env.ALLOWED_EMAIL_DOMAIN,
    MICROSOFT_ALLOWED_STUDENT_DOMAINS: process.env.MICROSOFT_ALLOWED_STUDENT_DOMAINS,
    MICROSOFT_INCLUDE_LEGACY_STUDENT_DOMAINS:
      process.env.MICROSOFT_INCLUDE_LEGACY_STUDENT_DOMAINS,
    NEXT_PUBLIC_AZURE_REDIRECT_URI:
      process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI ?? MICROSOFT_PRODUCTION_CALLBACK_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? OFFICIAL_SITE_URL,
    NEXT_PUBLIC_LOGO_VERSION: process.env.NEXT_PUBLIC_LOGO_VERSION,
  },
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.loca.lt",
    "*.serveousercontent.com",
  ],
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24,
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      ...LEGACY_PATH_REDIRECTS,
      {
        source: "/images/logo-crest.svg",
        destination: "/images/logo-lockup.png",
        permanent: false,
      },
      {
        source: "/images/clinical-infant-care-training.png",
        destination: "/images/learning-pillars-clinical.jpg",
        permanent: false,
      },
      {
        source: "/images/footer-school-logo.png",
        destination: "/images/footer-mbsnm-lockup.png",
        permanent: true,
      },
      {
        source: "/wp-admin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/wp-admin/:path*",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/wp-login.php",
        destination: "/admin",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, must-revalidate",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, must-revalidate",
          },
        ],
      },
      {
        source: "/((?!_next/static|_next/image|images|api).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

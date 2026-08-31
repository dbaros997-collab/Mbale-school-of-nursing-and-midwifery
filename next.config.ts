import type { NextConfig } from "next";

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
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,
    NEXT_PUBLIC_AZURE_CLIENT_ID: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    NEXT_PUBLIC_AZURE_TENANT_ID: process.env.NEXT_PUBLIC_AZURE_TENANT_ID,
    NEXT_PUBLIC_AZURE_REDIRECT_URI: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
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
    ];
  },
};

export default nextConfig;

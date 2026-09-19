import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { SCHOOL } from "@/lib/data";
import { SiteIconHeadLinks } from "@/components/layout/SiteIconHeadLinks";
import { OFFICIAL_SITE_LOGO, officialSiteLogoOpenGraphImage } from "@/lib/site-logo";
import { DEFAULT_SITE_DESCRIPTION, GLOBAL_INDEXING_ROBOTS } from "@/lib/seo";
import { getPublicSiteUrl, OFFICIAL_SITE_URL } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getPublicSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || OFFICIAL_SITE_URL),
  applicationName: SCHOOL.shortName,
  title: {
    default: `Welcome | ${SCHOOL.name}`,
    template: `%s | ${SCHOOL.name}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  robots: GLOBAL_INDEXING_ROBOTS,
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: siteUrl || OFFICIAL_SITE_URL,
    siteName: SCHOOL.name,
    title: SCHOOL.name,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [officialSiteLogoOpenGraphImage()],
  },
  twitter: {
    card: "summary",
    title: SCHOOL.name,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [OFFICIAL_SITE_LOGO.path],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <SiteIconHeadLinks />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

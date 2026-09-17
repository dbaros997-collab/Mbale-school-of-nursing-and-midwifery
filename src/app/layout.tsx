import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { SCHOOL } from "@/lib/data";
import {
  OFFICIAL_SITE_LOGO,
  SITE_ICON_PATHS,
  officialSiteLogoOpenGraphImage,
} from "@/lib/site-logo";
import { getPublicSiteUrl, OFFICIAL_SITE_URL } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getPublicSiteUrl();
const defaultDescription =
  "Nursing and midwifery training in Mbale. Registered with the Ministry of Education and Sports. Accredited by UNMC and NCHE. In God We Love and Serve.";

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
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: SITE_ICON_PATHS.favicon, sizes: "any" },
      { url: SITE_ICON_PATHS.icon48, sizes: "48x48", type: "image/png" },
      { url: SITE_ICON_PATHS.icon96, sizes: "96x96", type: "image/png" },
      { url: SITE_ICON_PATHS.icon192, sizes: "192x192", type: "image/png" },
      {
        url: OFFICIAL_SITE_LOGO.path,
        sizes: `${OFFICIAL_SITE_LOGO.width}x${OFFICIAL_SITE_LOGO.height}`,
        type: "image/png",
      },
    ],
    apple: [
      {
        url: SITE_ICON_PATHS.appleTouch,
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [SITE_ICON_PATHS.favicon],
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: siteUrl || OFFICIAL_SITE_URL,
    siteName: SCHOOL.name,
    title: SCHOOL.name,
    description: defaultDescription,
    images: [officialSiteLogoOpenGraphImage()],
  },
  twitter: {
    card: "summary",
    title: SCHOOL.name,
    description: defaultDescription,
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

import type { Metadata } from "next";
import { SCHOOL } from "@/lib/data";
import { OFFICIAL_SITE_LOGO, officialSiteLogoOpenGraphImage } from "@/lib/site-logo";
import { getPublicSiteUrl, OFFICIAL_SITE_URL } from "@/lib/site-url";

export const DEFAULT_SITE_DESCRIPTION =
  "Nursing and midwifery training in Mbale. Registered with the Ministry of Education and Sports. Accredited by UNMC and NCHE. In God We Love and Serve.";

/** Public marketing URLs included in sitemap.xml (keep in sync with route files). */
export const MARKETING_SITEMAP_ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/academics", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/academics/nursing", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/academics/nursing/programs", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/academics/nursing/curriculum", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/academics/nursing/clinical-placements", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/academics/midwifery", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/admissions", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/admissions/track", priority: 0.65, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/alumni", priority: 0.7, changeFrequency: "monthly" as const },
] as const;

export function absolutePublicUrl(pathname: string): string {
  const base = getPublicSiteUrl() || OFFICIAL_SITE_URL;
  if (!pathname || pathname === "/") return base;
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/** Metadata for indexable marketing pages (unique canonical per path). */
export function marketingPageMetadata(
  pathname: string,
  options: { title: string; description?: string },
): Metadata {
  const canonical = pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  const description = options.description ?? DEFAULT_SITE_DESCRIPTION;
  const pageUrl = absolutePublicUrl(canonical);

  return {
    title: options.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_UG",
      url: pageUrl,
      siteName: SCHOOL.name,
      title: `${options.title} | ${SCHOOL.name}`,
      description,
      images: [officialSiteLogoOpenGraphImage()],
    },
    twitter: {
      card: "summary",
      title: `${options.title} | ${SCHOOL.name}`,
      description,
      images: [OFFICIAL_SITE_LOGO.path],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/** Portal, admin, and auth surfaces must not compete with marketing URLs in Search. */
export function privateAppMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export const GLOBAL_INDEXING_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

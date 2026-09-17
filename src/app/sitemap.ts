import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();
  const routes = [
    "",
    "/academics",
    "/academics/nursing",
    "/academics/nursing/programs",
    "/academics/nursing/curriculum",
    "/academics/nursing/clinical-placements",
    "/academics/midwifery",
    "/admissions",
    "/admissions/track",
    "/contact",
    "/alumni",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}

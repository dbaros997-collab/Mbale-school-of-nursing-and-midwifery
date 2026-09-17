import type { MetadataRoute } from "next";
import { MARKETING_SITEMAP_ROUTES, absolutePublicUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return MARKETING_SITEMAP_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absolutePublicUrl(path || "/"),
    changeFrequency,
    priority,
  }));
}

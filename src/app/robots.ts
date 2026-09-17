import type { MetadataRoute } from "next";
import { absolutePublicUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portal/", "/admin/", "/api/", "/auth/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/portal/", "/admin/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${absolutePublicUrl("/")}/sitemap.xml`,
    host: new URL(absolutePublicUrl("/")).host,
  };
}

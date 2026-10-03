import {
  events,
  galleryItems,
  newsItems,
  spotlightArticles,
  statusBarUpdates,
} from "@/lib/data";
import type { SiteContent } from "@/lib/site-content/types";

/** Seed content — same as static `data.ts` until staff save overrides via admin. */
export function createDefaultSiteContent(): SiteContent {
  return {
    statusBarUpdates: statusBarUpdates.map((item) => ({ ...item })),
    newsItems: newsItems.map((item) => ({
      ...item,
      body: [...item.body],
    })),
    events: events.map((item) => ({ ...item })),
    galleryItems: galleryItems.map((item) => ({ ...item })),
    spotlightArticles: spotlightArticles.map((item) => ({ ...item })),
    updatedAt: new Date(0).toISOString(),
  };
}

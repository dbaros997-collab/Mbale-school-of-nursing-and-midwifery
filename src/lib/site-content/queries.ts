import { cache } from "react";
import { readSiteContent } from "@/lib/site-content/store";
import type { SiteEvent, SiteNewsItem } from "@/lib/site-content/types";

export const getSiteContent = cache(readSiteContent);

export async function getSiteNewsItems(): Promise<SiteNewsItem[]> {
  const { newsItems } = await getSiteContent();
  return [...newsItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getSiteNewsById(id: string): Promise<SiteNewsItem | undefined> {
  const items = await getSiteNewsItems();
  return items.find((item) => item.id === id);
}

export async function getSiteEvents(): Promise<SiteEvent[]> {
  const { events } = await getSiteContent();
  return [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export async function getSiteEventById(id: string): Promise<SiteEvent | undefined> {
  const items = await getSiteEvents();
  return items.find((item) => item.id === id);
}

import { promises as fs } from "fs";
import path from "path";
import { createDefaultSiteContent } from "@/lib/site-content/defaults";
import type { SiteContent, SiteContentSection } from "@/lib/site-content/types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CONTENT_FILE = path.join(CONTENT_DIR, "site-content.json");

function normalizeContent(raw: SiteContent): SiteContent {
  const defaults = createDefaultSiteContent();
  return {
    statusBarUpdates: raw.statusBarUpdates?.length
      ? raw.statusBarUpdates
      : defaults.statusBarUpdates,
    newsItems: raw.newsItems?.length ? raw.newsItems : defaults.newsItems,
    events: raw.events?.length ? raw.events : defaults.events,
    galleryItems: raw.galleryItems?.length ? raw.galleryItems : defaults.galleryItems,
    spotlightArticles: raw.spotlightArticles?.length
      ? raw.spotlightArticles
      : defaults.spotlightArticles,
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  };
}

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return normalizeContent(JSON.parse(raw) as SiteContent);
  } catch {
    return createDefaultSiteContent();
  }
}

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  const payload: SiteContent = {
    ...normalizeContent(content),
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

export async function updateSiteContentSection(
  section: SiteContentSection,
  value: SiteContent[SiteContentSection],
): Promise<SiteContent> {
  const current = await readSiteContent();
  return writeSiteContent({ ...current, [section]: value });
}

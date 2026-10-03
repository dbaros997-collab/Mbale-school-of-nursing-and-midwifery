import { withAdminSiteContentAccess } from "@/lib/api/admin-site-content-route";
import { readSiteContent, writeSiteContent } from "@/lib/site-content/store";
import type { SiteContent, SiteContentSection } from "@/lib/site-content/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

const SECTIONS: SiteContentSection[] = [
  "statusBarUpdates",
  "newsItems",
  "events",
  "galleryItems",
  "spotlightArticles",
];

function isSection(value: string): value is SiteContentSection {
  return (SECTIONS as string[]).includes(value);
}

export async function GET() {
  return withAdminSiteContentAccess(async () => {
    const content = await readSiteContent();
    return Response.json({ ok: true, content }, { headers: NO_STORE });
  });
}

export async function PUT(request: Request) {
  return withAdminSiteContentAccess(async () => {
    const body = (await request.json()) as {
      section?: SiteContentSection;
      data?: SiteContent[SiteContentSection];
      content?: SiteContent;
    };

    if (body.content) {
      const saved = await writeSiteContent(body.content);
      return Response.json({ ok: true, content: saved }, { headers: NO_STORE });
    }

    if (!body.section || !isSection(body.section) || body.data === undefined) {
      return Response.json(
        {
          ok: false,
          message: "Provide { section, data } or full { content }.",
        },
        { status: 400, headers: NO_STORE },
      );
    }

    const current = await readSiteContent();
    const saved = await writeSiteContent({ ...current, [body.section]: body.data });
    return Response.json({ ok: true, content: saved }, { headers: NO_STORE });
  });
}

import type { SiteContent, SiteContentSection } from "@/lib/site-content/types";

const NO_STORE: RequestInit = { cache: "no-store" };

export async function fetchAdminSiteContent(): Promise<SiteContent> {
  const res = await fetch("/api/admin/site-content", NO_STORE);
  if (!res.ok) {
    throw new Error("Could not load website content.");
  }
  const json = (await res.json()) as { ok: boolean; content: SiteContent };
  return json.content;
}

export async function saveSiteContentSection(
  section: SiteContentSection,
  data: SiteContent[SiteContentSection],
): Promise<{ ok: boolean; message: string; content?: SiteContent }> {
  const res = await fetch("/api/admin/site-content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, data }),
    ...NO_STORE,
  });
  const json = (await res.json()) as {
    ok: boolean;
    message?: string;
    content?: SiteContent;
  };
  if (!res.ok || !json.ok) {
    return { ok: false, message: json.message ?? "Save failed." };
  }
  return { ok: true, message: "Changes saved.", content: json.content };
}

export async function uploadSiteImage(file: File): Promise<{ ok: boolean; message: string; url?: string }> {
  const formData = new FormData();
  formData.set("file", file);
  const res = await fetch("/api/admin/site-content/upload", {
    method: "POST",
    body: formData,
    ...NO_STORE,
  });
  const json = (await res.json()) as { ok: boolean; message?: string; url?: string };
  if (!res.ok || !json.ok) {
    return { ok: false, message: json.message ?? "Upload failed." };
  }
  return { ok: true, message: "Image uploaded.", url: json.url };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import {
  fetchAdminSiteContent,
  saveSiteContentSection,
  uploadSiteImage,
} from "@/services/portal/admin/site-content";
import type {
  GalleryItem,
  SiteContent,
  SiteContentSection,
  SiteEvent,
  SiteNewsItem,
  SpotlightArticle,
  StatusBarUpdate,
} from "@/lib/site-content/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type TabId = SiteContentSection | "media";

const TABS: { id: TabId; label: string; hint: string }[] = [
  {
    id: "statusBarUpdates",
    label: "Status bar",
    hint: "Scrolling messages at the top of every page.",
  },
  {
    id: "newsItems",
    label: "Campus news",
    hint: "Stories for Happening around Campus and the news section.",
  },
  { id: "events", label: "Events", hint: "Upcoming events and calendar listings." },
  { id: "galleryItems", label: "Gallery", hint: "School gallery photos on the homepage." },
  {
    id: "spotlightArticles",
    label: "Campus spotlight",
    hint: "Featured cards below the gallery.",
  },
  { id: "media", label: "Upload photos", hint: "Upload images, then paste the URL into any story or gallery item." },
];

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

export function WebsiteContentDashboard() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<TabId>("statusBarUpdates");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [lastUploadUrl, setLastUploadUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminSiteContent();
      setContent(data);
    } catch {
      setFlash({ ok: false, text: "Could not load content. Sign in as staff and try again." });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function persistSection(section: SiteContentSection) {
    if (!content) return;
    setBusy(true);
    setFlash(null);
    const result = await saveSiteContentSection(section, content[section]);
    if (result.ok && result.content) setContent(result.content);
    setFlash({ ok: result.ok, text: result.message });
    setBusy(false);
  }

  async function handleUpload(file: File) {
    setBusy(true);
    setFlash(null);
    const result = await uploadSiteImage(file);
    if (result.ok && result.url) setLastUploadUrl(result.url);
    setFlash({ ok: result.ok, text: result.ok ? `Uploaded: ${result.url}` : result.message });
    setBusy(false);
  }

  const activeHint = TABS.find((t) => t.id === tab)?.hint ?? "";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="admin-page-eyebrow">Website &amp; homepage</p>
        <h1 className="admin-page-title">Marketing content dashboard</h1>
        <p className="admin-page-desc">
          Control the status bar, campus news, events, gallery, and spotlight cards visitors see on
          the public site. Changes apply after you save each section.
        </p>
        {content?.updatedAt && content.updatedAt !== new Date(0).toISOString() ? (
          <p className="mt-2 text-xs text-muted">
            Last saved: {new Date(content.updatedAt).toLocaleString("en-UG")}
          </p>
        ) : null}
      </div>

      {flash ? (
        <p
          className={cn(
            "rounded-lg border px-4 py-3 text-sm font-medium",
            flash.ok
              ? "border-accent-green/30 bg-accent-green-soft text-accent-green"
              : "border-red-200 bg-red-50 text-red-700",
          )}
          role="status"
        >
          {flash.text}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-ring",
              tab === t.id
                ? "bg-primary text-white"
                : "border border-border bg-white text-muted hover:bg-surface",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted">{activeHint}</p>

      {loading || !content ? (
        <div className="flex h-80 items-center justify-center rounded-xl border border-border bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : tab === "media" ? (
        <MediaUploadPanel
          busy={busy}
          lastUrl={lastUploadUrl}
          onUpload={(file) => void handleUpload(file)}
        />
      ) : tab === "statusBarUpdates" ? (
        <StatusBarEditor
          items={content.statusBarUpdates}
          busy={busy}
          onChange={(items) => setContent({ ...content, statusBarUpdates: items })}
          onSave={() => void persistSection("statusBarUpdates")}
        />
      ) : tab === "newsItems" ? (
        <NewsEditor
          items={content.newsItems}
          busy={busy}
          onChange={(items) => setContent({ ...content, newsItems: items })}
          onSave={() => void persistSection("newsItems")}
        />
      ) : tab === "events" ? (
        <EventsEditor
          items={content.events}
          busy={busy}
          onChange={(items) => setContent({ ...content, events: items })}
          onSave={() => void persistSection("events")}
        />
      ) : tab === "galleryItems" ? (
        <GalleryEditor
          items={content.galleryItems}
          busy={busy}
          onChange={(items) => setContent({ ...content, galleryItems: items })}
          onSave={() => void persistSection("galleryItems")}
        />
      ) : (
        <SpotlightEditor
          items={content.spotlightArticles}
          busy={busy}
          onChange={(items) => setContent({ ...content, spotlightArticles: items })}
          onSave={() => void persistSection("spotlightArticles")}
        />
      )}
    </div>
  );
}

function SaveBar({ busy, onSave }: { busy: boolean; onSave: () => void }) {
  return (
    <div className="flex justify-end border-t border-border pt-4">
      <Button type="button" variant="primary" size="sm" disabled={busy} onClick={onSave}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
        Save section
      </Button>
    </div>
  );
}

function MediaUploadPanel({
  busy,
  lastUrl,
  onUpload,
}: {
  busy: boolean;
  lastUrl: string | null;
  onUpload: (file: File) => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Upload a photo</h2>
      <p className="mt-2 text-sm text-muted">
        Files are stored under <code className="text-xs">/uploads/site/</code>. Copy the URL into
        news, events, gallery, or spotlight image fields.
      </p>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface px-6 py-10 transition hover:border-primary/40">
        <ImagePlus className="h-10 w-10 text-primary" aria-hidden />
        <span className="mt-2 text-sm font-semibold text-primary">Choose image (max 8 MB)</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
      </label>
      {lastUrl ? (
        <div className="mt-4 rounded-lg bg-surface px-3 py-2 text-sm">
          <p className="font-semibold text-primary">Latest upload URL</p>
          <code className="mt-1 block break-all text-xs">{lastUrl}</code>
        </div>
      ) : null}
    </section>
  );
}

function StatusBarEditor({
  items,
  busy,
  onChange,
  onSave,
}: {
  items: StatusBarUpdate[];
  busy: boolean;
  onChange: (items: StatusBarUpdate[]) => void;
  onSave: () => void;
}) {
  function update(index: number, patch: Partial<StatusBarUpdate>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Status bar messages</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([...items, { id: newId("status"), text: "New announcement", href: "/" }])
          }
        >
          Add message
        </Button>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={item.id} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              className={inputClass}
              value={item.text}
              onChange={(e) => update(index, { text: e.target.value })}
              placeholder="Message text"
            />
            <input
              className={inputClass}
              value={item.href}
              onChange={(e) => update(index, { href: e.target.value })}
              placeholder="Link (e.g. /admissions)"
            />
            <button
              type="button"
              className="rounded-md p-2 text-red-600 hover:bg-red-50 focus-ring"
              aria-label="Remove message"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <SaveBar busy={busy} onSave={onSave} />
    </section>
  );
}

function NewsEditor({
  items,
  busy,
  onChange,
  onSave,
}: {
  items: SiteNewsItem[];
  busy: boolean;
  onChange: (items: SiteNewsItem[]) => void;
  onSave: () => void;
}) {
  function update(index: number, patch: Partial<SiteNewsItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Campus news stories</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([
              ...items,
              {
                id: newId("news"),
                title: "New story",
                date: new Date().toISOString().slice(0, 10),
                category: "Campus",
                excerpt: "Short summary for listings.",
                body: ["Full story paragraph."],
                image: "/images/front-offices.jpg",
                featured: false,
              },
            ])
          }
        >
          Add story
        </Button>
      </div>
      <ul className="space-y-6">
        {items.map((item, index) => (
          <li key={item.id} className="space-y-2 rounded-lg border border-border p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={inputClass}
                value={item.title}
                onChange={(e) => update(index, { title: e.target.value })}
                placeholder="Title"
              />
              <input
                className={inputClass}
                type="date"
                value={item.date}
                onChange={(e) => update(index, { date: e.target.value })}
              />
              <input
                className={inputClass}
                value={item.category}
                onChange={(e) => update(index, { category: e.target.value })}
                placeholder="Category"
              />
              <input
                className={inputClass}
                value={item.image}
                onChange={(e) => update(index, { image: e.target.value })}
                placeholder="Image URL"
              />
            </div>
            <textarea
              className={cn(inputClass, "min-h-[4rem]")}
              value={item.excerpt}
              onChange={(e) => update(index, { excerpt: e.target.value })}
              placeholder="Excerpt"
            />
            <textarea
              className={cn(inputClass, "min-h-[6rem] font-mono text-xs")}
              value={item.body.join("\n\n")}
              onChange={(e) =>
                update(index, {
                  body: e.target.value
                    .split(/\n\s*\n/)
                    .map((p) => p.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Body paragraphs (blank line between paragraphs)"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(e) => update(index, { featured: e.target.checked })}
              />
              Featured on news page
            </label>
            <button
              type="button"
              className="text-sm font-semibold text-red-600 hover:underline"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Remove story
            </button>
          </li>
        ))}
      </ul>
      <SaveBar busy={busy} onSave={onSave} />
    </section>
  );
}

function EventsEditor({
  items,
  busy,
  onChange,
  onSave,
}: {
  items: SiteEvent[];
  busy: boolean;
  onChange: (items: SiteEvent[]) => void;
  onSave: () => void;
}) {
  function update(index: number, patch: Partial<SiteEvent>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Upcoming events</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([
              ...items,
              {
                id: newId("event"),
                title: "New event",
                date: new Date().toISOString().slice(0, 10),
                location: "Main Hall",
                mode: "Physical",
                image: "/images/events-staff.jpg",
                description: "Event description.",
              },
            ])
          }
        >
          Add event
        </Button>
      </div>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={item.id} className="space-y-2 rounded-lg border border-border p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={inputClass}
                value={item.title}
                onChange={(e) => update(index, { title: e.target.value })}
              />
              <input
                className={inputClass}
                type="date"
                value={item.date}
                onChange={(e) => update(index, { date: e.target.value })}
              />
              <input
                className={inputClass}
                value={item.location}
                onChange={(e) => update(index, { location: e.target.value })}
                placeholder="Location"
              />
              <input
                className={inputClass}
                value={item.mode}
                onChange={(e) => update(index, { mode: e.target.value })}
                placeholder="Mode"
              />
              <input
                className={cn(inputClass, "sm:col-span-2")}
                value={item.image}
                onChange={(e) => update(index, { image: e.target.value })}
                placeholder="Image URL"
              />
            </div>
            <textarea
              className={cn(inputClass, "min-h-[4rem]")}
              value={item.description}
              onChange={(e) => update(index, { description: e.target.value })}
            />
            <button
              type="button"
              className="text-sm font-semibold text-red-600 hover:underline"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Remove event
            </button>
          </li>
        ))}
      </ul>
      <SaveBar busy={busy} onSave={onSave} />
    </section>
  );
}

function GalleryEditor({
  items,
  busy,
  onChange,
  onSave,
}: {
  items: GalleryItem[];
  busy: boolean;
  onChange: (items: GalleryItem[]) => void;
  onSave: () => void;
}) {
  function update(index: number, patch: Partial<GalleryItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">School gallery</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([
              ...items,
              {
                id: newId("gallery"),
                src: "/uploads/site/placeholder.jpg",
                alt: "Photo description for accessibility",
                caption: "Caption",
                category: "Campus",
              },
            ])
          }
        >
          Add photo
        </Button>
      </div>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={item.id} className="space-y-2 rounded-lg border border-border p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={inputClass}
                value={item.caption}
                onChange={(e) => update(index, { caption: e.target.value })}
                placeholder="Caption"
              />
              <input
                className={inputClass}
                value={item.category}
                onChange={(e) => update(index, { category: e.target.value })}
                placeholder="Category"
              />
              <input
                className={cn(inputClass, "sm:col-span-2")}
                value={item.src}
                onChange={(e) => update(index, { src: e.target.value })}
                placeholder="Image URL"
              />
              <input
                className={cn(inputClass, "sm:col-span-2")}
                value={item.alt}
                onChange={(e) => update(index, { alt: e.target.value })}
                placeholder="Alt text (accessibility)"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(item.featured)}
                onChange={(e) => update(index, { featured: e.target.checked })}
              />
              Featured in gallery slider
            </label>
            <button
              type="button"
              className="text-sm font-semibold text-red-600 hover:underline"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Remove photo
            </button>
          </li>
        ))}
      </ul>
      <SaveBar busy={busy} onSave={onSave} />
    </section>
  );
}

function SpotlightEditor({
  items,
  busy,
  onChange,
  onSave,
}: {
  items: SpotlightArticle[];
  busy: boolean;
  onChange: (items: SpotlightArticle[]) => void;
  onSave: () => void;
}) {
  function update(index: number, patch: Partial<SpotlightArticle>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Campus spotlight cards</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([
              ...items,
              {
                id: newId("spot"),
                category: "Campus",
                title: "Spotlight title",
                image: "/images/front-offices.jpg",
                href: "/news",
              },
            ])
          }
        >
          Add card
        </Button>
      </div>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={item.id} className="space-y-2 rounded-lg border border-border p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={inputClass}
                value={item.title}
                onChange={(e) => update(index, { title: e.target.value })}
              />
              <input
                className={inputClass}
                value={item.category}
                onChange={(e) => update(index, { category: e.target.value })}
              />
              <input
                className={inputClass}
                value={item.image}
                onChange={(e) => update(index, { image: e.target.value })}
                placeholder="Image URL"
              />
              <input
                className={inputClass}
                value={item.href}
                onChange={(e) => update(index, { href: e.target.value })}
                placeholder="Link href"
              />
            </div>
            <button
              type="button"
              className="text-sm font-semibold text-red-600 hover:underline"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Remove card
            </button>
          </li>
        ))}
      </ul>
      <SaveBar busy={busy} onSave={onSave} />
    </section>
  );
}

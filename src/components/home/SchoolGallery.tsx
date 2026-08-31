"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { galleryItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type GalleryItem = (typeof galleryItems)[number];

const galleryCategories = [
  "All",
  ...Array.from(new Set(galleryItems.map((item) => item.category))),
] as const;

export function SchoolGallery() {
  const [filter, setFilter] = useState<(typeof galleryCategories)[number]>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visibleItems = useMemo(
    () =>
      filter === "All"
        ? galleryItems
        : galleryItems.filter((item) => item.category === filter),
    [filter],
  );

  const openLightbox = useCallback((item: GalleryItem) => {
    setActive(item);
  }, []);

  const closeLightbox = useCallback(() => {
    dialogRef.current?.close();
    setActive(null);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [active]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && active) closeLightbox();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, closeLightbox]);

  return (
    <section id="gallery" className="scroll-mt-24 section-muted py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="Gallery"
            title="School Gallery"
            description="Campus life, training, facilities, and the people who make MBSNM home"
            align="center"
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.08}>
          <div
            className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-2.5"
            role="tablist"
            aria-label="Filter gallery by category"
          >
            {galleryCategories.map((category) => {
              const selected = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setFilter(category)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition focus-ring",
                    selected
                      ? "bg-primary text-white shadow-sm"
                      : "border border-border bg-panel text-foreground hover:border-primary/40 hover:text-primary",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[160px] lg:auto-rows-[190px]">
          {visibleItems.map((item, i) => (
            <ScrollReveal
              key={item.id}
              direction="up"
              delay={i * 0.05}
              className={cn(
                "group relative min-h-[140px] overflow-hidden rounded-2xl sm:min-h-[160px]",
                item.featured && "col-span-2 row-span-2 min-h-[220px] md:min-h-0",
              )}
            >
              <button
                type="button"
                onClick={() => openLightbox(item)}
                className="relative h-full w-full cursor-zoom-in text-left focus-ring"
                aria-label={`View photo: ${item.caption}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  sizes={
                    item.featured
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-85 transition group-hover:opacity-100"
                />
                <span className="absolute inset-x-0 bottom-0 z-[1] block p-4 sm:p-5">
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-brand-yellow">
                    {item.category}
                  </span>
                  <span className="mt-1 block font-display text-base font-semibold leading-snug text-white sm:text-lg">
                    {item.caption}
                  </span>
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        className="fixed inset-0 z-[100] m-0 h-full max-h-none w-full max-w-none border-0 bg-black/90 p-0 backdrop:bg-black/80 open:flex open:items-center open:justify-center"
        aria-label={active ? active.caption : "Gallery photo"}
      >
        {active ? (
          <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-8 sm:px-8">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-ring sm:right-8 sm:top-8"
              aria-label="Close gallery photo"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            <div className="relative min-h-0 flex-1">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="mt-4 shrink-0 text-center text-white sm:mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-yellow">
                {active.category}
              </p>
              <p className="mt-1 font-display text-xl font-semibold sm:text-2xl">{active.caption}</p>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}

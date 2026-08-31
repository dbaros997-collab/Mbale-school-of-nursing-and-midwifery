"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { galleryItems } from "@/lib/data";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type GalleryItem = (typeof galleryItems)[number];

export function SchoolGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const slideImages = useMemo(() => galleryItems.map((item) => item.src), []);
  const activeItem = galleryItems[activeIndex];

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
            description="Campus life, training, facilities, and the people who make MBSNM home — swipe or use the arrows to explore."
            align="center"
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.08}>
          <div className="mt-10">
            <ImageSlider
              images={slideImages}
              layout="section"
              intervalMs={5000}
              altPrefix="Gallery photo"
              onIndexChange={setActiveIndex}
              renderOverlay={() =>
                activeItem ? (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => openLightbox(activeItem)}
                      className="absolute inset-x-0 bottom-0 z-[1] block w-full cursor-zoom-in p-5 text-left focus-ring sm:p-8"
                      aria-label={`View photo: ${activeItem.caption}`}
                    >
                      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-brand-yellow">
                        {activeItem.category}
                      </span>
                      <span className="mt-1 block font-display text-lg font-semibold leading-snug text-white sm:text-2xl">
                        {activeItem.caption}
                      </span>
                    </button>
                  </>
                ) : null
              }
            />
          </div>
        </ScrollReveal>
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

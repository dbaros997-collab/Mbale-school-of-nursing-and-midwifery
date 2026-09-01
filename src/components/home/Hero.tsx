"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Hospital,
  Monitor,
} from "lucide-react";
import { heroQuickBoxes, heroSlides } from "@/lib/data";
import { cn } from "@/lib/utils";

const quickIconMap = {
  GraduationCap,
  Hospital,
  FlaskConical,
  Monitor,
} as const;

const quickIconStyles = [
  "accent-chip-green",
  "accent-chip-sky",
  "accent-chip-green",
  "accent-chip-gold",
] as const;

/** Bust CDN/browser cache when a new build deploys. */
const HERO_ASSET_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "hero-v2";

function heroAsset(path: string) {
  return `${path}?v=${HERO_ASSET_VERSION}`;
}

function heroWebp(jpgPath: string) {
  return heroAsset(jpgPath.replace(/\.jpg$/, ".webp"));
}

function HeroSlideImage({
  slide,
  index,
  activeIndex,
  priority,
}: {
  slide: (typeof heroSlides)[number];
  index: number;
  activeIndex: number;
  priority: boolean;
}) {
  const active = index === activeIndex;

  return (
    <picture>
      <source srcSet={heroWebp(slide.image)} type="image/webp" />
      <img
        src={heroAsset(slide.image)}
        alt={active ? slide.alt : ""}
        width={1920}
        height={830}
        decoding="async"
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="homepage-slider__photo block h-full w-full object-cover"
      />
    </picture>
  );
}

function HeroDots({
  index,
  onSelect,
  className,
}: {
  index: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="tablist" aria-label="Hero slides">
      {heroSlides.map((s, i) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Slide ${i + 1}`}
          className={cn(
            "h-1 w-9 rounded-full transition",
            i === index ? "bg-brand-yellow" : "bg-white/60 hover:bg-white/85",
          )}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const slide = heroSlides[index];
  const animateCopy = !reduceMotion;

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    for (const s of heroSlides) {
      const img = new window.Image();
      img.src = heroWebp(s.image);
      const fallback = new window.Image();
      fallback.src = heroAsset(s.image);
    }
  }, []);

  const go = (next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  };

  const copyBlock = animateCopy ? (
    <motion.div
      key={`copy-${slide.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-[min(100%,52rem)] text-white"
    >
      <HeroCopy slide={slide} />
    </motion.div>
  ) : (
    <div className="max-w-[min(100%,52rem)] text-white">
      <HeroCopy slide={slide} />
    </div>
  );

  return (
    <section
      className="homepage-slider relative overflow-hidden bg-primary-dark"
      aria-label="Homepage hero"
    >
      {/* Mobile: full-height photo with copy overlaid at the bottom */}
      <div className="md:hidden">
        <div className="homepage-slider__mobile-photo relative w-full overflow-hidden bg-primary-dark">
          {heroSlides.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              aria-hidden={i !== index}
            >
              <HeroSlideImage
                slide={s}
                index={i}
                activeIndex={index}
                priority={i === 0}
              />
            </div>
          ))}

          <div className="homepage-slider__mobile-overlay" aria-hidden />

          <div className="homepage-slider__mobile-content absolute inset-x-0 bottom-0 z-[2] px-4 pb-8 pt-24">
            {copyBlock}
            <HeroDots index={index} onSelect={setIndex} className="mt-6" />
          </div>
        </div>
      </div>

      {/* Desktop: full-width banner with overlay copy */}
      <div className="homepage-slider__frame relative hidden w-full md:block">
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <HeroSlideImage
              slide={s}
              index={i}
              activeIndex={index}
              priority={i === 0}
            />
          </div>
        ))}

        <div className="homepage-slider__overlay" aria-hidden />

        <div className="homepage-slider__content absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-[calc(var(--site-status-bar-height)+var(--site-header-height))] lg:px-8 lg:pb-24">
            {copyBlock}
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-[3] -translate-y-1/2 rounded-full bg-black/25 p-2 text-white transition hover:bg-black/45 focus-ring lg:left-4"
          onClick={() => go(index - 1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-[3] -translate-y-1/2 rounded-full bg-black/25 p-2 text-white transition hover:bg-black/45 focus-ring lg:right-4"
          onClick={() => go(index + 1)}
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute inset-x-0 bottom-6 z-[3]" role="presentation">
          <div className="mx-auto flex w-[min(1140px,calc(100%-2rem))] items-center justify-start">
            <HeroDots index={index} onSelect={setIndex} />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 md:-mt-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-2xl content-panel sm:grid-cols-2 lg:grid-cols-4">
            {heroQuickBoxes.map((box, i) => {
              const Icon = quickIconMap[box.icon];
              return (
                <Link
                  key={box.id}
                  href={box.href}
                  className={cn(
                    "flex items-start gap-3.5 px-5 py-5 transition hover:bg-surface focus-ring sm:gap-4 sm:px-6 sm:py-6",
                    i < heroQuickBoxes.length - 1 &&
                      "border-b border-border sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:[&:nth-child(4)]:border-r-0",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      quickIconStyles[i],
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-[17px] font-bold leading-snug text-primary">
                      {box.title}
                    </strong>
                    <small className="mt-1 block text-[15px] leading-snug text-muted">
                      {box.description}
                    </small>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCopy({
  slide,
}: {
  slide: (typeof heroSlides)[number];
}) {
  return (
    <>
      <h1 className="font-display text-[clamp(1.875rem,4.5vw+0.25rem,3.75rem)] font-extrabold leading-[1.14] tracking-tight text-white">
        {slide.title}
      </h1>
      <p className="mt-5 max-w-[48rem] text-[0.9375rem] leading-[1.65] text-white/90 sm:mt-6 sm:text-[1.0625rem] sm:leading-[1.7] lg:text-lg lg:leading-[1.75]">
        {slide.description}
      </p>
      <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
        <Link
          href={slide.href}
          className="btn-pill inline-flex min-h-[3rem] w-full items-center justify-center rounded-full border border-brand-green bg-brand-green px-5 py-3 text-sm font-extrabold leading-none text-white shadow-[0_10px_24px_rgba(25,143,52,0.28)] transition hover:border-brand-green-dark hover:bg-brand-green-dark focus-ring sm:min-h-[3.25rem] sm:w-auto sm:min-w-[11rem] sm:px-6 sm:py-[15px] sm:text-lg"
        >
          {slide.cta}
        </Link>
        <Link
          href={slide.secondaryHref}
          className="btn-pill inline-flex min-h-[3rem] w-full items-center justify-center rounded-full border-2 border-white/80 bg-transparent px-5 py-3 text-sm font-bold leading-none text-white transition hover:bg-white hover:text-primary focus-ring sm:min-h-[3.25rem] sm:w-auto sm:min-w-[11rem] sm:px-6 sm:py-[15px] sm:text-lg"
        >
          {slide.secondaryCta}
        </Link>
      </div>
    </>
  );
}

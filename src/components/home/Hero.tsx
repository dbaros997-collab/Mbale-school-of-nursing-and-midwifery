"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FlaskConical,
  GraduationCap,
  Hospital,
  Monitor,
} from "lucide-react";
import { heroQuickBoxes, heroSlides, SCHOOL } from "@/lib/data";
import { ImageSlider } from "@/components/ui/ImageSlider";
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
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "hero-v3-no-lab";

function heroAsset(path: string) {
  return `${path}?v=${HERO_ASSET_VERSION}`;
}

const HERO_TITLE_ACCENTS = [
  "hero-accent-green",
  "hero-accent-gold",
  "hero-accent-sky",
  "hero-accent-gold",
] as const;

const HERO_COPY_ACCENTS: Record<
  string,
  { titlePhrase: string; descriptionPhrases?: readonly string[] }
> = {
  "1": {
    titlePhrase: "real health professionals",
    descriptionPhrases: ["UNMC", "NCHE"],
  },
  "2": {
    titlePhrase: "Real hospital",
    descriptionPhrases: ["Mbale Referral Hospital"],
  },
  "3": { titlePhrase: "on day one" },
  "4": { titlePhrase: "Learning by doing" },
};

function highlightPhrase(text: string, phrase: string, accentClass: string): ReactNode {
  const idx = text.indexOf(phrase);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <span className={accentClass}>{phrase}</span>
      {text.slice(idx + phrase.length)}
    </>
  );
}

function highlightPhrases(
  text: string,
  phrases: readonly string[],
  className: string,
): ReactNode {
  if (phrases.length === 0) return text;

  const pattern = phrases
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${pattern})`, "g");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    phrases.includes(part) ? (
      <span key={`${part}-${i}`} className={className}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const slide = heroSlides[index];
  const animateCopy = !reduceMotion;

  const slideImages = useMemo(
    () => heroSlides.map((s) => heroAsset(s.image)),
    [],
  );

  const copyBlock = animateCopy ? (
    <motion.div
      key={`copy-${slide.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="hero-section__copy"
    >
      <HeroCopy slide={slide} slideIndex={index} />
    </motion.div>
  ) : (
    <div className="hero-section__copy">
      <HeroCopy slide={slide} slideIndex={index} />
    </div>
  );

  return (
    <section
      className="homepage-slider relative overflow-hidden bg-primary-dark"
      aria-label="Homepage hero"
    >
      <div className="hero-section">
        <ImageSlider
          images={slideImages}
          layout="hero"
          intervalMs={6500}
          altPrefix="Hero slide"
          onIndexChange={setIndex}
        >
          <div className="hero-slider__scrim-linear" aria-hidden />
          <div className="hero-slider__scrim-radial" aria-hidden />
        </ImageSlider>

        <div className="hero-section__content">{copyBlock}</div>
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
  slideIndex,
}: {
  slide: (typeof heroSlides)[number];
  slideIndex: number;
}) {
  const accent = HERO_COPY_ACCENTS[slide.id];
  const titleAccent = HERO_TITLE_ACCENTS[slideIndex % HERO_TITLE_ACCENTS.length];

  return (
    <>
      <p className="font-display text-[clamp(1rem,2vw,1.35rem)] italic leading-snug text-white">
        {SCHOOL.motto}
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.875rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
        {accent
          ? highlightPhrase(slide.title, accent.titlePhrase, titleAccent)
          : slide.title}
      </h1>
      <p className="mx-auto mt-5 max-w-[36rem] text-[0.9375rem] leading-[1.7] text-white/88 sm:text-[1.0625rem] lg:text-lg">
        {accent?.descriptionPhrases
          ? highlightPhrases(
              slide.description,
              accent.descriptionPhrases,
              "hero-desc-highlight",
            )
          : slide.description}
      </p>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <Link
          href={slide.href}
          className="btn-pill inline-flex min-h-[3rem] w-full items-center justify-center rounded-full border border-brand-green bg-brand-green px-6 py-3 text-sm font-extrabold leading-none text-white shadow-[0_10px_24px_rgba(25,143,52,0.28)] transition hover:border-brand-green-dark hover:bg-brand-green-dark focus-ring sm:min-h-[3.25rem] sm:w-auto sm:min-w-[11rem] sm:px-8 sm:text-base"
        >
          {slide.cta}
        </Link>
        <Link
          href={slide.secondaryHref}
          className="btn-pill inline-flex min-h-[3rem] w-full items-center justify-center rounded-full border-2 border-white/70 bg-white/5 px-6 py-3 text-sm font-bold leading-none text-white backdrop-blur-sm transition hover:border-white hover:bg-white/12 focus-ring sm:min-h-[3.25rem] sm:w-auto sm:min-w-[11rem] sm:px-8 sm:text-base"
        >
          {slide.secondaryCta}
        </Link>
      </div>
    </>
  );
}

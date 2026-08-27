"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

export function Hero() {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const slide = heroSlides[index];
  const animateSlides = ready && !reduceMotion;

  useEffect(() => {
    setReady(true);
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  const go = (next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  };

  return (
    <section
      className="homepage-slider relative overflow-hidden bg-primary-dark"
      aria-label="Homepage hero"
    >
      <div className="relative min-h-[calc(100svh-var(--site-status-bar-height))] w-full sm:min-h-[calc(100svh-var(--site-status-bar-height)-2rem)] lg:min-h-[38rem]">
        {animateSlides ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
                quality={85}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0">
            <Image
              src={heroSlides[0].image}
              alt={heroSlides[0].alt}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              quality={85}
            />
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/65 via-black/25 to-black/5"
        />

        <div className="absolute inset-0 z-[2] flex items-end pt-[calc(var(--site-status-bar-height)+var(--site-header-height))] sm:items-center">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
            {animateSlides ? (
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
                <HeroCopy slide={heroSlides[0]} />
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-[3] hidden -translate-y-1/2 rounded-full bg-black/25 p-2 text-white transition hover:bg-black/45 focus-ring md:inline-flex lg:left-4"
          onClick={() => go(index - 1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-[3] hidden -translate-y-1/2 rounded-full bg-black/25 p-2 text-white transition hover:bg-black/45 focus-ring md:inline-flex lg:right-4"
          onClick={() => go(index + 1)}
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div
          className="absolute inset-x-0 bottom-5 z-[3] sm:bottom-6"
          role="tablist"
          aria-label="Hero slides"
        >
          <div className="mx-auto flex w-[min(1140px,calc(100%-2rem))] items-center justify-start gap-2.5">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition",
                  i === index
                    ? "scale-110 bg-brand-yellow"
                    : "bg-white/60 hover:bg-white/85",
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-14 px-4 sm:-mt-16 sm:px-6 lg:px-8">
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
                    i < heroQuickBoxes.length - 1 && "border-b border-border sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:[&:nth-child(4)]:border-r-0",
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

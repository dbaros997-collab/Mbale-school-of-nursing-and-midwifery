"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { heroSlides } from "@/lib/data";

export function Hero() {
  const [index, setIndex] = useState(0);
  const slide = heroSlides[index];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative bg-white">
      {/* Full-bleed rounded hero — header overlays the top of this photo */}
      <div className="relative mx-3 mt-3 min-h-[560px] overflow-hidden rounded-t-[28px] bg-primary-dark text-white sm:mx-4 sm:mt-4 sm:min-h-[600px] sm:rounded-t-[44px] lg:mx-5 lg:mt-5 lg:min-h-[640px] lg:rounded-t-[60px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0.4, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Soft top shade so header menu stays readable */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/45 to-transparent"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex min-h-[560px] items-center px-4 pb-24 pt-32 sm:min-h-[600px] sm:px-8 sm:pt-36 lg:min-h-[640px] lg:px-14 lg:pt-40">
          <div className="relative w-full max-w-xl overflow-hidden rounded-sm sm:max-w-2xl">
            {/* See-through wash — photo shows through; text stays solid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-black/25 backdrop-blur-[2px]"
            />
            <motion.div
              key={`copy-${slide.id}`}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-6 sm:p-10 lg:p-12"
            >
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.55)] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] sm:text-base lg:text-lg">
                {slide.description}
              </p>
              <Link
                href={slide.href}
                className="mt-7 inline-flex bg-[#002868] px-10 py-[18px] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#001a4d] focus-ring"
              >
                {slide.cta}
              </Link>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="playbtn text-white"
                  aria-label="Campus tour information"
                >
                  <span className="play-icon" aria-hidden>
                    <span className="circle c3" />
                    <span className="circle c2" />
                    <span className="circle c1" />
                    <span className="play-spot">
                      <svg className="play-triangle" viewBox="0 0 24 24" aria-hidden>
                        <path d="M8 5v14l11-7z" fill="#ffffff" />
                      </svg>
                    </span>
                  </span>
                  <span className="play-text [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                    MBSNM Campus Tour: Visit Our Learning Facilities
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2.5 sm:bottom-10"
          role="tablist"
          aria-label="Hero slides"
        >
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              className={`h-3 w-3 rounded-full border-2 border-white transition ${
                i === index ? "bg-white opacity-100" : "bg-white/40 opacity-70 hover:opacity-100"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { visionMission } from "@/lib/data";
import { cn } from "@/lib/utils";

const titleColors = ["text-primary", "text-brand-green", "text-brand-yellow-dark"] as const;

/**
 * ISBAT-style zigzag Vision / Mission / Philosophy rows with illustration drawings.
 */
export function VisionMission() {
  return (
    <section
      id="vision-mission"
      className="scroll-mt-24 section-primary-soft py-14 sm:py-20"
      aria-labelledby="vision-mission-heading"
    >
      <h2 id="vision-mission-heading" className="sr-only">
        Our Vision, Mission, and Philosophy
      </h2>
      <div className="mx-auto max-w-5xl space-y-10 px-4 sm:space-y-14 sm:px-6 lg:px-8">
        {visionMission.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: item.reverse ? 72 : -72 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "grid items-center gap-8 sm:gap-12 md:grid-cols-[240px_minmax(0,1fr)] md:gap-16",
              item.reverse && "md:grid-cols-[minmax(0,1fr)_240px]",
            )}
          >
            <div
              className={cn(
                "flex justify-center md:justify-center",
                item.reverse && "md:order-2",
              )}
            >
              <motion.div
                whileHover={{ scale: 1.04, rotate: item.reverse ? -2 : 2 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="relative h-[160px] w-[220px] sm:h-[180px] sm:w-[240px]"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-contain"
                  sizes="240px"
                />
              </motion.div>
            </div>

            <div className={cn(item.reverse && "md:order-1")}>
              <h3
                className={cn(
                  "text-2xl font-bold tracking-tight sm:text-[1.75rem]",
                  titleColors[index % titleColors.length],
                )}
              >
                {item.title}
              </h3>
              <div
                className="brand-tricolor-rule mt-2 max-w-[3.5rem] rounded-full"
                aria-hidden
              />
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {item.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

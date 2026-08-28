"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Cross,
  GraduationCap,
  Heart,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";
import { coreValues, SCHOOL } from "@/lib/data";

const valueIcons: Record<(typeof coreValues)[number]["title"], LucideIcon> = {
  Compassion: Heart,
  Competence: GraduationCap,
  Faith: Cross,
  Community: Users,
  Integrity: Scale,
};

/**
 * Grace High–style two-column band: Our School (image + overlay) and Our Core Values.
 */
export function VisionMission() {
  return (
    <section
      id="vision-mission"
      className="scroll-mt-24 bg-white py-14 sm:py-20"
      aria-labelledby="vision-mission-heading"
    >
      <h2 id="vision-mission-heading" className="sr-only">
        Our School and Core Values
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl shadow-lg sm:rounded-3xl lg:grid lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[22rem] sm:min-h-[26rem]"
          >
            <Image
              src="/images/admin-block.jpg"
              alt={`Campus and learning facilities at ${SCHOOL.shortName}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,36,86,0.92)_0%,rgba(22,53,127,0.88)_100%)]"
              aria-hidden
            />
            <div className="relative z-10 flex h-full flex-col justify-center px-8 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
              <h3 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                Our School
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
                Explore our Christian foundation and dedicated learning community. A place where
                every student is guided toward clinical excellence and Christ-like character.
              </p>
              <Link
                href="/#about"
                className="mt-8 inline-flex w-fit items-center gap-2 border border-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
              >
                Explore
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center bg-white px-8 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16"
          >
            <h3 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
              Our Core Values
            </h3>
            <ul className="mt-8 space-y-5 sm:space-y-6">
              {coreValues.map((value, index) => {
                const Icon = valueIcons[value.title];
                return (
                  <motion.li
                    key={value.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-4 sm:gap-5"
                  >
                    <Icon
                      className="h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span className="text-base font-bold text-primary sm:text-lg">
                      {value.title}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

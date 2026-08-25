"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import { programs } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function FeaturedPrograms() {
  const featured = programs.slice(0, 3);

  return (
    <section className="section-gold py-16 sm:py-20" aria-labelledby="programs-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Programs"
            title="Featured courses"
            description="Nursing and midwifery pathways designed for direct entry and professional extension."
          />
          <Button href="/academics" variant="ghost" className="self-start sm:self-auto">
            View all programs
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((program, index) => (
            <motion.article
              key={program.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group overflow-hidden rounded-3xl border border-border bg-surface"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-primary/10">
                <Image
                  src={program.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded-md bg-primary/90 px-2.5 py-1 text-xs font-semibold text-white">
                  {program.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-primary">{program.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                  {program.summary}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5 text-accent-green" aria-hidden />
                    {program.duration}
                  </span>
                  <Link
                    href={`/academics#${program.id}`}
                    className="text-sm font-semibold text-primary hover:text-accent-green focus-ring rounded"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

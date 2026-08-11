"use client";

import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { newsItems } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-UG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function NewsAnnouncements() {
  return (
    <section className="bg-primary py-16 text-white sm:py-20" aria-labelledby="news-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Updates"
          title="News & announcements"
          description="Intake notices, campus events, and academic updates from MBSNM."
          light
        />

        <div
          className="mt-6 flex items-center gap-3 overflow-hidden rounded-xl bg-white/10 px-4 py-3 text-sm backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <Megaphone className="h-4 w-4 shrink-0 text-accent-cyan" aria-hidden />
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <motion.p
              className="whitespace-nowrap font-medium text-white/90"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              We are accepting applications for July 2026 Intake — Apply now · Recognized by UNMC & NCHE · Clinical placements at Mbale Referral Hospital ·{" "}
              We are accepting applications for July 2026 Intake — Apply now ·
            </motion.p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-accent-green/20 px-2 py-0.5 font-semibold text-accent-cyan">
                  {item.category}
                </span>
                <time dateTime={item.date} className="text-white/60">
                  {formatDate(item.date)}
                </time>
              </div>
              <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{item.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

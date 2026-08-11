"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  return (
    <section className="section-atmosphere py-16 sm:py-20" aria-labelledby="life-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Life at MBSNM"
              title="Voices from students & alumni"
              description="Perspectives from learners shaped by clinical excellence, mentorship, and compassionate care."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {testimonials.map((item, index) => (
                <motion.blockquote
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <Quote className="h-5 w-5 text-accent-cyan" aria-hidden />
                  <p className="mt-3 text-sm leading-relaxed text-muted">“{item.quote}”</p>
                  <footer className="mt-4">
                    <p className="text-sm font-bold text-primary">{item.name}</p>
                    <p className="text-xs text-muted">{item.role}</p>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { src: "/images/graduates.jpg", alt: "Graduating class celebrating success" },
              { src: "/images/dancers.jpg", alt: "Campus celebration performance" },
              { src: "/images/principal.jpg", alt: "School principal addressing graduation" },
              { src: "/images/campus-night.jpg", alt: "Campus facilities with modern lighting" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="25vw" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

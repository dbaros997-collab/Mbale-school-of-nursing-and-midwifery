"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Eye, Target } from "lucide-react";
import { coreValues, SCHOOL } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSnapshot() {
  return (
    <section className="section-atmosphere py-16 sm:py-20" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/admin-block.jpg"
              alt="Administration block and learning facilities at the campus"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-5 left-5 right-5 rounded-xl bg-primary px-4 py-3 text-sm text-white shadow-lg sm:left-8 sm:right-auto sm:max-w-xs">
            <p className="font-semibold text-accent-cyan">Our motto</p>
            <p className="mt-0.5">{SCHOOL.motto}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="pt-6 lg:pt-0"
        >
          <SectionHeading
            eyebrow="About Us"
            title="A Christian calling to heal communities"
            description={`Founded by Christians of ${SCHOOL.foundedBy}, ${SCHOOL.name} was established to provide healthcare training that serves the poor, the young, and the elderly through community health services.`}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Mission",
                text: "Impart professional nursing knowledge with hands-on clinical excellence.",
              },
              {
                icon: Eye,
                title: "Vision",
                text: "Raise trusted health professionals who love and serve with integrity.",
              },
              {
                icon: Heart,
                title: "Faith",
                text: "Anchor training in compassionate, God-honoring patient care.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-border bg-white p-4">
                <Icon className="mb-2 h-5 w-5 text-accent-green" aria-hidden />
                <h3 className="text-sm font-bold text-primary">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Core values</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {coreValues.map((value) => (
                <li key={value.title} className="text-sm text-muted">
                  <span className="font-semibold text-foreground">{value.title}</span> — {value.description}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

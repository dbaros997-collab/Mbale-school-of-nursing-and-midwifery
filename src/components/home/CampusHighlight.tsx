"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stats = [
  { icon: Users, label: "Graduated students", value: "Growing alumni network" },
  { icon: Building2, label: "Modern facilities", value: "Labs, classrooms & offices" },
  { icon: Stethoscope, label: "Clinical partners", value: "Including Mbale Referral Hospital" },
];

export function CampusHighlight() {
  return (
    <section className="section-sky py-16 sm:py-20" aria-labelledby="campus-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[5/4] overflow-hidden rounded-3xl"
          >
            <Image
              src="/images/front-offices.jpg"
              alt="Modern front offices at Mbale School of Nursing and Midwifery"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-green">
              Campus & recognition
            </p>
            <h2 id="campus-heading" className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">
              A learning environment built for practice
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              We prioritize practical labs, modern office infrastructure, and clinical readiness so every student
              graduates prepared for real healthcare settings.
            </p>

            <ul className="mt-8 space-y-4">
              {stats.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-cyan-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-bold text-primary">{label}</p>
                    <p className="text-sm text-muted">{value}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button href="/admissions" variant="primary">
                Start your application
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

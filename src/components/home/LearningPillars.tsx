"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SCHOOL } from "@/lib/data";
import { cn } from "@/lib/utils";

const CAMPUS_VIDEO_URL = "https://youtu.be/L0XIzMuBm5g";

const pillars = [
  {
    title: "Quality",
    text: `${SCHOOL.shortName} meets UNMC and NCHE standards. Experienced tutors, solid programmes, and real ward practice — that is what we offer.`,
    icon: "/images/icons/quality.png",
  },
  {
    title: "Reliability",
    text: `We are a registered school. You can count on clear guidance, fair processes, and staff who take your training seriously.`,
    icon: "/images/icons/reliability.png",
  },
  {
    title: "Innovation",
    text: `Skills labs, hospital placements, and digital learning tools help you grow into a nurse or midwife who can serve your community well.`,
    icon: "/images/icons/innovation.png",
  },
];

const pillarAccents = [
  "border-l-brand-green",
  "border-l-primary",
  "border-l-brand-yellow",
] as const;

/**
 * ISBAT-style homepage band: pedagogy + infrastructure + Quality/Reliability/Innovation on the left,
 * campus visual + play CTA on the right.
 */
export function LearningPillars() {
  return (
    <section
      id="learning-pillars"
      className="scroll-mt-24 section-green py-12 sm:py-16"
      aria-labelledby="learning-pillars-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-8">
        {/* Left — like ISBAT */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-green">
            Registered school · Nursing &amp; Midwifery focus
          </p>
          <h2
            id="learning-pillars-heading"
            className="mt-2 font-display text-2xl font-semibold leading-snug text-primary sm:text-3xl"
          >
            Where you learn to nurse and midwife with skill and heart.
          </h2>
          <div className="brand-tricolor-rule mt-3 max-w-[5rem] rounded-full" aria-hidden />
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {SCHOOL.name} combines classroom teaching, skills labs, and hospital placements in Mbale.
            {SCHOOL.registration}
          </p>

          <h3 className="mt-8 text-lg font-bold text-primary">How we teach</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
            You learn by doing. Tutors guide you in class, in the lab, and on the ward so you are
            ready for the work ahead.
          </p>

          <h3 className="mt-6 text-lg font-bold text-primary">Where you learn</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
            Teaching blocks, skills labs, a computer lab, and spaces built for nursing and midwifery
            training.
          </p>

          <ul className="mt-8 space-y-7">
            {pillars.map((item, index) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex items-start gap-4 border-l-4 pl-4 sm:gap-5 sm:pl-5",
                  pillarAccents[index],
                )}
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold text-foreground sm:text-lg">{item.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
                <div className="relative h-[72px] w-[72px] shrink-0 sm:h-[84px] sm:w-[84px]">
                  <Image
                    src={item.icon}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="84px"
                  />
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right — campus visual + play */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl sm:aspect-[4/5] lg:aspect-[3/4]">
            <Image
              src="/images/clinical-infant-care-training.png"
              alt="Midwifery students observing infant care practice on a training mannequin"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="mt-4 flex justify-center lg:mt-5">
            <a
              href={CAMPUS_VIDEO_URL}
              className="playbtn"
              role="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="play-icon" aria-hidden="true">
                <span className="circle c1" />
                <span className="circle c2" />
                <span className="circle c3" />
                <span className="play-spot">
                  <svg className="play-triangle" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M8 5v14l11-7z" fill="#ffffff" />
                  </svg>
                </span>
              </span>
              <span className="play-text">
                A Glimpse of {SCHOOL.shortName}: Campus &amp; Graduation
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Briefcase, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { programs, nursingDepartment, headOfMidwifery, SCHOOL } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";
import { Callout } from "@/components/ui/Callout";

export default function AcademicsPage() {
  return (
    <div>
      <PageBanner
        breadcrumb="Study at MBSNM"
        title="Courses & Programs"
        subtitle={`Explore diploma and certificate pathways in Nursing and Midwifery at ${SCHOOL.name}.`}
        image="/images/discovery/discovery-programs.webp"
      />

      <section className="section-sky py-14">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Course catalogue"
            title="Nursing & Midwifery offerings"
            description="Select a program to review duration, requirements, and graduate pathways."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <Callout>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div className="space-y-2 text-sm leading-relaxed text-foreground">
                    <p className="font-semibold text-primary">{nursingDepartment.name}</p>
                    <p>{nursingDepartment.accreditation.registration}</p>
                    <p>{nursingDepartment.accreditation.examinations}</p>
                  </div>
                </div>
                <Link
                  href="/academics/nursing"
                  className="shrink-0 text-sm font-bold text-primary underline-offset-2 hover:underline focus-ring"
                >
                  Explore the department →
                </Link>
              </div>
            </Callout>
            <Callout>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2 text-sm leading-relaxed text-foreground">
                  <p className="font-semibold text-primary">{headOfMidwifery.title}</p>
                  <p>
                    Message from {headOfMidwifery.head.name} for student and qualified midwives —
                    courage at birth, the golden minute, and service with integrity.
                  </p>
                </div>
                <Link
                  href="/academics/midwifery"
                  className="shrink-0 text-sm font-bold text-primary underline-offset-2 hover:underline focus-ring"
                >
                  Read the message →
                </Link>
              </div>
            </Callout>
          </div>

          <div className="space-y-8">
            {programs.map((program) => (
              <article
                key={program.id}
                id={program.id}
                className="scroll-mt-28 overflow-hidden rounded-3xl content-panel"
              >
                <div className="grid lg:grid-cols-[360px_1fr]">
                  <div className="relative min-h-[240px] overflow-hidden bg-surface sm:min-h-[280px] lg:min-h-0 lg:rounded-l-3xl">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 360px"
                    />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-accent-cyan-soft px-2.5 py-1 text-xs font-bold text-primary">
                        {program.category}
                      </span>
                      <span className="rounded-md bg-accent-green-soft px-2.5 py-1 text-xs font-bold text-accent-green">
                        {program.level}
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-extrabold text-primary">{program.title}</h2>
                    <p className="mt-2 text-muted leading-relaxed">{program.summary}</p>

                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Clock className="h-4 w-4 text-accent-green" aria-hidden />
                      Duration: {program.duration}
                    </p>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                          <CheckCircle2 className="h-4 w-4 text-accent-green" aria-hidden />
                          Entry requirements
                        </h3>
                        <ul className="space-y-2">
                          {program.requirements.map((req) => (
                            <li key={req} className="text-sm text-muted leading-relaxed">
                              • {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                          <Briefcase className="h-4 w-4 text-accent-green" aria-hidden />
                          Career outcomes
                        </h3>
                        <ul className="space-y-2">
                          {program.outcomes.map((out) => (
                            <li key={out} className="text-sm text-muted leading-relaxed">
                              • {out}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button href="/admissions" variant="green" size="sm">
                        Apply for this course
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        href={
                          program.category === "Nursing"
                            ? "/academics/nursing/curriculum"
                            : undefined
                        }
                        onClick={
                          program.category === "Nursing"
                            ? undefined
                            : () =>
                                alert(
                                  `Curriculum overview for ${program.title} will be available as a downloadable PDF. Contact ${SCHOOL.admissionsEmail} for the current syllabus.`,
                                )
                        }
                        ariaLabel={`Request curriculum for ${program.title}`}
                      >
                        <Download className="h-4 w-4" aria-hidden />
                        Curriculum / syllabus info
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

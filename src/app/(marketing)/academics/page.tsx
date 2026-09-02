"use client";

import Image from "next/image";
import { Download, Briefcase, CheckCircle2, Clock } from "lucide-react";
import { programs, SCHOOL } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";

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
                        onClick={() =>
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

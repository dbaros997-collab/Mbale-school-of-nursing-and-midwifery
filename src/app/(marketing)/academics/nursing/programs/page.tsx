import Image from "next/image";
import { Briefcase, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { nursingDepartment, nursingPrograms, SCHOOL } from "@/lib/data";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NursingSubNav } from "@/components/academics/NursingSubNav";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";

export default function NursingProgramsPage() {
  const { accreditation } = nursingDepartment;

  return (
    <div>
      <PageBanner
        breadcrumb="Department of Nursing"
        title="Nursing Programmes"
        subtitle={`Diploma and certificate pathways offered by the Department of Nursing at ${SCHOOL.shortName}.`}
        image="/images/discovery/discovery-programs.webp"
      />

      <section className="section-sky py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NursingSubNav />
        </div>
      </section>

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Accredited programmes"
            title="Three nursing courses"
            description="All programmes are registered with the Ministry of Education and Sports and examined through UHPAB."
          />

          <Callout>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div className="space-y-2 text-sm leading-relaxed text-foreground">
                <p>{accreditation.registration}</p>
                <p>{accreditation.examinations}</p>
              </div>
            </div>
          </Callout>

          <div className="space-y-8">
            {nursingPrograms.map((program) => (
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
                      <Button href="/academics/nursing/curriculum" variant="ghost" size="sm">
                        View curriculum
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

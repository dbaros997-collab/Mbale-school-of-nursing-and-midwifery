import Image from "next/image";
import { GraduationCap, Users } from "lucide-react";
import { nursingDepartment, SCHOOL } from "@/lib/data";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NursingSubNav } from "@/components/academics/NursingSubNav";
import { Button } from "@/components/ui/Button";

export default function NursingDepartmentPage() {
  const { head, teamDescription, overview } = nursingDepartment;

  return (
    <div>
      <PageBanner
        breadcrumb="Department of Nursing"
        title={nursingDepartment.name}
        subtitle={`Meet the team and explore nursing education at ${SCHOOL.shortName}.`}
        image="/images/gallery/students-building-front.jpg"
      />

      <section className="section-sky py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NursingSubNav />
        </div>
      </section>

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="About the department"
                title="Training nurses for Eastern Uganda and beyond"
                description={overview}
              />
              <p className="mt-6 text-muted leading-relaxed">{teamDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/academics/nursing/programs" variant="green">
                  View nursing programmes
                </Button>
                <Button href="/admissions" variant="ghost">
                  How to apply
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/gallery/staff-nurses-trio.jpg"
                alt="MBSNM nursing team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-green py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Leadership & faculty"
            title="Head of Department and teaching team"
            description="The Department of Nursing combines academic leadership with experienced tutors and clinical instructors."
            align="center"
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
            <article className="overflow-hidden rounded-3xl content-panel">
              <div className="relative aspect-[3/4] bg-surface">
                <Image
                  src={head.image}
                  alt={`${head.name}, ${head.title} of the Department of Nursing`}
                  fill
                  unoptimized
                  className="object-cover object-top"
                  sizes="320px"
                />
              </div>
              <div className="p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-accent-green">
                  {head.title}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-primary">{head.name}</h3>
              </div>
            </article>

            <div className="grid gap-6 sm:grid-cols-2">
              <article className="rounded-2xl content-panel p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl accent-chip-green">
                  <GraduationCap className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">Health tutors</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Qualified health tutors deliver classroom instruction across nursing sciences,
                  professional ethics, and health service management — preparing students for
                  UHPAB semester examinations.
                </p>
              </article>
              <article className="rounded-2xl content-panel p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl accent-chip-sky">
                  <Users className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">Clinical instructors</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Clinical instructors supervise students during rotations at regional hospitals,
                  HCIVs, and HCIIIs — bridging theory with bedside practice and patient-centred
                  care.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

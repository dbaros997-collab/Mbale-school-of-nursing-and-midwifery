import { BookOpen } from "lucide-react";
import { nursingDepartment, SCHOOL } from "@/lib/data";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NursingSubNav } from "@/components/academics/NursingSubNav";
import { Button } from "@/components/ui/Button";

export default function NursingCurriculumPage() {
  const { coreSubjects } = nursingDepartment;

  return (
    <div>
      <PageBanner
        breadcrumb="Department of Nursing"
        title="Curriculum & Course Units"
        subtitle={`Core subjects taught across nursing programmes at ${SCHOOL.shortName}.`}
        image="/images/learning-pillars-clinical.jpg"
      />

      <section className="section-sky py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NursingSubNav />
        </div>
      </section>

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Course catalogue"
            title="Core nursing subjects"
            description="Students progress through a structured curriculum covering clinical sciences, specialty nursing areas, and professional development."
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreSubjects.map((subject) => (
              <li
                key={subject}
                className="flex items-start gap-3 rounded-2xl content-panel p-5"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl accent-chip-sky">
                  <BookOpen className="h-5 w-5" aria-hidden />
                </span>
                <span className="pt-2 text-sm font-semibold leading-snug text-primary">
                  {subject}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
            Course units are delivered through lectures, skills-lab sessions, and supervised
            clinical practice. Semester examinations for all nursing programmes are conducted
            through the Uganda Health Professions Assessment Board (UHPAB) under assessment
            center number U120.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/academics/nursing/programs" variant="green">
              View programmes
            </Button>
            <Button href="/academics/nursing/clinical-placements" variant="ghost">
              Clinical placements
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

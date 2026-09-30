import { nursingDepartment, SCHOOL } from "@/lib/data";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NursingSubNav } from "@/components/academics/NursingSubNav";
import { NursingCurriculumExplorer } from "@/components/academics/NursingCurriculumExplorer";
import { Button } from "@/components/ui/Button";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata = marketingPageMetadata("/academics/nursing/curriculum", {
  title: "Nursing Curriculum",
  description:
    "Year-by-year, semester-by-semester course units for each MBSNM nursing programme — certificate and diploma pathways.",
});

export default function NursingCurriculumPage() {
  const { accreditation } = nursingDepartment;

  return (
    <div>
      <PageBanner
        breadcrumb="Department of Nursing"
        title="Curriculum & Course Units"
        subtitle={`Detailed course breakdowns for each nursing programme at ${SCHOOL.shortName}.`}
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
            eyebrow="Programme catalogues"
            title="Course units by programme"
            description="Select a nursing course to view its full curriculum organised by academic year and semester. Each programme has its own sequence of theory, clinical, and professional units."
          />

          <NursingCurriculumExplorer />

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
            Units are delivered through lectures, skills-laboratory sessions, and supervised clinical
            practice. {accreditation.examinations}
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

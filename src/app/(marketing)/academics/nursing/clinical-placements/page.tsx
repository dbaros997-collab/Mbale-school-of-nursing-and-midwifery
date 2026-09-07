import { Building2, Hospital, MapPin } from "lucide-react";
import { nursingDepartment, SCHOOL } from "@/lib/data";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NursingSubNav } from "@/components/academics/NursingSubNav";
import { Button } from "@/components/ui/Button";

const siteGroups = [
  {
    title: "Regional & district hospitals",
    description:
      "Students undertake major clinical rotations at these referral and district general hospitals.",
    Icon: Hospital,
    sites: nursingDepartment.clinicalPlacements.regionalHospitals,
    chipClass: "accent-chip-green",
  },
  {
    title: "Affiliated HCIVs",
    description:
      "Health Centre IV facilities where students gain community and primary-care nursing experience.",
    Icon: Building2,
    sites: nursingDepartment.clinicalPlacements.hcivs,
    chipClass: "accent-chip-sky",
  },
  {
    title: "Affiliated HCIIIs",
    description:
      "Health Centre III sites supporting outreach, preventive care, and foundational clinical skills.",
    Icon: MapPin,
    sites: nursingDepartment.clinicalPlacements.hciiis,
    chipClass: "accent-chip-gold",
  },
] as const;

export default function NursingClinicalPlacementsPage() {
  return (
    <div>
      <PageBanner
        breadcrumb="Department of Nursing"
        title="Clinical Placements"
        subtitle={`Practical training sites for nursing students at ${SCHOOL.shortName}.`}
        image="/images/hero/hero-clinical-infant-care.jpg"
      />

      <section className="section-sky py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NursingSubNav />
        </div>
      </section>

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Hands-on training"
            title="Where nursing students practice"
            description="Clinical placements connect classroom learning with real patient care across hospitals and health centres in Eastern Uganda."
          />

          <div className="mt-10 space-y-8">
            {siteGroups.map(({ title, description, Icon, sites, chipClass }) => (
              <article key={title} className="rounded-3xl content-panel p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${chipClass}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-extrabold text-primary">{title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {sites.map((site) => (
                        <li
                          key={site}
                          className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
                        >
                          {site}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
            Clinical instructors supervise students at each placement site, ensuring safe practice
            and competency development in medical-surgical, pediatric, reproductive health, mental
            health, and community nursing settings.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/academics/nursing/programs" variant="green">
              Nursing programmes
            </Button>
            <Button href="/contact" variant="ghost">
              Enquire about placements
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

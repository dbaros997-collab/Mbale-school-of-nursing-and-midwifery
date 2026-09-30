import Link from "next/link";
import { Briefcase, Mail, Users } from "lucide-react";
import { SCHOOL } from "@/lib/data";
import { marketingPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = marketingPageMetadata("/careers", {
  title: "Careers",
  description:
    "Teaching, clinical instruction, and support roles at Mbale School of Nursing and Midwifery — join our mission to train health professionals.",
});

const roleAreas = [
  {
    title: "Health tutors & clinical instructors",
    text: "Deliver classroom teaching, skills-lab supervision, and ward-based mentoring for nursing and midwifery students.",
    Icon: Users,
  },
  {
    title: "Administrative & student services",
    text: "Support admissions, registry, finance, and campus operations that keep programmes running smoothly.",
    Icon: Briefcase,
  },
  {
    title: "Partners & locum clinicians",
    text: "Contribute as visiting lecturers or clinical preceptors at partner hospitals and health centres.",
    Icon: Mail,
  },
];

export default function CareersPage() {
  return (
    <div>
      <PageBanner
        breadcrumb="Careers"
        title="Work at MBSNM"
        subtitle={`Join a Christian health training institution serving Eastern Uganda — ${SCHOOL.motto}.`}
        image="/images/events-staff.jpg"
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Opportunities"
            title="Build careers that heal communities"
            description="We hire qualified educators, clinicians, and support staff who share our values of competence, compassion, and integrity."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {roleAreas.map(({ title, text, Icon }) => (
              <div key={title} className="rounded-2xl border border-border bg-panel p-6 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-green-soft text-accent-green">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-primary">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-accent-green/30 bg-accent-green-soft/40 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-primary">How to apply</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Send a cover letter, CV, and copies of relevant certificates to{" "}
              <a href={`mailto:${SCHOOL.email}`} className="font-semibold text-primary hover:underline">
                {SCHOOL.email}
              </a>
              . Include the role you are interested in and your earliest availability. The registry will
              acknowledge receipt and contact shortlisted candidates.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`mailto:${SCHOOL.email}?subject=Career%20enquiry%20at%20MBSNM`} variant="green">
                Email your application
              </Button>
              <Button href="/contact" variant="ghost">
                General contact
              </Button>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted">
            Looking to train as a nurse or midwife instead? See{" "}
            <Link href="/admissions" className="font-semibold text-primary hover:underline">
              student admissions
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

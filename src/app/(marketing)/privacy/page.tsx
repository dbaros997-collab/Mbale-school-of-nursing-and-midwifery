import Link from "next/link";
import { SCHOOL } from "@/lib/data";
import { marketingPageMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = marketingPageMetadata("/privacy", {
  title: "Privacy Policy",
  description: `How ${SCHOOL.shortName} collects, uses, and protects personal information on this website and student portals.`,
});

const sections = [
  {
    title: "Information we collect",
    body: [
      "We collect information you provide when applying for admission, activating a student portal account, paying fees, or contacting the school through forms and email.",
      "This may include your name, contact details, academic records, payment references, and messages you send to admissions or registry staff.",
      "We also collect basic technical data such as browser type and pages visited to keep the site secure and improve performance.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "We use personal data to process applications, manage student records, verify payments, deliver portal services, and respond to enquiries.",
      "We may send service-related notices about admissions status, fee verification, or campus announcements. Marketing emails are sent only when you subscribe.",
      "We do not sell personal information to third parties.",
    ],
  },
  {
    title: "Sharing & retention",
    body: [
      "We share data with payment processors, hosting providers, and accreditation bodies only when necessary to operate services you request.",
      "Student and applicant records are retained according to institutional policy and applicable education regulations.",
      "You may request correction of inaccurate contact details by emailing the registry.",
    ],
  },
  {
    title: "Security & your choices",
    body: [
      "We apply access controls, encrypted connections, and staff authentication for admin and finance systems.",
      "Student portal passwords are stored using industry-standard hashing; never share your login credentials.",
      "For privacy questions or data requests, contact us using the details on the contact page.",
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageBanner
        breadcrumb="Legal"
        title="Privacy Policy"
        subtitle={`Last updated ${new Date().getFullYear()}. This policy applies to ${SCHOOL.name} public website and online services.`}
        image="/images/front-offices.jpg"
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Your privacy"
            title="How we handle personal data"
            description="We treat applicant and student information with care and use it only for legitimate school purposes."
          />

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-primary">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-border pt-8 text-sm text-muted">
            Questions about this policy?{" "}
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact {SCHOOL.shortName}
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

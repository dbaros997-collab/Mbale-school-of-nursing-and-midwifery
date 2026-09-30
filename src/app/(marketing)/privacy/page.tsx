import Link from "next/link";
import { SCHOOL } from "@/lib/data";
import {
  PRIVACY_POLICY_LAST_UPDATED,
  privacyPolicySections,
} from "@/lib/legal/privacy-policy";
import { marketingPageMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = marketingPageMetadata("/privacy", {
  title: "Privacy Policy",
  description: `How ${SCHOOL.shortName} collects, uses, and protects personal information under Ugandan data protection law.`,
});

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageBanner
        breadcrumb="Legal"
        title="Privacy Policy"
        subtitle={`Last updated ${PRIVACY_POLICY_LAST_UPDATED}. This policy applies to ${SCHOOL.name} public website, admissions, and online student services.`}
        image="/images/front-offices.jpg"
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Your privacy"
            title="Personal data at MBSNM"
            description="We follow the Data Protection and Privacy Act, 2019 (Uganda) and treat applicant, student, and staff information with care."
          />

          <p className="mt-8 rounded-xl border border-accent-green/30 bg-accent-green-soft/40 p-4 text-sm leading-relaxed text-muted">
            This policy explains what we collect, why we use it, who we share it with, how long we
            keep it, and the choices you have. When you submit a form on this website, you will be
            asked to confirm that you have read this policy and consent to processing as described.
          </p>

          <div className="mt-10 space-y-10">
            {privacyPolicySections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-primary">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-border pt-8 text-sm text-muted">
            Questions or data subject requests? Email{" "}
            <a href={`mailto:${SCHOOL.email}`} className="font-semibold text-primary hover:underline">
              {SCHOOL.email}
            </a>{" "}
            or{" "}
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              contact the registry
            </Link>
            . You may also contact the Personal Data Protection Office (PDPO), Uganda, if your
            concern is not resolved.
          </p>
        </div>
      </section>
    </div>
  );
}

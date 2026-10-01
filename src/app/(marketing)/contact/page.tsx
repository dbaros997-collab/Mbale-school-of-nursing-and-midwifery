"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import { SCHOOL, schoolWhatsAppUrl } from "@/lib/data";
import { CampusMapPanel } from "@/components/marketing/CampusMapPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { PrivacyConsentField } from "@/components/legal/PrivacyConsentField";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyConsent) {
      setConsentError("Please confirm you have read the Privacy Policy before sending your message.");
      return;
    }
    setConsentError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  }

  return (
    <div>
      <PageBanner
        breadcrumb="Get in Touch"
        title="Contact Information"
        subtitle={`Reach admissions, registry, or general enquiries — “${SCHOOL.motto}”.`}
        image="/images/front-offices.jpg"
      />

      <section
        className="border-b border-white/10 bg-primary-dark py-5 text-white sm:py-6"
        aria-label="Quick contact"
      >
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: MapPin, label: "Campus", value: SCHOOL.address },
            {
              icon: Phone,
              label: "Helpline",
              value: SCHOOL.phone,
              href: `tel:${SCHOOL.phone.replace(/\s/g, "")}`,
            },
            {
              icon: WhatsAppIcon,
              label: "WhatsApp",
              value: SCHOOL.whatsapp,
              href: schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`),
              external: true,
            },
            {
              icon: Mail,
              label: "Email",
              value: SCHOOL.email,
              href: `mailto:${SCHOOL.email}`,
            },
          ].map(({ icon: Icon, label, value, href, external }) => (
            <div key={label} className="flex gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-yellow">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">{label}</p>
                {href ? (
                  <a
                    href={href}
                    className="mt-0.5 block text-sm font-semibold leading-snug text-white hover:text-brand-yellow hover:underline"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm font-semibold leading-snug">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-surface py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Get in touch"
              title="Contact details"
              description="Prefer email, phone, or WhatsApp? Use the channels below or send a message through the form."
            />

            <div className="mt-6 rounded-2xl border border-accent-green/30 bg-accent-green-soft/40 p-5">
              <p className="text-sm font-bold text-primary">Staff admin login</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Registry and academic staff sign in through the Staff Admin panel on this website.
              </p>
              <Button href="/admin" variant="green" size="sm" className="mt-4">
                Staff Admin
              </Button>
            </div>

            <ul className="mt-8 space-y-4">
              {[
                { icon: MapPin, label: "Address", value: SCHOOL.address },
                { icon: Phone, label: "Helpline", value: SCHOOL.phone, href: `tel:${SCHOOL.phone.replace(/\s/g, "")}` },
                {
                  icon: WhatsAppIcon,
                  label: "WhatsApp",
                  value: SCHOOL.whatsapp,
                  href: schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`),
                  external: true,
                  accent: true,
                },
                { icon: Mail, label: "General email", value: SCHOOL.email, href: `mailto:${SCHOOL.email}` },
                {
                  icon: Mail,
                  label: "Admissions",
                  value: SCHOOL.admissionsEmail,
                  href: `mailto:${SCHOOL.admissionsEmail}`,
                },
              ].map(({ icon: Icon, label, value, href, external, accent }) => (
                <li key={label} className="flex gap-3 rounded-xl content-panel p-4">
                  <span
                    className={
                      accent
                        ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]"
                        : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-green-soft text-accent-green"
                    }
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="font-semibold text-primary hover:underline"
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-semibold text-primary">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3">
              <a
                href={SCHOOL.website}
                aria-label="Official website"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition hover:bg-accent-green focus-ring"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href={SCHOOL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition hover:bg-accent-green focus-ring"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href={schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1ebe57] focus-ring"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>

            <CampusMapPanel id="campus-map" className="mt-8" />
          </div>

          <div>
            <div className="rounded-2xl content-panel p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-primary">Send a message</h2>
              <p className="mt-1 text-sm text-muted">We typically respond within 1–2 business days.</p>

              {sent ? (
                <div className="mt-8 text-center" role="status">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-accent-green" aria-hidden />
                  <p className="mt-3 font-bold text-primary">Message sent</p>
                  <p className="mt-1 text-sm text-muted">Thank you for contacting Mbale School of Nursing and Midwifery. (Mock form)</p>
                  <Button className="mt-5" variant="ghost" onClick={() => setSent(false)}>
                    Send another
                  </Button>
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Full name</span>
                    <input required className={inputClass} name="name" autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Email</span>
                    <input required type="email" className={inputClass} name="email" autoComplete="email" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Subject</span>
                    <select required className={inputClass} name="subject" defaultValue="">
                      <option value="" disabled>
                        Select subject
                      </option>
                      <option>Admissions enquiry</option>
                      <option>Fees & finance</option>
                      <option>Accommodation</option>
                      <option>General enquiry</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Message</span>
                    <textarea required className={`${inputClass} min-h-[140px] resize-y`} name="message" />
                  </label>
                  <PrivacyConsentField
                    id="contact-form-privacy"
                    checked={privacyConsent}
                    onCheckedChange={(value) => {
                      setPrivacyConsent(value);
                      if (value) setConsentError(null);
                    }}
                    disabled={loading}
                  />
                  {consentError ? (
                    <p className="text-sm font-medium text-red-600" role="alert">
                      {consentError}
                    </p>
                  ) : null}
                  <Button type="submit" variant="green" disabled={loading || !privacyConsent}>
                    {loading ? "Sending…" : "Send message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-panel px-3 py-2.5 text-sm outline-none transition focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30";

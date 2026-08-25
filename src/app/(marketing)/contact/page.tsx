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
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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

      <section className="section-surface py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Get in touch"
              title="Contact details"
              description="Prefer email, phone, or WhatsApp? Use the channels below or send a message through the form."
            />

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
              <Link
                href="/"
                aria-label="Website"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition hover:bg-accent-green focus-ring"
              >
                <Globe className="h-4 w-4" />
              </Link>
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

            <div className="mt-8 overflow-hidden rounded-3xl content-panel">
              <div className="border-b border-border px-4 py-3">
                <h3 className="font-bold text-primary">Campus map</h3>
                <p className="text-xs text-muted">Map placeholder — embed Google Maps when coordinates are confirmed</p>
              </div>
              <div
                className="relative flex aspect-[16/10] items-center justify-center bg-[linear-gradient(135deg,#e8f7fc_0%,#f8fafc_50%,#e8f8ee_100%)]"
                role="img"
                aria-label="Map placeholder for Mbale School of Nursing and Midwifery campus location"
              >
                <div className="text-center">
                  <MapPin className="mx-auto h-10 w-10 text-primary" aria-hidden />
                  <p className="mt-2 font-semibold text-primary">{SCHOOL.address}</p>
                  <p className="mt-1 text-sm text-muted">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl content-panel p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-primary">Send a message</h2>
              <p className="mt-1 text-sm text-muted">We typically respond within 1–2 business days.</p>

              {sent ? (
                <div className="mt-8 text-center" role="status">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-accent-green" aria-hidden />
                  <p className="mt-3 font-bold text-primary">Message sent</p>
                  <p className="mt-1 text-sm text-muted">Thank you for contacting MBSNM. (Mock form)</p>
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
                  <Button type="submit" variant="green" disabled={loading}>
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

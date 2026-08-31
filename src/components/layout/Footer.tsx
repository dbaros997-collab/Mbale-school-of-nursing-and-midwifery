"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCHOOL, schoolWhatsAppUrl } from "@/lib/data";
import { footerSectionPhoto } from "@/lib/footer-section-bg";

const academicsLinks = [
  { label: "Why MBSNM", href: "/#about" },
  { label: "Certificate Programmes", href: "/academics#certificate-nursing" },
  { label: "Diploma Programmes", href: "/academics" },
  { label: "Admission Requirements", href: "/admissions" },
  { label: "How to Apply", href: "/admissions#apply" },
  { label: "Fees & Payments", href: "/admissions" },
  { label: "List of all Programmes", href: "/academics" },
];

const quickLinks = [
  { label: "Student Portal", href: "/portal/dashboard" },
  { label: "Gulu University Portal", href: "/university-portal" },
  { label: "News & Events", href: "/#events" },
  { label: "Campus News", href: "/#campus-news" },
  { label: "School Gallery", href: "/#gallery" },
  { label: "LMS Hub", href: "/portal/lms" },
  { label: "Contact", href: "/contact" },
  { label: "Staff", href: "/portal" },
];

const campusLinks = [
  { label: "About MBSNM", href: "/#about" },
  { label: "Vision & Mission", href: "/#vision-mission" },
  { label: "Clinical Training", href: "/contact" },
  { label: "Alumni", href: "/alumni" },
  { label: "Campus Life", href: "/#about" },
  { label: "School Gallery", href: "/#gallery" },
  { label: "Careers", href: "/admissions" },
  { label: "Emergency Numbers", href: "/contact" },
];

function FooterLinkCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-base font-bold text-white">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/80 transition hover:text-white hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


/** UCU-style lower section: yellow subscribe bar + four-column footer on foggy campus photo. */
export function Footer() {
  return (
    <div className="relative mt-auto">
      {/* Subscribe bar — overlaps footer like ucu.ac.ug */}
      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="ucu-subscribe-bar flex flex-col gap-5 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-10 sm:py-9">
          <h2 className="font-display text-2xl font-bold leading-tight text-brand-ink sm:text-[1.75rem]">
            Subscribe to get more information
          </h2>
          <form
            className="w-full sm:max-w-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <label
              htmlFor="footer-subscribe-email"
              className="block text-sm font-semibold text-brand-ink"
            >
              Email
            </label>
            <div className="mt-1.5 flex overflow-hidden rounded-sm border border-primary/30 bg-white shadow-sm">
              <input
                id="footer-subscribe-email"
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="min-w-0 flex-1 border-0 px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              />
              <button
                type="submit"
                className="shrink-0 border-l border-primary/30 bg-brand-yellow px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-yellow-dark focus-ring"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="relative overflow-hidden pt-16 text-white sm:pt-20">
        <div
          className="absolute inset-0 bg-cover bg-[center_35%] bg-no-repeat"
          style={{ backgroundImage: footerSectionPhoto() }}
          aria-hidden
        />
        <div className="footer-fog-overlay absolute inset-0" aria-hidden />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-4 sm:px-8 lg:grid-cols-4 lg:gap-8 lg:pb-14">
          {/* Brand + contact — UCU column 1 */}
          <div className="lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/footer-school-logo.png?v=2"
              alt={SCHOOL.name}
              width={100}
              height={100}
              className="h-auto w-[100px] max-w-[100px] rounded-lg sm:w-[115px] sm:max-w-[115px]"
              decoding="async"
            />
            <ul className="mt-6 space-y-2 text-sm leading-relaxed text-white/85">
              <li>{SCHOOL.address}</li>
              <li>{SCHOOL.postal}</li>
              <li>
                Telephone:{" "}
                <a
                  href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`}
                  className="hover:text-brand-sky hover:underline"
                >
                  {SCHOOL.phone}
                </a>
              </li>
              <li>
                Email Us:{" "}
                <a href={`mailto:${SCHOOL.email}`} className="hover:text-brand-sky hover:underline">
                  {SCHOOL.email}
                </a>
                {" / "}
                <a
                  href={`mailto:${SCHOOL.admissionsEmail}`}
                  className="hover:text-brand-sky hover:underline"
                >
                  {SCHOOL.admissionsEmail}
                </a>
              </li>
              <li>
                WhatsApp:{" "}
                <a
                  href={schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`)}
                  className="hover:text-brand-sky hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SCHOOL.whatsapp}
                </a>
              </li>
            </ul>
          </div>

          <FooterLinkCol title="Academics" links={academicsLinks} />
          <FooterLinkCol title="Quick Links" links={quickLinks} />
          <FooterLinkCol title="Our Campus" links={campusLinks} />
        </div>

        <div className="relative z-10 border-t border-white/25 bg-white/5 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-white/70 sm:flex-row sm:px-8">
            <p>
              Copyright ©{new Date().getFullYear()} {SCHOOL.name}. All rights reserved.
            </p>
            <Link href="/contact" className="hover:text-white hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Renders the footer on non-home marketing pages only. */
export function MarketingFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Footer />;
}

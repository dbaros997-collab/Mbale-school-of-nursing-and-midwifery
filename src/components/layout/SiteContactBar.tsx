"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SCHOOL, schoolWhatsAppUrl } from "@/lib/data";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";

const phoneHref = `tel:${SCHOOL.phone.replace(/\s/g, "")}`;
const whatsappHref = schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`);

const linkClass =
  "inline-flex items-center gap-1.5 rounded-sm font-bold text-primary-dark transition hover:text-brand-green focus-ring";

export function SiteContactBar() {
  return (
    <div
      className="site-contact-bar fixed inset-x-0 top-0 z-[75] flex h-[var(--site-contact-bar-height)] items-center border-b-2 border-brand-green bg-brand-yellow text-primary-dark shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
      role="region"
      aria-label="Contact information"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <p className="hidden min-w-0 flex-1 items-center gap-1.5 truncate text-xs font-semibold sm:flex sm:text-sm">
          <MapPin className="h-4 w-4 shrink-0 text-brand-green" aria-hidden />
          <span className="truncate">{SCHOOL.address}</span>
        </p>

        <p className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-primary-dark/80 sm:hidden">
          Call us
        </p>

        <ul className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-2.5 gap-y-0.5 text-xs sm:flex-none sm:gap-x-4 sm:text-sm md:text-[15px]">
          <li>
            <a href={phoneHref} className={linkClass}>
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <span>{SCHOOL.phone}</span>
            </a>
          </li>
          <li>
            <a
              href={whatsappHref}
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${SCHOOL.whatsapp}`}
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#128C7E]" />
              <span className="hidden min-[420px]:inline">WhatsApp</span>
            </a>
          </li>
          <li className="hidden min-[480px]:list-item">
            <a href={`mailto:${SCHOOL.email}`} className={linkClass}>
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden md:inline">{SCHOOL.email}</span>
              <span className="md:hidden">Email</span>
            </a>
          </li>
          <li>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-primary-dark focus-ring sm:px-3 sm:text-xs md:text-sm"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

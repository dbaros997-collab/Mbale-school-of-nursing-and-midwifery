"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { SCHOOL, schoolWhatsAppUrl } from "@/lib/data";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";

const phoneHref = `tel:${SCHOOL.phone.replace(/\s/g, "")}`;
const whatsappHref = schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`);

const linkClass =
  "inline-flex items-center gap-1.5 rounded-sm font-semibold text-white/95 transition hover:text-brand-yellow focus-ring";

export function SiteContactBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      className={cn(
        "site-contact-bar fixed inset-x-0 top-0 z-[75] flex h-[var(--site-contact-bar-height)] items-center border-b border-white/10 text-white",
        isHome
          ? "site-contact-bar--glass"
          : "bg-primary-dark shadow-[0_2px_10px_rgba(14,36,86,0.35)]",
      )}
      role="region"
      aria-label="Contact information"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-3 px-3 sm:px-6 lg:px-8">
        <p className="hidden min-w-0 flex-1 items-center gap-1.5 truncate text-xs text-white/85 lg:flex">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-yellow" aria-hidden />
          <span className="truncate">{SCHOOL.address}</span>
        </p>

        <ul className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-0.5 text-[11px] sm:flex-none sm:gap-x-4 sm:text-xs md:text-sm">
          <li>
            <a href={phoneHref} className={linkClass}>
              <Phone className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
              <span>{SCHOOL.phone}</span>
            </a>
          </li>
          <li>
            <a
              href={whatsappHref}
              className={cn(linkClass, "text-[#25D366] hover:text-[#20bd5a]")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${SCHOOL.whatsapp}`}
            >
              <WhatsAppIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </li>
          <li className="hidden md:list-item">
            <a href={`mailto:${SCHOOL.email}`} className={linkClass}>
              <Mail className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
              <span>{SCHOOL.email}</span>
            </a>
          </li>
          <li>
            <Link href="/contact" className={cn(linkClass, "text-brand-yellow hover:text-white")}>
              Contact us
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

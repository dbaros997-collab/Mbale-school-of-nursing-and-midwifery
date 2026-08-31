"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCHOOL, schoolWhatsAppUrl } from "@/lib/data";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.58A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.84.58 9.38.58 9.38.58s7.54 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

const socials = [
  { label: "YouTube", href: SCHOOL.youtube, Icon: YouTubeIcon },
  {
    label: "WhatsApp",
    href: schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`),
    Icon: WhatsAppIcon,
  },
];

/** ISBAT-style solid black footer: logo + socials | contact | campus. */
export function Footer() {
  return (
    <footer className="relative mt-auto bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-3 lg:gap-12 lg:py-14">
        {/* Brand */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-lockup-on-dark.svg"
            alt={SCHOOL.name}
            className="h-auto w-full max-w-[280px]"
            decoding="async"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            {SCHOOL.registration} {SCHOOL.motto}.
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-4">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex text-white/80 transition hover:text-white focus-ring"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-white/55">
            <Link href="/contact" className="underline underline-offset-2 hover:text-white">
              Privacy Policy
            </Link>
            <span aria-hidden className="mx-2">
              |
            </span>
            <Link href="/contact" className="underline underline-offset-2 hover:text-white">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="font-display text-xl font-semibold sm:text-2xl">Contact Us</h3>
          <address className="mt-5 space-y-4 text-sm not-italic leading-relaxed text-white/65">
            <p>
              {SCHOOL.name}
              <br />
              {SCHOOL.address}
              <br />
              {SCHOOL.postal}
            </p>
            <p>
              Tel:{" "}
              <a
                href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`}
                className="text-white/80 hover:text-white hover:underline"
              >
                {SCHOOL.phone}
              </a>
            </p>
            <p>
              WhatsApp:{" "}
              <a
                href={schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`)}
                className="text-white/80 hover:text-white hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {SCHOOL.whatsapp}
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href={`mailto:${SCHOOL.email}`}
                className="text-white/80 hover:text-white hover:underline"
              >
                {SCHOOL.email}
              </a>
            </p>
          </address>
        </div>

        {/* Campus & training */}
        <div>
          <h3 className="font-display text-xl font-semibold sm:text-2xl">Campus</h3>
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            {SCHOOL.address}
            <br />
            {SCHOOL.postal}
          </p>
          <h3 className="mt-8 font-display text-xl font-semibold sm:text-2xl">Clinical Training</h3>
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            Partner hospitals and community health sites across Eastern Uganda, including Mbale
            Referral Hospital.
          </p>
        </div>
      </div>

      <div className="border-t border-white/15">
        <p className="px-6 py-5 text-center text-sm text-white/55 sm:px-8">
          Copyright © {new Date().getFullYear()} {SCHOOL.name}
        </p>
      </div>
    </footer>
  );
}

/** Renders the footer on non-home marketing pages only. */
export function MarketingFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Footer />;
}

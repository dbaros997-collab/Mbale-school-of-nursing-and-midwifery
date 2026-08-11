"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { SCHOOL } from "@/lib/data";

const engagements = [
  { label: "Alumni Voices", href: "/#voices" },
  { label: "Community Health", href: "/#about" },
  { label: "Clinical Partners", href: "/#spotlight" },
  { label: "Vision & Mission", href: "/#vision-mission" },
];

const otherLinks = [
  { label: "Jobs & Careers", href: "/admissions" },
  { label: "Campus News", href: "/#campus-news" },
  { label: "Upcoming Events", href: "/#events" },
  { label: "Graduation", href: "/#spotlight" },
  { label: "Accreditation", href: "/contact" },
];

const importantLinks = [
  { label: "News & Events", href: "/#events" },
  { label: "Student Portal", href: "/portal" },
  { label: "Campus Life @ MBSNM", href: "/#about" },
  { label: "How to Apply", href: "/admissions" },
  { label: "Programmes", href: "/academics" },
];

type IconProps = { className?: string };

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.924L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0-2.16C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.69 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.58A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.84.58 9.38.58 9.38.58s7.54 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

const socials = [
  { label: "Facebook", href: SCHOOL.website, Icon: FacebookIcon },
  { label: "X", href: SCHOOL.website, Icon: XIcon },
  { label: "LinkedIn", href: SCHOOL.website, Icon: LinkedInIcon },
  { label: "Instagram", href: SCHOOL.website, Icon: InstagramIcon },
  { label: "YouTube", href: SCHOOL.website, Icon: YouTubeIcon },
];

export function Footer() {
  return (
    <footer className="kiu-footer relative mt-auto text-white">
      <div className="kiu-footer-rule" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          {/* Newsletters + Follow Us */}
          <div
            className="rounded-xl bg-[#001a33]/65 p-5 sm:p-6"
            role="region"
            aria-label="Newsletters"
          >
            <h2 className="text-xl font-bold uppercase tracking-wide sm:text-2xl">
              Newsletters
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Subscribe to our newsletters and stay up to date with the latest news and
              activities at {SCHOOL.shortName}.
            </p>
            <form
              className="mt-5 flex overflow-hidden rounded-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="sr-only" htmlFor="footer-newsletter-email">
                Email Address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                required
                placeholder="Email Address"
                className="min-w-0 flex-1 border-0 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-cyan"
              />
              <button
                type="submit"
                className="shrink-0 bg-primary-light px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0c5a94] focus-ring"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider">Follow Us</h3>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-cyan text-primary-dark transition hover:bg-sky-300 focus-ring"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact + link columns */}
          <div className="min-w-0">
            <h3 className="text-xl font-bold sm:text-2xl">Contact Us</h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <ContactItem
                Icon={MapPin}
                title="Campus"
                href="/contact"
                body={`${SCHOOL.name}, ${SCHOOL.postal}. Visit us @ ${SCHOOL.address}`}
              />
              <ContactItem
                Icon={MapPin}
                title="Clinical Training"
                href="/contact"
                body="Partner hospitals and community health sites across Eastern Uganda."
              />
              <ContactItem
                Icon={Phone}
                title="Phone"
                href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`}
                body={SCHOOL.phone}
              />
              <ContactItem
                Icon={Mail}
                title="Email Address"
                href={`mailto:${SCHOOL.email}`}
                body={SCHOOL.email}
              />
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              <FooterCol title="Engagements" links={engagements} />
              <FooterCol title="Other Links" links={otherLinks} />
              <FooterCol title="Important Links" links={importantLinks} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 bg-black/25">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © Copyright {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-x-1 gap-y-1" aria-label="Footer legal">
            <Link href="/contact" className="hover:text-white">
              Policies
            </Link>
            <span aria-hidden className="px-1 text-white/40">
              |
            </span>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <span aria-hidden className="px-1 text-white/40">
              |
            </span>
            <Link href="/portal" className="hover:text-white">
              Staff
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({
  Icon,
  title,
  body,
  href,
}: {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a href={href} className="group flex gap-3">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-cyan text-primary-dark">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-white group-hover:underline">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-white/75 group-hover:text-white">
          {body}
        </span>
      </span>
    </a>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-white">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-white/75 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { SCHOOL, schoolWhatsAppUrl } from "@/lib/data";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { cn } from "@/lib/utils";

const engagements = [
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
  { label: "Student Portal", href: "/portal/dashboard" },
  { label: "Gulu University Portal", href: "/university-portal" },
  { label: "Campus Life @ MBSNM", href: "/#about" },
  { label: "How to Apply", href: "/admissions" },
  { label: "Programmes", href: "/academics" },
];

type IconProps = { className?: string };

function YouTubeIcon({ className }: IconProps) {
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

type FooterProps = {
  /** When true, sit on the campus watermark (no solid blue fill). */
  onWallpaper?: boolean;
};

export function Footer({ onWallpaper = false }: FooterProps) {
  return (
    <footer
      className={cn(
        "relative mt-auto text-white",
        onWallpaper ? "bg-transparent" : "kiu-footer",
      )}
    >
      <div className="kiu-footer-rule" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <div
            className={cn(
              "rounded-xl p-5 sm:p-6",
              onWallpaper ? "border border-white/15 bg-black/25 backdrop-blur-[2px]" : "bg-[#0e2456]/65",
            )}
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
                className="min-w-0 flex-1 border-0 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-sky"
              />
              <button
                type="submit"
                className="shrink-0 bg-brand-green px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-green-dark focus-ring"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider">Follow Us</h3>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {socials.map(({ label, href, Icon }, index) => {
                  const tones = [
                    "bg-brand-sky text-primary hover:bg-sky-300",
                    "bg-brand-green text-white hover:bg-brand-green-dark",
                    "bg-brand-yellow text-primary hover:bg-brand-yellow-dark",
                  ];
                  return (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-full transition focus-ring",
                        tones[index % tones.length],
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                  );
                })}
              </ul>
            </div>
          </div>

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
                Icon={WhatsAppIcon}
                title="WhatsApp"
                href={schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`)}
                body={SCHOOL.whatsapp}
                external
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

      <div
        className={cn(
          "border-t border-white/15",
          onWallpaper ? "bg-black/20" : "bg-black/25",
        )}
      >
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

/** Renders the solid footer on non-home marketing pages only. */
export function MarketingFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Footer />;
}

function ContactItem({
  Icon,
  title,
  body,
  href,
  external,
}: {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className="group flex gap-3"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-sky text-primary">
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

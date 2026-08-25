import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CreditCard,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  LogIn,
  User,
} from "lucide-react";
import { GULU_UNIVERSITY, SCHOOL } from "@/lib/data";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const serviceIcons = [BookOpen, CreditCard, FileText, GraduationCap, CalendarDays, User] as const;

const portalLinks = [
  {
    label: "Student Portal (Sign In)",
    href: GULU_UNIVERSITY.studentPortal,
    description: "Login to your GU account — registration, fees, results, and more.",
    primary: true,
  },
  {
    label: "Gulu University Website",
    href: GULU_UNIVERSITY.website,
    description: "Official news, admission lists, academic calendar, and notices.",
  },
  {
    label: "Online Application Portal",
    href: GULU_UNIVERSITY.applicationPortal,
    description: "Apply for GU programmes through the ACMIS application system.",
  },
  {
    label: "DICTS Helpdesk",
    href: GULU_UNIVERSITY.helpdesk,
    description: "Portal setup, password reset, and IT support for GU students.",
  },
] as const;

export default function UniversityPortalPage() {
  return (
    <div>
      <PageBanner
        breadcrumb="University Resources"
        title="Gulu University Student Portal"
        subtitle={`Access the official ${GULU_UNIVERSITY.shortName} HEMIS portal for registration, fees, results, and academic services.`}
        image="/images/computer-lab.jpg"
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow={GULU_UNIVERSITY.shortName}
                title="About Gulu University"
                description={GULU_UNIVERSITY.about}
              />
              <p className="mt-4 text-sm leading-relaxed text-muted">{GULU_UNIVERSITY.portalIntro}</p>
              <p className="mt-3 text-xs text-muted">
                Powered by {GULU_UNIVERSITY.poweredBy} · Motto: &ldquo;{GULU_UNIVERSITY.motto}&rdquo;
              </p>
            </div>

            <aside className="rounded-2xl border border-border bg-primary-dark p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-brand-sky">
                <LogIn className="h-5 w-5" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-wider">Quick access</p>
              </div>
              <h2 className="mt-2 text-xl font-extrabold">Login to your account</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                Use your Gulu University credentials at the official student portal.
              </p>
              <a
                href={GULU_UNIVERSITY.studentPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 py-3 text-sm font-bold text-primary-dark transition hover:bg-brand-yellow-dark focus-ring"
              >
                Sign in at myportal.gu.ac.ug
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
              <p className="mt-4 text-xs text-white/70">
                Forgot your password? Use the reset link on the sign-in page — an OTP is sent to your
                registered email.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-sky py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Portal services"
            title="What you can do on the GU portal"
            description="The HEMIS student portal centralises key academic actions for enrolled Gulu University students."
            align="center"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GULU_UNIVERSITY.portalServices.map(({ title, detail }, i) => {
              const Icon = serviceIcons[i % serviceIcons.length];
              const chips = ["accent-chip-green", "accent-chip-sky", "accent-chip-gold"] as const;
              return (
                <article key={title} className="rounded-2xl content-panel p-5">
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                      chips[i % chips.length],
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-bold text-primary">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Getting started"
                title="How to sign in"
                description="Follow these steps to access your Gulu University student account."
              />
              <ol className="mt-6 space-y-3">
                {GULU_UNIVERSITY.signInSteps.map((step, i) => (
                  <li key={step} className="flex gap-3 rounded-xl content-panel p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-green-soft text-sm font-bold text-accent-green">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <SectionHeading
                eyebrow="Important links"
                title="Official GU websites"
                description="Bookmark these pages for applications, support, and university announcements."
              />
              <ul className="mt-6 space-y-3">
                {portalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-start justify-between gap-3 rounded-xl border p-4 transition focus-ring",
                        "primary" in link && link.primary
                          ? "border-accent-green/30 bg-accent-green-soft/40 hover:border-accent-green"
                          : "border-border content-panel hover:border-accent-cyan/40",
                      )}
                    >
                      <span>
                        <span className="font-semibold text-primary group-hover:underline">{link.label}</span>
                        <span className="mt-1 block text-sm text-muted">{link.description}</span>
                      </span>
                      <ArrowUpRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent-green opacity-70 group-hover:opacity-100"
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-green py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl content-panel p-6">
              <div className="flex items-center gap-2 text-accent-green">
                <GraduationCap className="h-5 w-5" aria-hidden />
                <h3 className="font-bold text-primary">Admission information</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{GULU_UNIVERSITY.admissionNote}</p>
            </article>
            <article className="rounded-2xl content-panel p-6">
              <div className="flex items-center gap-2 text-accent-green">
                <HelpCircle className="h-5 w-5" aria-hidden />
                <h3 className="font-bold text-primary">Freshers & new students</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{GULU_UNIVERSITY.freshersGuide}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-primary-dark py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emphasis-gold">
              {SCHOOL.shortName} students
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Need help with MBSNM services?</h2>
            <p className="mt-2 max-w-xl leading-body text-white/90">
              For {SCHOOL.shortName} fees, registration, and campus notices, use the MBSNM student portal.
              This page is for Gulu University&apos;s official HEMIS system.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/portal/dashboard" variant="green">
              Open MBSNM Portal
            </Button>
            <Link
              href="/contact"
              className="btn-pill inline-flex items-center justify-center rounded-full border border-white/50 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-ring"
            >
              Contact {SCHOOL.shortName}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, HeartHandshake, Newspaper, Mail } from "lucide-react";
import { SCHOOL } from "@/lib/data";
import { cn } from "@/lib/utils";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const highlights = [
  {
    title: "Stay connected",
    text: "Share your workplace, postgraduate studies, or community health work so we can celebrate alumni impact.",
    Icon: HeartHandshake,
  },
  {
    title: "Campus news",
    text: "Follow graduations, intake announcements, and school updates from Mbale.",
    Icon: Newspaper,
  },
  {
    title: "Mentor the next class",
    text: "Support current students through encouragement, clinical tips, and career guidance.",
    Icon: GraduationCap,
  },
];

export default function AlumniPage() {
  return (
    <div>
      <PageBanner
        breadcrumb="Alumni"
        title="Alumni Network"
        subtitle={`Graduates of ${SCHOOL.shortName} — with God we love and serve in clinics, hospitals, and communities.`}
        image="/images/graduation-day.jpg"
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Welcome back"
                title="Your journey continues beyond graduation"
                description="MBSNM alumni serve across Uganda and beyond. This page is your home for updates, reconnection, and ways to support the next generation of nurses and midwives."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/contact" variant="green">
                  Update your details
                </Button>
                <Button href="/#campus-news" variant="ghost">
                  Read campus news
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/graduates.jpg"
                alt="MBSNM graduates"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-green py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Alumni life"
            title="Ways to engage with MBSNM"
            description="Whether you graduated last year or a decade ago, there is a place for you in the network."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {highlights.map(({ title, text, Icon }, i) => {
              const iconChip = ["accent-chip-green", "accent-chip-sky", "accent-chip-gold"][i % 3];
              return (
              <article
                key={title}
                className="rounded-2xl content-panel p-6"
              >
                <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", iconChip)}>
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary-dark py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emphasis-gold">
              Alumni desk
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              Ready to reconnect?
            </h2>
            <p className="mt-2 max-w-xl leading-body text-white/90">
              Email admissions or the school office with your graduation year and current role.
              We would love to hear from you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${SCHOOL.email}?subject=Alumni%20update`}
              className="btn-pill inline-flex items-center gap-2 rounded-full bg-brand-yellow px-5 py-3 text-sm font-bold text-primary-dark transition hover:bg-brand-yellow-dark focus-ring"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email alumni desk
            </a>
            <Link
              href="/contact"
              className="btn-pill inline-flex items-center justify-center rounded-full border border-white/50 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-ring"
            >
              Contact page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

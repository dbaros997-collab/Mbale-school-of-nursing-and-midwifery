import Image from "next/image";
import { Baby, HeartHandshake, Sparkles } from "lucide-react";
import { headOfMidwifery, SCHOOL } from "@/lib/data";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata = marketingPageMetadata("/academics/midwifery", {
  title: "Head of Midwifery",
  description:
    "Message from the Head of Midwifery at Mbale School of Nursing and Midwifery — training compassionate midwives for Uganda.",
});

function MessageList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function HeadOfMidwiferyPage() {
  const { head, title, intro, toStudents, toQualified, inspireBy, conclusion } = headOfMidwifery;

  return (
    <div>
      <PageBanner
        breadcrumb="Midwifery at MBSNM"
        title="Head of Midwifery"
        subtitle={intro}
        image="/images/programs/diploma-midwifery-direct.jpg"
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[320px_1fr]">
            <article className="overflow-hidden rounded-3xl content-panel lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] bg-surface">
                <Image
                  src={head.image}
                  alt={`${head.name}, ${title} at MBSNM`}
                  fill
                  unoptimized
                  className="object-cover object-top"
                  sizes="320px"
                />
              </div>
              <div className="p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-accent-green">{title}</p>
                <h2 className="mt-2 text-xl font-extrabold text-primary">{head.name}</h2>
              </div>
            </article>

            <div className="space-y-10">
              <div>
                <SectionHeading
                  eyebrow="To student midwives"
                  title="Training with courage and compassion"
                  description="Guidance for midwifery students beginning their journey at MBSNM."
                />
                <MessageList items={toStudents} />
              </div>

              <div className="rounded-3xl content-panel p-6 sm:p-8">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl accent-chip-sky">
                  <Baby className="h-6 w-6" aria-hidden />
                </span>
                <SectionHeading
                  eyebrow="To qualified midwives"
                  title="Pillars of life in every community"
                  description="A message to practising midwives on service, integrity, and emotional support."
                  className="mt-4"
                />
                <MessageList items={toQualified} />
              </div>

              <div>
                <SectionHeading
                  eyebrow="Inspire others"
                  title="Lead by calm, skilled example"
                  description="How midwives can reassure families and transform difficult moments."
                />
                <MessageList items={inspireBy} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-green py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Conclusion"
                title="Keep growing — knowledge is not static"
                description={conclusion[0]}
              />
              <Callout className="mt-6">
                <div className="flex gap-3">
                  <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <p className="text-sm leading-relaxed text-foreground">{conclusion[1]}</p>
                </div>
              </Callout>
              <p className="mt-6 text-sm font-semibold text-primary">
                — {head.name}, {title}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/academics#diploma-midwifery-direct" variant="green">
                  Midwifery programmes
                </Button>
                <Button href="/admissions" variant="ghost">
                  Apply now
                </Button>
              </div>
            </div>
            <article className="rounded-3xl content-panel p-6 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl accent-chip-gold">
                <Sparkles className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold text-primary">Study midwifery at {SCHOOL.shortName}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Certificate and diploma pathways in midwifery prepare you for safe motherhood, skilled
                attendance at birth, and compassionate care across Eastern Uganda.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

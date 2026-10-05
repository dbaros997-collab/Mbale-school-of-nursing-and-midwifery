import Image from "next/image";
import { coreValues, SCHOOL } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Bust browser cache when a new build deploys. */
const ABOUT_ASSET_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "about-campus-v3";

export function AboutBand() {
  return (
    <section id="about" className="scroll-mt-24 bg-primary-dark py-14 text-white sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emphasis-gold">About Mbale School of Nursing and Midwifery</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Our story</h2>
          <p className="mt-4 leading-body text-white/90">{SCHOOL.aboutStory}</p>
          <h3 className="mt-6 text-lg font-bold text-white">Where we are — and how our campus looks</h3>
          <p className="mt-2 leading-body text-white/90">{SCHOOL.aboutCampusLocation}</p>
          <p className="mt-2 text-sm text-brand-sky">{SCHOOL.address}</p>
          <blockquote className="pull-quote mt-4 border-l-2 border-brand-yellow pl-4 text-lg font-semibold text-white">
            &ldquo;{SCHOOL.motto}&rdquo;
          </blockquote>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {coreValues.map((value, i) => {
              const tints = [
                "border-brand-green/35 bg-brand-green/15",
                "border-brand-sky/35 bg-brand-sky/15",
                "border-brand-yellow/40 bg-brand-yellow/15",
                "border-white/20 bg-white/10",
              ] as const;
              return (
              <li
                key={value.title}
                className={cn("rounded-lg border p-3", tints[i % tints.length])}
              >
                <p className="font-semibold">{value.title}</p>
                <p className="mt-1 text-xs leading-body text-brand-sky">{value.description}</p>
              </li>
              );
            })}
          </ul>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <figure className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
              <Image
                src={`${SCHOOL.aboutCampusOriginPhoto}?v=${ABOUT_ASSET_VERSION}`}
                alt={`${SCHOOL.shortName} campus building and front offices in Malere, Mbale`}
                fill
                unoptimized
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 50vw, 480px"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {SCHOOL.aboutCampusOriginCaption}
            </figcaption>
          </figure>
          <figure className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
              <Image
                src={`${SCHOOL.aboutCampusPhoto}?v=${ABOUT_ASSET_VERSION}`}
                alt={`Nursing and midwifery students and staff in front of the ${SCHOOL.shortName} campus building in Malere, Mbale`}
                fill
                unoptimized
                className="object-cover object-[center_35%]"
                sizes="(max-width: 1024px) 50vw, 480px"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {SCHOOL.aboutCampusPhotoCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

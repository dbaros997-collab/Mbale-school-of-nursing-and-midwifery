import Image from "next/image";
import { coreValues, SCHOOL } from "@/lib/data";
import { cn } from "@/lib/utils";

export function AboutBand() {
  return (
    <section id="about" className="scroll-mt-24 py-14 text-white sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="rounded-2xl border border-white/15 bg-primary-dark/55 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emphasis-gold">About MBSNM</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Our story</h2>
          <p className="mt-4 leading-body text-white/90">{SCHOOL.aboutStory}</p>
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
          <Image
            src="/images/front-offices.jpg"
            alt="Front offices at Mbale School of Nursing and Midwifery"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}

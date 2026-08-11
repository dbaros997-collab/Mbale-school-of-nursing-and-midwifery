import Image from "next/image";
import { coreValues, SCHOOL } from "@/lib/data";

export function AboutBand() {
  return (
    <section id="about" className="scroll-mt-24 py-14 text-white sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="rounded-2xl border border-white/15 bg-primary-dark/55 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-gold">About MBSNM</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Humble beginnings</h2>
          <p className="mt-4 text-white/85 leading-relaxed">
            {SCHOOL.name} was started by Christians of {SCHOOL.foundedBy} after realizing the need of
            providing healthcare services to the community — especially the poor, the young and the
            elderly — through community health services.
          </p>
          <p className="mt-3 text-lg font-medium text-accent-gold">“{SCHOOL.motto}”</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {coreValues.map((value) => (
              <li key={value.title} className="rounded-lg bg-white/10 p-3">
                <p className="font-semibold">{value.title}</p>
                <p className="mt-1 text-xs text-white/75">{value.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
          <Image
            src="/images/admin-block.jpg"
            alt="Administration block at Mable School of Nursing and Midwifery"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}

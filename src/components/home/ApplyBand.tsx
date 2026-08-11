import Image from "next/image";
import Link from "next/link";
import { SCHOOL } from "@/lib/data";

/**
 * KIU-style admissions CTA band that sits above the footer.
 */
export function ApplyBand() {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="apply-band-heading"
    >
      <div className="relative mx-3 mb-0 overflow-hidden rounded-2xl sm:mx-4 lg:mx-5">
        <div className="absolute inset-0">
          <Image
            src="/images/computer-lab.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary-light/85"
          />
        </div>

        <div className="relative grid gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:px-12 lg:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
              — Your journey starts here
            </p>
            <h2
              id="apply-band-heading"
              className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl lg:text-[2.5rem]"
            >
              Choose your programme. Join {SCHOOL.shortName}.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Applications are open for the July 2026 intake across certificate and diploma
              programmes in nursing and midwifery.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["July Intake", "Nursing", "Midwifery"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-stretch">
            <Link
              href="/admissions#apply"
              className="inline-flex items-center justify-center rounded-md bg-accent-gold px-6 py-3 text-sm font-bold text-primary-dark transition hover:bg-yellow-400 focus-ring"
            >
              Apply Online
            </Link>
            <Link
              href="/academics"
              className="inline-flex items-center justify-center rounded-md border border-white/70 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-ring"
            >
              View Programmes
            </Link>
            <p className="text-xs text-white/75">
              Admissions support:{" "}
              <a
                href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`}
                className="font-semibold text-white hover:underline"
              >
                {SCHOOL.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

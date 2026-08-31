import Link from "next/link";
import { openIntakesLabel, SCHOOL } from "@/lib/data";

/** YouTube video from the ENTRY REQUIREMENTS area on mbsnm.org/services/ */
const CAMPUS_VIDEO_ID = "L0XIzMuBm5g";

/**
 * UCU-style Apply for Admission content.
 * Renders on the shared campus watermark (no own background) so it moves with it.
 */
export function ApplyBand() {
  return (
    <section
      id="apply-admission"
      className="relative scroll-mt-24 py-10 sm:py-12 lg:py-14"
      aria-labelledby="apply-band-heading"
    >
      <div className="relative z-10 mx-auto grid max-w-[1290px] gap-3 px-3 sm:px-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-6">
        {/* Left column — semi-transparent panel */}
        <div className="flex flex-col justify-center rounded-xl border border-white/20 bg-black/20 px-6 py-12 backdrop-blur-[2px] sm:px-10 sm:py-14 lg:px-12 lg:py-16">
          <p className="font-sans text-[13px] font-medium uppercase tracking-[0.25em] text-brand-sky sm:text-sm md:text-[23px] md:tracking-[0.2em]">
            Apply for Admission
          </p>
          <h2
            id="apply-band-heading"
            className="mt-3 font-display text-[40px] font-black leading-none text-white sm:text-[50px] lg:text-[58px]"
          >
            Applications for the {openIntakesLabel(" & ")} Intakes are now open
          </h2>
          <p className="mt-5 max-w-[85%] font-sans text-[13px] font-normal leading-relaxed text-white sm:text-sm md:text-[19px]">
            Choose your programme, gather your documents, and apply online. We will walk you through
            each step — In God We Love and Serve.
          </p>
          <div className="mt-8">
            <Link
              href="/admissions#apply"
              className="btn-pill inline-flex w-full items-center justify-center rounded-full bg-brand-green px-8 py-5 text-[13px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-brand-yellow hover:text-primary focus-ring sm:w-auto sm:min-w-[10.5rem] sm:text-sm"
            >
              Apply Now
            </Link>
          </div>
        </div>

        {/* Right column — video panel */}
        <div className="mt-3 flex flex-col justify-center rounded-xl border border-white/20 bg-black/20 px-6 py-10 backdrop-blur-[2px] sm:mt-0 sm:px-8 lg:px-10 lg:py-16">
          <h3 className="font-display text-[23px] font-black leading-none text-white sm:text-2xl">
            <a
              href={`https://youtu.be/${CAMPUS_VIDEO_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-brand-yellow focus-ring"
            >
              A Glimpse of {SCHOOL.shortName}
            </a>
          </h3>
          <div className="mt-4 w-full overflow-hidden rounded-2xl">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${CAMPUS_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${CAMPUS_VIDEO_ID}&controls=1&rel=0&playsinline=1`}
                title={`A Glimpse of ${SCHOOL.shortName}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

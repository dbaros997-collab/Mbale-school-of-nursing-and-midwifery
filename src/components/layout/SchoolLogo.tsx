import { cn } from "@/lib/utils";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Kept for call sites; official PNG lockup renders on all surfaces. */
  surface?: "dark" | "light";
};

const LOCKUP = {
  src: "/images/logo-lockup.png",
  /** Native PNG — horizontal lockup sits in the top band; empty space below is cropped. */
  width: 920,
  height: 1010,
  cropHeight: 400,
} as const;

const LOCKUP_ASPECT = `${LOCKUP.width}/${LOCKUP.cropHeight}`;

/** Baked at build time — busts browser cache when a new image deploys. */
const LOGO_CACHE_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "png-lockup";

/** Official MBSNM horizontal lockup — crest + wordmark. */
export function SchoolLogo({
  className,
  variant = "header",
}: SchoolLogoProps) {
  const compact = variant === "compact";
  const src = `${LOCKUP.src}?v=${LOGO_CACHE_VERSION}`;

  return (
    <span
      className={cn(
        "inline-block shrink-0 overflow-hidden",
        compact
          ? "w-[240px] sm:w-[280px]"
          : "w-[min(92vw,320px)] sm:w-[400px] md:w-[460px] lg:w-[520px]",
        className,
      )}
      style={{ aspectRatio: LOCKUP_ASPECT }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Mbale School of Nursing and Midwifery"
        width={LOCKUP.width}
        height={LOCKUP.height}
        className="h-full w-full object-cover object-left-top"
        decoding="async"
      />
    </span>
  );
}

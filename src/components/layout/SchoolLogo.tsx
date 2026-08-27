import { cn } from "@/lib/utils";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Kept for call sites; official PNG lockup renders on all surfaces. */
  surface?: "dark" | "light";
};

const LOCKUP = {
  src: "/images/logo-lockup.png",
  width: 920,
  height: 1010,
  /** Visible artwork band within the PNG (measured from the asset). */
  artWidthRatio: 0.9,
  artHeightRatio: 0.36,
} as const;

/** Crop frame aspect — maps display box to the lockup, not the full square PNG. */
const LOCKUP_ASPECT = `${1000}/${Math.round(
  ((1000 * LOCKUP.height) / LOCKUP.width) *
    (LOCKUP.artHeightRatio / LOCKUP.artWidthRatio),
)}`;

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
  const imgWidthPct = `${(100 / LOCKUP.artWidthRatio).toFixed(3)}%`;

  return (
    <span
      className={cn(
        "inline-block shrink-0 overflow-hidden",
        compact
          ? "w-[220px] sm:w-[260px]"
          : "w-[min(88vw,280px)] sm:w-[360px] md:w-[420px] lg:w-[480px]",
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
        className="block h-auto max-w-none object-left-top"
        style={{ width: imgWidthPct }}
        decoding="async"
      />
    </span>
  );
}

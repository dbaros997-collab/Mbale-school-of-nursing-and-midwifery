import { cn } from "@/lib/utils";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Kept for call sites; SVG lockup on all surfaces. */
  surface?: "dark" | "light";
};

const LOCKUP = {
  /** Transparent horizontal lockup — correct aspect ratio, no white matte. */
  src: "/images/logo-lockup.svg",
  width: 1200,
  height: 300,
} as const;

/** Baked at build time — busts browser cache when a new image deploys. */
const LOGO_CACHE_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "svg-lockup";

/** Official MBSNM horizontal lockup — crest + wordmark. */
export function SchoolLogo({
  className,
  variant = "header",
}: SchoolLogoProps) {
  const compact = variant === "compact";
  const src = `${LOCKUP.src}?v=${LOGO_CACHE_VERSION}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Mbale School of Nursing and Midwifery"
      width={compact ? 320 : LOCKUP.width}
      height={compact ? 80 : LOCKUP.height}
      className={cn(
        "block h-auto w-auto shrink-0 object-contain object-left",
        compact
          ? "h-[52px] w-auto max-w-[240px] sm:h-[56px] sm:max-w-[280px]"
          : "h-[56px] w-auto max-w-[min(88vw,300px)] sm:h-[64px] sm:max-w-[340px] md:h-[72px] md:max-w-[380px] lg:h-[80px] lg:max-w-[420px]",
        className,
      )}
      decoding="async"
    />
  );
}

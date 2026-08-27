import { cn } from "@/lib/utils";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Kept for call sites; crest emblem on all surfaces. */
  surface?: "dark" | "light";
};

const LOCKUP = {
  /** Official crest emblem — circular badge with motto banner. */
  src: "/images/logo-lockup.png",
  width: 462,
  height: 478,
} as const;

/** Baked at build time — busts browser cache when a new image deploys. */
const LOGO_CACHE_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "crest-2026";

/** Official MBSNM crest emblem. */
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
      width={compact ? 180 : LOCKUP.width}
      height={compact ? 186 : LOCKUP.height}
      className={cn(
        "block h-auto w-auto shrink-0 object-contain object-left",
        compact
          ? "h-[52px] w-auto max-w-[56px] sm:h-[56px] sm:max-w-[60px]"
          : "h-[56px] w-auto max-w-[58px] sm:h-[64px] sm:max-w-[66px] md:h-[72px] md:max-w-[74px] lg:h-[80px] lg:max-w-[82px]",
        className,
      )}
      decoding="async"
    />
  );
}

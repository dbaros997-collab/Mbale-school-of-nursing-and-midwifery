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
          ? "h-[72px] w-auto max-w-[76px] sm:h-[80px] sm:max-w-[84px]"
          : "h-[80px] w-auto max-w-[84px] sm:h-[92px] sm:max-w-[96px] md:h-[104px] md:max-w-[108px] lg:h-[116px] lg:max-w-[120px]",
        className,
      )}
      decoding="async"
    />
  );
}

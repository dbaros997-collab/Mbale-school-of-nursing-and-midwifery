import { cn } from "@/lib/utils";
import { OFFICIAL_SITE_LOGO } from "@/lib/site-logo";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Kept for call sites; crest emblem on all surfaces. */
  surface?: "dark" | "light";
};

const LOCKUP = OFFICIAL_SITE_LOGO;

/** Baked at build time — busts browser cache when a new image deploys. */
const LOGO_CACHE_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "crest-2026-09-19-v5";

/** Official MBSNM crest emblem. */
export function SchoolLogo({
  className,
  variant = "header",
}: SchoolLogoProps) {
  const compact = variant === "compact";
  const src = `${LOCKUP.path}?v=${LOGO_CACHE_VERSION}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Mbale School of Nursing and Midwifery"
      width={compact ? 180 : LOCKUP.width}
      height={compact ? 127 : LOCKUP.height}
      className={cn(
        "block h-auto w-auto shrink-0 object-contain object-left",
        compact
          ? "h-[72px] w-auto max-w-[102px] sm:h-[80px] sm:max-w-[113px]"
          : "h-[80px] w-auto max-w-[113px] sm:h-[92px] sm:max-w-[130px] md:h-[104px] md:max-w-[147px] lg:h-[116px] lg:max-w-[164px]",
        className,
      )}
      decoding="async"
    />
  );
}

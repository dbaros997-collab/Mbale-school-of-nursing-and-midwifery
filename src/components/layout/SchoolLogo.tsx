import { cn } from "@/lib/utils";

/** Bump when logo SVG assets change — busts CDN/browser cache on deploy. */
const LOGO_ASSET_VERSION = "20260826";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Dark = transparent lockup for navy/hero headers; light = brand colors on ivory panels. */
  surface?: "dark" | "light";
};

const LOCKUPS = {
  header: {
    light: "/images/logo-lockup.svg",
    dark: "/images/logo-lockup-on-dark.svg",
  },
  compact: {
    light: "/images/logo-lockup-primary.svg",
    dark: "/images/logo-lockup-primary.svg",
  },
} as const;

const SIZES = {
  header: { width: 520, height: 130 },
  compact: { width: 320, height: 80 },
} as const;

/** Official MBSNM horizontal lockup — crest + wordmark. */
export function SchoolLogo({
  className,
  variant = "header",
  surface = "light",
}: SchoolLogoProps) {
  const compact = variant === "compact";
  const { width, height } = SIZES[variant];
  const src = `${LOCKUPS[variant][surface]}?v=${LOGO_ASSET_VERSION}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Mbale School of Nursing and Midwifery"
      width={width}
      height={height}
      className={cn(
        "block h-auto w-auto object-contain object-left",
        compact
          ? "h-[64px] w-[260px] sm:h-[72px] sm:w-[300px]"
          : "h-[84px] w-[min(340px,90vw)] sm:h-[96px] sm:w-[400px] md:h-[108px] md:w-[460px] lg:h-[118px] lg:w-[520px]",
        className,
      )}
      decoding="async"
    />
  );
}

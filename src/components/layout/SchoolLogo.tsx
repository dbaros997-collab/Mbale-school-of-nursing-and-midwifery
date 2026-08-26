import { cn } from "@/lib/utils";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Dark = transparent SVG for navy/hero headers; light = official PNG lockup. */
  surface?: "dark" | "light";
};

const LOCKUPS = {
  header: {
    light: "/images/logo-lockup.png",
    dark: "/images/logo-lockup-on-dark.svg",
  },
  compact: {
    light: "/images/logo-lockup.png",
    dark: "/images/logo-lockup-on-dark.svg",
  },
} as const;

const SIZES = {
  header: { width: 320, height: 72, aspect: 1024 / 584 },
  compact: { width: 240, height: 54, aspect: 1024 / 584 },
} as const;

/** Official MBSNM horizontal lockup — crest + wordmark. */
export function SchoolLogo({
  className,
  variant = "header",
  surface = "light",
}: SchoolLogoProps) {
  const compact = variant === "compact";
  const { width, height, aspect } = SIZES[variant];
  const src = LOCKUPS[variant][surface];
  const usePng = src.endsWith(".png");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Mbale School of Nursing and Midwifery"
      width={width}
      height={height}
      className={cn(
        "block h-auto w-auto object-contain object-left",
        usePng
          ? compact
            ? "h-[44px] w-[min(240px,72vw)] sm:h-[48px] sm:w-[260px]"
            : "h-[48px] w-[min(260px,78vw)] sm:h-[56px] sm:w-[320px] md:h-[64px] md:w-[360px] lg:h-[72px] lg:w-[400px]"
          : compact
            ? "h-[44px] w-[176px] sm:h-[48px] sm:w-[192px]"
            : "h-[48px] w-[192px] sm:h-[52px] sm:w-[208px] md:h-[56px] md:w-[224px] lg:h-[60px] lg:w-[240px]",
        className,
      )}
      style={usePng ? { aspectRatio: aspect } : undefined}
      decoding="async"
    />
  );
}

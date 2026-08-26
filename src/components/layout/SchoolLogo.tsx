import { cn } from "@/lib/utils";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Kept for call sites; PNG lockup renders on all surfaces. */
  surface?: "dark" | "light";
};

const LOCKUP = {
  src: "/images/logo-lockup.png",
  width: 520,
  height: 130,
} as const;

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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Mbale School of Nursing and Midwifery"
      width={compact ? 320 : LOCKUP.width}
      height={compact ? 80 : LOCKUP.height}
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

import { cn } from "@/lib/utils";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
  /** Kept for call sites; official PNG lockup renders on all surfaces. */
  surface?: "dark" | "light";
};

const LOCKUP = {
  src: "/images/logo-lockup.png",
  width: 1024,
  height: 1012,
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
          ? "h-[72px] w-auto max-w-[340px] sm:h-[80px]"
          : "h-[84px] w-auto max-w-[min(88vw,380px)] sm:h-[96px] sm:max-w-none md:h-[108px] lg:h-[120px]",
        className,
      )}
      decoding="async"
    />
  );
}

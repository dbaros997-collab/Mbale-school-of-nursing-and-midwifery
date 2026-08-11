import { cn } from "@/lib/utils";

type SchoolLogoProps = {
  className?: string;
  variant?: "header" | "compact";
};

export function SchoolLogo({ className, variant = "header" }: SchoolLogoProps) {
  const compact = variant === "compact";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-transparent-hd.png"
      alt="Mable School of Nursing and Midwifery"
      width={compact ? 140 : 180}
      height={compact ? 99 : 127}
      className={cn(
        "w-auto object-contain object-left",
        compact ? "h-[52px]" : "h-[64px] sm:h-[72px]",
        className,
      )}
      decoding="async"
    />
  );
}

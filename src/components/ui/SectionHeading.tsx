import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-2 text-xs font-bold uppercase tracking-[0.18em]",
            light ? "text-brand-sky" : "text-brand-green",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl font-semibold leading-display tracking-tight sm:text-4xl",
          light ? "text-white" : "text-primary",
        )}
      >
        {title}
      </h2>
      {!light ? (
        <div
          className={cn(
            "brand-tricolor-rule mt-3 max-w-[5rem] rounded-full",
            align === "center" && "mx-auto",
          )}
          aria-hidden
        />
      ) : null}
      {description ? (
        <p
          className={cn(
            "mt-3 text-base leading-body sm:text-lg",
            light ? "text-white/80" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

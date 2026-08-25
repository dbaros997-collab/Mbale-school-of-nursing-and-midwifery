import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AppPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

/** Sky hero strip for portal/admin inner pages (below navy topbar). */
export function AppPageHero({
  eyebrow,
  title,
  description,
  actions,
  className,
}: AppPageHeroProps) {
  return (
    <div className={cn("hero-sky border-b border-border", className)}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1 font-display text-2xl font-semibold leading-display text-primary sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-body text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

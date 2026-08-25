import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type DataCardProps = {
  children: ReactNode;
  className?: string;
  /** Optional navy title strip above card body */
  title?: ReactNode;
  id?: string;
};

/** Structured card — sky border, navy shadow, optional navy header row. */
export function DataCard({ children, className, title, id }: DataCardProps) {
  return (
    <section id={id} className={cn("data-card overflow-hidden", className)}>
      {title ? (
        <div className="header-navy-row flex items-center px-4 py-2.5 sm:px-5">
          {typeof title === "string" ? (
            <h2 className="text-sm font-bold text-white">{title}</h2>
          ) : (
            <div className="w-full text-sm font-bold text-white">{title}</div>
          )}
        </div>
      ) : null}
      <div className="data-card__body p-4 sm:p-5">{children}</div>
    </section>
  );
}

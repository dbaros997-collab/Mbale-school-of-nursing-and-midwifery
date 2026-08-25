import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

/** Bleed sky hero to portal/admin main padding edges. */
export function PageShellBleed({ children, className }: PageShellProps) {
  return (
    <div className={cn("-mx-4 -mt-6 mb-6 sm:-mx-6 lg:-mx-8", className)}>{children}</div>
  );
}

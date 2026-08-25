import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  className?: string;
  role?: "note" | "status" | "alert";
};

/** Sky callout panel with a navy left edge marker (MBSNM UI pattern). */
export function Callout({ children, className, role = "note" }: CalloutProps) {
  return (
    <div role={role} className={cn("callout-sky px-4 py-3 sm:px-5 sm:py-4", className)}>
      {children}
    </div>
  );
}

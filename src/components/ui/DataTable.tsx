import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type DataTableProps = {
  children: ReactNode;
  className?: string;
  caption?: string;
};

/** Table shell with MBSNM sky header and navy/sky zebra rows. */
export function DataTable({ children, className, caption }: DataTableProps) {
  return (
    <div className={cn("data-table-shell overflow-hidden rounded-xl", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          {caption ? (
            <caption className="sr-only">
              {caption}
            </caption>
          ) : null}
          {children}
        </table>
      </div>
    </div>
  );
}

export function DataTableHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <thead className={cn("data-table-head", className)}>
      {children}
    </thead>
  );
}

export function DataTableBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tbody className={cn("data-table-body divide-y divide-border", className)}>
      {children}
    </tbody>
  );
}

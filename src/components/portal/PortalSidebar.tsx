"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  CreditCard,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  User,
  X,
} from "lucide-react";
import { PORTAL_NAV } from "@/lib/portal/constants";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CreditCard,
  FolderOpen,
  CalendarDays,
  Megaphone,
  User,
  FileText,
} as const;

type PortalSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function PortalSidebar({ open, onClose }: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-primary-dark/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-primary-dark text-white transition-transform lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Portal navigation"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-2" onClick={onClose}>
            <SchoolLogo variant="compact" className="!h-9 !w-auto shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">MBSNM Portal</p>
              <p className="truncate text-[11px] text-white/60">Student workspace</p>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-md p-1.5 text-white/80 hover:bg-white/10 lg:hidden focus-ring"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {PORTAL_NAV.map((item) => {
              const Icon = iconMap[item.icon];
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              if (!item.ready) {
                return (
                  <li key={item.href}>
                    <span
                      className="flex cursor-not-allowed items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm text-white/40"
                      title="Coming soon"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        {item.label}
                      </span>
                      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                        Soon
                      </span>
                    </span>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-ring",
                      active
                        ? "bg-primary-light text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-4 py-3 text-xs text-white/50">
          Module 1 foundation · Mock session
        </div>
      </aside>
    </>
  );
}

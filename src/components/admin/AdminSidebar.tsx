"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { ADMIN_NAV } from "@/lib/portal/constants";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { BackToWebsite } from "@/components/layout/BackToWebsite";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  BarChart3,
  ClipboardList,
  CalendarDays,
  Users,
  Wallet,
} as const;

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export function AdminSidebar({ open, onClose, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-primary-dark/40 lg:hidden"
          aria-hidden
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-primary-dark text-white transition-transform lg:static lg:z-auto lg:translate-x-0 lg:pointer-events-auto",
          open
            ? "translate-x-0 pointer-events-auto"
            : "-translate-x-full pointer-events-none lg:pointer-events-auto",
        )}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-2" onClick={onClose}>
            <SchoolLogo variant="compact" className="!h-[84px] !w-[88px] shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">MBSNM Admin</p>
              <p className="truncate text-[11px] text-white/60">Staff control panel</p>
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
            {ADMIN_NAV.map((item) => {
              const Icon = iconMap[item.icon];
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

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

        <div className="space-y-1 border-t border-white/10 p-3">
          <BackToWebsite variant="sidebar" onClick={onClose} />
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/10 focus-ring"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

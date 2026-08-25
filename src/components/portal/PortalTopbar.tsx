"use client";

import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BackToWebsite } from "@/components/layout/BackToWebsite";

type PortalTopbarProps = {
  onMenuClick: () => void;
  onLogout: () => void;
};

export function PortalTopbar({ onMenuClick, onLogout }: PortalTopbarProps) {
  const { profile, session } = useAuth();

  return (
    <header className="header-navy-row sticky top-0 z-[60] flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="relative z-[61] rounded-md p-2 text-white hover:bg-white/10 lg:hidden focus-ring"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white sm:text-base">
            {profile?.fullName ?? "Student"}
          </p>
          <p className="truncate text-xs text-brand-sky">
            {profile?.studentNumber}
            {session?.token ? " · Session active" : ""}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <BackToWebsite variant="topbar-dark" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLogout();
          }}
          className="btn-pill relative z-[61] inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-ring"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}

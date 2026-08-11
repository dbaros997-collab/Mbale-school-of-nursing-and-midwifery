"use client";

import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type PortalTopbarProps = {
  onMenuClick: () => void;
};

export function PortalTopbar({ onMenuClick }: PortalTopbarProps) {
  const { profile, session, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 text-primary hover:bg-surface lg:hidden focus-ring"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-primary sm:text-base">
            {profile?.fullName ?? "Student"}
          </p>
          <p className="truncate text-xs text-muted">
            {profile?.studentNumber}
            {session?.token ? " · Session active" : ""}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={logout}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-surface focus-ring"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Log out</span>
      </button>
    </header>
  );
}

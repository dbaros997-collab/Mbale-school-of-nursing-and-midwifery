"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { StudentLoginGate } from "@/components/portal/StudentLoginGate";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { BackToWebsite } from "@/components/layout/BackToWebsite";
import { Button } from "@/components/ui/Button";

function StaffBlockedOnStudentPortal() {
  return (
    <div className="flex min-h-full items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm text-center">
        <SchoolLogo surface="light" variant="header" className="mx-auto !h-[160px] !w-[166px]" />
        <h1 className="mt-6 font-display text-2xl font-semibold text-primary">
          Student portal only
        </h1>
        <p className="mt-2 text-sm text-muted">
          You are signed in as staff. Use the admin control panel to manage the school
          system.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button href="/admin" variant="navy" className="w-full">
            Go to admin panel
          </Button>
          <div className="flex justify-center">
            <BackToWebsite variant="page" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { needsActivation, isAuthenticated, ready, logout, isAdmin, isStudent } =
    useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isActivation = pathname === "/portal/activate";

  useEffect(() => {
    if (!ready) return;
    if (isAdmin) return;
    if (needsActivation && !isActivation) {
      router.replace("/portal/activate");
    }
  }, [needsActivation, isActivation, router, ready, isAdmin]);

  function handleLogout() {
    logout();
    window.location.assign("/portal");
  }

  if (!ready) {
    return (
      <div className="flex min-h-full items-center justify-center bg-surface text-sm text-muted">
        Loading portal…
      </div>
    );
  }

  if (isAdmin) {
    return <StaffBlockedOnStudentPortal />;
  }

  if (isActivation) {
    return (
      <div className="min-h-full bg-surface">
        <div className="border-b border-border bg-white px-4 py-3 sm:px-6">
          <BackToWebsite />
        </div>
        <main id="main-content" className="px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !isStudent) {
    return <StudentLoginGate />;
  }

  return (
    <div className="flex min-h-full bg-surface">
      <PortalSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalTopbar
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  return <PortalChrome>{children}</PortalChrome>;
}

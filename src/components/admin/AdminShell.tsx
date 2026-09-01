"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { BackToWebsite } from "@/components/layout/BackToWebsite";
import { Button } from "@/components/ui/Button";
import {
  loginStaff,
  STAFF_DEMO_CREDENTIALS,
} from "@/services/portal/admin/auth";

function StaffLoginGate() {
  const { applyStaffSession } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>(STAFF_DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await loginStaff(email, password);
    if (!result.ok) {
      setError(result.message);
      setBusy(false);
      return;
    }
    applyStaffSession({
      user: result.user,
      session: result.session,
      adminProfile: result.adminProfile,
    });
    router.replace("/admin");
    setBusy(false);
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <SchoolLogo surface="light" variant="header" className="mx-auto !h-[160px] !w-[184px]" />
        <h1 className="admin-gate-title mt-6 text-center">
          Staff Admin Panel
        </h1>
        <p className="admin-gate-desc text-center">
          Restricted to authorised registry and academic staff only. Students cannot
          sign in here.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-muted">
            Staff email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-3 text-base text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-muted">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-3 text-base text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30"
              required
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="primary" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in as staff"}
          </Button>
        </form>

        <p className="mt-4 rounded-lg bg-surface px-3 py-2.5 text-sm text-muted">
          Demo staff access: <span className="font-semibold text-primary">{STAFF_DEMO_CREDENTIALS.email}</span>
          {" · "}
          password <span className="font-semibold text-primary">{STAFF_DEMO_CREDENTIALS.password}</span>
        </p>

        <div className="mt-6 flex flex-col items-center gap-2 text-center text-base">
          <Link href="/portal" className="font-semibold text-primary hover:underline focus-ring">
            Student portal
          </Link>
          <BackToWebsite variant="page" />
        </div>
      </div>
    </div>
  );
}

function StudentBlockedOnAdmin() {
  const { logout, profile } = useAuth();

  return (
    <div className="flex min-h-full items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm text-center">
        <SchoolLogo surface="light" variant="header" className="mx-auto !h-[160px] !w-[184px]" />
        <h1 className="admin-gate-title mt-6">
          Staff access only
        </h1>
        <p className="admin-gate-desc">
          {profile?.fullName ? `Hi ${profile.fullName.split(" ")[0]}. ` : ""}
          The admin control panel is reserved for registry staff in charge. Please use
          the student portal instead.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button href="/portal/dashboard" variant="green" className="w-full">
            Go to student portal
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              logout();
              window.location.assign("/admin");
            }}
          >
            Sign out and use staff login
          </Button>
          <div className="flex justify-center">
            <BackToWebsite variant="page" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminChrome({ children }: { children: React.ReactNode }) {
  const { ready, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  function handleLogout() {
    logout();
    window.location.assign("/admin");
  }

  if (!ready) {
    return (
      <div className="flex min-h-full items-center justify-center bg-surface text-base font-medium text-muted sm:text-lg">
        Loading admin panel…
      </div>
    );
  }

  if (isStudent) {
    return <StudentBlockedOnAdmin />;
  }

  if (!isAuthenticated || !isAdmin) {
    return <StaffLoginGate />;
  }

  return (
    <div className="flex min-h-full bg-surface">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8" key={pathname}>
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <AdminChrome>{children}</AdminChrome>;
}

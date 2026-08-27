"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { BackToWebsite } from "@/components/layout/BackToWebsite";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import {
  loginStudent,
  STUDENT_DEMO_CREDENTIALS,
} from "@/services/portal/auth";
import {
  activationInputClass,
  FieldLabel,
} from "@/components/portal/activation/form";
import { MicrosoftSignInButton } from "@/components/microsoft/MicrosoftSignInButton";

export function StudentLoginGate() {
  const { applyActivatedSession } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await loginStudent(identifier, password);
    if (!result.ok || !result.data) {
      setError(result.message);
      setBusy(false);
      return;
    }
    applyActivatedSession({
      user: result.data.user,
      session: result.data.session,
      profile: result.data.profile,
    });
    router.replace("/portal/dashboard");
    setBusy(false);
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <SchoolLogo surface="light" variant="header" className="mx-auto !h-[160px] !w-[166px]" />
        <h1 className="mt-6 text-center font-display text-2xl font-semibold text-primary">
          Student Portal
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Welcome back. Sign in with Microsoft 365, or use your student number and activation
          password.
        </p>

        <section
          className="mt-8 rounded-xl border border-border bg-surface/50 p-4"
          aria-label="Microsoft 365 sign-in"
        >
          <p className="text-center text-xs font-bold uppercase tracking-wider text-primary">
            Recommended for MBSNM students
          </p>
          <p className="mt-1 text-center text-xs text-muted">
            Use your official <span className="font-semibold text-primary">@student.mbsnm.org</span>{" "}
            school account
          </p>
          <div className="mt-4">
            <MicrosoftSignInButton
              surface="portal"
              size="lg"
              className="w-full"
              onError={setError}
            />
          </div>
        </section>

        <div className="relative my-6 py-1">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-border" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Or sign in with password
          </p>
        </div>

        {error ? (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        ) : null}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <FieldLabel htmlFor="student-identifier" required>
              Student number or email
            </FieldLabel>
            <input
              id="student-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={activationInputClass}
              placeholder="MBSNM/NS/2026/042"
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="student-password" required>
              Password
            </FieldLabel>
            <input
              id="student-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={activationInputClass}
              required
            />
          </div>

          <Button type="submit" variant="green" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 rounded-lg bg-surface px-3 py-2 text-xs text-muted">
          Microsoft 365 sign-in uses your school Azure AD account. Password sign-in works for
          activated portal accounts.
          <br />
          <span className="mt-1 inline-block">
            Example (continuing student): {STUDENT_DEMO_CREDENTIALS.studentNumber} or{" "}
            {STUDENT_DEMO_CREDENTIALS.email} · password {STUDENT_DEMO_CREDENTIALS.password}
          </span>
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm">
          <Link
            href="/portal/activate"
            className="font-semibold text-primary hover:underline focus-ring"
          >
            First time here? Activate your account
          </Link>
          <BackToWebsite variant="page" />
        </div>
      </div>
    </div>
  );
}

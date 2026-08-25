"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { useAuth } from "@/contexts/AuthContext";
import {
  completeAccountActivation,
  getDemoActivationHints,
  validatePassword,
  verifyStudentIdentity,
} from "@/services/portal/auth";
import type { PendingActivation } from "@/lib/portal/schema";
import { cn } from "@/lib/utils";
import { VerifyIdentityStep } from "@/components/portal/activation/VerifyIdentityStep";
import { PasswordSetupStep } from "@/components/portal/activation/PasswordSetupStep";
import { ProfileCompletionStep } from "@/components/portal/activation/ProfileCompletionStep";
import { ActivationSuccessStep } from "@/components/portal/activation/ActivationSuccessStep";
import {
  emptyWizardDraft,
  type WizardDraft,
} from "@/components/portal/activation/types";

const STEPS = [
  { id: 1, label: "Verify identity" },
  { id: 2, label: "Set password" },
  { id: 3, label: "Complete profile" },
  { id: 4, label: "Done" },
] as const;

export function ActivationWizard() {
  const router = useRouter();
  const { applyActivatedSession } = useAuth();
  const hints = useMemo(() => getDemoActivationHints(), []);

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<WizardDraft>(emptyWizardDraft);
  const [verified, setVerified] = useState<PendingActivation | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  function patchDraft(patch: Partial<WizardDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    setError(null);
  }

  async function handleVerify() {
    setBusy(true);
    setError(null);
    const result = await verifyStudentIdentity({
      tempRegistrationNumber: draft.tempRegistrationNumber,
      admissionLetterRef: draft.admissionLetterRef,
    });
    setBusy(false);
    if (!result.ok || !result.data) {
      setError(result.message);
      return;
    }
    setVerified(result.data);
    patchDraft({ phone: result.data.phone });
    setStep(2);
  }

  function handlePasswordNext() {
    const passwordError = validatePassword(draft.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (draft.password !== draft.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setStep(3);
  }

  async function handleCompleteProfile() {
    setBusy(true);
    setError(null);
    const result = await completeAccountActivation({
      password: draft.password,
      confirmPassword: draft.confirmPassword,
      profile: {
        phone: draft.phone,
        address: draft.address,
        nextOfKin: draft.nextOfKin,
        emergencyContact: draft.emergencyContact,
        medicalInfo: draft.medicalInfo,
      },
    });
    setBusy(false);
    if (!result.ok || !result.data) {
      setError(result.message);
      return;
    }
    applyActivatedSession({
      user: result.data.user,
      session: result.data.session,
      profile: result.data.profile,
    });
    setStep(4);
  }

  const handleGoToDashboard = useCallback(() => {
    setRedirecting(true);
    router.push("/portal/dashboard");
  }, [router]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
        <SchoolLogo surface="light" variant="compact" className="mx-auto !h-[72px] !w-[280px]" />
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
          First-time student activation
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
          Activate your MBSNM portal account
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Use your temporary registration number and admission letter to verify
          identity, set a password, and complete your student record.
        </p>
      </div>

      <ol className="mb-6 grid grid-cols-2 gap-2 sm:mb-8 sm:grid-cols-4">
        {STEPS.map((s) => {
          const active = step === s.id;
          const done = step > s.id;
          return (
            <li
              key={s.id}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left transition",
                active
                  ? "border-accent-cyan bg-accent-cyan-soft"
                  : done
                    ? "border-accent-green/40 bg-accent-green-soft"
                    : "border-border bg-white",
              )}
            >
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-green" aria-hidden />
                ) : (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    {s.id}
                  </span>
                )}
                Step {s.id}
              </p>
              <p
                className={cn(
                  "mt-1 text-sm font-semibold",
                  active || done ? "text-primary" : "text-muted",
                )}
              >
                {s.label}
              </p>
            </li>
          );
        })}
      </ol>

      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 1 ? (
            <VerifyIdentityStep
              draft={draft}
              hints={hints}
              busy={busy}
              onChange={patchDraft}
              onContinue={() => void handleVerify()}
            />
          ) : null}

          {step === 2 ? (
            <PasswordSetupStep
              draft={draft}
              verifiedName={verified?.fullName}
              busy={busy}
              onChange={patchDraft}
              onBack={() => setStep(1)}
              onContinue={handlePasswordNext}
            />
          ) : null}

          {step === 3 ? (
            <ProfileCompletionStep
              draft={draft}
              busy={busy}
              onChange={patchDraft}
              onBack={() => setStep(2)}
              onContinue={() => void handleCompleteProfile()}
            />
          ) : null}

          {step === 4 ? (
            <ActivationSuccessStep
              studentName={verified?.fullName ?? "Student"}
              studentNumber={verified?.studentNumber}
              redirecting={redirecting}
              onContinue={handleGoToDashboard}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>

      {step < 4 ? (
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-accent-green" aria-hidden />
          Your details are used only for MBSNM student records and emergency readiness.
        </p>
      ) : null}
    </div>
  );
}

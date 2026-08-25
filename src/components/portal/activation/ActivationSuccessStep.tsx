"use client";

import { useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StepCard } from "@/components/portal/activation/form";

type Props = {
  studentName: string;
  studentNumber?: string;
  redirecting: boolean;
  onContinue: () => void;
};

export function ActivationSuccessStep({
  studentName,
  studentNumber,
  redirecting,
  onContinue,
}: Props) {
  useEffect(() => {
    const id = window.setTimeout(() => {
      onContinue();
    }, 2200);
    return () => window.clearTimeout(id);
  }, [onContinue]);

  return (
    <StepCard className="text-center">
      <CheckCircle2
        className="mx-auto h-14 w-14 text-accent-green"
        aria-hidden
      />
      <h2 className="mt-4 text-2xl font-extrabold text-primary">
        Account activated
      </h2>
      <p className="mt-2 text-sm text-muted">
        Welcome aboard, <span className="font-semibold text-primary">{studentName}</span>.
        Your portal account is ready. Redirecting to your dashboard…
      </p>
      {studentNumber ? (
        <p className="mt-3 inline-flex rounded-full bg-accent-green-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-green">
          Student no. {studentNumber}
        </p>
      ) : null}

      <div className="mt-8 flex justify-center">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onContinue}
          disabled={redirecting}
        >
          {redirecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Opening dashboard…
            </>
          ) : (
            "Go to dashboard now"
          )}
        </Button>
      </div>
    </StepCard>
  );
}

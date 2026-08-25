"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import {
  FieldLabel,
  StepCard,
  activationInputClass,
} from "@/components/portal/activation/form";
import type { PendingActivation } from "@/lib/portal/schema";
import type { WizardDraft } from "@/components/portal/activation/types";

type Props = {
  draft: WizardDraft;
  hints: PendingActivation[];
  busy: boolean;
  onChange: (patch: Partial<WizardDraft>) => void;
  onContinue: () => void;
};

export function VerifyIdentityStep({
  draft,
  hints,
  busy,
  onChange,
  onContinue,
}: Props) {
  return (
    <StepCard>
      <h2 className="text-xl font-extrabold text-primary">Identity verification</h2>
      <p className="mt-1 text-sm text-muted">
        Enter the temporary registration number and admission letter reference from
        your offer pack.
      </p>

      <Callout className="mt-4 text-sm">
        <p className="font-semibold text-primary">Demo credentials (any row below)</p>
        <ul className="mt-2 space-y-2 text-xs sm:text-sm">
          {hints.map((row) => (
            <li key={row.tempRegistrationNumber} className="rounded-md bg-white/60 px-2 py-1.5">
              <span className="font-semibold text-primary">{row.fullName}</span>
              <br />
              Temp reg: <span className="font-mono font-bold">{row.tempRegistrationNumber}</span>
              <br />
              Letter ref: <span className="font-mono font-bold">{row.admissionLetterRef}</span>
              <br />
              After activation, sign in with{" "}
              <span className="font-mono font-bold">{row.studentNumber}</span> or{" "}
              <span className="font-mono font-bold">{row.email}</span>
            </li>
          ))}
        </ul>
      </Callout>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        <div>
          <FieldLabel htmlFor="temp-reg" required>
            Temporary registration number
          </FieldLabel>
          <input
            id="temp-reg"
            required
            autoComplete="off"
            className={activationInputClass}
            placeholder="TMP/MBSNM/2026/042"
            value={draft.tempRegistrationNumber}
            onChange={(e) => onChange({ tempRegistrationNumber: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel htmlFor="letter-ref" required>
            Admission letter reference
          </FieldLabel>
          <input
            id="letter-ref"
            required
            autoComplete="off"
            className={activationInputClass}
            placeholder="ADM-MBSNM-2026-1184"
            value={draft.admissionLetterRef}
            onChange={(e) => onChange({ admissionLetterRef: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify & continue"
            )}
          </Button>
        </div>
      </form>
    </StepCard>
  );
}

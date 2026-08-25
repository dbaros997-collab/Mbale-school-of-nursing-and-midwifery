"use client";

import { Button } from "@/components/ui/Button";
import {
  FieldLabel,
  StepCard,
  activationInputClass,
} from "@/components/portal/activation/form";
import type { WizardDraft } from "@/components/portal/activation/types";

type Props = {
  draft: WizardDraft;
  verifiedName?: string;
  busy: boolean;
  onChange: (patch: Partial<WizardDraft>) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function PasswordSetupStep({
  draft,
  verifiedName,
  busy,
  onChange,
  onBack,
  onContinue,
}: Props) {
  return (
    <StepCard>
      <h2 className="text-xl font-extrabold text-primary">Create your password</h2>
      <p className="mt-1 text-sm text-muted">
        {verifiedName ? (
          <>
            Welcome, <span className="font-semibold text-primary">{verifiedName}</span>.
            Choose a secure password for future portal logins.
          </>
        ) : (
          "Choose a secure password for future portal logins."
        )}
      </p>

      <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-muted">
        <li>At least 8 characters</li>
        <li>One uppercase letter, one lowercase letter, and one number</li>
      </ul>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        <div>
          <FieldLabel htmlFor="password" required>
            New password
          </FieldLabel>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            className={activationInputClass}
            value={draft.password}
            onChange={(e) => onChange({ password: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel htmlFor="confirm-password" required>
            Confirm password
          </FieldLabel>
          <input
            id="confirm-password"
            type="password"
            required
            autoComplete="new-password"
            className={activationInputClass}
            value={draft.confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onBack} disabled={busy}>
            Back
          </Button>
          <Button type="submit" variant="primary" disabled={busy}>
            Continue
          </Button>
        </div>
      </form>
    </StepCard>
  );
}

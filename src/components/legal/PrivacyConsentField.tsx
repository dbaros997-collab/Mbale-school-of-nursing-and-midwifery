"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  PRIVACY_POLICY_PATH,
  privacyFormNotice,
} from "@/lib/legal/privacy-policy";

type PrivacyConsentFieldProps = {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Use on dark backgrounds (e.g. footer subscribe bar). */
  variant?: "default" | "onDark";
  className?: string;
};

export function PrivacyConsentField({
  id,
  checked,
  onCheckedChange,
  disabled,
  variant = "default",
  className,
}: PrivacyConsentFieldProps) {
  const onDark = variant === "onDark";

  return (
    <div
      className={cn(
        "space-y-2 rounded-lg border p-3 text-sm",
        onDark
          ? "border-white/25 bg-black/15 text-white/90"
          : "border-border bg-surface/60 text-muted",
        className,
      )}
    >
      <p className={cn("leading-relaxed", onDark ? "text-white/85" : "text-muted")}>
        {privacyFormNotice}
      </p>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-start gap-2.5",
          disabled && "cursor-not-allowed opacity-70",
        )}
      >
        <input
          id={id}
          name="privacyConsent"
          type="checkbox"
          required
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-brand-green focus-ring"
        />
        <span className={cn("text-sm leading-snug", onDark ? "text-white" : "text-foreground")}>
          I have read the{" "}
          <Link
            href={PRIVACY_POLICY_PATH}
            className={cn(
              "font-semibold underline-offset-2 hover:underline",
              onDark ? "text-brand-yellow" : "text-primary",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>{" "}
          and consent to MBSNM processing my personal information for the purpose described above.
        </span>
      </label>
    </div>
  );
}

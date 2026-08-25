"use client";

import { useState } from "react";
import { Loader2, Mail, MessageSquare, Send } from "lucide-react";
import type { ApplicationNotificationLog } from "@/lib/admissions/types";
import { dispatchApplicationNotification } from "@/services/admissions/notifications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type NotificationDispatchPanelProps = {
  applicationReference: string;
  email: string;
  phone: string;
  /** Pre-dispatched log from auto-send on submission */
  initialLog?: ApplicationNotificationLog | null;
  className?: string;
};

export function NotificationDispatchPanel({
  applicationReference,
  email,
  phone,
  initialLog,
  className,
}: NotificationDispatchPanelProps) {
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(
    initialLog
      ? `Notification sent to ${initialLog.email}${initialLog.channels.includes("sms") ? " and via SMS" : ""}.`
      : null,
  );
  const [lastLog, setLastLog] = useState<ApplicationNotificationLog | null>(initialLog ?? null);

  async function handleSend() {
    setBusy(true);
    setMessage(null);
    const channels: ("email" | "sms")[] = [];
    if (sendEmail) channels.push("email");
    if (sendSms) channels.push("sms");

    const result = await dispatchApplicationNotification({
      applicationReference,
      channels,
    });

    setMessage(result.message);
    if (result.log) setLastLog(result.log);
    setBusy(false);
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Send className="h-4 w-4 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-primary">Email &amp; SMS notification</h3>
          <p className="mt-1 text-xs text-muted">
            Simulated dispatch — sends a summary of your qualification status and reference to
            your registered contact details.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus-ring"
          />
          <Mail className="h-4 w-4 text-muted" aria-hidden />
          <span>
            Email to <span className="font-medium text-primary">{email}</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={sendSms}
            onChange={(e) => setSendSms(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus-ring"
          />
          <MessageSquare className="h-4 w-4 text-muted" aria-hidden />
          <span>
            SMS to <span className="font-medium text-primary">{phone}</span>
          </span>
        </label>
      </div>

      <Button
        type="button"
        variant="primary"
        disabled={busy || (!sendEmail && !sendSms)}
        onClick={() => void handleSend()}
        className="mt-4 w-full sm:w-auto"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {busy ? "Sending…" : "Send notification"}
      </Button>

      {message ? (
        <p
          className={cn(
            "mt-3 text-xs font-medium",
            message.includes("sent") ? "text-accent-green" : "text-red-600",
          )}
          role="status"
        >
          {message}
        </p>
      ) : null}

      {lastLog ? (
        <div className="mt-4 rounded-lg border border-border bg-surface px-3 py-3 text-xs text-muted">
          <p className="font-semibold text-primary">Last message preview</p>
          <p className="mt-1 font-medium">{lastLog.subject}</p>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{lastLog.preview}</p>
          <p className="mt-2 text-[11px]">
            Sent {new Date(lastLog.sentAt).toLocaleString("en-UG")} via{" "}
            {lastLog.channels.join(" & ")}
          </p>
        </div>
      ) : null}
    </div>
  );
}

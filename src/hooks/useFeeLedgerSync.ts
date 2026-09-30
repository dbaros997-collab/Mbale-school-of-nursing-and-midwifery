"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FEE_LEDGER_POLL_MS } from "@/lib/portal/constants";
import {
  FEE_LEDGER_BROADCAST_CHANNEL,
  type FeeLedgerSyncEvent,
} from "@/lib/portal/fee-ledger-sync-client";

type UseFeeLedgerSyncOptions = {
  scope: "portal" | "admin";
  revision: number;
  studentId?: string;
  enabled?: boolean;
  onRefresh: (event?: FeeLedgerSyncEvent) => void | Promise<void>;
  onRealtimeEvent?: (event: FeeLedgerSyncEvent) => void;
};

export function useFeeLedgerSync({
  scope,
  revision,
  studentId,
  enabled = true,
  onRefresh,
  onRealtimeEvent,
}: UseFeeLedgerSyncOptions) {
  const [liveMode, setLiveMode] = useState<"polling" | "realtime" | "broadcast">("polling");
  const revisionRef = useRef(revision);

  useEffect(() => {
    revisionRef.current = revision;
  }, [revision]);

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncInFlightRef = useRef(false);

  const scheduleRefresh = useCallback(
    (event?: FeeLedgerSyncEvent) => {
      const delayMs = scope === "admin" ? 150 : 0;
      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = window.setTimeout(() => {
        refreshTimerRef.current = null;
        void onRefresh(event);
      }, delayMs);
    },
    [onRefresh, scope],
  );

  const syncFromServer = useCallback(async () => {
    if (typeof document !== "undefined" && document.hidden) return;
    if (syncInFlightRef.current) return;
    syncInFlightRef.current = true;

    const path =
      scope === "portal"
        ? `/api/portal/fees/sync?revision=${revisionRef.current}${
            studentId ? `&studentId=${encodeURIComponent(studentId)}` : ""
          }`
        : `/api/admin/fees/sync?revision=${revisionRef.current}`;
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as { changed?: boolean; revision?: number };
      if (json.changed) {
        scheduleRefresh({ type: "ledger_updated", source: "system" });
      } else if (typeof json.revision === "number") {
        revisionRef.current = json.revision;
      }
    } catch {
      // ignore transient network errors
    } finally {
      syncInFlightRef.current = false;
    }
  }, [scheduleRefresh, scope, studentId]);

  useEffect(() => {
    if (!enabled) return;

    const channel = new BroadcastChannel(FEE_LEDGER_BROADCAST_CHANNEL);
    channel.onmessage = (event: MessageEvent<FeeLedgerSyncEvent>) => {
      const payload = event.data;
      if (payload?.studentId && studentId && payload.studentId !== studentId) {
        return;
      }
      setLiveMode("broadcast");
      onRealtimeEvent?.(payload);
      scheduleRefresh(payload);
    };

    const pollMs = scope === "admin" ? FEE_LEDGER_POLL_MS * 2 : FEE_LEDGER_POLL_MS;
    const poll = window.setInterval(() => {
      if (document.hidden) return;
      setLiveMode((mode) => (mode === "realtime" ? mode : "polling"));
      void syncFromServer();
    }, pollMs);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let removeRealtime: (() => void) | undefined;

    if (url && anon && scope === "portal" && studentId) {
      const supabase = createClient();
      const pushLedgerRefresh = () => {
        setLiveMode("realtime");
        const evt = {
          type: "ledger_updated" as const,
          studentId,
          source: "system" as const,
        };
        onRealtimeEvent?.(evt);
        scheduleRefresh(evt);
      };

      const realtimeChannel = supabase
        .channel(`fee-ledger-${studentId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bank_payment_submissions",
            filter: `student_id=eq.${studentId}`,
          },
          pushLedgerRefresh,
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "online_payment_sessions",
            filter: `student_id=eq.${studentId}`,
          },
          pushLedgerRefresh,
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "fee_payments",
            filter: `student_id=eq.${studentId}`,
          },
          pushLedgerRefresh,
        )
        .subscribe();

      removeRealtime = () => {
        void supabase.removeChannel(realtimeChannel);
      };
    }

    if (url && anon && scope === "admin") {
      const supabase = createClient();
      const pushAdminRefresh = () => {
        setLiveMode("realtime");
        const evt = { type: "ledger_updated" as const, source: "system" as const };
        onRealtimeEvent?.(evt);
        scheduleRefresh(evt);
      };

      const realtimeChannel = supabase
        .channel("fee-ledger-admin")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bank_payment_submissions" },
          pushAdminRefresh,
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "online_payment_sessions" },
          pushAdminRefresh,
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "fee_payments" },
          pushAdminRefresh,
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "student_portal_activation" },
          pushAdminRefresh,
        )
        .subscribe();

      removeRealtime = () => {
        void supabase.removeChannel(realtimeChannel);
      };
    }

    return () => {
      channel.close();
      window.clearInterval(poll);
      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
      removeRealtime?.();
    };
  }, [enabled, onRealtimeEvent, scheduleRefresh, scope, studentId, syncFromServer]);

  return { liveMode };
}

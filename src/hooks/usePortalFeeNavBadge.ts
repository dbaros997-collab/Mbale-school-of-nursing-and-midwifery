"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FEE_LEDGER_BROADCAST_CHANNEL } from "@/lib/portal/fee-ledger-sync-client";
import { FEE_LEDGER_POLL_MS } from "@/lib/portal/constants";

type FeeSummaryResponse = {
  alertCount: number;
  revision: number;
};

/** Badge count on portal nav "Fees" link — scoped to the signed-in student. */
export function usePortalFeeNavBadge() {
  const { profile } = useAuth();
  const studentId = profile?.id ?? null;
  const [alertCount, setAlertCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!studentId) {
      setAlertCount(0);
      return;
    }
    try {
      const res = await fetch(
        `/api/portal/fees/summary?studentId=${encodeURIComponent(studentId)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const json = (await res.json()) as FeeSummaryResponse;
      setAlertCount(json.alertCount);
    } catch {
      // ignore
    }
  }, [studentId]);

  useEffect(() => {
    void refresh();

    const channel = new BroadcastChannel(FEE_LEDGER_BROADCAST_CHANNEL);
    channel.onmessage = (event: MessageEvent<{ studentId?: string }>) => {
      const payload = event.data;
      if (payload?.studentId && studentId && payload.studentId !== studentId) {
        return;
      }
      void refresh();
    };

    const poll = window.setInterval(() => {
      void refresh();
    }, FEE_LEDGER_POLL_MS);

    return () => {
      channel.close();
      window.clearInterval(poll);
    };
  }, [refresh, studentId]);

  return alertCount;
}

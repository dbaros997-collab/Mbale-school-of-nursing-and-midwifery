"use client";

export const FEE_LEDGER_BROADCAST_CHANNEL = "mbale-fee-ledger-v1";

export type FeeLedgerSyncEvent = {
  type: "ledger_updated";
  studentId?: string;
  revision?: number;
  source?: "admin" | "student" | "system";
  reviewDecision?: "approved" | "rejected";
};

/** Notify other open portal/admin tabs to refresh fee data immediately. */
export function notifyFeeLedgerClients(event: FeeLedgerSyncEvent = { type: "ledger_updated" }) {
  if (typeof window === "undefined") return;
  try {
    const channel = new BroadcastChannel(FEE_LEDGER_BROADCAST_CHANNEL);
    channel.postMessage(event);
    channel.close();
  } catch {
    // BroadcastChannel unavailable in some embedded contexts
  }
}

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type OnlinePaymentSessionAdminRow = {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  txRef: string;
  gateway: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
};

type SessionRow = {
  id: string;
  student_id: string;
  amount: number;
  currency: string;
  tx_ref: string;
  gateway: string;
  status: string;
  created_at: string;
  completed_at: string | null;
};

function mapSession(row: SessionRow): OnlinePaymentSessionAdminRow {
  return {
    id: row.id,
    studentId: row.student_id,
    amount: Number(row.amount),
    currency: row.currency ?? "UGX",
    txRef: row.tx_ref,
    gateway: row.gateway,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export async function listRecentOnlinePaymentSessions(
  limit = 12,
): Promise<OnlinePaymentSessionAdminRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("online_payment_sessions")
    .select("id,student_id,amount,currency,tx_ref,gateway,status,created_at,completed_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[listRecentOnlinePaymentSessions]", error);
    return [];
  }

  return (data as SessionRow[]).map(mapSession);
}

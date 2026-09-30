import { assertSupabaseFinanceConfigured } from "@/lib/admin/assert-supabase-finance";
import { requireStaffAuth } from "@/lib/admin/require-staff-auth";
import { AdminFinanceDataError } from "@/lib/supabase/admin-finance-errors";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Staff session + live Supabase guard for `/api/admin/fees/*` handlers. */
export async function withAdminFinanceAccess(
  handler: () => Promise<Response>,
): Promise<Response> {
  const auth = await requireStaffAuth();
  if (!auth.authorized) return auth.response;

  const supabaseBlock = assertSupabaseFinanceConfigured();
  if (supabaseBlock) return supabaseBlock;

  try {
    return await handler();
  } catch (error) {
    if (error instanceof AdminFinanceDataError) {
      console.error("[admin-finance]", error.operation, error.message);
      return Response.json(
        { ok: false, code: "LEDGER_FETCH_FAILED", message: error.message },
        { status: 503, headers: NO_STORE },
      );
    }
    throw error;
  }
}

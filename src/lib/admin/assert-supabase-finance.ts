import { isSupabaseConfigured } from "@/lib/supabase/config";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Rejects admin finance API calls when the server has no Supabase service credentials. */
export function assertSupabaseFinanceConfigured(): Response | null {
  if (isSupabaseConfigured()) return null;
  return Response.json(
    {
      ok: false,
      code: "SUPABASE_REQUIRED",
      message:
        "Finance ledger requires live Supabase (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).",
    },
    { status: 503, headers: NO_STORE },
  );
}

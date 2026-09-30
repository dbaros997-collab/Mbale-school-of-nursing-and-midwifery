import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertProductionPoolRouting } from "@/lib/db/pool-config";
import { supabaseKeepAliveFetch } from "@/lib/supabase/http-client";

let adminClient: SupabaseClient | null = null;

/** Service-role client for trusted admin analytics queries (server-only). */
export function createAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  assertProductionPoolRouting();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: supabaseKeepAliveFetch() },
  });

  return adminClient;
}

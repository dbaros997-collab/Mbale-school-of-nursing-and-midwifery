/**
 * Shared fetch for Supabase REST/RPC — reuses TCP connections under peak payment load.
 * (Supabase pools Postgres on their side via Supavisor; this reduces Node → API latency.)
 */

type FetchFn = typeof fetch;

let cachedFetch: FetchFn | null = null;

export function supabaseKeepAliveFetch(): FetchFn {
  if (cachedFetch) return cachedFetch;

  cachedFetch = (input, init) =>
    fetch(input, {
      ...init,
      keepalive: true,
    });

  return cachedFetch;
}

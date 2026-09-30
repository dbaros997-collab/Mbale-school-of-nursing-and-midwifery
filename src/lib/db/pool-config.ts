/**
 * Database connection pooling (this project does not use Prisma ORM).
 *
 * Payment and fee writes go through Supabase PostgREST → Postgres RPC (one HTTP round-trip,
 * single DB transaction per RPC). Postgres connections are pooled by Supabase Supavisor.
 *
 * If you add Prisma or another direct Postgres driver later, use the pooler URL (port 6543,
 * transaction mode) for the app and the direct URL (5432) for migrations only.
 */

export type DatabasePoolConfig = {
  /** Direct Postgres (migrations, admin scripts) — never use for high-concurrency app traffic */
  directUrl: string | null;
  /** PgBouncer / Supavisor pooler URL for application queries */
  poolerUrl: string | null;
  /** Supabase REST base URL (current app default for RPC) */
  supabaseUrl: string | null;
  mode: "supabase-rest" | "postgres-pooler" | "unconfigured";
};

export function getDatabasePoolConfig(): DatabasePoolConfig {
  const directUrl =
    process.env.DIRECT_DATABASE_URL?.trim() ||
    process.env.SUPABASE_DB_DIRECT_URL?.trim() ||
    null;
  const poolerUrl =
    process.env.DATABASE_URL?.trim() ||
    process.env.SUPABASE_DB_POOLER_URL?.trim() ||
    null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || null;

  if (supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return { directUrl, poolerUrl, supabaseUrl, mode: "supabase-rest" };
  }
  if (poolerUrl) {
    return { directUrl, poolerUrl, supabaseUrl, mode: "postgres-pooler" };
  }
  return { directUrl, poolerUrl, supabaseUrl, mode: "unconfigured" };
}

/** Warn at startup in production if pooler env is missing while direct URL is set (anti-pattern). */
export function assertProductionPoolRouting(): void {
  if (process.env.NODE_ENV !== "production") return;
  const { directUrl, poolerUrl, mode } = getDatabasePoolConfig();
  if (mode === "supabase-rest") return;
  if (directUrl && !poolerUrl) {
    console.warn(
      "[db] DIRECT_DATABASE_URL is set without DATABASE_URL / SUPABASE_DB_POOLER_URL. " +
        "Use the Supavisor pooler for app traffic to avoid connection saturation.",
    );
  }
}

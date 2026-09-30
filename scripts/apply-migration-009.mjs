#!/usr/bin/env node
/**
 * Apply supabase/migrations/009_student_portal_activation.sql to PostgreSQL.
 *
 * Uses DIRECT_DATABASE_URL (preferred) or DATABASE_URL from .env — not Prisma.
 * Supabase SQL editor: paste the migration file manually if you have no CLI/psql.
 *
 * Usage:
 *   node scripts/apply-migration-009.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(import.meta.url), "..");

function loadDotEnv() {
  const path = resolve(ROOT, ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv();

const dbUrl =
  process.env.DIRECT_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  "";

if (!dbUrl) {
  console.error(
    "No DIRECT_DATABASE_URL or DATABASE_URL in .env — cannot apply migration automatically.",
  );
  console.error(
    "Add your Supabase Postgres URL (see .env.example), then re-run: node scripts/apply-migration-009.mjs",
  );
  console.error(
    "Or run the SQL in Supabase Dashboard → SQL → New query:\n  supabase/migrations/009_student_portal_activation.sql",
  );
  process.exit(1);
}

const migrationPath = resolve(
  ROOT,
  "supabase/migrations/009_student_portal_activation.sql",
);
const sql = readFileSync(migrationPath, "utf8");

const psql = spawnSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", migrationPath], {
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (psql.error?.code === "ENOENT") {
  console.error("psql was not found on PATH.");
  console.error("Install PostgreSQL client tools, or paste this file into Supabase SQL editor:");
  console.error(migrationPath);
  process.exit(1);
}

if (psql.status !== 0) {
  console.error(psql.stderr || psql.stdout || "psql failed");
  process.exit(psql.status ?? 1);
}

console.log("Applied 009_student_portal_activation.sql successfully.");
if (psql.stdout?.trim()) console.log(psql.stdout.trim());

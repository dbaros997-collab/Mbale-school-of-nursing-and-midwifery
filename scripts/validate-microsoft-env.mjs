#!/usr/bin/env node
/**
 * Validates Microsoft 365 env vars from `.env` (if present) and process.env.
 * Keep rules aligned with src/lib/microsoft/validate-config.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const OFFICIAL_SITE = "https://mbaleschoolofnursing.ac.ug";
const CALLBACK_PATH = "/auth/microsoft/callback";
const PRODUCTION_CALLBACK = `${OFFICIAL_SITE}${CALLBACK_PATH}`;

function loadDotEnv(root) {
  const path = resolve(root, ".env");
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
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

function read(key) {
  const v = process.env[key]?.trim();
  return v || undefined;
}

function readFirst(keys) {
  for (const key of keys) {
    const value = read(key);
    if (value) return value;
  }
  return undefined;
}

function isPlaceholder(v) {
  if (!v) return true;
  const l = v.toLowerCase();
  return l.startsWith("your_") || l.includes("change-before-production");
}

function issue(level, code, message) {
  return { level, code, message };
}

function validate({ production }) {
  const issues = [];
  const clientPublic = read("NEXT_PUBLIC_AZURE_CLIENT_ID");
  const clientServer = read("MICROSOFT_CLIENT_ID");
  const tenantPublic = read("NEXT_PUBLIC_AZURE_TENANT_ID");
  const tenantServer = read("MICROSOFT_TENANT_ID");

  if (clientPublic && clientServer && clientPublic !== clientServer) {
    issues.push(
      issue(
        "error",
        "client_id_mismatch",
        "NEXT_PUBLIC_AZURE_CLIENT_ID and MICROSOFT_CLIENT_ID must match.",
      ),
    );
  }
  if (tenantPublic && tenantServer && tenantPublic !== tenantServer) {
    issues.push(
      issue(
        "error",
        "tenant_id_mismatch",
        "NEXT_PUBLIC_AZURE_TENANT_ID and MICROSOFT_TENANT_ID must match.",
      ),
    );
  }
  if (isPlaceholder(clientPublic ?? clientServer)) {
    issues.push(issue("error", "client_id_missing", "Set Azure client ID env vars."));
  }
  if (isPlaceholder(tenantPublic ?? tenantServer)) {
    issues.push(issue("error", "tenant_id_missing", "Set Azure tenant ID env vars."));
  }
  if (isPlaceholder(readFirst(["MICROSOFT_CLIENT_SECRET", "AZURE_CLIENT_SECRET"]))) {
    issues.push(issue("error", "client_secret_missing", "Set MICROSOFT_CLIENT_SECRET."));
  }
  if (isPlaceholder(read("SESSION_SECRET"))) {
    issues.push(
      issue(
        production ? "error" : "warning",
        "session_secret",
        "Set SESSION_SECRET to a long random value.",
      ),
    );
  }

  const redirectRaw = read("NEXT_PUBLIC_AZURE_REDIRECT_URI");
  if (redirectRaw) {
    try {
      const url = new URL(redirectRaw);
      if (url.pathname.replace(/\/+$/, "") !== CALLBACK_PATH) {
        issues.push(
          issue("error", "redirect_path", `Redirect path must be ${CALLBACK_PATH}.`),
        );
      }
      if (production) {
        const expectedHost = new URL(OFFICIAL_SITE).host;
        if (url.host !== expectedHost) {
          issues.push(
            issue(
              "error",
              "redirect_host",
              `Production redirect should be ${PRODUCTION_CALLBACK}.`,
            ),
          );
        }
        if (url.protocol !== "https:") {
          issues.push(issue("error", "redirect_https", "Production redirect must use https."));
        }
      }
    } catch {
      issues.push(issue("error", "redirect_invalid", "NEXT_PUBLIC_AZURE_REDIRECT_URI invalid."));
    }
  } else if (production) {
    issues.push(
      issue(
        "warning",
        "redirect_missing",
        `Set NEXT_PUBLIC_AZURE_REDIRECT_URI=${PRODUCTION_CALLBACK} at build time.`,
      ),
    );
  }

  return issues;
}

const root = resolve(import.meta.dirname, "..");
loadDotEnv(root);

const production = process.argv.includes("--production");
const issues = validate({ production });
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

for (const i of issues) {
  const tag = i.level === "error" ? "ERROR" : "WARN";
  console.log(`[${tag}] ${i.code}: ${i.message}`);
}

console.log("");
if (errors.length === 0) {
  console.log(
    production
      ? "Microsoft 365 production env checks passed (warnings may remain)."
      : "Microsoft 365 local env checks passed (run with --production for live site rules).",
  );
  process.exit(warnings.length && production ? 0 : 0);
}

console.error(`${errors.length} error(s) — fix before deploying Microsoft SSO.`);
process.exit(1);

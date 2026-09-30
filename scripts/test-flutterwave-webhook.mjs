#!/usr/bin/env node
/**
 * Local Flutterwave webhook tester (mock ledger or Supabase RPC).
 *
 * Examples:
 *   node scripts/test-flutterwave-webhook.mjs --register
 *   node scripts/test-flutterwave-webhook.mjs --tx-ref MBS-FEE-... --amount 450000
 *   node scripts/test-flutterwave-webhook.mjs --register --base https://abc123.ngrok-free.app
 *   node scripts/test-flutterwave-webhook.mjs --tx-ref ... --amount 450000 --repeat
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

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

function arg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx === -1 || !process.argv[idx + 1]) return fallback;
  return process.argv[idx + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

loadDotEnv();

const base = (arg("--base", "http://localhost:5173") ?? "http://localhost:5173").replace(/\/$/, "");
const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET?.trim() ?? "";
const studentId = arg("--student-id", "stu-sarah");
const invoiceId = arg("--invoice-id", "inv-2025-1");
const amount = Number(arg("--amount", "450000"));

async function registerSession() {
  const res = await fetch(`${base}/api/payments/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentId,
      invoiceId,
      amount,
      studentEmail: "nagudi.sarah@mbaleschoolofnursing.ac.ug",
      studentName: "Nagudi Sarah",
    }),
  });
  const json = await res.json();
  if (!json.txRef) {
    console.error("Checkout did not return txRef.", res.status, json);
    process.exit(1);
  }
  console.log(`Registered session tx_ref=${json.txRef} (HTTP ${res.status})`);
  if (!json.ok) {
    console.log("(Gateway redirect may have failed; session is still pending for webhook tests.)");
  }
  return json.txRef;
}

async function sendWebhook(txRef, gatewayId) {
  if (!webhookSecret || webhookSecret === "your_webhook_secret") {
    console.error("Set FLUTTERWAVE_WEBHOOK_SECRET in .env to your dashboard secret hash.");
    process.exit(1);
  }

  const body = {
    event: "charge.completed",
    data: {
      id: gatewayId,
      tx_ref: txRef,
      amount,
      currency: "UGX",
      status: "successful",
      payment_type: "mobilemoneyuganda",
      processor_response: "Approved",
    },
  };

  const res = await fetch(`${base}/api/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "verif-hash": webhookSecret,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`Webhook POST ${res.status} ${text}`);
  return res.ok;
}

async function peekSync(revision = "-1") {
  const res = await fetch(`${base}/api/portal/fees/sync?revision=${revision}`, {
    cache: "no-store",
  });
  const json = await res.json();
  console.log("Sync:", JSON.stringify(json, null, 2).slice(0, 800));
}

async function main() {
  let txRef = arg("--tx-ref", null);
  if (hasFlag("--register") || !txRef) {
    txRef = await registerSession();
  }

  const gatewayId = arg("--gateway-id", `flw-test-${Date.now()}`);
  const ok1 = await sendWebhook(txRef, gatewayId);
  if (hasFlag("--repeat")) {
    console.log("Sending duplicate webhook (idempotency check)…");
    await sendWebhook(txRef, gatewayId);
  }

  if (ok1) {
    await peekSync();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

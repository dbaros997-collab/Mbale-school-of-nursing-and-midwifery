import {
  microsoftConfigHasErrors,
  validateMicrosoftDeploymentConfig,
} from "@/lib/microsoft/validate-config";
import { isFlutterwaveConfigured } from "@/lib/payments/flutterwave";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDatabasePoolConfig } from "@/lib/db/pool-config";

/** Lightweight health probe for Coolify / Docker healthchecks. */
export async function GET() {
  try {
    const microsoft = validateMicrosoftDeploymentConfig({
      production: process.env.NODE_ENV === "production",
    });

    const db = getDatabasePoolConfig();

    return Response.json({
      ok: true,
      build: process.env.NEXT_PUBLIC_LOGO_VERSION ?? "unknown",
      microsoft: {
        serverConfigured: microsoft.serverConfigured,
        clientConfigured: microsoft.clientConfigured,
        ready: microsoft.clientConfigured && !microsoftConfigHasErrors(microsoft),
        issueCount: microsoft.issues.length,
      },
      supabase: { configured: isSupabaseConfigured(), mode: db.mode },
      flutterwave: { configured: isFlutterwaveConfigured() },
    });
  } catch (error) {
    console.error("[health]", error);
    return Response.json({ ok: true, build: "unknown", microsoft: { ready: false } });
  }
}

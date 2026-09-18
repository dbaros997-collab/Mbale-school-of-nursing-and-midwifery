import {
  microsoftConfigHasErrors,
  validateMicrosoftDeploymentConfig,
} from "@/lib/microsoft/validate-config";

/** Lightweight health probe for Coolify / Docker healthchecks. */
export async function GET() {
  try {
    const microsoft = validateMicrosoftDeploymentConfig({
      production: process.env.NODE_ENV === "production",
    });

    return Response.json({
      ok: true,
      build: process.env.NEXT_PUBLIC_LOGO_VERSION ?? "unknown",
      microsoft: {
        serverConfigured: microsoft.serverConfigured,
        clientConfigured: microsoft.clientConfigured,
        ready:
          microsoft.serverConfigured &&
          microsoft.clientConfigured &&
          !microsoftConfigHasErrors(microsoft),
        issueCount: microsoft.issues.length,
      },
    });
  } catch (error) {
    console.error("[health]", error);
    return Response.json({ ok: true, build: "unknown", microsoft: { ready: false } });
  }
}

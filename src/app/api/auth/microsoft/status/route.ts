import { NextResponse } from "next/server";
import {
  microsoftConfigHasErrors,
  validateMicrosoftDeploymentConfig,
} from "@/lib/microsoft/validate-config";
import { MICROSOFT_PRODUCTION_CALLBACK_URL } from "@/lib/microsoft/env-vars";
import { OFFICIAL_SITE_URL } from "@/lib/site-url";

/** Non-secret Microsoft SSO deployment checklist for operators (Coolify / ICT). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const production =
    searchParams.get("production") === "1" || process.env.NODE_ENV === "production";

  const validation = validateMicrosoftDeploymentConfig({ production });

  return NextResponse.json({
    ok: validation.serverConfigured && validation.clientConfigured && !microsoftConfigHasErrors(validation),
    officialSite: OFFICIAL_SITE_URL,
    productionCallbackUrl: MICROSOFT_PRODUCTION_CALLBACK_URL,
    serverConfigured: validation.serverConfigured,
    clientConfigured: validation.clientConfigured,
    redirectUri: validation.redirectUri,
    allowedStudentDomains: validation.allowedStudentDomains,
    issues: validation.issues,
  });
}

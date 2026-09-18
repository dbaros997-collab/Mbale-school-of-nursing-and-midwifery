import { NextResponse } from "next/server";
import { getMicrosoftPublicConfig, isMicrosoftClientConfigured } from "@/lib/microsoft/config";

/** Non-secret MSAL settings read from runtime env (for browser when build-time NEXT_PUBLIC_* was empty). */
export async function GET() {
  const configured = isMicrosoftClientConfigured();
  const publicConfig = getMicrosoftPublicConfig();

  return NextResponse.json({
    configured,
    clientId: configured ? publicConfig.clientId : "",
    tenantId: configured ? publicConfig.tenantId : "",
    authority: publicConfig.authority,
    redirectUri: publicConfig.redirectUri,
    scopes: publicConfig.scopes,
  });
}

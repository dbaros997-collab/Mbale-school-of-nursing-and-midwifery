import { NextResponse } from "next/server";
import { getMicrosoftPublicConfig, isMicrosoftClientConfigured } from "./config";

export type MicrosoftClientConfigPayload = {
  configured: boolean;
  clientId: string;
  tenantId: string;
  authority: string;
  redirectUri: string;
  scopes: string[];
  error?: string;
};

export function buildMicrosoftClientConfigPayload(): MicrosoftClientConfigPayload {
  const configured = isMicrosoftClientConfigured();
  const publicConfig = getMicrosoftPublicConfig();

  return {
    configured,
    clientId: configured ? publicConfig.clientId : "",
    tenantId: configured ? publicConfig.tenantId : "",
    authority: publicConfig.authority,
    redirectUri: publicConfig.redirectUri,
    scopes: publicConfig.scopes,
  };
}

/** JSON response for browser MSAL (non-secret Entra settings from runtime env). */
export function microsoftClientConfigResponse(): NextResponse<MicrosoftClientConfigPayload> {
  try {
    return NextResponse.json(buildMicrosoftClientConfigPayload());
  } catch (error) {
    console.error("[microsoft/client-config]", error);
    return NextResponse.json(
      {
        configured: false,
        clientId: "",
        tenantId: "",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "",
        scopes: [],
        error: "Microsoft sign-in settings could not be loaded.",
      },
      { status: 200 },
    );
  }
}

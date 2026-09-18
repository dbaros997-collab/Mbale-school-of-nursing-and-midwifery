import { NextResponse } from "next/server";
import { getMicrosoftPublicConfig, isMicrosoftClientConfigured } from "@/lib/microsoft/config";

export const dynamic = "force-dynamic";

/** Non-secret MSAL settings read from runtime env (for browser when build-time NEXT_PUBLIC_* was empty). */
export async function GET() {
  try {
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

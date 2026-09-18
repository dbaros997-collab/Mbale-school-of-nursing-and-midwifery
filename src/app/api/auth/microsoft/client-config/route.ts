import { microsoftClientConfigResponse } from "@/lib/microsoft/client-config-response";

export const dynamic = "force-dynamic";

/** Non-secret MSAL settings read from runtime env (for browser when build-time NEXT_PUBLIC_* was empty). */
export async function GET() {
  return microsoftClientConfigResponse();
}

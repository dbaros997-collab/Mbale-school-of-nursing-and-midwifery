import { microsoftClientConfigResponse } from "@/lib/microsoft/client-config-response";

export const dynamic = "force-dynamic";

/**
 * MSAL public settings (no "microsoft" in the URL — some browsers block that path segment).
 * Prefer this endpoint from the browser; `/api/auth/microsoft/client-config` remains for compatibility.
 */
export async function GET() {
  return microsoftClientConfigResponse();
}

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Minimal JSON for gateway webhooks — avoids large serialisation on the hot path. */
export function paymentWebhookResponse(ok: boolean, status: number): Response {
  return new Response(ok ? '{"ok":true}' : '{"ok":false}', {
    status,
    headers: {
      ...NO_STORE,
      "Content-Type": "application/json",
    },
  });
}

export function paymentApiJson<T extends Record<string, unknown>>(
  body: T,
  status: number,
): Response {
  return Response.json(body, { status, headers: NO_STORE });
}

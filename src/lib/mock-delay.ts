/** Artificial latency for local/demo UX — skipped in production deployments. */
export async function mockDelay(ms: number): Promise<void> {
  if (process.env.NODE_ENV === "production" || ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

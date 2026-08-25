const DEFAULT_TIMEOUT_MS = 12_000;

export class FetchTimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "FetchTimeoutError";
  }
}

/** fetch with AbortSignal timeout — prevents hung auth/Graph requests on slow networks. */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const { timeoutMs: _omit, ...fetchInit } = init ?? {};

  if (timeoutMs <= 0) {
    return fetch(input, fetchInit);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const upstreamSignal = fetchInit.signal;
  if (upstreamSignal) {
    if (upstreamSignal.aborted) {
      clearTimeout(timer);
      controller.abort(upstreamSignal.reason);
    } else {
      upstreamSignal.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          controller.abort(upstreamSignal.reason);
        },
        { once: true },
      );
    }
  }

  try {
    return await fetch(input, { ...fetchInit, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new FetchTimeoutError(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

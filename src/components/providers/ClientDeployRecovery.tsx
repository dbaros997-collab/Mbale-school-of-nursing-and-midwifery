"use client";

import { useEffect } from "react";

const RELOAD_KEY = "mbsnm-deploy-reload";

function shouldRecoverFromError(reason: unknown): boolean {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
        ? reason
        : "";
  const lower = message.toLowerCase();
  return (
    lower.includes("chunkloaderror") ||
    lower.includes("loading chunk") ||
    lower.includes("failed to fetch dynamically imported module") ||
    lower.includes("importing a module script failed")
  );
}

/**
 * After a deploy, cached HTML may reference old JS chunks → blank or error pages.
 * Reload once when the browser reports a stale chunk load.
 */
export function ClientDeployRecovery() {
  useEffect(() => {
    function tryReloadOnce(reason: unknown) {
      if (!shouldRecoverFromError(reason)) return;
      try {
        if (sessionStorage.getItem(RELOAD_KEY) === "1") return;
        sessionStorage.setItem(RELOAD_KEY, "1");
      } catch {
        /* private mode */
      }
      window.location.reload();
    }

    function onError(event: ErrorEvent) {
      tryReloadOnce(event.error ?? event.message);
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      tryReloadOnce(event.reason);
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}

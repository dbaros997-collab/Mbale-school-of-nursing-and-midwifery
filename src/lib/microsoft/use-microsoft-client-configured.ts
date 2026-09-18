"use client";

import { useEffect, useState } from "react";
import { isMicrosoftBrowserPublicConfigReady, loadMicrosoftBrowserPublicConfig } from "./browser-public-config";

/** Whether MSAL can start (build-time or runtime Azure client + tenant IDs). */
export function useMicrosoftClientConfigured(): boolean {
  const [configured, setConfigured] = useState(isMicrosoftBrowserPublicConfigReady());

  useEffect(() => {
    if (configured) return;

    let cancelled = false;
    void loadMicrosoftBrowserPublicConfig()
      .then(() => {
        if (!cancelled) setConfigured(true);
      })
      .catch(() => {
        if (!cancelled) setConfigured(false);
      });

    return () => {
      cancelled = true;
    };
  }, [configured]);

  return configured;
}

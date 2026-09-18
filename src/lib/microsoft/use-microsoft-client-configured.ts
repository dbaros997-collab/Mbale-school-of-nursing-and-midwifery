"use client";

import { useEffect, useState } from "react";
import { probeMicrosoftClientConfigured } from "./browser-public-config";

/** Whether MSAL can start — resolved from server runtime env via /api/auth/microsoft/client-config. */
export function useMicrosoftClientConfigured(): boolean {
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void probeMicrosoftClientConfigured().then((ready) => {
      if (!cancelled) setConfigured(ready);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return configured;
}

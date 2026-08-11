"use client";

import { useCallback, useState } from "react";
import type { ApplicationPayload } from "@/lib/data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useSubmitApplication() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (payload: ApplicationPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await delay(900);
      if (!payload.fullName || !payload.email || !payload.programId) {
        throw new Error("Please complete all required fields.");
      }
      // Ready for backend integration (POST /api/applications)
      console.info("Mock application submitted", payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSuccess(false);
    setError(null);
  }, []);

  return { submit, loading, success, error, reset };
}

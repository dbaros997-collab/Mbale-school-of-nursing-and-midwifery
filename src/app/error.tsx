"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-surface px-4 py-16 text-center">
      <p className="font-display text-2xl font-semibold text-primary">
        Something went wrong loading this page
      </p>
      <p className="mt-3 max-w-md text-sm text-muted">
        This can happen briefly while the site updates. Reload to fetch the latest version, or
        return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" variant="navy" onClick={() => reset()}>
          Try again
        </Button>
        <Button type="button" variant="ghost" onClick={() => window.location.assign("/")}>
          Go to homepage
        </Button>
      </div>
    </div>
  );
}

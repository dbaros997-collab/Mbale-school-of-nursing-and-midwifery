"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center font-sans">
        <h1 className="text-xl font-semibold text-[#1a365d]">Site temporarily unavailable</h1>
        <p className="mt-2 max-w-md text-sm text-neutral-600">
          Please reload. If this continues, wait a minute and try again — the server may be
          finishing an update.
        </p>
        <button
          type="button"
          className="mt-6 rounded-lg bg-[#1a365d] px-5 py-2.5 text-sm font-semibold text-white"
          onClick={() => reset()}
        >
          Reload
        </button>
      </body>
    </html>
  );
}

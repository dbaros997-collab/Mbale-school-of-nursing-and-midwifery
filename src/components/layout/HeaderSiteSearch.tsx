"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { siteSearchEntries } from "@/lib/data";
import { cn } from "@/lib/utils";

type HeaderSiteSearchProps = {
  glassHome?: boolean;
};

export function HeaderSiteSearch({ glassHome = false }: HeaderSiteSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return siteSearchEntries.slice(0, 8);
    return siteSearchEntries.filter(
      (entry) =>
        entry.label.toLowerCase().includes(q) || entry.keywords.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center transition focus-ring",
          glassHome ? "text-white hover:text-brand-sky" : "text-white hover:text-brand-sky",
        )}
        aria-expanded={open}
        aria-controls="site-search-dialog"
        aria-label="Search website"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" aria-hidden />
      </button>

      {open ? (
        <div
          id="site-search-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Search website"
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 pt-[calc(var(--site-status-bar-height)+var(--site-header-height)+1rem)] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-panel p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search programmes, portal, admissions…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              />
              <button
                type="button"
                className="rounded p-1 text-muted hover:text-primary focus-ring"
                aria-label="Close search"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="mt-2 max-h-[min(60vh,320px)] overflow-y-auto">
              {results.length === 0 ? (
                <li className="px-2 py-3 text-sm text-muted">No matches. Try “admissions” or “portal”.</li>
              ) : (
                results.map((entry) => (
                  <li key={entry.href + entry.label}>
                    <Link
                      href={entry.href}
                      className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-primary hover:bg-surface"
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      {entry.label}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}

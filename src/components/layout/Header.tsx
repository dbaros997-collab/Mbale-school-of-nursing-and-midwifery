"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, SCHOOL } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SchoolLogo } from "@/components/layout/SchoolLogo";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !isHome || scrolled || open;

  return (
    <header
      className={cn(
        "z-[60] transition-all duration-300",
        // On the home face: sit ON the rounded hero photo (same inset as Hero)
        isHome && !solid
          ? "absolute left-3 right-3 top-3 overflow-hidden rounded-t-[28px] sm:left-4 sm:right-4 sm:top-4 sm:rounded-t-[44px] lg:left-5 lg:right-5 lg:top-5 lg:rounded-t-[60px]"
          : "fixed inset-x-0 top-0",
        // See-through bar — no solid blue
        solid
          ? "bg-black/25 shadow-[0_4px_18px_rgba(0,0,0,0.18)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="flex w-full items-stretch">
        <Link
          href="/"
          className="header-logo-cell group relative z-10 flex shrink-0 items-center focus-ring"
          aria-label={SCHOOL.name}
        >
          <span className="relative z-[1] bg-white px-4 py-3 sm:px-5 sm:py-4 lg:pl-8 lg:pr-6">
            <SchoolLogo className={cn(solid ? "h-[52px] sm:h-[56px]" : "h-[58px] sm:h-[66px]")} />
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-0 bg-transparent px-2 sm:px-4 lg:px-6">
          <nav
            className="hidden flex-wrap items-center justify-end sm:flex"
            aria-label="main navigation"
          >
            {mainNav.map((item) => {
              const hasMega = "columns" in item && !!item.columns;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasMega && setActiveMega(item.label)}
                  onMouseLeave={() => setActiveMega(null)}
                >
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 px-2 py-4 text-[13px] font-bold text-white transition hover:text-accent-gold md:px-2.5 md:text-sm lg:px-3.5 lg:text-[15px]"
                  >
                    {item.label}
                    {hasMega ? (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    ) : null}
                  </Link>

                  <AnimatePresence>
                    {hasMega && activeMega === item.label ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute left-0 top-full z-50 min-w-[260px] overflow-hidden rounded-b-md border border-black/10 bg-white shadow-2xl"
                      >
                        {item.columns?.map((col) => (
                          <div key={col.title}>
                            <p className="border-b border-border bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
                              {col.title}
                            </p>
                            <ul>
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    className="block px-4 py-2.5 text-sm text-foreground transition hover:bg-primary hover:text-white"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <Link
            href="/portal"
            className="ml-2 hidden shrink-0 rounded-sm bg-white/90 px-3 py-2 text-sm font-bold text-[#002868] transition hover:bg-white focus-ring sm:inline-flex md:ml-3 md:px-4 md:py-2.5"
          >
            My MBSNM
          </Link>

          <button
            type="button"
            className="ml-2 inline-flex rounded border border-white/50 p-2 text-white sm:hidden focus-ring"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/15 bg-black/40 backdrop-blur-md sm:hidden"
          >
            <nav className="space-y-1 px-4 py-3" aria-label="Mobile">
              {mainNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/portal"
                className="mt-2 block rounded bg-white/90 px-3 py-2.5 text-center text-sm font-bold text-[#002868]"
                onClick={() => setOpen(false)}
              >
                My MBSNM
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, SCHOOL } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { HeaderPortalActions } from "@/components/layout/HeaderPortalActions";

type NavItem = (typeof mainNav)[number];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const activeItem = mainNav.find((item) => item.label === activeMega) ?? null;
  const megaOpen = Boolean(activeItem);
  const showNavyHeader = !isHome || megaOpen;
  const glassHome = isHome && !megaOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveMega(null);
    setOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setActiveMega(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveMega(null);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMega(label: string) {
    clearCloseTimer();
    setActiveMega(label);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setActiveMega(null), 160);
  }

  return (
    <header
      ref={headerRef}
      onMouseLeave={scheduleClose}
      onMouseEnter={clearCloseTimer}
      className="fixed inset-x-0 top-[var(--site-status-bar-height)] z-[60] transition-all duration-300"
    >
      <div
        className={cn(
          "relative flex w-full items-stretch transition-all duration-300",
          showNavyHeader
            ? "header-navy-row header-bar-accent-navy shadow-[0_8px_28px_rgba(22,53,127,0.28)]"
            : glassHome
              ? "bg-transparent"
              : "header-navy-row header-bar-accent-navy",
        )}
      >
        <Link
          href="/"
          className="group relative z-10 flex shrink-0 items-center bg-transparent px-3 py-2 focus-ring sm:px-4 sm:py-2.5 lg:pl-6 lg:pr-5"
          aria-label={SCHOOL.name}
        >
          <SchoolLogo className="header-logo-blend" />
        </Link>

        <div
          className={cn(
            "flex min-w-0 flex-1 items-center justify-end gap-0 px-2 sm:px-4 lg:px-6",
            glassHome &&
              (scrolled || open
                ? "border-b border-white/15 bg-black/35"
                : "bg-gradient-to-b from-black/50 via-black/20 to-transparent"),
          )}
        >
          <nav
            className="hidden flex-wrap items-center justify-end sm:flex"
            aria-label="main navigation"
          >
            {mainNav.map((item) => {
              const hasMega = "columns" in item && !!item.columns;
              const isActive = activeMega === item.label;
              const emphasized = "emphasize" in item && item.emphasize;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasMega && openMega(item.label)}
                >
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 focus-ring",
                      emphasized
                        ? "btn-pill ml-2 rounded-full bg-brand-green px-3 py-2 text-sm font-bold text-white transition hover:bg-brand-green-dark md:ml-3 md:px-4 md:py-2.5"
                        : "px-2 py-4 text-[13px] font-bold text-white transition hover:text-brand-sky md:px-2.5 md:text-sm lg:px-3.5 lg:text-[15px]",
                      isActive && !emphasized && "text-brand-sky",
                    )}
                    aria-expanded={isActive}
                    aria-haspopup={hasMega ? "true" : undefined}
                    aria-controls={hasMega ? "mega-menu" : undefined}
                    onClick={() => {
                      if (!hasMega) return;
                      openMega(item.label);
                    }}
                  >
                    {item.label}
                    {hasMega ? (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                          isActive && "rotate-180",
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </button>

                  {isActive ? (
                    <span
                      className="pointer-events-none absolute bottom-0 left-1/2 z-[70] h-0 w-0 -translate-x-1/2 border-x-[7px] border-b-[8px] border-x-transparent border-b-brand-green"
                      aria-hidden
                    />
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="hidden md:flex">
            <HeaderPortalActions glassHome={glassHome} showPortalLink={!isHome} />
          </div>

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
        {activeItem ? (
          <motion.div
            key="mega-menu"
            id="mega-menu"
            role="region"
            aria-label={`${activeItem.label} menu`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-50 hidden bg-panel sm:block"
            onMouseEnter={clearCloseTimer}
          >
            <MegaPanel item={activeItem} onNavigate={() => setActiveMega(null)} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/15 bg-primary/95 backdrop-blur-md sm:hidden"
          >
            <nav className="space-y-1 px-4 py-3" aria-label="Mobile">
              <div className="mb-3 rounded-lg border border-white/15 bg-white/5 px-3 py-3">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-yellow">
                  Student access
                </p>
                <HeaderPortalActions
                  layout="stacked"
                  showPortalLink={!isHome}
                  onNavigate={() => setOpen(false)}
                />
              </div>
              {mainNav.map((item) => {
                const hasMega = "columns" in item && !!item.columns;
                const expanded = mobileSection === item.label;
                const emphasized = "emphasize" in item && item.emphasize;

                if (!hasMega) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.label} className="rounded bg-white/5">
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-sm font-semibold text-white",
                        emphasized && "bg-brand-yellow text-primary",
                      )}
                      aria-expanded={expanded}
                      onClick={() =>
                        setMobileSection((current) => (current === item.label ? null : item.label))
                      }
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
                        aria-hidden
                      />
                    </button>
                    {expanded ? (
                      <div className="space-y-3 border-t border-white/10 px-3 py-3">
                        {item.columns?.map((col) => (
                          <div key={col.title}>
                            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-gold">
                              {col.title}
                            </p>
                            <ul className="space-y-0.5">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    className="block rounded px-2 py-1.5 text-sm text-white/90 hover:bg-white/10"
                                    onClick={() => setOpen(false)}
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {"featured" in item && item.featured ? (
                          <Link
                            href={item.featured.href}
                            className="block rounded bg-accent-gold px-3 py-2 text-center text-sm font-bold text-primary-dark"
                            onClick={() => setOpen(false)}
                          >
                            {item.featured.cta}
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function MegaPanel({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const columns = "columns" in item ? item.columns : undefined;
  const featured = "featured" in item ? item.featured : undefined;
  const columnCount = columns?.length ?? 0;

  return (
    <div className="border-t-[3px] border-brand-green bg-panel text-foreground shadow-[0_18px_40px_rgba(22,53,127,0.12)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div
          className={cn(
            "grid gap-8 lg:gap-10",
            featured && columnCount >= 3
              ? "lg:grid-cols-4"
              : featured
                ? "lg:grid-cols-3"
                : "lg:grid-cols-3",
          )}
        >
          {columns?.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2.5 text-sm text-foreground transition hover:text-primary"
                      onClick={onNavigate}
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green text-white">
                        <ChevronRight className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="group-hover:underline">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {featured ? (
            <div className="relative overflow-hidden rounded-sm bg-primary p-6 text-white">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 14px 14px, rgba(255,255,255,0.45) 0 1.4px, transparent 2px)
                  `,
                  backgroundSize: "28px 28px",
                }}
              />
              <p className="relative text-[11px] font-bold uppercase tracking-[0.16em] text-brand-yellow">
                {featured.eyebrow}
              </p>
              <h4 className="relative mt-3 text-lg font-bold leading-snug">{featured.title}</h4>
              {"microsoftSignIn" in featured && featured.microsoftSignIn ? (
                <HeaderPortalActions layout="stacked" onNavigate={onNavigate} />
              ) : (
                <Link
                  href={featured.href}
                  className="btn-pill relative mt-5 inline-flex min-w-[120px] items-center justify-center rounded-full bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green-dark focus-ring"
                  onClick={onNavigate}
                >
                  {featured.cta}
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

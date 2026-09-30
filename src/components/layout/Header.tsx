"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { headerApplyCta, mainNav, quickLinks, SCHOOL } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { HeaderPortalActions } from "@/components/layout/HeaderPortalActions";
import { HeaderSiteSearch } from "@/components/layout/HeaderSiteSearch";

type NavItem = (typeof mainNav)[number];

type MegaNavLink = {
  label: string;
  href: string;
  external?: boolean;
};

type MegaNavItem = NavItem & {
  columns: readonly {
    title: string;
    links: readonly MegaNavLink[];
  }[];
};

function MegaNavAnchor({
  link,
  className,
  onNavigate,
  children,
}: {
  link: MegaNavLink;
  className: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const external = link.external ?? /^https?:\/\//i.test(link.href);
  if (external) {
    return (
      <a
        href={link.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}

function navHasDropdown(item: NavItem): boolean {
  if ("quickLinksMenu" in item && item.quickLinksMenu) return true;
  return "columns" in item && !!item.columns?.length;
}

function resolveMegaNavItem(item: NavItem | null): MegaNavItem | null {
  if (!item) return null;
  if ("quickLinksMenu" in item && item.quickLinksMenu) {
    return {
      ...item,
      columns: [
        {
          title: "Portals & apply",
          links: quickLinks.slice(0, 4),
        },
        {
          title: "Admissions & study",
          links: quickLinks.slice(4, 7),
        },
        {
          title: "Campus & web",
          links: quickLinks.slice(7),
        },
      ],
    };
  }
  if ("columns" in item && item.columns?.length) {
    return item as MegaNavItem;
  }
  return null;
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const activeRaw = mainNav.find((item) => item.label === activeMega) ?? null;
  const activeItem = resolveMegaNavItem(activeRaw);
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
          "relative flex w-full min-h-[var(--site-header-height)] items-center transition-all duration-300",
          showNavyHeader
            ? "header-navy-row header-bar-accent-navy shadow-[0_8px_28px_rgba(22,53,127,0.28)]"
            : glassHome
              ? scrolled || open
                ? "border-b border-white/15 bg-black/45 backdrop-blur-sm"
                : "bg-gradient-to-b from-black/55 via-black/25 to-transparent"
              : "header-navy-row header-bar-accent-navy",
        )}
      >
        <Link
          href="/"
          className={cn(
            "group relative z-10 flex shrink-0 items-center px-3 py-2 focus-ring sm:px-4 lg:pl-6 lg:pr-4",
            glassHome && "drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]",
          )}
          aria-label={SCHOOL.name}
        >
          <SchoolLogo />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-0 px-2 sm:px-4 lg:px-6">
          <nav
            className="hidden flex-wrap items-center justify-end sm:flex"
            aria-label="main navigation"
          >
            {mainNav.map((item) => {
              const hasDropdown = navHasDropdown(item);
              const isActive = activeMega === item.label;
              const linkClass = cn(
                "inline-flex items-center gap-1 px-2 py-4 text-[13px] font-bold text-white transition hover:text-brand-sky focus-ring md:px-2.5 md:text-sm lg:px-3 lg:text-[15px]",
                isActive && "text-brand-sky",
              );

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasDropdown && openMega(item.label)}
                >
                  {hasDropdown ? (
                    <button
                      type="button"
                      className={linkClass}
                      aria-expanded={isActive}
                      aria-haspopup="true"
                      aria-controls="mega-menu"
                      onClick={() => openMega(item.label)}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                          isActive && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                  ) : (
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  )}

                  {isActive ? (
                    <span
                      className="pointer-events-none absolute bottom-0 left-1/2 z-[70] h-0 w-0 -translate-x-1/2 border-x-[7px] border-b-[8px] border-x-transparent border-b-brand-green"
                      aria-hidden
                    />
                  ) : null}
                </div>
              );
            })}

            <Link
              href={headerApplyCta.href}
              className="ml-2 inline-flex shrink-0 items-center justify-center bg-brand-yellow px-3 py-2 text-[13px] font-bold text-primary-dark transition hover:bg-brand-yellow/90 focus-ring md:ml-3 md:px-4 md:text-sm"
            >
              {headerApplyCta.label}
            </Link>
          </nav>

          <div className="hidden items-center md:flex">
            <HeaderSiteSearch glassHome={glassHome} />
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
                  Student &amp; staff access
                </p>
                <HeaderPortalActions
                  layout="stacked"
                  showPortalLink={!isHome}
                  onNavigate={() => setOpen(false)}
                />
              </div>
              <Link
                href={headerApplyCta.href}
                className="mb-2 block rounded bg-brand-yellow px-3 py-2.5 text-center text-sm font-bold text-primary-dark"
                onClick={() => setOpen(false)}
              >
                {headerApplyCta.label}
              </Link>
              {mainNav.map((item) => {
                const hasDropdown = navHasDropdown(item);
                const expanded = mobileSection === item.label;
                const megaItem = resolveMegaNavItem(item);

                if (!hasDropdown) {
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
                      className="flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-sm font-semibold text-white"
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
                    {expanded && megaItem ? (
                      <div className="space-y-3 border-t border-white/10 px-3 py-3">
                        {megaItem.columns.map((col) => (
                          <div key={col.title}>
                            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-gold">
                              {col.title}
                            </p>
                            <ul className="space-y-0.5">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <MegaNavAnchor
                                    link={link}
                                    className="block rounded px-2 py-1.5 text-sm text-white/90 hover:bg-white/10"
                                    onNavigate={() => setOpen(false)}
                                  >
                                    {link.label}
                                  </MegaNavAnchor>
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

type MegaFeatured = NonNullable<
  Extract<NavItem, { featured?: unknown }> extends infer T
    ? T extends { featured?: infer F }
      ? F
      : never
    : never
>;

function MegaFeaturedPanel({
  featured,
  onNavigate,
}: {
  featured: MegaFeatured;
  onNavigate: () => void;
}) {
  const image = "image" in featured && featured.image ? featured.image : undefined;
  const imageAlt =
    "imageAlt" in featured && featured.imageAlt ? featured.imageAlt : "Campus highlight";

  const copy = (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-yellow">
        {featured.eyebrow}
      </p>
      <h4 className="mt-3 text-lg font-bold leading-snug lg:text-xl">{featured.title}</h4>
      {"microsoftSignIn" in featured && featured.microsoftSignIn ? (
        <div className="mt-5">
          <HeaderPortalActions layout="stacked" showStaffAdmin={false} onNavigate={onNavigate} />
        </div>
      ) : (
        <Link
          href={featured.href}
          className="btn-pill mt-5 inline-flex min-w-[120px] items-center justify-center rounded-full bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-green-dark focus-ring"
          onClick={onNavigate}
        >
          {featured.cta}
        </Link>
      )}
    </>
  );

  if (!image) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-primary p-6 text-white shadow-[0_12px_32px_rgba(22,53,127,0.18)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `radial-gradient(circle at 14px 14px, rgba(255,255,255,0.45) 0 1.4px, transparent 2px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex flex-col justify-center">{copy}</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border/80 bg-primary text-white shadow-[0_12px_32px_rgba(22,53,127,0.2)] lg:grid lg:min-h-[320px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
      <div className="relative z-10 order-2 flex flex-col justify-center bg-primary p-6 lg:order-1 lg:p-7">
        {copy}
      </div>
      <div className="relative order-1 min-h-[220px] bg-neutral-100 lg:order-2 lg:min-h-full">
        <Image
          src={image}
          alt={imageAlt}
          fill
          quality={92}
          className="object-cover object-center contrast-[1.03] saturate-[1.06]"
          sizes="(max-width: 1024px) 100vw, 420px"
        />
      </div>
    </div>
  );
}

function MegaPanel({ item, onNavigate }: { item: MegaNavItem; onNavigate: () => void }) {
  const columns = item.columns;
  const featured = "featured" in item ? item.featured : undefined;
  const columnCount = columns?.length ?? 0;

  return (
    <div className="border-t-[3px] border-brand-green bg-gradient-to-b from-white to-panel text-foreground shadow-[0_18px_40px_rgba(22,53,127,0.12)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div
          className={cn(
            "grid gap-8 lg:items-stretch lg:gap-8 xl:gap-10",
            featured && columnCount >= 3
              ? "lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(300px,420px)]"
              : featured
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(300px,420px)]"
                : "lg:grid-cols-3",
          )}
        >
          {columns?.map((col, colIndex) => (
            <div
              key={col.title}
              className={cn(
                "min-w-0",
                colIndex < columnCount - 1 &&
                  "lg:border-r lg:border-border/70 lg:pr-6 xl:pr-8",
              )}
            >
              <p className="border-b-2 border-brand-green/35 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <MegaNavAnchor
                      link={link}
                      className="group flex items-center gap-2.5 text-sm text-foreground transition hover:text-primary"
                      onNavigate={onNavigate}
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green text-white shadow-sm">
                        <ChevronRight className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="group-hover:underline">{link.label}</span>
                    </MegaNavAnchor>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {featured ? (
            <MegaFeaturedPanel featured={featured} onNavigate={onNavigate} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

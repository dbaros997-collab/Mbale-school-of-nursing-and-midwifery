"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { headerApplyCta, mainNav, quickLinks, SCHOOL, schoolWhatsAppUrl } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SchoolLogo } from "@/components/layout/SchoolLogo";
import { HeaderPortalActions } from "@/components/layout/HeaderPortalActions";
import { HeaderSiteSearch } from "@/components/layout/HeaderSiteSearch";

type NavItem = (typeof mainNav)[number];

/** Keeps white mega-menu type readable on bright photo backgrounds. */
const megaMenuTextShadow =
  "[text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_14px_rgba(0,0,0,0.55)]";

const MEGA_WALLPAPER_VERSION = "mega-v4-hq";
const DEFAULT_MEGA_WALLPAPER = "/images/gallery/mega/about-campus.jpg";

function megaMenuWallpaperUrl(path: string) {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${MEGA_WALLPAPER_VERSION}`;
}

/** Full-resolution campus photo — avoids Next image compression on large nav backdrops. */
function MegaMenuWallpaper({ src }: { src: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={megaMenuWallpaperUrl(src)}
        alt=""
        className="mega-menu-wallpaper"
        decoding="async"
        fetchPriority="high"
        sizes="100vw"
      />
      <div className="mega-menu-wallpaper-scrim" aria-hidden />
    </>
  );
}

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

function navFeaturedImage(item: NavItem | null): string | undefined {
  if (!item || !("featured" in item) || !item.featured) return undefined;
  const featured = item.featured;
  const image = "image" in featured && featured.image ? featured.image : undefined;
  if (!image || image.includes("/images/hero/")) return undefined;
  return image;
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
  const megaBackdropImage = navFeaturedImage(activeRaw);
  const mobileNavRaw =
    mainNav.find((item) => item.label === mobileSection) ??
    mainNav.find((item) => navHasDropdown(item)) ??
    null;
  const mobileWallpaper =
    navFeaturedImage(mobileNavRaw) ?? DEFAULT_MEGA_WALLPAPER;
  const showNavyHeader = !isHome || megaOpen;
  const glassHome = isHome && !megaOpen;
  const navPhotoOpen = megaOpen || open;

  useEffect(() => {
    document.documentElement.classList.toggle("mega-nav-open", navPhotoOpen);
    return () => document.documentElement.classList.remove("mega-nav-open");
  }, [navPhotoOpen]);

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
      className={cn(
        "fixed inset-x-0 top-[var(--site-status-bar-height)] z-[60] transition-all duration-300",
        megaOpen && "z-[62]",
      )}
    >
      <div
        className={cn(
          "relative isolate",
          megaOpen && "border-b-[3px] border-brand-green shadow-[0_24px_56px_rgba(0,0,0,0.35)]",
        )}
      >
        {megaOpen && megaBackdropImage ? (
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-primary"
            aria-hidden
          >
            <MegaMenuWallpaper src={megaBackdropImage} />
          </div>
        ) : null}

        <div
          className={cn(
            "relative z-10 flex w-full min-h-[var(--site-header-height)] items-center transition-all duration-300",
            showNavyHeader
              ? megaOpen && megaBackdropImage
                ? "border-b border-white/20 bg-transparent shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
                : "header-navy-row header-bar-accent-navy shadow-[0_8px_28px_rgba(22,53,127,0.28)]"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 hidden w-full sm:block"
              onMouseEnter={clearCloseTimer}
            >
              <MegaPanel item={activeItem} onNavigate={() => setActiveMega(null)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative overflow-hidden border-t border-white/15 sm:hidden"
          >
            {open ? (
              <div className="pointer-events-none absolute inset-0 bg-primary" aria-hidden>
                <MegaMenuWallpaper src={mobileWallpaper} />
              </div>
            ) : null}
            <nav className="relative z-10 space-y-1 px-4 py-3" aria-label="Mobile">
              <div className="mb-3 rounded-lg border border-white/15 bg-white/5 px-3 py-3">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-yellow">
                  Contact us
                </p>
                <ul className="space-y-1.5 text-sm text-white/95">
                  <li>
                    <a
                      href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`}
                      className="block rounded px-2 py-1 hover:bg-white/10 focus-ring"
                    >
                      Call {SCHOOL.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={schoolWhatsAppUrl(`Hello ${SCHOOL.shortName}, I would like to enquire.`)}
                      className="block rounded px-2 py-1 text-[#25D366] hover:bg-white/10 focus-ring"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${SCHOOL.email}`}
                      className="block rounded px-2 py-1 hover:bg-white/10 focus-ring"
                    >
                      {SCHOOL.email}
                    </a>
                  </li>
                </ul>
              </div>
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
                            <p className="mb-1.5 font-display text-base font-semibold text-brand-yellow">
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

function MegaFeaturedCallout({
  featured,
  onNavigate,
}: {
  featured: MegaFeatured;
  onNavigate: () => void;
}) {
  return (
    <div className="mt-8 border-t border-white/25 pt-6 lg:mt-10 lg:pt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-yellow">
            {featured.eyebrow}
          </p>
          <p
            className={cn(
              "mt-1 font-display text-lg font-semibold leading-snug text-white sm:text-xl",
              megaMenuTextShadow,
            )}
          >
            {featured.title}
          </p>
        </div>
        {"microsoftSignIn" in featured && featured.microsoftSignIn ? (
          <div className="shrink-0">
            <HeaderPortalActions layout="stacked" showStaffAdmin={false} onNavigate={onNavigate} />
          </div>
        ) : (
          <Link
            href={featured.href}
            className="btn-pill inline-flex shrink-0 items-center justify-center rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-bold text-primary-dark shadow-sm transition hover:bg-brand-yellow/90 focus-ring"
            onClick={onNavigate}
          >
            {featured.cta}
          </Link>
        )}
      </div>
    </div>
  );
}

function MegaPanel({ item, onNavigate }: { item: MegaNavItem; onNavigate: () => void }) {
  const columns = item.columns;
  const featured = "featured" in item ? item.featured : undefined;
  const columnCount = columns?.length ?? 0;

  return (
    <div className="relative overflow-hidden text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8 lg:py-11">
        <div
          className={cn(
            "grid gap-8 lg:gap-x-10 lg:gap-y-6",
            columnCount >= 3
              ? "lg:grid-cols-3"
              : columnCount === 2
                ? "lg:grid-cols-2"
                : "lg:grid-cols-1",
          )}
        >
          {columns?.map((col, colIndex) => (
            <div
              key={col.title}
              className={cn(
                "min-w-0",
                colIndex < columnCount - 1 && "lg:border-r lg:border-white/25 lg:pr-8 xl:pr-10",
              )}
            >
              <h3
                className={cn(
                  "font-display border-b border-white/30 pb-2 text-xl font-semibold text-white sm:text-[1.35rem]",
                  megaMenuTextShadow,
                )}
              >
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => {
                  const external = link.external ?? /^https?:\/\//i.test(link.href);
                  return (
                    <li key={link.label}>
                      <MegaNavAnchor
                        link={link}
                        className={cn(
                          "group inline-flex items-center gap-1.5 text-[15px] leading-snug text-white transition hover:text-brand-yellow",
                          megaMenuTextShadow,
                        )}
                        onNavigate={onNavigate}
                      >
                        <span className="group-hover:underline">{link.label}</span>
                        {external ? (
                          <ExternalLink
                            className="h-3.5 w-3.5 shrink-0 text-white/70 opacity-90"
                            aria-hidden
                          />
                        ) : null}
                      </MegaNavAnchor>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {featured ? <MegaFeaturedCallout featured={featured} onNavigate={onNavigate} /> : null}
      </div>
    </div>
  );
}

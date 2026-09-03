"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { discoveryRoles, discoveryTopics } from "@/lib/data";
import { cn } from "@/lib/utils";

const DISCOVERY_ASSET_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "discovery-v2";

function discoveryAsset(path: string) {
  return `${path}?v=${DISCOVERY_ASSET_VERSION}`;
}

const ctaItems = [
  {
    title: "About",
    href: "/#about",
    image: "/images/discovery/discovery-about.webp",
    objectPosition: "50% 35%",
    color: "var(--brand-yellow)",
    textColor: "var(--primary-dark)",
    reverse: false,
    offset: "ml-0 sm:ml-3",
    from: "left" as const,
  },
  {
    title: "Programs",
    href: "/academics",
    image: "/images/discovery/discovery-programs.webp",
    objectPosition: "center center",
    color: "var(--brand-green)",
    textColor: "#ffffff",
    reverse: true,
    offset: "ml-0 sm:ml-8 lg:ml-12",
    from: "right" as const,
  },
];

export function Discovery() {
  const router = useRouter();
  const [role, setRole] = useState("prospective");
  const [topic, setTopic] = useState("");
  const topics = useMemo(() => discoveryTopics[role] ?? [], [role]);

  function navigateHref(href: string) {
    const hashIndex = href.indexOf("#");
    if (hashIndex !== -1) {
      const path = href.slice(0, hashIndex) || "/";
      const hash = href.slice(hashIndex + 1);
      if ((path === "/" || path === window.location.pathname) && hash) {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${hash}`);
          return;
        }
      }
    }
    router.push(href);
  }

  function onShow() {
    const match = topic
      ? topics.find((t) => t.value === topic)
      : topics[0];
    if (match) navigateHref(match.href);
  }

  return (
    <section className="relative z-10 mt-0 bg-transparent">
      <div className="brand-tricolor-rule" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-t-[28px] content-panel px-4 pb-12 pt-8 shadow-[0_-8px_30px_rgba(22,53,127,0.06)] sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Left: content discovery (Makerere col-lg-8) */}
            <div className="lg:col-span-7">
              <div className="relative mb-6 max-w-xl rounded-sm bg-primary px-4 py-3 text-sm text-white">
                Use the choices below to gain immediate access to the resources you require. Example: I
                am a/an prospective student seeking related information on admission.
                <span className="absolute -bottom-2 left-8 h-0 w-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-primary" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                <label className="min-w-[160px] flex-1">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">
                    I am a/an..
                  </span>
                  <select
                    className={selectClass}
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setTopic("");
                    }}
                  >
                    {discoveryRoles.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="min-w-[200px] flex-[1.3]">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">
                    seeking related information
                  </span>
                  <select
                    className={selectClass}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="">Select Option</option>
                    {topics.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={onShow}
                  className="rounded-sm bg-brand-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-green-dark focus-ring"
                >
                  Show me the information
                </button>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">
                While this is not a comprehensive list of the options you require, it is based on the
                most requested for information from MBSNM. Unable to find what you&apos;re looking for?{" "}
                <Link href="/contact" className="font-semibold text-primary underline-offset-2 hover:underline">
                  Let us know
                </Link>
              </p>
            </div>

            {/* Right: About / Programs */}
            <div className="flex flex-col justify-center gap-1 lg:col-span-5">
              {ctaItems.map((item, index) => (
                <CtaPill key={item.title} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaPill({
  item,
  index,
}: {
  item: (typeof ctaItems)[number];
  index: number;
}) {
  const xFrom = item.from === "left" ? -72 : 72;

  return (
    <motion.div
      className={cn("cta-style-one", item.offset)}
      initial={{ opacity: 0, x: xFrom }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{
        duration: 0.65,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={item.href}
        className={cn(
          "group relative flex h-[88px] w-full overflow-hidden rounded-[80px] transition hover:opacity-95 focus-ring sm:h-[96px]",
          item.reverse && "flex-row-reverse",
        )}
      >
        <span
          className="relative z-10 flex h-full w-[150px] min-w-[150px] shrink-0 items-center justify-center rounded-[80px] px-2 text-center transition group-hover:brightness-105 sm:w-[170px] sm:min-w-[170px]"
          style={{ backgroundColor: item.color, color: item.textColor }}
        >
          <span className="text-base font-medium leading-tight tracking-tight sm:text-lg">
            {item.title}
          </span>
        </span>

        <div className="relative min-h-full min-w-0 flex-1">
          <Image
            src={discoveryAsset(item.image)}
            alt=""
            fill
            sizes="(max-width: 1024px) 55vw, 320px"
            quality={90}
            className="object-cover transition group-hover:scale-[1.02]"
            style={{ objectPosition: item.objectPosition }}
            aria-hidden
          />
        </div>
      </Link>
    </motion.div>
  );
}

const selectClass =
  "w-full rounded-sm border border-border bg-panel px-3 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/25";

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { discoveryRoles, discoveryTopics } from "@/lib/data";
import { cn } from "@/lib/utils";

const DISCOVERY_ASSET_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "discovery-v1";

function discoveryAsset(path: string) {
  return `${path}?v=${DISCOVERY_ASSET_VERSION}`;
}

const ctaItems = [
  {
    title: "About",
    href: "/#about",
    image: "/images/discovery/discovery-about.jpg",
    color: "var(--brand-yellow)",
    textColor: "var(--primary-dark)",
    reverse: false,
    offset: "ml-0 sm:ml-3",
    from: "left" as const,
  },
  {
    title: "MBSNM Online",
    href: "/portal",
    image: "/images/discovery/discovery-online.jpg",
    color: "var(--primary)",
    textColor: "#ffffff",
    reverse: false,
    offset: "mr-0 sm:mr-8 lg:mr-12",
    from: "left" as const,
  },
];

export function Discovery() {
  const router = useRouter();
  const [role, setRole] = useState("prospective");
  const [topic, setTopic] = useState("");
  const topics = useMemo(() => discoveryTopics[role] ?? [], [role]);

  function onShow() {
    const match = topics.find((t) => t.value === topic) ?? topics[0];
    if (match) router.push(match.href);
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

            {/* Right: About / MBSNM Online */}
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
          "group relative flex h-[88px] w-full overflow-hidden rounded-[80px] sm:h-[96px]",
          item.reverse && "flex-row-reverse",
        )}
        aria-label={item.title}
      >
        {/* Full-bleed photo */}
        <span
          className="absolute inset-0 z-0 rounded-[80px] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url('${discoveryAsset(item.image)}')` }}
          aria-hidden
        />
        <span className="absolute inset-0 z-0 rounded-[80px] bg-black/10" aria-hidden />

        {/* Colored label capsule — wider for longer titles */}
        <motion.span
          className="relative z-10 flex h-full w-[150px] min-w-[150px] items-center justify-center rounded-[80px] px-2 text-center transition-all duration-300 ease-in-out group-hover:w-[200px] group-hover:opacity-90 sm:w-[170px] sm:min-w-[170px]"
          style={{ backgroundColor: item.color, color: item.textColor }}
          whileHover={{ x: item.reverse ? -6 : 6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <span className="text-base font-medium leading-tight tracking-tight sm:text-lg">
            {item.title}
          </span>
        </motion.span>

        {/* Spacer so the colored pill sits left/right while image shows beside it */}
        <span className="relative z-10 flex-1" aria-hidden />
      </Link>
    </motion.div>
  );
}

const selectClass =
  "w-full rounded-sm border border-border bg-panel px-3 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/25";

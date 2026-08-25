"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "left" | "right" | "up";

const offsets: Record<Direction, { x: number; y: number }> = {
  left: { x: -72, y: 0 },
  right: { x: 72, y: 0 },
  up: { x: 0, y: 56 },
};

type ScrollRevealProps = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  /** How far into view before animating (px). Negative = earlier. */
  offset?: number;
  once?: boolean;
};

/**
 * Makerere-style AOS scroll entrance (fade + slide from the side/bottom).
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
  offset = -80,
  once = false,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const from = offsets[direction];

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (reduceMotion || !hydrated) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x: from.x, y: from.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: `${offset}px 0px` }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

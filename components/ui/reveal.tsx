"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance in px the element travels up while fading in */
  y?: number;
  as?: "div" | "li" | "figure" | "article";
};

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * Only for content below the first screen: until JavaScript loads, it stays hidden.
 * With "reduce motion" on, the content appears at once instead of fading.
 */
export function Reveal({ children, className, delay = 0, y = 32, as = "div" }: RevealProps) {
  const Component = motion[as];
  const reduce = useReducedMotion();
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

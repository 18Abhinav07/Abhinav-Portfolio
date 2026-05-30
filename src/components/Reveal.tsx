"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Luminous Depth cinematic easing — gentle, unhurried, long tail.
 * cubic-bezier(0.16, 1, 0.3, 1)
 */
const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "header" | "h1" | "h2" | "p" | "span";
  once?: boolean;
  amount?: number;
};

/**
 * Standard Reveal: Smooth fade + blur + slide up.
 * Use for secondary elements or subtle presence.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  as = "div",
  once = true,
  amount = 0.05,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, ease: CINEMATIC_EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/**
 * MaskReveal: Cinematic slide up from an invisible container.
 * Creates the "emerging from surface" effect used by high-end agencies.
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
  y = "100%",
  once = true,
  amount = 0.05,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: string | number;
  once?: boolean;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div className={`overflow-hidden ${className || ""}`}>
      <motion.div
        initial={{ y }}
        whileInView={{ y: 0 }}
        viewport={{ once, amount }}
        transition={{ duration: 1.1, ease: CINEMATIC_EASE, delay }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: CINEMATIC_EASE },
  },
};

export function StaggerGroup({
  children,
  className,
  amount = 0.05,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

/**
 * TextReveal: Splits text into words and reveals them via masks.
 * High-impact for headlines and titles.
 */
type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
};

export function TextReveal({ text, className, delay = 0, once = true }: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: CINEMATIC_EASE,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className || ""}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.22em] py-[0.05em]">
          <motion.span
            className="inline-block will-change-transform"
            variants={wordVariants}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * KineticReveal: Advanced animation for cards or sections.
 * Combines scale + fade + slide for spatial depth.
 */
export function KineticReveal({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.995 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.05 }}
      transition={{
        duration: 1.3,
        ease: CINEMATIC_EASE,
        delay,
        opacity: { duration: 0.9 },
        scale: { duration: 1.5 },
      }}
    >
      {children}
    </motion.div>
  );
}

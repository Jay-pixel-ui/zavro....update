import React from "react";
import { motion } from "framer-motion";

export const EASE = [0.2, 0.8, 0.2, 1];

const lineV = {
  hidden: { y: "110%" },
  show: (i) => ({ y: "0%", transition: { duration: 0.95, ease: EASE, delay: 0.08 + i * 0.09 } }),
};

const renderSeg = (s, j) =>
  typeof s === "string" ? <React.Fragment key={j}>{s}</React.Fragment> : <span key={j} className="grad-text">{s.g}</span>;

// Masked line-by-line reveal. Observer sits on the unclipped heading; clipping is on inner line wrappers.
export function Headline({ lines, as = "h2", className = "", onMount = false, testid }) {
  const Tag = motion[as];
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.1 } };
  return (
    <Tag className={className} initial="hidden" {...trigger} data-testid={testid}>
      {lines.map((segs, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span className="block" variants={lineV} custom={i}>
            {segs.map(renderSeg)}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Reveal({ children, delay = 0, y = 24, className = "", as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-gradient-to-r from-z-cyan to-transparent" aria-hidden="true" />
      {children}
    </p>
  );
}

import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { track } from "@/lib/analytics";

const MotionLink = motion.create(Link);

export const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Cta({ to, href, children, variant = "primary", className = "", testid, onClick, external, event, service }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });
  const magnetic = variant === "primary";

  const move = (e) => {
    if (!magnetic || !canHover()) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.16);
    y.set((e.clientY - r.top - r.height / 2) * 0.24);
  };
  const leave = () => { x.set(0); y.set(0); };
  const click = (e) => {
    if (event) track(event, { service, location: window.location.pathname });
    if (onClick) onClick(e);
  };

  const cls = `group relative inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full px-6 font-mono text-[13px] uppercase tracking-[0.12em] ${
    variant === "primary" ? "btn-primary font-semibold" : "btn-ghost"
  } ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-signal group-hover:-translate-y-0.5 group-hover:translate-x-1" />
    </>
  );
  const common = { ref, className: cls, "data-cursor": magnetic ? "cta" : "link", "data-testid": testid, onMouseMove: move, onMouseLeave: leave, onClick: click, style: { x: sx, y: sy } };

  if (href)
    return (
      <motion.a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...common}>
        {inner}
      </motion.a>
    );
  return <MotionLink to={to} {...common}>{inner}</MotionLink>;
}

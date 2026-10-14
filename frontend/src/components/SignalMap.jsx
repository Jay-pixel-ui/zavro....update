import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SITE } from "@/data/site";
import { EASE } from "@/components/motion";

const NODES = [
  { id: "ai", label: "AI & automation", to: "/services/ai-automation", x: 16, y: 20, c: "#FFB800" },
  { id: "web", label: "Web & software", to: "/services/web-development", x: 84, y: 18, c: "#00E5FF" },
  { id: "growth", label: "Marketing & search", to: "/services/digital-marketing", x: 85, y: 66, c: "#5EA8FF" },
  { id: "strategy", label: "Strategy", to: "/services/business-consulting", x: 54, y: 93, c: "#B98CFF" },
  { id: "brand", label: "Brand", to: "/services/branding", x: 11, y: 72, c: "#00E5FF" },
];
const curve = (n) => `M50 50 Q ${(50 + n.x) / 2 + (n.y < 50 ? -8 : 8)} ${(50 + n.y) / 2 + (n.x < 50 ? 6 : -6)} ${n.x} ${n.y}`;
const ring = (a, b) => `M${a.x} ${a.y} Q 50 ${a.y < 50 && b.y < 50 ? 2 : 50} ${b.x} ${b.y}`;

export default function SignalMap() {
  const wrap = useRef(null);
  const [interactive, setInteractive] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [7, -7]), { stiffness: 80, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-9, 9]), { stiffness: 80, damping: 20 });
  const px = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 80, damping: 20 });
  const py = useSpring(useTransform(my, [-1, 1], [-14, 14]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setInteractive(ok);
    if (!ok) return undefined;
    const move = (e) => { mx.set((e.clientX / window.innerWidth) * 2 - 1); my.set((e.clientY / window.innerHeight) * 2 - 1); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[560px] [perspective:1200px]" data-testid="hero-signal-map">
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={interactive ? { rotateX: rx, rotateY: ry } : undefined}>
        <div aria-hidden="true" className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.18),rgba(30,144,255,0.06)_45%,transparent_70%)] blur-2xl" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth=".25" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(0,229,255,.16)" strokeWidth=".2" strokeDasharray=".6 1.6" />
          {NODES.map((n, i) => (
            <path key={`r${n.id}`} d={ring(n, NODES[(i + 1) % NODES.length])} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth=".2" />
          ))}
          {NODES.map((n, i) => (
            <g key={n.id}>
              <motion.path id={`route-${n.id}`} d={curve(n)} fill="none" stroke={n.c} strokeOpacity=".75" strokeWidth=".35" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.6 + i * 0.12 }} />
              <path d={curve(n)} fill="none" stroke={n.c} strokeOpacity=".5" strokeWidth=".35" className="route-dash" />
              {interactive && (
                <circle r=".8" fill={n.c}>
                  <animateMotion dur={`${3.2 + i * 0.6}s`} repeatCount="indefinite" begin={`${1.6 + i * 0.3}s`}>
                    <mpath href={`#route-${n.id}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2">
        <motion.div className="flex items-center justify-center" style={interactive ? { x: px, y: py } : undefined}>
          <div className="css-pop relative w-full rounded-[22px] border border-z-cyan/25 bg-[#03060d] p-[9%] shadow-[0_0_80px_-10px_rgba(0,229,255,0.45)]">
            <img src={SITE.mark} alt="Zavro Solutions ZS monogram" width="924" height="334" fetchpriority="high" className="h-auto w-full" />
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-z-muted">core</span>
          </div>
        </motion.div>
        </div>
        {NODES.map((n, i) => (
          <div key={n.id} className="absolute -translate-x-1/2 -translate-y-[7px]" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 1 + i * 0.1 }}>
            <Link to={n.to} className="group flex min-h-[44px] flex-col items-center justify-center gap-1.5 px-1" data-testid={`signal-node-${n.id}`}>
              <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inset-0 rounded-full opacity-40 blur-[3px]" style={{ background: n.c }} />
                <span className="h-2.5 w-2.5 rounded-full ring-2 ring-z-bg transition-transform duration-300 group-hover:scale-150" style={{ background: n.c }} />
              </span>
              <span className="whitespace-nowrap rounded-full border border-white/10 bg-z-bg/80 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-z-body backdrop-blur transition-colors group-hover:border-white/30 group-hover:text-white sm:text-[12px]">{n.label}</span>
            </Link>
          </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const SIZES = { default: 36, link: 56, cta: 76, view: 84, drag: 84 };
const LABELS = { cta: "GO", view: "VIEW", drag: "DRAG" };

function CursorInner() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 30 });
  const ry = useSpring(y, { stiffness: 300, damping: 30 });
  const [state, setState] = useState("default");
  const [down, setDown] = useState(false);
  const [ripple, setRipple] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => {
      const el = e.target.closest?.("[data-cursor],a,button,input,textarea,select,summary,label");
      if (!el) return setState("default");
      if (el.dataset.cursor) return setState(el.dataset.cursor);
      setState(el.tagName === "INPUT" || el.tagName === "TEXTAREA" ? "text" : "link");
    };
    const dn = (e) => { setDown(true); setRipple({ x: e.clientX, y: e.clientY, id: Date.now() }); };
    const up = () => setDown(false);
    const leave = () => { x.set(-100); y.set(-100); };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseover", over);
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  const isText = state === "text";
  const size = SIZES[state] || 36;
  const warm = state === "link" || state === "cta";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border font-mono text-[11px] font-semibold tracking-widest"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isText ? 3 : size,
          height: isText ? 30 : size,
          scale: down ? 0.8 : 1,
          borderColor: warm ? "rgba(255,184,0,0.85)" : "rgba(0,229,255,0.7)",
          backgroundColor: state === "cta" ? "rgba(255,184,0,0.12)" : state === "link" ? "rgba(255,184,0,0.06)" : "rgba(0,229,255,0)",
          borderRadius: isText ? "2px" : "999px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <span className={state === "cta" ? "text-z-gold" : "text-z-cyan"}>{LABELS[state] || ""}</span>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-[6px] w-[6px] rounded-full bg-z-cyan"
        style={{ x, y, translateX: "-50%", translateY: "-50%", boxShadow: "0 0 12px 2px rgba(0,229,255,.7)", opacity: isText ? 0 : 1 }}
      />
      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full border border-z-cyan"
            style={{ left: ripple.x, top: ripple.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 6, height: 6, opacity: 0.8 }}
            animate={{ width: 46, height: 46, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);
  return enabled ? <CursorInner /> : null;
}

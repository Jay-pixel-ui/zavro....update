import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/data/site";
import { EASE } from "@/components/motion";

const shouldShow = () => {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !sessionStorage.getItem("zv-intro");
  } catch (e) {
    return false;
  }
};

// Short, first-visit-only intro. Page content renders underneath immediately.
export default function Loader() {
  const [show, setShow] = useState(shouldShow);
  useEffect(() => {
    if (!show) return undefined;
    try { sessionStorage.setItem("zv-intro", "1"); } catch (e) { /* ignore */ }
    const t = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-testid="intro-loader"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-z-bg"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="relative flex h-44 w-44 items-center justify-center">
            <svg viewBox="0 0 200 200" className="absolute inset-0" aria-hidden="true">
              <motion.circle cx="100" cy="100" r="92" fill="none" stroke="#00E5FF" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, ease: EASE }} />
              <motion.circle cx="100" cy="100" r="78" fill="none" stroke="#FFB800" strokeWidth="0.6" strokeOpacity=".6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }} />
              <motion.line x1="10" x2="190" y1="100" y2="100" stroke="#00E5FF" strokeOpacity=".5" initial={{ y: -80 }} animate={{ y: 80 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
            </svg>
            <motion.img src={SITE.mark} alt="" width="120" height="43" className="relative w-[120px]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} />
          </div>
          <p className="eyebrow mt-8">Initializing intelligent systems</p>
          <button type="button" onClick={() => setShow(false)} data-testid="intro-skip-button" className="mt-6 min-h-[44px] rounded-full px-5 font-mono text-xs uppercase tracking-widest text-z-body hover:text-white">
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

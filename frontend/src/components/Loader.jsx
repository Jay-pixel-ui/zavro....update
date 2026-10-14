import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/data/site";
import { EASE } from "@/components/motion";

const shouldShow = () => {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return false; // desktop only
    return !sessionStorage.getItem("zv-intro");
  } catch (e) {
    return false;
  }
};

// Short, first-visit-only intro, desktop only. It is part of the prerendered HTML (so it covers the
// page from the first frame instead of flashing in after hydration); index.html hides it before paint
// on mobile and for returning visitors, and hydration then removes it.
export default function Loader() {
  const [show, setShow] = useState(true);
  useEffect(() => { if (!shouldShow()) setShow(false); }, []);
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
          className="intro-loader fixed inset-0 z-[90] hidden flex-col items-center justify-center bg-z-bg lg:flex"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="relative flex h-44 w-44 items-center justify-center">
            <svg viewBox="0 0 200 200" className="absolute inset-0" aria-hidden="true">
              <motion.circle cx="100" cy="100" r="92" fill="none" stroke="#00E5FF" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, ease: EASE }} />
              <motion.circle cx="100" cy="100" r="78" fill="none" stroke="#FFB800" strokeWidth="0.6" strokeOpacity=".6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }} />
              <motion.line x1="10" x2="190" y1="100" y2="100" stroke="#00E5FF" strokeOpacity=".5" initial={{ y: -80 }} animate={{ y: 80 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
            </svg>
            <motion.img src={SITE.markSmall} alt="" width="120" height="43" className="relative w-[120px]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} />
          </div>
          <p className="eyebrow mt-8">Initializing intelligent systems</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

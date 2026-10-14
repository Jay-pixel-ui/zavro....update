import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, MotionConfig, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import ErrorBoundary from "@/components/ErrorBoundary";

const NovaPanel = lazy(() => import("@/components/NovaPanel"));

function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); window.__lenis = null; };
  }, []);
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left" style={{ scaleX, background: "var(--grad)" }} />;
}

function Nova() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const o = () => setOpen(true);
    window.addEventListener("nova:open", o);
    return () => window.removeEventListener("nova:open", o);
  }, []);
  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="glass-strong fixed bottom-4 right-4 z-40 flex min-h-[48px] items-center gap-2.5 rounded-full px-4 font-mono text-xs uppercase tracking-widest text-white sm:bottom-6 sm:right-6"
          aria-haspopup="dialog"
          data-testid="nova-launcher"
        >
          <span className="pulse-soft h-2 w-2 rounded-full bg-z-cyan" aria-hidden="true" />
          NOVA <span className="hidden text-z-muted sm:inline">· Find your service</span>
        </button>
      )}
      {open && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}><NovaPanel onClose={() => setOpen(false)} /></Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  useLenis();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { (window.__lenis ? window.__lenis.scrollTo(el, { offset: -90 }) : el.scrollIntoView()); return; }
    }
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <Loader />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <ErrorBoundary><Outlet /></ErrorBoundary>
      </main>
      <Footer />
      <Nova />
    </MotionConfig>
  );
}

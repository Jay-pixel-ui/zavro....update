import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { FAMILIES, NAV, SITE } from "@/data/site";
import { servicesByFamily } from "@/data/services";
import { Cta } from "@/components/Cta";
import { EASE } from "@/components/motion";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Zavro Solutions home" data-testid="nav-brand-link">
      <img src={SITE.mark} alt="" width="56" height="21" className="h-[21px] w-[56px] rounded-[3px]" />
      <span className="font-display text-[15px] font-semibold tracking-[0.08em] text-white">ZAVRO</span>
    </Link>
  );
}

function MegaPanel({ onNavigate }) {
  return (
    <motion.div
      id="services-menu"
      initial={{ opacity: 0, y: -8, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -8, x: "-50%" }}
      transition={{ duration: 0.25, ease: EASE }}
      className="absolute left-1/2 top-full w-[min(920px,92vw)] pt-3"
    >
      <div className="rounded-card border border-z-cyan/20 bg-[#04060d]/[0.97] p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
      <div className="grid grid-cols-4 gap-6">
        {FAMILIES.map((f) => (
          <div key={f.id}>
            <p className="eyebrow mb-3">{f.code} · {f.label}</p>
            <ul className="space-y-1">
              {servicesByFamily(f.id).map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} onClick={onNavigate} className="block rounded-lg px-2 py-1.5 text-[15px] text-z-body transition-colors hover:bg-white/5 hover:text-white" data-testid={`mega-link-${s.slug}`}>
                    {s.short}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <p className="text-sm text-z-muted">Not sure where to start? Begin from the problem you want to solve.</p>
        <Link to="/services" onClick={onNavigate} className="font-mono text-xs uppercase tracking-widest text-z-eyebrow link-u" data-testid="mega-all-services-link">All services →</Link>
      </div>
      </div>
    </motion.div>
  );
}

function MobileMenu({ onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", key);
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <motion.div role="dialog" aria-modal="true" aria-label="Site menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex h-screen flex-col bg-z-bg/95 backdrop-blur-xl [height:100dvh]" data-testid="mobile-menu">
      <div className="flex shrink-0 items-center justify-between px-5 py-4 [padding-top:max(1rem,env(safe-area-inset-top))]">
        <Brand />
        <button ref={closeRef} onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white" aria-label="Close menu" data-testid="mobile-menu-close">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10 [-webkit-overflow-scrolling:touch] [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]" aria-label="Mobile">
        {FAMILIES.map((f) => (
          <div key={f.id} className="border-t border-white/10 py-4">
            <p className="eyebrow mb-2">{f.label}</p>
            {servicesByFamily(f.id).map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} onClick={onClose} className="block rounded-lg py-2 text-[17px] text-z-body hover:text-white">{s.short}</Link>
            ))}
          </div>
        ))}
        <div className="border-t border-white/10 pt-4">
          {[{ to: "/services", label: "All services" }, ...NAV].map((n) => (
            <Link key={n.to} to={n.to} onClick={onClose} className="block py-2.5 font-display text-2xl text-white" data-testid={`mobile-nav-${n.label.toLowerCase().replace(/\s/g, "-")}`}>{n.label}</Link>
          ))}
        </div>
        <Cta to="/contact" className="mt-6 w-full" onClick={onClose} testid="mobile-menu-cta" event="primary_cta_click">Discuss a project</Cta>
      </nav>
    </motion.div>
  );
}

export default function Nav() {
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const btnRef = useRef(null);
  const hoverAt = useRef(0);

  useEffect(() => { setMega(false); setMobile(false); }, [loc.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!mega) return undefined;
    const key = (e) => { if (e.key === "Escape") { setMega(false); btnRef.current?.focus(); } };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [mega]);

  const linkCls = ({ isActive }) => `rounded-full px-3 py-2 text-[15px] transition-colors ${isActive ? "text-white" : "text-z-body hover:text-white"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className={`relative mx-auto flex max-w-[1240px] items-center justify-between rounded-full px-4 py-2.5 transition-[background-color,border-color] duration-500 sm:px-5 ${scrolled ? "glass" : "border border-transparent"}`}>
        <Brand />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <div className="static" onMouseEnter={() => { hoverAt.current = Date.now(); setMega(true); }} onMouseLeave={() => setMega(false)}>
            <button ref={btnRef} type="button" aria-expanded={mega} aria-controls="services-menu" onClick={() => { if (Date.now() - hoverAt.current > 400) setMega((v) => !v); }} className="flex items-center gap-1 rounded-full px-3 py-2 text-[15px] text-z-body hover:text-white" data-testid="nav-services-toggle">
              Services <ChevronDown className={`h-4 w-4 transition-transform ${mega ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <AnimatePresence>{mega && <MegaPanel onNavigate={() => setMega(false)} />}</AnimatePresence>
          </div>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkCls} data-testid={`nav-${n.label.toLowerCase()}`}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Cta to="/contact" className="hidden !min-h-[42px] !px-5 sm:inline-flex" testid="nav-cta" event="primary_cta_click">Discuss a project</Cta>
          <button onClick={() => setMobile(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden" aria-label="Open menu" aria-expanded={mobile} data-testid="mobile-menu-open">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <AnimatePresence>{mobile && <MobileMenu onClose={() => setMobile(false)} />}</AnimatePresence>
    </header>
  );
}

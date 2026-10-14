import { motion } from "framer-motion";
import { SITE } from "@/data/site";
import { Headline, EASE } from "@/components/motion";
import { Cta } from "@/components/Cta";
import SignalMap from "@/components/SignalMap";

const up = (d) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: d } });

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-36 lg:min-h-[100svh] lg:pb-24" data-testid="home-hero">
      <div aria-hidden="true" className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_40%,black,transparent_70%)]" />
      <div aria-hidden="true" className="absolute -right-40 top-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(30,144,255,0.16),transparent)]" />
      <div aria-hidden="true" className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(138,43,226,0.10),transparent)]" />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-6">
        <div>
          <motion.p {...up(0.1)} className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-z-body" data-testid="hero-location-badge">
            <span className="h-1.5 w-1.5 rounded-full bg-z-cyan" aria-hidden="true" /> {SITE.reach}
          </motion.p>
          <Headline as="h1" onMount testid="hero-heading" lines={[["Growth isn't luck."], ["It's ", { g: "engineering." }]]} className="mt-7 font-display text-[clamp(2.5rem,7.2vw,5.9rem)] font-medium leading-[1.02]" />
          <motion.p {...up(0.45)} className="mt-7 max-w-[520px] text-[17px] leading-relaxed text-z-body sm:text-lg">
            A digital growth and IT team working worldwide. We connect your website, search, marketing, software and AI automation into one system — for SMEs and founders, wherever you are.
          </motion.p>
          <motion.div {...up(0.6)} className="mt-9 flex flex-wrap gap-3">
            <Cta to="/contact" testid="hero-primary-cta" event="primary_cta_click">Discuss a project</Cta>
            <Cta to="/work" variant="ghost" testid="hero-secondary-cta">Explore our work</Cta>
          </motion.div>
        </div>
        <div className="mx-auto w-full max-w-[400px] sm:max-w-[520px] lg:max-w-none">
          <SignalMap />
        </div>
      </div>
    </section>
  );
}

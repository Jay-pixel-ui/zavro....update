import { motion } from "framer-motion";
import Seo, { ORG_LD } from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow, EASE } from "@/components/motion";
import ContactBand from "@/components/ContactBand";
import { SITE } from "@/data/site";

const FLOW = [["Your goals", "#FFB800"], ["Strategy", "#00E5FF"], ["Brand · Web · Marketing", "#5EA8FF"], ["Software · AI", "#B98CFF"], ["Measure", "#00E5FF"]];

function Flow() {
  return (
    <div className="relative" data-testid="about-flow">
      <ol className="grid gap-3 sm:grid-cols-5">
        {FLOW.map(([l, c], i) => (
          <motion.li key={l} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }} className="relative rounded-card border bg-z-surface/60 p-5" style={{ borderColor: `${c}55` }}>
            <span className="font-mono text-xs" style={{ color: c }}>0{i + 1}</span>
            <p className="mt-3 font-display text-[17px] text-white">{l}</p>
          </motion.li>
        ))}
      </ol>
      <p className="mt-4 font-mono text-[12px] uppercase tracking-widest text-z-muted">↻ What we learn from measurement feeds the next round of strategy.</p>
    </div>
  );
}

const FACTS = [["Legal name", SITE.legalName], ["UEN", SITE.uen], ["Headquarters", "Singapore"], ["Works with", "Clients worldwide, remotely, across time zones"], ["Email", SITE.email], ["WhatsApp", SITE.phoneDisplay]];

export default function About() {
  return (
    <>
      <Seo title="About | A global digital growth & IT studio — Zavro Solutions" description="About Zavro Solutions Pte. Ltd.: a Singapore-headquartered team working worldwide, joining growth and technology — websites, search, marketing, software and AI automation." path="/about" jsonLd={[ORG_LD]} crumbs={[{ to: "/", label: "Home" }, { to: "/about", label: "About" }]} />
      <section className="px-5 pb-20 pt-28 sm:px-8 sm:pt-36" data-testid="about-page">
        <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/about", label: "About" }]} />
            <Eyebrow>About Zavro</Eyebrow>
            <Headline as="h1" onMount lines={[["A studio that joins"], [{ g: "growth with technology." }]]} className="mt-6 font-display text-[clamp(2.2rem,6vw,4.8rem)] font-medium leading-[1.04]" />
          </div>
          <Reveal delay={0.3} className="text-lg text-z-body">
            Zavro Solutions is a Singapore-registered company working as a collaborative team. We help businesses look credible online, become easier to find, handle enquiries properly and remove repetitive work — treating those as one connected problem, not separate purchases.
          </Reveal>
        </div>
      </section>

      <section className="px-5 sm:px-8" aria-label="Brand mark">
        <Reveal className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[24px] border border-white/5 bg-[#03060d]">
          <div className="grid items-center lg:grid-cols-[1fr_0.8fr]">
            <img src={SITE.lockup} alt="Zavro Solutions lockup: ZS monogram above the Singapore skyline" width="994" height="630" loading="lazy" className="h-auto w-full" />
            <div className="p-6 sm:p-10">
              <p className="eyebrow">The mark</p>
              <p className="mt-4 text-z-body">Blue and gold for the two sides of the work — systems and growth. The Singapore skyline beneath for where we're headquartered; the work itself travels worldwide.</p>
              <p className="mt-6 font-display text-xl text-white">{SITE.tagline}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Eyebrow>How work moves through Zavro</Eyebrow>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight">From your goals to measured improvement — in one loop.</h2>
          <div className="mt-12"><Flow /></div>
        </div>
      </section>

      <section className="bg-z-navy px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>What we believe</Eyebrow>
            <div className="mt-6 space-y-6 text-z-body">
              <p><strong className="text-white">Clarity beats cleverness.</strong> If a business owner can't tell what a page means in a few seconds, it isn't working yet.</p>
              <p><strong className="text-white">Proof beats persuasion.</strong> We publish only what's true and approved — on our site and yours.</p>
              <p><strong className="text-white">Tools should earn their place.</strong> Every new system should remove friction, not add another dashboard to check.</p>
            </div>
          </div>
          <dl className="divide-y divide-white/10 border-y border-white/10" data-testid="company-facts">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-4 py-4 sm:grid-cols-[160px_1fr]"><dt className="font-mono text-xs uppercase tracking-widest text-z-muted">{k}</dt><dd className="break-words text-white">{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>
      <ContactBand source="about" showLockup={false} />
    </>
  );
}

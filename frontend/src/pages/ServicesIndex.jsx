import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow, EASE } from "@/components/motion";
import { Cta } from "@/components/Cta";
import { FAMILIES, INTENTS } from "@/data/site";
import { serviceBySlug, servicesByFamily } from "@/data/services";

function ProblemMap() {
  const [active, setActive] = useState(0);
  const intent = INTENTS[active];
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" data-testid="problem-map">
      <div role="tablist" aria-label="Choose your problem" className="flex flex-col gap-2">
        {INTENTS.map((it, i) => (
          <button key={it.id} role="tab" aria-selected={active === i} aria-controls="problem-panel" onClick={() => setActive(i)} className={`group flex min-h-[64px] items-center justify-between gap-4 rounded-card border px-5 py-4 text-left transition-colors duration-300 ${active === i ? "border-z-cyan/50 bg-z-cyan/[0.06]" : "border-white/10 hover:border-white/25"}`} data-testid={`problem-tab-${it.id}`}>
            <span>
              <span className={`block font-display text-lg ${active === i ? "text-white" : "text-z-body"}`}>{it.label}</span>
              <span className="mt-1 block text-[14px] text-z-muted">{it.text}</span>
            </span>
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${active === i ? "bg-z-cyan shadow-[0_0_12px_rgba(0,229,255,.8)]" : "bg-white/20"}`} aria-hidden="true" />
          </button>
        ))}
      </div>
      <motion.div id="problem-panel" role="tabpanel" key={intent.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: EASE }} className="glass-strong rounded-[20px] p-6 sm:p-8">
        <p className="eyebrow">Routes for “{intent.label}”</p>
        <ul className="mt-6 space-y-3">
          {intent.services.map(serviceBySlug).map((s, i) => (
            <li key={s.slug}>
              <Link to={`/services/${s.slug}`} data-cursor="view" className="group grid grid-cols-[32px_1fr_auto] items-start gap-3 rounded-card border border-white/5 p-4 transition-colors hover:border-z-cyan/40" data-testid={`problem-route-${s.slug}`}>
                <span className="font-mono text-xs text-z-cyan">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-[17px] text-white">{s.short}</span>
                  <span className="mt-1 block text-[14px] text-z-body">{s.answer.split(". ")[0]}.</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-z-muted transition-colors group-hover:text-z-cyan" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function ServicesIndex() {
  return (
    <>
      <Seo title="Services | AI automation, web, SEO, GEO & branding — Zavro Solutions" description="Find the right service by the problem you need solved: get discovered, convert visitors, remove repetitive work, build a product or clarify the business." path="/services" image="/og/og-services.jpg" crumbs={[{ to: "/", label: "Home" }, { to: "/services", label: "Services" }]} />
      <section className="relative px-5 pb-20 pt-28 sm:px-8 sm:pt-36" data-testid="services-index">
        <div className="mx-auto max-w-[1240px]">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/services", label: "Services" }]} />
          <Eyebrow>Services</Eyebrow>
          <Headline as="h1" onMount lines={[["Start with the problem,"], ["not the ", { g: "service name." }]]} className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,6vw,4.8rem)] font-medium leading-[1.03]" />
          <Reveal delay={0.3} className="mt-6 max-w-2xl text-lg text-z-body">Pick what you want to change. We'll show the services that usually help — then the full index, grouped into four families.</Reveal>
          <div className="mt-14"><ProblemMap /></div>
        </div>
      </section>

      <section className="bg-z-navy px-5 py-20 sm:px-8 sm:py-28" data-testid="services-all">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-medium">All services</h2>
          <div className="mt-10 border-t border-white/10">
            {FAMILIES.map((f) => (
              <Reveal key={f.id} className="grid gap-6 border-b border-white/10 py-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16" id={f.id}>
                <div>
                  <p className="font-mono text-xs text-z-cyan">{f.code}</p>
                  <h3 className="mt-2 font-display text-2xl">{f.label}</h3>
                  <p className="mt-2 text-z-body">{f.blurb}</p>
                </div>
                <ul className="divide-y divide-white/5">
                  {servicesByFamily(f.id).map((s) => (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 py-4" data-testid={`services-index-link-${s.slug}`}>
                        <span>
                          <span className="font-display text-lg text-white transition-colors group-hover:text-z-eyebrow">{s.short}</span>
                          {s.availability === "scoped" && <span className="ml-3 rounded-full border border-z-gold/40 px-2 py-0.5 font-mono text-[11px] uppercase text-z-gold">scoped</span>}
                          <span className="mt-1 block text-[15px] text-z-body">{s.description.split(":")[0]}.</span>
                        </span>
                        <ArrowUpRight className="h-5 w-5 shrink-0 text-z-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-z-cyan" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <Reveal className="mx-auto flex max-w-[1240px] flex-col items-start gap-6 border-y border-white/10 py-10 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-tight text-white">Not sure which fits? Tell us the situation and we'll suggest where to start.</p>
          <Cta to="/contact" testid="services-fit-cta" event="primary_cta_click">Discuss a project</Cta>
        </Reveal>
      </section>
    </>
  );
}

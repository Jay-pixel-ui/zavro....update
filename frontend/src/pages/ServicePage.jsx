import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import Seo, { ORG_LD } from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow } from "@/components/motion";
import { Cta } from "@/components/Cta";
import ServiceVisual from "@/components/ServiceVisuals";
import Faq from "@/components/Faq";
import { serviceBySlug } from "@/data/services";
import { FAMILIES, SITE, waLink } from "@/data/site";
import NotFound from "@/pages/NotFound";

const Shell = ({ children, className = "", testid }) => (
  <section className={`px-5 py-20 sm:px-8 sm:py-28 ${className}`} data-testid={testid}>
    <div className="mx-auto max-w-[1240px]">{children}</div>
  </section>
);

function Audience({ s }) {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      {[["Who it's for", s.forWho, "#00E5FF"], ["What it addresses", s.problems, "#FFB800"]].map(([t, list, c]) => (
        <Reveal key={t}>
          <h2 className="font-display text-xl">{t}</h2>
          <ul className="mt-5 space-y-3">
            {list.map((x) => (
              <li key={x} className="flex gap-3 text-z-body"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c }} aria-hidden="true" />{x}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

function Includes({ s }) {
  return (
    <>
      <Eyebrow>What's included</Eyebrow>
      <Headline as="h2" lines={[["Scope you can ", { g: "pick from." }]]} className="mt-5 font-display text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1.08]" />
      <p className="mt-4 max-w-xl text-z-body">Each engagement uses the parts that fit. We confirm exactly what's included in a written scope.</p>
      <ol className="mt-10 border-t border-white/10">
        {s.includes.map((x, i) => (
          <Reveal as="li" key={x.t} delay={i * 0.05} className="group grid gap-2 border-b border-white/10 py-6 sm:grid-cols-[72px_minmax(0,320px)_1fr] sm:gap-8">
            <span className="font-mono text-xs text-z-muted">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-display text-lg transition-colors group-hover:text-z-eyebrow">{x.t}</h3>
            <p className="text-z-body">{x.d}</p>
          </Reveal>
        ))}
      </ol>
    </>
  );
}

function Approach({ s }) {
  return (
    <div>
      <Eyebrow>How it works</Eyebrow>
      <h2 className="mt-5 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium leading-tight">Our approach</h2>
      <ol className="mt-8 space-y-0 border-l border-white/12">
        {s.approach.map((a, i) => (
          <Reveal as="li" key={a} delay={i * 0.06} className="relative py-3 pl-8">
            <span className="absolute -left-[5px] top-[22px] h-2.5 w-2.5 rounded-full border border-z-cyan bg-z-bg" aria-hidden="true" />
            <span className="mr-3 font-mono text-xs text-z-cyan">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-white">{a}</span>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function Limits({ s }) {
  return (
    <Reveal className="relative overflow-hidden rounded-[20px] border border-z-gold/25 bg-[linear-gradient(120deg,rgba(255,184,0,0.06),rgba(13,19,34,0.5)_40%)] p-6 sm:p-10">
      <p className="font-mono text-xs uppercase tracking-widest text-z-gold">Honest boundaries</p>
      <h2 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.2rem)] font-medium">Where we draw the line.</h2>
      <ul className="mt-6 grid gap-5 lg:grid-cols-2">
        {s.limits.map((l) => <li key={l} className="border-l border-z-gold/40 pl-5 text-z-body">{l}</li>)}
      </ul>
    </Reveal>
  );
}

function Related({ s }) {
  const rel = s.related.map(serviceBySlug).filter(Boolean);
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {rel.map((r) => (
        <Link key={r.slug} to={`/services/${r.slug}`} data-cursor="view" className="glass group rounded-card p-6 transition-colors hover:border-z-cyan/40" data-testid={`related-${r.slug}`}>
          <p className="font-mono text-[12px] uppercase tracking-widest text-z-muted">{FAMILIES.find((f) => f.id === r.family)?.label}</p>
          <p className="mt-3 flex items-start justify-between gap-3 font-display text-lg text-white">{r.short}<ArrowUpRight className="h-5 w-5 shrink-0 text-z-cyan transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></p>
        </Link>
      ))}
    </div>
  );
}

function ServiceCta({ s }) {
  return (
    <section className="px-5 pb-24 sm:px-8" data-testid="service-cta">
      <Reveal className="glass-strong mx-auto flex max-w-[1240px] flex-col gap-8 rounded-[24px] p-6 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow">Next step</p>
          <h2 className="mt-3 max-w-xl font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium leading-tight">Let's see if {s.short.toLowerCase()} is the right move.</h2>
          <p className="mt-3 max-w-lg text-z-body">Share a few lines about your situation. Feasibility, timing and pricing depend on your systems and goals — we'll be straight about all three.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Cta to={`/contact?service=${s.slug}`} testid="service-cta-primary" event="service_cta_click" service={s.slug}>Discuss a project</Cta>
          <a href={waLink(`Hi Zavro, I'm interested in ${s.short}.`)} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 font-mono text-[12px] uppercase tracking-widest" data-testid="service-cta-whatsapp">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function HeroText({ s }) {
  return (
    <div>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/services", label: "Services" }, { to: `/services/${s.slug}`, label: s.short }]} />
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <Headline as="h1" onMount testid="service-heading" lines={[[s.h1.pre, { g: s.h1.g }, s.h1.post]]} className="mt-6 font-display text-[clamp(2.1rem,5.4vw,4.4rem)] font-medium leading-[1.05]" />
      <Reveal delay={0.3} className="mt-7 max-w-2xl text-[17px] leading-relaxed text-z-body sm:text-lg" data-testid="service-answer">{s.answer}</Reveal>
      {s.availability === "scoped" && (
        <p className="mt-5 inline-flex rounded-full border border-z-gold/40 px-4 py-1.5 font-mono text-[12px] uppercase tracking-widest text-z-gold" data-testid="service-availability">Scoped per project</p>
      )}
      <Reveal delay={0.4} className="mt-9 flex flex-wrap gap-3">
        <Cta to={`/contact?service=${s.slug}`} testid="service-hero-cta" event="service_cta_click" service={s.slug}>Discuss a project</Cta>
        <button type="button" onClick={() => window.dispatchEvent(new Event("nova:open"))} className="btn-ghost inline-flex min-h-[48px] items-center rounded-full px-6 font-mono text-[13px] uppercase tracking-[0.12em]" data-testid="service-ask-nova">Not sure? Ask NOVA</button>
      </Reveal>
    </div>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const s = serviceBySlug(slug);
  if (!s) return <NotFound />;
  const visual = <ServiceVisual kind={s.visual} label={`Illustrative diagram for ${s.short}`} />;
  const ld = [ORG_LD, { "@context": "https://schema.org", "@type": "Service", name: s.short, serviceType: s.short, description: s.description, url: `${SITE.url}/services/${s.slug}`, provider: { "@id": `${SITE.url}/#organization` }, areaServed: ["Singapore", "Worldwide (remote)"] }];

  return (
    <>
      <Seo title={s.title} description={s.description} path={`/services/${s.slug}`} jsonLd={ld} crumbs={[{ to: "/", label: "Home" }, { to: "/services", label: "Services" }, { to: `/services/${s.slug}`, label: s.short }]} />
      <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-36" data-testid={`service-page-${s.slug}`}>
        <div aria-hidden="true" className="grid-lines absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className={`relative mx-auto max-w-[1240px] ${s.layout === "split" ? "grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]" : ""}`}>
          <div className={s.layout === "split" ? "" : "max-w-4xl"}><HeroText s={s} /></div>
          {s.layout === "split" && <div>{visual}</div>}
        </div>
      </section>

      {s.layout === "stage" && (
        <Shell className="!pt-4">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">{visual}<Audience s={s} /></div>
        </Shell>
      )}
      {s.layout === "stage" && <Shell className="!pt-0"><Limits s={s} /></Shell>}
      {s.layout !== "stage" && <Shell className="border-t border-white/10"><Audience s={s} /></Shell>}
      <Shell className="bg-z-navy"><Includes s={s} /></Shell>
      {s.layout === "inset" ? (
        <Shell><div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center"><Approach s={s} />{visual}</div></Shell>
      ) : (
        <Shell><div className="max-w-2xl"><Approach s={s} /></div></Shell>
      )}
      {s.layout !== "stage" && <Shell className="!pt-0"><Limits s={s} /></Shell>}
      <Shell className="!pt-0">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium">Frequently asked.</h2>
          </div>
          <Faq items={s.faqs} idPrefix={`faq-${s.slug}`} />
        </div>
      </Shell>
      <Shell className="!pt-0">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-z-muted">Works well with</h2>
        <Related s={s} />
      </Shell>
      <ServiceCta s={s} />
    </>
  );
}

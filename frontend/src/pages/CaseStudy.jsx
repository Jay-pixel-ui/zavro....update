import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Seo, { ORG_LD } from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow, EASE } from "@/components/motion";
import { Cta } from "@/components/Cta";
import { projectBySlug, publicProjects, hostOf } from "@/data/projects";
import { serviceBySlug } from "@/data/services";
import { SITE } from "@/data/site";
import NotFound from "@/pages/NotFound";

export default function CaseStudy() {
  const { slug } = useParams();
  const p = projectBySlug(slug);
  if (!p) return <NotFound />;
  const all = publicProjects();
  const next = all[(all.indexOf(p) + 1) % all.length];
  const services = p.services.map(serviceBySlug).filter(Boolean);
  const path = `/work/${p.slug}`;
  const crumbs = [{ to: "/", label: "Home" }, { to: "/work", label: "Work" }, { to: path, label: p.clientName }];
  const ld = [ORG_LD, { "@context": "https://schema.org", "@type": "CreativeWork", name: `${p.clientName} — case study`, description: p.engagementSummary, url: `${SITE.url}${path}`, creator: { "@id": `${SITE.url}/#organization` }, about: { "@type": "Organization", name: p.clientName, url: p.clientDomain } }];

  return (
    <>
      <Seo title={`${p.clientName} case study | Zavro Solutions`} description={p.engagementSummary} path={path} type="article" jsonLd={ld} crumbs={crumbs} />
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pt-36" data-testid={`case-study-${p.slug}`}>
        <div className="mx-auto max-w-[1240px]">
          <Breadcrumbs items={crumbs} />
          <Eyebrow>Case study · {p.industry}</Eyebrow>
          <Headline as="h1" onMount lines={[[p.clientName]]} className="mt-6 font-display text-[clamp(2.6rem,9vw,7.5rem)] font-medium leading-[0.98]" testid="case-study-heading" />
          <Reveal delay={0.3} className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <p className="max-w-2xl text-lg text-z-body">{p.engagementSummary}</p>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {services.map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="inline-flex min-h-[40px] items-center rounded-full border border-white/10 px-3.5 text-[14px] text-z-body hover:border-z-cyan/50 hover:text-white">{s.short}</Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 sm:px-8" aria-label="Live website">
        <motion.a
          href={p.clientDomain}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="view"
          initial={{ clipPath: "inset(8% 8% 8% 8% round 28px)", opacity: 0.4 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="group relative mx-auto block aspect-[16/10] max-w-[1240px] overflow-hidden rounded-[24px] border border-white/10 bg-z-surface"
          data-testid="case-study-shot"
        >
          <img src={`/work/${p.slug}.webp`} alt={`Homepage of ${p.clientName} at ${hostOf(p.clientDomain)}`} width="1440" height="900" className="h-full w-full object-cover object-top transition-transform duration-[1.4s] ease-signal group-hover:scale-[1.03]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_45%,rgba(2,4,10,0.7))]" />
          <span className="glass-strong absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-widest text-white">
            {hostOf(p.clientDomain)} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </motion.a>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <dl className="h-fit divide-y divide-white/10 border-y border-white/10 text-[15px] lg:sticky lg:top-32" data-testid="case-study-facts">
            {[["Client", p.clientName], ["Industry", p.industry], ["Zavro's role", "Design, build and growth partner"], ["Results", "Being measured — published only once verified and approved"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-4"><dt className="font-mono text-xs uppercase tracking-widest text-z-muted">{k}</dt><dd className="text-white">{v}</dd></div>
            ))}
            <div className="grid grid-cols-[110px_1fr] gap-4 py-4"><dt className="font-mono text-xs uppercase tracking-widest text-z-muted">Website</dt><dd><a href={p.clientDomain} target="_blank" rel="noopener noreferrer" className="text-z-eyebrow link-u">{hostOf(p.clientDomain)}</a></dd></div>
          </dl>
          <div className="space-y-16">
            <Reveal>
              <p className="eyebrow">01 · Context</p>
              <p className="mt-4 text-[clamp(1.25rem,2.2vw,1.65rem)] font-light leading-relaxed text-white">{p.challenge}</p>
            </Reveal>
            <div>
              <p className="eyebrow">02 · What we delivered</p>
              <ol className="mt-6 border-t border-white/10">
                {p.scopeDelivered.map((x, i) => (
                  <Reveal as="li" key={x.t} delay={i * 0.05} className="grid gap-2 border-b border-white/10 py-5 sm:grid-cols-[48px_220px_1fr] sm:gap-6">
                    <span className="font-mono text-xs text-z-cyan">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="font-display text-lg">{x.t}</h2>
                    <p className="text-z-body">{x.d}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
            <Reveal>
              <p className="eyebrow">03 · How we approached it</p>
              <ul className="mt-6 space-y-3">
                {p.approach.map((a) => <li key={a} className="flex gap-3 text-z-body"><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-z-gold" aria-hidden="true" />{a}</li>)}
              </ul>
            </Reveal>
            <Reveal className="rounded-[20px] border border-z-gold/25 p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-z-gold">04 · Outcomes</p>
              {p.verified && p.metrics.length ? (
                <ul className="mt-4 space-y-2">{p.metrics.map((m) => <li key={m.unit} className="text-white">{m.value} {m.unit} <span className="text-z-muted">({m.source}, {m.period})</span></li>)}</ul>
              ) : (
                <p className="mt-4 text-z-body">We're measuring results with {p.clientName}. Figures will appear here only once they've been verified and the client has approved publishing them — until then, we'd rather show the work than an unproven number.</p>
              )}
              {p.testimonialApproved && p.testimonialQuote && <blockquote className="mt-6 font-display text-xl text-white">“{p.testimonialQuote}” <span className="block text-sm text-z-muted">— {p.testimonialAttribution}</span></blockquote>}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 border-t border-white/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
          <Link to={`/work/${next.slug}`} className="group" data-cursor="view" data-testid="case-study-next">
            <span className="font-mono text-xs uppercase tracking-widest text-z-muted">Next case study</span>
            <span className="mt-2 flex items-center gap-3 font-display text-[clamp(1.8rem,4vw,3rem)] text-white transition-transform duration-500 group-hover:translate-x-2">{next.clientName}<ArrowRight className="h-7 w-7 text-z-cyan" aria-hidden="true" /></span>
          </Link>
          <Cta to={`/contact?service=${p.services[0]}`} testid="case-study-cta" event="service_cta_click" service={p.services[0]}>Discuss a similar project</Cta>
        </div>
      </section>
    </>
  );
}

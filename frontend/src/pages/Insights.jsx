import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { Cta } from "@/components/Cta";
import { serviceBySlug } from "@/data/services";
import Seo, { ORG_LD } from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow } from "@/components/motion";
import { CATEGORIES, publishedInsights } from "@/data/insights";
import { SITE } from "@/data/site";
import NotFound from "@/pages/NotFound";

const STANDARDS = ["Reviewed for accuracy before publishing", "Grounded in first-hand experience or clear analysis", "A named author and real publish date", "Sources cited where facts come from elsewhere"];

const fmt = (d) => new Date(`${d}T00:00:00`).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" });

export function Insights() {
  const list = publishedInsights();
  return (
    <>
      <Seo title="Insights | AI automation, search & digital growth — Zavro Solutions" description="Practical notes from Zavro Solutions on AI automation, websites, SEO, GEO and digital growth for SMEs." path="/insights" crumbs={[{ to: "/", label: "Home" }, { to: "/insights", label: "Insights" }]} />
      <section className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36" data-testid="insights-page">
        <div className="mx-auto max-w-[1240px]">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/insights", label: "Insights" }]} />
          <Eyebrow>Insights</Eyebrow>
          <Headline as="h1" onMount lines={[["Notes worth ", { g: "reading twice." }]]} className="mt-6 font-display text-[clamp(2.3rem,6.4vw,5rem)] font-medium leading-[1.03]" />
          {list.length ? (
            <ul className="mt-14 border-t border-white/10">
              {list.map((a) => (
                <li key={a.slug} className="border-b border-white/10">
                  <Link to={`/insights/${a.slug}`} data-cursor="view" className="group grid gap-3 py-8 sm:grid-cols-[200px_1fr_auto] sm:gap-8" data-testid={`insight-link-${a.slug}`}>
                    <span className="font-mono text-xs uppercase tracking-widest text-z-muted">{a.category}<span className="mt-1 block normal-case tracking-normal">{fmt(a.publishedAt)} · {a.readMinutes} min read</span></span>
                    <span><span className="font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-tight text-white transition-colors group-hover:text-z-eyebrow">{a.title}</span><span className="mt-3 block max-w-2xl text-z-body">{a.description}</span></span>
                    <ArrowUpRight className="hidden h-6 w-6 text-z-muted transition-colors group-hover:text-z-cyan sm:block" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" data-testid="insights-empty">
              <Reveal className="glass rounded-[20px] p-6 sm:p-10">
                <p className="font-display text-2xl text-white">Insights are being prepared.</p>
                <p className="mt-4 text-z-body">We'd rather publish a few genuinely useful pieces than fill a blog with generic content. Our first articles will cover the topics below.</p>
                <ul className="mt-6 flex flex-wrap gap-2">{CATEGORIES.map((c) => <li key={c} className="rounded-full border border-white/10 px-3.5 py-1.5 text-[14px] text-z-body">{c}</li>)}</ul>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="eyebrow">Our editorial standard</p>
                <ol className="mt-5 border-t border-white/10">{STANDARDS.map((s, i) => <li key={s} className="flex gap-4 border-b border-white/10 py-4 text-white"><span className="font-mono text-xs text-z-cyan">0{i + 1}</span>{s}</li>)}</ol>
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function InsightArticle() {
  const { slug } = useParams();
  const a = publishedInsights().find((x) => x.slug === slug);
  if (!a) return <NotFound />;
  const path = `/insights/${a.slug}`;
  const ld = [ORG_LD, { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: a.description, datePublished: a.publishedAt, dateModified: a.updatedAt || a.publishedAt, author: { "@type": "Organization", name: a.author, url: SITE.url }, publisher: { "@id": `${SITE.url}/#organization` }, mainEntityOfPage: `${SITE.url}${path}` }];
  return (
    <>
      <Seo title={a.metaTitle || `${a.title} | Zavro Solutions`} description={a.description} path={path} type="article" jsonLd={ld} crumbs={[{ to: "/", label: "Home" }, { to: "/insights", label: "Insights" }, { to: path, label: a.title }]} />
      <article className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[760px]">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/insights", label: "Insights" }, { to: path, label: a.title }]} />
          <p className="eyebrow">{a.category}</p>
          <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] font-medium leading-tight">{a.title}</h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-z-muted">{a.author} · {fmt(a.publishedAt)}{a.updatedAt ? ` · Updated ${fmt(a.updatedAt)}` : ""} · {a.readMinutes} min read</p>
          <div className="glass mt-10 rounded-[20px] border-l-2 !border-l-z-cyan p-6 sm:p-8" data-testid="insight-answer">
            <p className="eyebrow">The short answer</p>
            <p className="mt-3 text-lg leading-relaxed text-white">{a.answer}</p>
          </div>
          {a.body.map((s) => (
            <section key={s.h} className="mt-12"><h2 className="font-display text-[clamp(1.3rem,2.4vw,1.7rem)] leading-snug">{s.h}</h2>{s.p.map((p) => <p key={p} className="mt-4 text-[17px] leading-[1.75] text-z-body">{p}</p>)}</section>
          ))}
          {a.checklist && (
            <section className="mt-14 rounded-[20px] border border-z-gold/25 p-6 sm:p-8" data-testid="insight-checklist">
              <h2 className="font-display text-xl">Quick checklist</h2>
              <ul className="mt-5 space-y-3">{a.checklist.map((c) => <li key={c} className="flex gap-3 text-z-body"><Check className="mt-1 h-4 w-4 shrink-0 text-z-gold" aria-hidden="true" />{c}</li>)}</ul>
            </section>
          )}
          <section className="mt-14">
            <h2 className="font-mono text-xs uppercase tracking-widest text-z-muted">Related services</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(a.relatedServices || []).map(serviceBySlug).filter(Boolean).map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/10 px-3.5 text-[14px] text-z-body hover:border-z-cyan/50 hover:text-white">{s.short}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
              ))}
            </div>
          </section>
          {publishedInsights().filter((x) => x.slug !== a.slug).slice(0, 1).map((o) => (
            <Link key={o.slug} to={`/insights/${o.slug}`} className="group mt-12 block border-t border-white/10 pt-8" data-testid="insight-next">
              <span className="font-mono text-xs uppercase tracking-widest text-z-muted">Read next</span>
              <span className="mt-2 block font-display text-2xl text-white transition-colors group-hover:text-z-eyebrow">{o.title}</span>
            </Link>
          ))}
          <div className="mt-12"><Cta to={`/contact?service=${a.relatedServices?.[0] || ""}`} testid="insight-cta" event="primary_cta_click">Discuss a project</Cta></div>
        </div>
      </article>
    </>
  );
}

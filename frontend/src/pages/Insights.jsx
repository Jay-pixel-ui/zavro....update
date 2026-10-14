import { Link, useParams } from "react-router-dom";
import Seo, { ORG_LD } from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow } from "@/components/motion";
import { CATEGORIES, publishedInsights } from "@/data/insights";
import { SITE } from "@/data/site";
import NotFound from "@/pages/NotFound";

const STANDARDS = ["Reviewed for accuracy before publishing", "Grounded in first-hand experience or clear analysis", "A named author and real publish date", "Sources cited where facts come from elsewhere"];

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
                  <Link to={`/insights/${a.slug}`} className="grid gap-2 py-8 sm:grid-cols-[160px_1fr]">
                    <span className="font-mono text-xs uppercase text-z-muted">{a.category}</span>
                    <span><span className="font-display text-2xl text-white">{a.title}</span><span className="mt-2 block text-z-body">{a.description}</span></span>
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
  const ld = [ORG_LD, { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: a.description, datePublished: a.publishedAt, dateModified: a.updatedAt || a.publishedAt, author: { "@type": "Person", name: a.author }, publisher: { "@id": `${SITE.url}/#organization` }, mainEntityOfPage: `${SITE.url}${path}` }];
  return (
    <>
      <Seo title={`${a.title} | Zavro Solutions`} description={a.description} path={path} type="article" jsonLd={ld} crumbs={[{ to: "/", label: "Home" }, { to: "/insights", label: "Insights" }, { to: path, label: a.title }]} />
      <article className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[760px]">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/insights", label: "Insights" }, { to: path, label: a.title }]} />
          <p className="eyebrow">{a.category}</p>
          <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] font-medium leading-tight">{a.title}</h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-z-muted">{a.author} · {a.publishedAt}{a.updatedAt ? ` · Updated ${a.updatedAt}` : ""}</p>
          {a.body.map((s) => (
            <section key={s.h} className="mt-10"><h2 className="font-display text-2xl">{s.h}</h2>{s.p.map((p) => <p key={p} className="mt-4 text-z-body">{p}</p>)}</section>
          ))}
        </div>
      </article>
    </>
  );
}

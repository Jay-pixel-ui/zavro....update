import { Link } from "react-router-dom";
import Seo, { ORG_LD, WEBSITE_LD } from "@/components/Seo";
import { Headline, Reveal, Eyebrow } from "@/components/motion";
import Hero from "@/components/home/Hero";
import SignalPath from "@/components/home/SignalPath";
import ServicesBento from "@/components/home/ServicesBento";
import Marquee from "@/components/Marquee";
import ProjectList from "@/components/ProjectList";
import ProcessPath from "@/components/ProcessPath";
import ContactBand from "@/components/ContactBand";
import SampleTestimonials from "@/components/SampleTestimonials";
import { publicProjects } from "@/data/projects";
import { publishedInsights } from "@/data/insights";

const PRINCIPLES = [
  ["One accountable team", "Strategy, design, development and marketing are planned together, so nothing falls between suppliers."],
  ["Practical choices", "We recommend the simplest tool that solves the problem and that you can maintain — even when that is not the newest one."],
  ["Direct communication", "You talk to the people doing the work. We explain trade-offs plainly and tell you when something isn't worth doing."],
  ["Honest measurement", "We agree what success means before we start and report what is and isn't working."],
  ["Continued improvement", "Where the engagement includes it, we keep refining after launch rather than handing over and disappearing."],
];

function ClientRail() {
  const list = publicProjects();
  return (
    <section aria-label="Selected clients" className="px-5 sm:px-8" data-testid="client-rail">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 border-y border-white/10 py-6 sm:flex-row sm:items-center sm:gap-10">
        <p className="shrink-0 font-mono text-[12px] uppercase tracking-[0.16em] text-z-muted">Selected clients</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-3">
          {list.map((p) => (
            <li key={p.slug}>
              <a href={p.clientDomain} target="_blank" rel="noopener noreferrer" className="font-display text-lg text-z-body transition-colors hover:text-white">{p.clientName}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  const insights = publishedInsights().slice(0, 3);
  return (
    <>
      <Seo
        title="Zavro Solutions | Digital growth & IT solutions, Singapore"
        description="Singapore-based team connecting websites, SEO, GEO, digital marketing, custom software and AI automation for SMEs and founders — in Singapore and remotely worldwide."
        path="/"
        jsonLd={[ORG_LD, WEBSITE_LD]}
      />
      <Hero />
      <ClientRail />
      <SignalPath />
      <Marquee />
      <ServicesBento />

      <section className="px-5 py-24 sm:px-8 sm:py-32" data-testid="home-work-section">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Eyebrow>Selected work</Eyebrow>
              <Headline lines={[["Client work, ", { g: "stated plainly." }]]} className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.05]" />
            </div>
            <Reveal className="max-w-md text-z-body lg:justify-self-end">
              These are businesses we have worked with, shown with their permission. Detailed case studies are published only once each client has confirmed the scope and any results.
            </Reveal>
          </div>
          <ProjectList />
          <Link to="/work" className="mt-8 inline-flex min-h-[44px] items-center font-mono text-xs uppercase tracking-widest text-z-eyebrow link-u" data-testid="home-work-link">See how we present work →</Link>
        </div>
      </section>

      <SampleTestimonials />

      <section className="bg-z-navy px-5 py-24 sm:px-8 sm:py-32" data-testid="home-process-section">
        <div className="mx-auto max-w-[1240px]">
          <Eyebrow>How we work</Eyebrow>
          <Headline lines={[["Five stages, ", { g: "scaled to the project." }]]} className="mt-6 max-w-3xl font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.05]" />
          <Reveal className="mt-6 max-w-xl text-z-body">Not every engagement needs every stage at the same depth. A focused fix might move through them in days; a new platform takes longer. We agree this with you up front.</Reveal>
          <div className="mt-16"><ProcessPath /></div>
          <Link to="/process" className="mt-12 inline-flex min-h-[44px] items-center font-mono text-xs uppercase tracking-widest text-z-eyebrow link-u" data-testid="home-process-link">Read the full process →</Link>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32" data-testid="home-why-section">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>Why Zavro</Eyebrow>
            <Headline lines={[["Built like a team."], [{ g: "Run like one." }]]} className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.05]" />
            <Reveal className="mt-6 max-w-md text-z-body">We're a collaborative studio, not a large agency. That means fewer hand-offs, direct conversations and work that connects across disciplines.</Reveal>
          </div>
          <ol className="border-t border-white/10">
            {PRINCIPLES.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.06} className="grid grid-cols-[48px_1fr] gap-4 border-b border-white/10 py-7 sm:grid-cols-[72px_1fr]">
                <span className="font-display text-2xl text-z-cyan/80">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl">{t}</h3>
                  <p className="mt-2 text-z-body">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 pb-8 sm:px-8" data-testid="home-insights-section">
        <div className="mx-auto max-w-[1240px]">
          <Reveal className="glass grid gap-6 rounded-[20px] p-6 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-12">
            <p className="eyebrow">Insights</p>
            {insights.length ? (
              <ul className="space-y-2">{insights.map((a) => <li key={a.slug}><Link to={`/insights/${a.slug}`} className="text-white link-u">{a.title}</Link></li>)}</ul>
            ) : (
              <p className="text-z-body"><span className="font-display text-xl text-white">Insights are being prepared.</span> We'll publish practical notes on AI automation, search and building for SMEs once each piece has been reviewed for accuracy.</p>
            )}
            <Link to="/insights" className="font-mono text-xs uppercase tracking-widest text-z-eyebrow link-u" data-testid="home-insights-link">Insights →</Link>
          </Reveal>
        </div>
      </section>

      <ContactBand source="home" />
    </>
  );
}

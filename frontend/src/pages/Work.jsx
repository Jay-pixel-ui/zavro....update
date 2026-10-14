import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow, EASE } from "@/components/motion";
import ContactBand from "@/components/ContactBand";
import SampleTestimonials from "@/components/SampleTestimonials";
import { publicProjects, hostOf } from "@/data/projects";

const STRUCTURE = ["Client and industry", "Business context and challenge", "Scope and constraints", "Zavro's actual role and deliverables", "How the solution was approached", "Verified outcomes — or a qualitative explanation", "Approved client quote, if provided"];

function Shot({ p }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-white/10 bg-z-surface">
      {ok ? (
        <img src={`/work/${p.slug}.webp`} alt={`Homepage of ${p.clientName} (${hostOf(p.clientDomain)})`} width="1440" height="900" loading="lazy" onError={() => setOk(false)} className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-signal group-hover:scale-[1.04]" />
      ) : (
        <div className="flex h-full items-center justify-center font-display text-3xl text-z-muted">{p.clientName}</div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,transparent_40%,rgba(2,4,10,0.75))]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/10" />
    </div>
  );
}

export default function Work() {
  const list = publicProjects();
  return (
    <>
      <Seo title="Work | Client projects — Zavro Solutions" description="Case studies from Zavro Solutions: website, SEO, social and automation work for UMI Spices, Feni Electrical and SGSA Construction in Singapore." path="/work" image="/og/og-work.jpg" crumbs={[{ to: "/", label: "Home" }, { to: "/work", label: "Work" }]} />
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pt-36" data-testid="work-page">
        <div className="mx-auto max-w-[1240px]">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/work", label: "Work" }]} />
          <Eyebrow>Work</Eyebrow>
          <Headline as="h1" onMount lines={[["Real clients."], ["Shown ", { g: "honestly." }]]} className="mt-6 font-display text-[clamp(2.4rem,7vw,5.6rem)] font-medium leading-[1.02]" />
          <Reveal delay={0.3} className="mt-6 max-w-2xl text-lg text-z-body">We'd rather show less than invent more. Each client below is shown with permission, with a case study describing what we delivered. Results and quotes are published only once they've been verified and approved by the client.</Reveal>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8" aria-label="Projects">
        <div className="mx-auto max-w-[1240px] space-y-20 sm:space-y-28">
          {list.map((p, i) => (
            <motion.article key={p.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.8, ease: EASE }} className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-12`} data-testid={`work-item-${p.slug}`}>
              <Link to={`/work/${p.slug}`} data-cursor="view" className={`group block lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`} aria-label={`Read the ${p.clientName} case study`} data-testid={`work-shot-${p.slug}`}>
                <Shot p={p} />
              </Link>
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : ""}`}>
                <p className="font-mono text-xs text-z-cyan">0{i + 1} · {p.industry}</p>
                <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-none">{p.clientName}</h2>
                <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 text-[15px]">
                  <div className="flex justify-between gap-6 py-3"><dt className="text-z-muted">Industry</dt><dd className="text-right text-white">{p.industry}</dd></div>
                  <div className="flex justify-between gap-6 py-3"><dt className="text-z-muted">Website</dt><dd><a href={p.clientDomain} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-z-eyebrow link-u" data-testid={`work-link-${p.slug}`}>{hostOf(p.clientDomain)}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a></dd></div>
                  <div className="flex justify-between gap-6 py-3"><dt className="text-z-muted">Delivered</dt><dd className="text-right text-z-body">{p.scopeDelivered.map((x) => x.t).slice(0, 3).join(" · ")}</dd></div>
                </dl>
                <Link to={`/work/${p.slug}`} className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-widest text-z-eyebrow link-u" data-testid={`work-case-link-${p.slug}`}>Read the case study →</Link>
                {p.testimonialApproved && p.testimonialQuote && <blockquote className="mt-6 text-z-body">“{p.testimonialQuote}” — {p.testimonialAttribution}</blockquote>}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <SampleTestimonials />

      <section className="bg-z-navy px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>Our standard for proof</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight">How each case study will be written.</h2>
            <p className="mt-4 max-w-md text-z-body">No traffic, sales or ranking claims without evidence. Metrics appear only when they've been measured and the client has approved publication.</p>
          </div>
          <ol className="border-t border-white/10">
            {STRUCTURE.map((s, i) => (
              <Reveal as="li" key={s} delay={i * 0.05} className="flex gap-5 border-b border-white/10 py-4 text-white"><span className="font-mono text-xs text-z-cyan">0{i + 1}</span>{s}</Reveal>
            ))}
          </ol>
        </div>
      </section>
      <ContactBand source="work" title={[["Have a project like these? ", { g: "Let's talk." }]]} />
    </>
  );
}

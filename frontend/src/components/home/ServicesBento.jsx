import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FAMILIES } from "@/data/site";
import { servicesByFamily } from "@/data/services";
import { Headline, Reveal, Eyebrow } from "@/components/motion";

const AI_TASKS = ["Triage incoming enquiries", "Update the CRM automatically", "Draft replies for approval", "Search internal knowledge", "Process repetitive documents"];

function FamilyTile({ fam, className = "", delay = 0 }) {
  const list = servicesByFamily(fam.id);
  return (
    <Reveal delay={delay} className={`glass group relative flex flex-col justify-between overflow-hidden rounded-[20px] p-6 transition-[border-color,box-shadow] duration-500 hover:border-z-cyan/30 hover:shadow-[0_24px_70px_-30px_rgba(0,229,255,0.5)] focus-within:border-z-cyan/40 focus-within:shadow-[0_24px_70px_-30px_rgba(0,229,255,0.5)] sm:p-8 ${className}`}>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-z-muted">{fam.code} · Family</p>
        <h3 className="mt-4 font-display text-2xl leading-tight">{fam.label}</h3>
        <p className="mt-3 max-w-md text-z-body">{fam.blurb}</p>
      </div>
      <ul className="mt-8 flex flex-wrap gap-2">
        {list.map((s) => (
          <li key={s.slug}>
            <Link to={`/services/${s.slug}`} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/10 px-3.5 text-[14px] text-z-body transition-colors hover:border-z-cyan/50 hover:text-white" data-testid={`bento-link-${s.slug}`}>
              {s.short} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function ServicesBento() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32" data-testid="services-bento">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <Headline lines={[["Technology should remove friction,"], ["not add ", { g: "another dashboard." }]]} className="mt-6 max-w-3xl font-display text-[clamp(1.9rem,4.4vw,3.5rem)] font-medium leading-[1.06]" />
          </div>
          <Link to="/services" className="font-mono text-xs uppercase tracking-widest text-z-eyebrow link-u" data-testid="bento-all-services">All services →</Link>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          <Reveal className="relative overflow-hidden rounded-[20px] border border-z-gold/25 bg-[linear-gradient(160deg,#0D1322_0%,#070B14_60%)] p-6 sm:p-10 lg:col-span-7 lg:row-span-2">
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,184,0,0.18),transparent)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-z-gold">01 · Lead path · AI & automation</p>
            <h3 className="mt-5 max-w-lg font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1]">Give your team back the hours lost to routine admin.</h3>
            <p className="mt-4 max-w-lg text-z-body">We map how work actually moves through your business, then automate the repetitive steps — with a person reviewing anything that carries risk.</p>
            <ol className="relative mt-8 space-y-0 border-l border-z-gold/30 pl-6">
              {AI_TASKS.map((t, i) => (
                <li key={t} className="relative py-2.5 text-[15px] text-white">
                  <span className="absolute -left-[29px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-z-gold" aria-hidden="true" />
                  <span className="mr-3 font-mono text-xs text-z-muted">0{i + 1}</span>{t}
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services/ai-automation" className="btn-primary inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 font-mono text-[12px] font-semibold uppercase tracking-widest" data-cursor="cta" data-testid="bento-ai-link">
                Explore AI automation <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <FamilyTile fam={FAMILIES[1]} className="lg:col-span-5" delay={0.08} />
          <FamilyTile fam={FAMILIES[2]} className="lg:col-span-5" delay={0.16} />
          <FamilyTile fam={FAMILIES[3]} className="lg:col-span-12 lg:flex-row lg:items-end lg:gap-10" delay={0.1} />
        </div>
      </div>
    </section>
  );
}

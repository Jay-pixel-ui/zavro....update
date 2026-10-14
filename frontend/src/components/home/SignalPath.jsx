import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Headline, Reveal, Eyebrow, EASE } from "@/components/motion";

const STEPS = [
  { id: "site", label: "Website", text: "A clear public face that explains what you do, who you help and how to reach you.", joined: "Built with the pages search needs and the forms your workflow expects.", to: "/services/web-development" },
  { id: "discovery", label: "Discovery", text: "SEO and GEO so people, search engines and AI answer tools can find and understand you.", joined: "Uses the site structure directly, rather than bolting keywords on later.", to: "/services/seo" },
  { id: "content", label: "Content & social", text: "Useful content and a sustainable social rhythm that answers real customer questions.", joined: "Every piece points back to a page that can convert interest into an enquiry.", to: "/services/social-media" },
  { id: "capture", label: "Enquiry capture", text: "Forms and WhatsApp paths that reach the right person with the context they need.", joined: "Captures which service and source the enquiry came from — without tracking personal details.", to: "/contact" },
  { id: "workflow", label: "Workflows & CRM", text: "Automation that files, routes and follows up, with a person reviewing what matters.", joined: "Removes re-typing between the website, inbox and CRM.", to: "/services/ai-automation" },
  { id: "report", label: "Reporting", text: "Measurement that shows which activity contributes, so the next decision is easier.", joined: "Feeds back into what we improve on the site, content and workflows.", to: "/services/digital-marketing" },
];

export default function SignalPath() {
  const [active, setActive] = useState(0);
  const s = STEPS[active];
  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32" data-testid="signal-path-section">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Eyebrow>Connected disciplines</Eyebrow>
            <Headline lines={[["One team connecting"], [{ g: "your digital systems." }]]} className="mt-6 font-display text-[clamp(2rem,4.8vw,3.8rem)] font-medium leading-[1.05]" />
          </div>
          <Reveal className="max-w-lg text-z-body lg:justify-self-end">
            Most businesses buy a website, then SEO, then a CRM, from different people. Each part works alone. We plan them as one path — so a visitor who finds you can become an enquiry your team actually handles.
          </Reveal>
        </div>

        <div className="relative mt-16 hidden lg:block">
          <svg viewBox="0 0 1200 40" className="absolute left-0 top-[22px] h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
            <line x1="40" x2="1160" y1="20" y2="20" stroke="rgba(255,255,255,.1)" strokeWidth="1.5" />
            <motion.line x1="40" y1="20" y2="20" stroke="url(#sp-grad)" strokeWidth="2" animate={{ x2: 40 + (1120 * active) / (STEPS.length - 1) }} transition={{ duration: 0.7, ease: EASE }} />
            <defs><linearGradient id="sp-grad" x1="0" x2="1"><stop offset="0" stopColor="#00E5FF" /><stop offset="1" stopColor="#FFB800" /></linearGradient></defs>
          </svg>
          <div className="relative grid grid-cols-6" role="group" aria-label="Signal path stages">
            {STEPS.map((st, i) => (
              <button key={st.id} type="button" onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} aria-pressed={active === i} className="group flex flex-col items-center gap-4 px-2 pb-2 pt-1 text-center" data-testid={`signal-step-${st.id}`}>
                <span className={`relative flex h-11 w-11 items-center justify-center rounded-full border font-mono text-xs transition-all duration-500 ${i <= active ? "border-z-cyan bg-z-bg text-z-cyan shadow-[0_0_24px_-4px_rgba(0,229,255,0.7)]" : "border-white/15 bg-z-bg text-z-muted"}`}>0{i + 1}</span>
                <span className={`font-mono text-[12px] uppercase tracking-widest transition-colors ${active === i ? "text-white" : "text-z-muted group-hover:text-z-body"}`}>{st.label}</span>
              </button>
            ))}
          </div>
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }} className="glass mt-10 grid grid-cols-[1.2fr_1fr_auto] items-center gap-10 rounded-[20px] p-8" aria-live="polite">
            <p className="font-display text-2xl leading-snug text-white">{s.text}</p>
            <p className="border-l border-z-gold/40 pl-6 text-z-body"><span className="mb-1 block font-mono text-[12px] uppercase tracking-widest text-z-gold">When it's joined up</span>{s.joined}</p>
            <Link to={s.to} className="font-mono text-xs uppercase tracking-widest text-z-eyebrow link-u" data-testid="signal-step-link">Learn more →</Link>
          </motion.div>
        </div>

        <ol className="mt-12 space-y-0 lg:hidden">
          {STEPS.map((st, i) => (
            <li key={st.id} className="relative border-l border-white/12 pb-8 pl-8 last:pb-0">
              <span className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-z-cyan/60 bg-z-bg font-mono text-[11px] text-z-cyan">0{i + 1}</span>
              <h3 className="font-display text-lg">{st.label}</h3>
              <p className="mt-2 text-z-body">{st.text}</p>
              <p className="mt-2 text-sm text-z-muted">{st.joined}</p>
              <Link to={st.to} className="mt-2 inline-flex min-h-[40px] items-center font-mono text-xs uppercase tracking-widest text-z-eyebrow">Learn more →</Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

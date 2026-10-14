import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow } from "@/components/motion";
import Faq from "@/components/Faq";
import ContactBand from "@/components/ContactBand";

const STAGES = [
  ["Discovery", "A conversation about your business, audience, current systems and what's prompting the project. We may review your site, tools or data with your permission.", "You share context and access where useful."],
  ["Scoping", "We turn what we learned into priorities, constraints and a clear definition of what's in and out of scope — plus how success will be measured.", "You confirm priorities and who makes decisions."],
  ["Proposal", "A written proposal covering scope, deliverables, approach, responsibilities, timeline and cost. Nothing starts until you've agreed it.", "You review, ask questions and approve."],
  ["Delivery", "Design, build, integration or content work in reviewable increments, so you see progress early rather than at the end.", "You give timely feedback and supply content."],
  ["Review & testing", "We test on real devices and data, check accessibility and edge cases, and walk you through the work before launch.", "You test, approve and flag anything missed."],
  ["Launch", "Go-live with a checklist: redirects, tracking, forms, backups and a rollback plan where relevant.", "You confirm the go-live window."],
  ["Follow-on support", "Where the engagement includes it: monitoring, fixes, improvements and regular check-ins on what to do next.", "You decide what continues."],
];

const NEEDS = ["A single decision-maker who can approve work", "Access to relevant accounts, systems and data — shared securely", "Content, images and facts you want published", "Timely feedback during review windows", "Clarity on any legal, compliance or brand constraints"];

const FAQS = [
  { q: "What happens if the scope changes?", a: "Changes are normal. We describe the impact on timing and cost in writing and only proceed once you've approved it. Small adjustments within the agreed scope don't need a formal change." },
  { q: "How do you communicate progress?", a: "Through the channel we agree — usually email or WhatsApp — with regular updates and review sessions at key milestones. You'll always know what's done, what's next and what we need from you." },
  { q: "Do all projects go through every stage?", a: "No. A focused fix can move through discovery and delivery quickly. Larger builds need each stage in more depth. We agree this in the proposal." },
  { q: "Who owns the work?", a: "Ownership of deliverables, code and accounts is set out in the engagement terms before work begins." },
];

export default function Process() {
  return (
    <>
      <Seo title="Process | How engagements work — Zavro Solutions" description="How Zavro engagements work: discovery, scoping, proposal, delivery, testing, launch and follow-on support — with clear responsibilities and change control." path="/process" crumbs={[{ to: "/", label: "Home" }, { to: "/process", label: "Process" }]} />
      <section className="px-5 pb-16 pt-28 sm:px-8 sm:pt-36" data-testid="process-page">
        <div className="mx-auto max-w-[1240px]">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/process", label: "Process" }]} />
          <Eyebrow>Process</Eyebrow>
          <Headline as="h1" onMount lines={[["How working with us"], [{ g: "actually works." }]]} className="mt-6 max-w-4xl font-display text-[clamp(2.3rem,6.4vw,5rem)] font-medium leading-[1.03]" />
          <Reveal delay={0.3} className="mt-6 max-w-2xl text-lg text-z-body">No black box. Here's what each stage involves, what we'll need from you and how changes are handled.</Reveal>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8" aria-label="Stages">
        <div className="mx-auto max-w-[1240px]">
          <ol className="relative border-l border-white/10 lg:ml-[220px]">
            {STAGES.map(([t, d, you], i) => (
              <Reveal as="li" key={t} className="relative pb-14 pl-8 last:pb-0 sm:pl-12" data-testid={`stage-${i}`}>
                <span className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-z-cyan bg-z-bg shadow-[0_0_16px_rgba(0,229,255,.6)]" aria-hidden="true" />
                <p className="font-mono text-xs text-z-cyan lg:absolute lg:-left-[220px] lg:top-2 lg:w-[180px] lg:text-right">STAGE {String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 font-display text-[clamp(1.5rem,3vw,2.2rem)] font-medium lg:mt-0">{t}</h2>
                <p className="mt-3 max-w-2xl text-z-body">{d}</p>
                <p className="mt-3 max-w-2xl border-l border-z-gold/40 pl-4 text-[15px] text-z-body"><span className="font-mono text-[12px] uppercase tracking-widest text-z-gold">Your part · </span>{you}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-z-navy px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-2">
          <Reveal className="glass rounded-[20px] p-6 sm:p-10">
            <p className="eyebrow">Client responsibilities</p>
            <h2 className="mt-4 font-display text-2xl">What we'll need from you.</h2>
            <ul className="mt-6 space-y-3">{NEEDS.map((n) => <li key={n} className="flex gap-3 text-z-body"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-z-cyan" aria-hidden="true" />{n}</li>)}</ul>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[20px] border border-z-gold/25 p-6 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-z-gold">Change control</p>
            <h2 className="mt-4 font-display text-2xl">Changes, in writing.</h2>
            <p className="mt-6 text-z-body">When something new comes up, we describe what it adds, what it affects and what it costs in time or money. You decide. Nothing outside the agreed scope is billed without your approval.</p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium">Process questions.</h2>
          <Faq items={FAQS} idPrefix="process-faq" />
        </div>
      </section>
      <ContactBand source="process" />
    </>
  );
}

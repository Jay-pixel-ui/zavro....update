import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Check, X as XIcon, RefreshCw } from "lucide-react";
import { Reveal, Eyebrow } from "@/components/motion";
import ServiceVisual from "@/components/ServiceVisuals";

const Band = ({ children, className = "", testid }) => (
  <section className={`px-5 py-16 sm:px-8 sm:py-20 ${className}`} data-testid={testid}>
    <div className="mx-auto max-w-[1240px]">{children}</div>
  </section>
);

/* AI AUTOMATION — transparent workflow canvas */
function AiSignature({ s }) {
  const chips = [
    ["Every step logged", "You can see what happened and when."],
    ["Human-in-the-loop", "Risky decisions wait for approval."],
    ["Reversible by design", "Fallbacks and a clear owner when something breaks."],
  ];
  return (
    <Band testid="signature-ai" className="relative">
      <Reveal className="relative overflow-hidden rounded-[24px] border border-z-cyan/20 bg-[linear-gradient(160deg,rgba(0,229,255,0.05),rgba(7,11,20,0.6)_55%)] p-5 sm:p-8">
        <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_75%)]" />
        <div className="relative">
          <Eyebrow>The pipeline, in the open</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.5rem,3.2vw,2.3rem)] font-medium leading-[1.1]">
            A transparent canvas — not a black box.
          </h2>
          <p className="mt-3 max-w-xl text-z-body">This is how an enquiry actually moves once it&apos;s automated: classified, routed, and handed to a person wherever judgement matters.</p>
        </div>
        <div className="relative mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
          <ServiceVisual kind={s.visual} label="Transparent AI workflow pipeline" />
          <ol className="space-y-3">
            {chips.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.08} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="flex items-center gap-2 font-display text-lg text-white"><span className="h-2 w-2 rounded-full bg-z-cyan" aria-hidden="true" />{t}</p>
                <p className="mt-1.5 pl-4 text-[15px] text-z-body">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Reveal>
    </Band>
  );
}

/* WEB DEVELOPMENT — before / after editorial */
function WebSignature({ s }) {
  const before = s.problems;
  const after = [
    "Visitors understand the offer in seconds",
    "Fast and stable on phones first",
    "Enquiries land where someone answers",
    "Your team edits content without a developer",
  ];
  return (
    <Band testid="signature-web">
      <Reveal>
        <Eyebrow>Before / after</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.5rem,3.2vw,2.3rem)] font-medium leading-[1.1]">
          What a rebuild actually changes.
        </h2>
      </Reveal>
      <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <Reveal className="rounded-[20px] border border-white/10 bg-white/[0.015] p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-z-muted">Before</p>
          <ul className="mt-6 space-y-4">
            {before.map((b) => (
              <li key={b} className="flex gap-3 text-z-muted">
                <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-white/30" aria-hidden="true" />
                <span className="line-through decoration-white/20">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="flex items-center justify-center lg:px-2" aria-hidden="true">
          <span className="hidden rounded-full border border-z-cyan/30 bg-z-bg p-3 text-z-cyan lg:flex"><ArrowRight className="h-5 w-5" /></span>
          <span className="flex rounded-full border border-z-cyan/30 bg-z-bg p-3 text-z-cyan lg:hidden"><ArrowDown className="h-5 w-5" /></span>
        </div>
        <Reveal delay={0.1} className="rounded-[20px] border border-z-cyan/25 bg-[linear-gradient(160deg,rgba(0,229,255,0.06),rgba(13,19,34,0.5)_60%)] p-6 shadow-[0_30px_80px_-40px_rgba(0,229,255,0.5)] sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-z-eyebrow">After</p>
          <ul className="mt-6 space-y-4">
            {after.map((a) => (
              <li key={a} className="flex gap-3 text-white">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-z-cyan" aria-hidden="true" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Band>
  );
}

/* DIGITAL MARKETING — channels → enquiry loop */
function MarketingSignature() {
  const channels = [["Search", "#00E5FF"], ["AI answers", "#B98CFF"], ["Social", "#5EA8FF"]];
  return (
    <Band testid="signature-marketing">
      <Reveal>
        <Eyebrow>One connected demand path</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.5rem,3.2vw,2.3rem)] font-medium leading-[1.1]">
          Channels that feed one path — not five silos.
        </h2>
      </Reveal>
      <div className="mt-10 grid items-center gap-6 lg:grid-cols-[auto_auto_auto_auto_auto] lg:justify-between">
        <div className="grid gap-3">
          {channels.map(([c, col], i) => (
            <Reveal as="div" key={c} delay={i * 0.08} className="flex min-w-[160px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: col }} aria-hidden="true" />
              <span className="text-[15px] text-white">{c}</span>
            </Reveal>
          ))}
        </div>
        <Arrow />
        <Reveal delay={0.2} className="flex min-w-[180px] flex-col items-center rounded-2xl border border-z-cyan/25 bg-white/[0.02] px-6 py-5 text-center">
          <p className="font-display text-lg text-white">Website & content</p>
          <p className="mt-1 text-[13px] text-z-muted">answers the intent</p>
        </Reveal>
        <Arrow />
        <Reveal delay={0.3} className="flex min-w-[150px] flex-col items-center rounded-2xl border border-z-gold/40 bg-[rgba(255,184,0,0.06)] px-6 py-5 text-center">
          <p className="font-display text-lg text-white">Enquiry</p>
          <p className="mt-1 text-[13px] text-z-gold">handled consistently</p>
        </Reveal>
      </div>
      <Reveal delay={0.4} className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[12px] uppercase tracking-widest text-z-muted">
        <RefreshCw className="h-3.5 w-3.5 text-z-cyan" aria-hidden="true" /> measure → learn → adjust
      </Reveal>
    </Band>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center" aria-hidden="true">
      <span className="hidden text-z-cyan lg:flex"><ArrowRight className="h-6 w-6" /></span>
      <span className="flex text-z-cyan lg:hidden"><ArrowDown className="h-6 w-6" /></span>
    </div>
  );
}

const SIGNATURES = {
  "ai-automation": AiSignature,
  "web-development": WebSignature,
  "digital-marketing": MarketingSignature,
};

export const hasSignature = (slug) => Boolean(SIGNATURES[slug]);

export default function ServiceSignature({ s }) {
  const Comp = SIGNATURES[s.slug];
  if (!Comp) return null;
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>
      <Comp s={s} />
    </motion.div>
  );
}

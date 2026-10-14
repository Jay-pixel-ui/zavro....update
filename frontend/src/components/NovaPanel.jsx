import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { INTENTS, waLink } from "@/data/site";
import { serviceBySlug } from "@/data/services";
import { track } from "@/lib/analytics";
import { EASE } from "@/components/motion";

const STEPS = [
  { key: "business", q: "What kind of business are you?", options: ["Retail / e-commerce", "Home services / trades", "Construction / property", "Professional services", "Startup / tech product", "Something else"] },
  { key: "intent", q: "What's the main thing you want to change?", options: INTENTS.map((i) => i.label) },
  { key: "timing", q: "Roughly when would you like to start?", options: ["As soon as possible", "Within 1–3 months", "3–6 months", "Just exploring"] },
  { key: "contact", q: "How would you prefer we follow up?", options: ["Email", "WhatsApp", "Phone call"] },
];

function recommend(a) {
  const intent = INTENTS.find((i) => i.label === a.intent) || INTENTS[0];
  let list = [...intent.services];
  if (a.business === "Retail / e-commerce" && intent.id === "convert") list = ["ecommerce-development", ...list.filter((s) => s !== "ecommerce-development")];
  return list.map(serviceBySlug).filter(Boolean);
}

export default function NovaPanel({ onClose }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const ref = useRef(null);
  const nav = useNavigate();
  const done = step >= STEPS.length;

  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const key = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", key);
    track("nova_open", {});
    return () => { document.removeEventListener("keydown", key); prev?.focus?.(); };
  }, [onClose]);

  const pick = (opt) => { setAns((a) => ({ ...a, [STEPS[step].key]: opt })); setStep((s) => s + 1); };
  const recs = done ? recommend(ans) : [];
  const summary = `Business type: ${ans.business}. Main goal: ${ans.intent}. Timing: ${ans.timing}. (Shared via NOVA guide)`;

  const toEnquiry = () => {
    try { sessionStorage.setItem("zv-nova", JSON.stringify({ service: recs[0]?.slug, summary, timing: ans.timing, contact: ans.contact })); } catch (e) { /* ignore */ }
    track("nova_to_enquiry", { service: recs[0]?.slug });
    onClose();
    nav(`/contact?service=${recs[0]?.slug || ""}&from=nova`);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="false"
      aria-labelledby="nova-title"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="glass-strong fixed inset-x-3 bottom-3 z-[70] flex max-h-[82vh] flex-col overflow-hidden rounded-[20px] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
      data-testid="nova-panel"
      data-lenis-prevent
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p id="nova-title" ref={ref} tabIndex={-1} className="font-display text-base text-white outline-none">NOVA</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-z-muted">Guided service finder</p>
        </div>
        <button onClick={onClose} aria-label="Close NOVA" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white hover:border-white/30" data-testid="nova-close">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div data-lenis-prevent className="overflow-y-auto px-5 py-5">
        <p className="mb-5 rounded-ctl bg-white/[0.04] p-3 text-[13px] leading-relaxed text-z-body">
          NOVA is a guided set of questions, not a live AI chat. It suggests a starting point from this site's service pages. A person from Zavro reviews every enquiry.
        </p>
        {!done ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-z-eyebrow">Step {step + 1} of {STEPS.length}</p>
              {step > 0 && (
                <button onClick={() => setStep((s) => s - 1)} className="flex min-h-[36px] items-center gap-1 text-sm text-z-body hover:text-white" data-testid="nova-back"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</button>
              )}
            </div>
            <h2 className="font-display text-lg leading-snug text-white">{STEPS[step].q}</h2>
            <div className="mt-4 grid gap-2">
              {STEPS[step].options.map((o, i) => (
                <button key={o} onClick={() => pick(o)} className="min-h-[46px] rounded-ctl border border-white/10 px-4 py-2.5 text-left text-[15px] text-z-body transition-colors hover:border-z-cyan/50 hover:bg-z-cyan/[0.05] hover:text-white" data-testid={`nova-option-${step}-${i}`}>{o}</button>
              ))}
            </div>
          </div>
        ) : (
          <div data-testid="nova-result">
            <p className="font-mono text-xs uppercase tracking-widest text-z-eyebrow">Suggested starting point</p>
            <h2 className="mt-2 font-display text-xl text-white">{recs[0]?.short}</h2>
            <p className="mt-2 text-[15px] text-z-body">{recs[0]?.answer.split(". ")[0]}.</p>
            <p className="mt-4 text-[13px] text-z-muted">You told us: {ans.business} · {ans.intent} · {ans.timing} · prefers {ans.contact}.</p>
            <div className="mt-5 grid gap-2">
              <button onClick={toEnquiry} className="btn-primary min-h-[48px] rounded-full px-5 font-mono text-[12px] font-semibold uppercase tracking-widest" data-testid="nova-start-enquiry">Start an enquiry with this summary</button>
              <Link to={`/services/${recs[0]?.slug}`} onClick={onClose} className="btn-ghost flex min-h-[48px] items-center justify-center rounded-full px-5 font-mono text-[12px] uppercase tracking-widest" data-testid="nova-view-service">View the service page</Link>
            </div>
            {recs.length > 1 && (
              <p className="mt-5 text-sm text-z-body">Also relevant:{" "}
                {recs.slice(1).map((r, i) => (
                  <span key={r.slug}>{i > 0 && ", "}<Link to={`/services/${r.slug}`} onClick={onClose} className="text-z-eyebrow underline">{r.short}</Link></span>
                ))}
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <a href={waLink(summary)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "nova" })} className="text-z-body underline hover:text-white" data-testid="nova-whatsapp">Send via WhatsApp instead</a>
              <button onClick={() => { setAns({}); setStep(0); }} className="text-z-muted underline hover:text-white" data-testid="nova-restart">Start over</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

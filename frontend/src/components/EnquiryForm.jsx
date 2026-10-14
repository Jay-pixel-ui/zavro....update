import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { SERVICES } from "@/data/services";
import { SITE, mailLink, waLink } from "@/data/site";
import { readUtm, track } from "@/lib/analytics";
import { EASE } from "@/components/motion";

const API = process.env.REACT_APP_BACKEND_URL;
const AREAS = [...SERVICES.map((s) => ({ v: s.slug, l: s.short })), { v: "growth-audit", l: "Growth audit (scope agreed first)" }, { v: "not-sure", l: "Not sure yet" }];
const TIMING = ["As soon as possible", "Within 1–3 months", "3–6 months", "Just exploring"];
const CONTACT = ["Email", "WhatsApp", "Phone call"];
const MAX = 1500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const inputCls = "w-full rounded-ctl border border-white/12 bg-white/[0.03] px-4 py-3 text-[16px] text-white placeholder:text-z-muted/80 transition-colors focus:border-z-cyan/70 focus:bg-white/[0.05] focus:outline-none focus-visible:outline-2 focus-visible:outline-z-cyan";

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between font-mono text-xs uppercase tracking-widest text-z-body">
        {label}
        {optional && <span className="normal-case tracking-normal text-z-muted">Optional</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-[#FCA5A5]" role="alert">{error}</p>}
    </div>
  );
}

function initialState(params) {
  let nova = {};
  try { nova = JSON.parse(sessionStorage.getItem("zv-nova") || "{}"); } catch (e) { nova = {}; }
  const q = params.get("service");
  const service = AREAS.some((a) => a.v === q) ? q : nova.service || "";
  return { name: "", email: "", company: "", service, summary: nova.summary || "", timing: nova.timing || "", contact_method: nova.contact || "", website_url: "" };
}

export default function EnquiryForm({ source = "contact" }) {
  const [params] = useSearchParams();
  const [v, setV] = useState(() => initialState(params));
  const [errors, setErrors] = useState({});
  const [more, setMore] = useState(Boolean(v.timing || v.contact_method));
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const started = useRef(false);
  const from = params.get("from") || "";

  useEffect(() => { try { sessionStorage.removeItem("zv-nova"); } catch (e) { /* ignore */ } }, []);

  const set = (k) => (e) => {
    if (!started.current) { started.current = true; track("form_start", { location: source }); }
    setV((s) => ({ ...s, [k]: e.target.value }));
  };

  const validate = () => {
    const e = {};
    if (v.name.trim().length < 2) e.name = "Please enter your name.";
    if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
    if (!v.service) e.service = "Choose the area you need help with.";
    if (v.summary.trim().length < 10) e.summary = "Tell us a little more — at least 10 characters.";
    return e;
  };

  const waText = useMemo(() => {
    const area = AREAS.find((a) => a.v === v.service)?.l || "";
    return `Hi Zavro, I'm ${v.name || "[name]"}.${area ? ` Area: ${area}.` : ""} ${v.summary}`.trim();
  }, [v]);

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }
    if (!API) { setStatus("error"); return; }
    setStatus("submitting");
    try {
      const res = await fetch(`${API}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, source_page: window.location.pathname, from_nova: from === "nova", utm: readUtm() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 422 && data?.detail?.fields) setErrors(data.detail.fields);
        throw new Error("rejected");
      }
      setResult(data);
      setStatus("success");
      track("form_submit_success", { service: v.service, location: source, source: from === "nova" ? "nova" : "form" });
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="py-6" role="status" data-testid="enquiry-success">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-z-live/15 text-z-live"><Check className="h-6 w-6" aria-hidden="true" /></div>
        <h3 className="mt-6 font-display text-2xl">Enquiry received.</h3>
        <p className="mt-3 max-w-md text-z-body">Thanks, {v.name.split(" ")[0]}. Your enquiry has been saved{result?.reference ? <> under reference <span className="font-mono text-white">{result.reference}</span></> : null}. A person from the Zavro team reviews every enquiry and will reply by your preferred method. We aim to reply within 24 hours.</p>
        <p className="mt-4 text-sm text-z-muted">Need to add something? Email <a className="text-z-eyebrow underline" href={mailLink()}>{SITE.email}</a>.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5" data-testid="enquiry-form" aria-describedby="form-privacy">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url">Leave this field empty</label>
        <input id="website_url" tabIndex={-1} autoComplete="off" value={v.website_url} onChange={set("website_url")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input id="name" className={inputCls} value={v.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} data-testid="enquiry-name-input" />
        </Field>
        <Field id="email" label="Work email" error={errors.email}>
          <input id="email" type="email" className={inputCls} value={v.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} data-testid="enquiry-email-input" />
        </Field>
      </div>
      <Field id="company" label="Company or website" optional>
        <input id="company" className={inputCls} value={v.company} onChange={set("company")} autoComplete="organization" data-testid="enquiry-company-input" />
      </Field>
      <Field id="service" label="Main area of help" error={errors.service}>
        <div className="relative">
          <select id="service" className={`${inputCls} appearance-none pr-10`} value={v.service} onChange={set("service")} aria-invalid={!!errors.service} data-testid="enquiry-service-select">
            <option value="" className="bg-z-navy">Select an area</option>
            {AREAS.map((a) => <option key={a.v} value={a.v} className="bg-z-navy">{a.l}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-z-muted" aria-hidden="true" />
        </div>
      </Field>
      <Field id="summary" label="Short project summary" error={errors.summary}>
        <textarea id="summary" rows={4} maxLength={MAX} className={`${inputCls} resize-y`} value={v.summary} onChange={set("summary")} placeholder="What's happening now, and what would you like to change?" aria-invalid={!!errors.summary} data-testid="enquiry-summary-input" />
        <p className="mt-1 text-right font-mono text-xs text-z-muted">{v.summary.length}/{MAX}</p>
      </Field>

      <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} className="flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-widest text-z-eyebrow" data-testid="enquiry-more-toggle">
        <ChevronDown className={`h-4 w-4 transition-transform ${more ? "rotate-180" : ""}`} aria-hidden="true" /> Timing & contact preference (optional)
      </button>
      <AnimatePresence initial={false}>
        {more && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
            <div className="grid gap-5 pb-1 sm:grid-cols-2">
              <Field id="timing" label="Approximate timing" optional>
                <select id="timing" className={`${inputCls} appearance-none`} value={v.timing} onChange={set("timing")} data-testid="enquiry-timing-select">
                  <option value="" className="bg-z-navy">Choose</option>
                  {TIMING.map((t) => <option key={t} className="bg-z-navy">{t}</option>)}
                </select>
              </Field>
              <Field id="contact_method" label="Preferred contact" optional>
                <select id="contact_method" className={`${inputCls} appearance-none`} value={v.contact_method} onChange={set("contact_method")} data-testid="enquiry-contact-select">
                  <option value="" className="bg-z-navy">Choose</option>
                  {CONTACT.map((t) => <option key={t} className="bg-z-navy">{t}</option>)}
                </select>
              </Field>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {status === "error" && (
        <div role="alert" className="rounded-ctl border border-[#FCA5A5]/40 bg-[#FCA5A5]/[0.06] p-4 text-[15px] text-z-body" data-testid="enquiry-error">
          <strong className="text-white">Your enquiry was not sent.</strong> Please try again, or reach us directly by{" "}
          <a className="text-z-eyebrow underline" href={mailLink()}>email</a> or{" "}
          <a className="text-z-eyebrow underline" href={waLink(waText)} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
        </div>
      )}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "submitting"} className="btn-primary inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full px-8 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] disabled:opacity-70" data-cursor="cta" data-testid="enquiry-submit-button">
          {status === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending</> : "Send enquiry"}
        </button>
        <a href={waLink(waText)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: `${source}-form` })} className="text-sm text-z-body link-u hover:text-white" data-testid="enquiry-whatsapp-link">
          Or continue in WhatsApp — opens WhatsApp; you send the message yourself.
        </a>
      </div>
      <p id="form-privacy" className="text-sm text-z-muted">Your enquiry is used to respond to your request. See our <a href="/privacy" className="underline hover:text-white">privacy notice</a>.</p>
    </form>
  );
}

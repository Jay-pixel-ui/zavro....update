import { randomBytes } from "node:crypto";
import { handle, send, httpError } from "./_lib/http.mjs";
import { admin } from "./_lib/supabase.mjs";
import { sendLeadEmails } from "./_lib/email.mjs";
import { qualifyLead } from "./_lib/ai.mjs";

const SERVICES = new Set(["ai-automation", "web-development", "ecommerce-development", "software-development", "mobile-app-development", "digital-marketing", "seo", "geo", "social-media", "branding", "business-consulting", "growth-audit", "not-sure"]);
const TIMINGS = new Set(["", "As soon as possible", "Within 1–3 months", "3–6 months", "Just exploring"]);
const CONTACTS = new Set(["", "Email", "WhatsApp", "Phone call"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referrer"];
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const newRef = () => `ZV-${randomBytes(4).toString("hex").toUpperCase()}`;

function validate(b) {
  const f = {};
  const name = str(b.name, 120), email = str(b.email, 200).toLowerCase(), summary = str(b.summary, 1500), service = str(b.service, 60);
  if (name.length < 2) f.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) f.email = "Please enter a valid email address.";
  if (!SERVICES.has(service)) f.service = "Choose the area you need help with.";
  if (summary.length < 10) f.summary = "Tell us a little more — at least 10 characters.";
  const utm = {};
  for (const k of UTM_KEYS) if (b.utm && typeof b.utm[k] === "string" && b.utm[k]) utm[k] = b.utm[k].slice(0, 200);
  return {
    fields: f,
    value: {
      name, email, service, message: summary,
      company: str(b.company, 200),
      timing: TIMINGS.has(b.timing) ? b.timing : "",
      contact_method: CONTACTS.has(b.contact_method) ? b.contact_method : "",
      source_page: str(b.source_page, 120),
      from_nova: b.from_nova === true,
      utm,
    },
  };
}

// Public endpoint used by the website enquiry form.
export default handle(["POST"], async (req, res) => {
  const body = typeof req.body === "object" && req.body ? req.body : {};
  // Honeypot: bots fill the hidden field. Pretend success, store nothing.
  if (str(body.website_url, 200)) return send(res, 201, { ok: true, reference: newRef() });

  const { fields, value } = validate(body);
  if (Object.keys(fields).length) throw httpError(422, "validation_failed", { fields });

  const db = admin();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const [{ count: sameEmail }, { count: all }] = await Promise.all([
    db.from("leads").select("id", { count: "exact", head: true }).eq("email", value.email).gte("created_at", since),
    db.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since),
  ]);
  if ((sameEmail ?? 0) >= 5 || (all ?? 0) >= 200) throw httpError(429, "too_many_requests");

  const { data: lead, error } = await db.from("leads")
    .insert({ ...value, reference: newRef(), source: "website" }).select().single();
  if (error) {
    console.error("lead insert failed", error.message);
    throw httpError(503, "could_not_save");
  }
  // Best effort: a failed email or AI call must never lose the lead.
  const [mail] = await Promise.allSettled([sendLeadEmails(lead), qualifyLead(lead)]);
  const email_status = mail.status === "fulfilled" ? mail.value : "failed";
  await db.from("leads").update({ email_status }).eq("id", lead.id);
  send(res, 201, { ok: true, reference: lead.reference });
});

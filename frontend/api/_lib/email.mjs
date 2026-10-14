import { Resend } from "resend";

const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const row = (k, v) => (v ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>` : "");

// Returns "sent", "partial", "skipped" or "failed". Never throws: a lost email must not lose the lead.
export async function sendLeadEmails(lead) {
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return "skipped";
  const resend = new Resend(process.env.RESEND_API_KEY.trim());
  const from = process.env.MAIL_FROM.trim();
  const jobs = [];
  if (process.env.NOTIFY_EMAIL) {
    jobs.push(resend.emails.send({
      from, to: process.env.NOTIFY_EMAIL.trim(), replyTo: lead.email,
      subject: `New enquiry ${lead.reference}: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
      html: `<div style="font:15px system-ui,sans-serif;color:#0f172a"><p><b>New website enquiry</b></p><table>${row("Reference", lead.reference)}${row("Name", lead.name)}${row("Email", lead.email)}${row("Company", lead.company)}${row("Area", lead.service)}${row("Timing", lead.timing)}${row("Prefers", lead.contact_method)}${row("Page", lead.source_page)}</table><p style="white-space:pre-wrap">${esc(lead.message)}</p></div>`,
    }));
  }
  jobs.push(resend.emails.send({
    from, to: lead.email, subject: "We received your enquiry — Zavro Solutions",
    html: `<div style="font:15px system-ui,sans-serif;color:#0f172a"><p>Hi ${esc(lead.name.split(" ")[0])},</p><p>Thanks for reaching out. Your enquiry (reference <b>${esc(lead.reference)}</b>) has been received. A person from our team will read it and reply, usually within 24 hours.</p><p>Zavro Solutions</p></div>`,
  }));
  const results = await Promise.allSettled(jobs);
  const ok = results.filter((r) => r.status === "fulfilled" && !r.value?.error).length;
  return ok === results.length ? "sent" : ok ? "partial" : "failed";
}

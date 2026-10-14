import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Headline, Reveal, Eyebrow } from "@/components/motion";
import EnquiryForm from "@/components/EnquiryForm";
import { SITE, mailLink, waLink } from "@/data/site";
import { track } from "@/lib/analytics";

const NEXT = [
  ["We read it", "A person from the Zavro team reviews your enquiry — not an autoresponder."],
  ["We reply", "By your preferred method, with questions or a suggested next step. We aim to reply within 24 hours."],
  ["A short conversation", "If it looks like a fit, a call or chat to understand the details."],
  ["A written proposal", "Scope, approach and cost in writing — only if you want to proceed."],
];

export default function Contact() {
  const ld = [{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Zavro Solutions", url: `${SITE.url}/contact`, about: { "@id": `${SITE.url}/#organization` } }];
  return (
    <>
      <Seo title="Contact | Discuss a project — Zavro Solutions" description="Discuss a project with Zavro Solutions. Send an enquiry, email ceo@zavrosolutions.site or WhatsApp +65 8980 5150. Working worldwide, headquartered in Singapore." path="/contact" jsonLd={ld} crumbs={[{ to: "/", label: "Home" }, { to: "/contact", label: "Contact" }]} />
      <section className="relative overflow-hidden px-5 pb-24 pt-28 sm:px-8 sm:pt-36" data-testid="contact-page">
        <div aria-hidden="true" className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(0,229,255,0.10),transparent)]" />
        <div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/contact", label: "Contact" }]} />
            <Eyebrow>Contact</Eyebrow>
            <Headline as="h1" onMount lines={[["Let's find out"], ["if ", { g: "we're the right fit." }]]} className="mt-6 font-display text-[clamp(2.2rem,5.6vw,4.2rem)] font-medium leading-[1.04]" />
            <Reveal delay={0.3} className="mt-6 max-w-md text-lg text-z-body">A few lines is enough to start. Budget and timing are optional.</Reveal>
            <ol className="mt-12 border-l border-white/10">
              {NEXT.map(([t, d], i) => (
                <Reveal as="li" key={t} delay={0.1 + i * 0.06} className="relative pb-7 pl-8 last:pb-0">
                  <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-z-cyan/60 bg-z-bg font-mono text-[11px] text-z-cyan">{i + 1}</span>
                  <h2 className="font-display text-lg">{t}</h2>
                  <p className="mt-1 text-[15px] text-z-body">{d}</p>
                </Reveal>
              ))}
            </ol>
            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              <a href={mailLink()} onClick={() => track("email_click", { location: "contact" })} className="glass rounded-card p-5 transition-colors hover:border-z-cyan/40" data-testid="contact-email-card">
                <p className="font-mono text-[12px] uppercase tracking-widest text-z-muted">Email</p>
                <p className="mt-2 break-all text-white">{SITE.email}</p>
              </a>
              <a href={waLink("Hi Zavro, I'd like to discuss a project.")} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "contact" })} className="glass rounded-card p-5 transition-colors hover:border-z-cyan/40" data-testid="contact-whatsapp-card">
                <p className="font-mono text-[12px] uppercase tracking-widest text-z-muted">WhatsApp</p>
                <p className="mt-2 text-white">{SITE.phoneDisplay}</p>
              </a>
            </div>
            <p className="mt-6 text-sm text-z-muted">{SITE.reach}. Remote-first, across time zones. No public office address.</p>
          </div>
          <Reveal className="glass-strong h-fit rounded-[24px] p-5 sm:p-9">
            <h2 className="mb-6 font-display text-xl">Project enquiry</h2>
            <EnquiryForm source="contact" />
          </Reveal>
        </div>
      </section>
    </>
  );
}

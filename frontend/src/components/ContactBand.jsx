import { Link } from "react-router-dom";
import { SITE, mailLink, waLink } from "@/data/site";
import { track } from "@/lib/analytics";
import { Headline, Reveal, Eyebrow } from "@/components/motion";
import EnquiryForm from "@/components/EnquiryForm";

// Closing contact block shared by home and selected pages.
export default function ContactBand({ title = [["Let's find out if ", { g: "we're the right fit." }]], intro, source = "band", showLockup = true }) {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-8 sm:py-32" id="contact" data-testid="contact-band">
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,229,255,0.12),transparent)]" />
      <div className="relative mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow>Start a conversation</Eyebrow>
          <Headline lines={title} className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.05]" />
          <Reveal className="mt-6 max-w-md text-z-body">
            {intro || "Tell us what's happening and what you'd like to change. We'll reply with a straight answer on whether — and how — we can help."}
          </Reveal>
          <Reveal delay={0.1} className="mt-8 space-y-3 text-[15px]">
            <a href={mailLink()} onClick={() => track("email_click", { location: source })} className="flex min-h-[44px] items-center gap-3 text-white link-u w-fit" data-testid={`${source}-email-link`}>{SITE.email}</a>
            <a href={waLink("Hi Zavro, I'd like to discuss a project.")} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: source })} className="flex min-h-[44px] items-center gap-3 text-white link-u w-fit" data-testid={`${source}-whatsapp-link`}>WhatsApp {SITE.phoneDisplay}</a>
            <p className="text-z-muted">{SITE.reach}</p>
          </Reveal>
          {showLockup && (
            <Reveal delay={0.15} className="mt-10 hidden max-w-[360px] overflow-hidden rounded-card border border-white/5 bg-[#03060d] lg:block">
              <img src={SITE.lockup} alt="Zavro Solutions logo lockup" width="994" height="630" loading="lazy" className="h-auto w-full" />
            </Reveal>
          )}
        </div>
        <Reveal className="glass-strong rounded-[20px] p-5 sm:p-8">
          <EnquiryForm source={source} />
          <p className="mt-6 border-t border-white/10 pt-4 text-sm text-z-muted">Prefer a fuller form? Visit the <Link to="/contact" className="underline hover:text-white">contact page</Link>.</p>
        </Reveal>
      </div>
    </section>
  );
}

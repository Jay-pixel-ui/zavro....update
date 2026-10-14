import Seo from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/data/site";

function LegalShell({ title, path, description, updated, children, testid }) {
  return (
    <>
      <Seo title={`${title} | Zavro Solutions`} description={description} path={path} crumbs={[{ to: "/", label: "Home" }, { to: path, label: title }]} />
      <article className="px-5 pb-24 pt-28 sm:px-8 sm:pt-36" data-testid={testid}>
        <div className="mx-auto max-w-[760px]">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: path, label: title }]} />
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-medium">{title}</h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-z-muted">Last updated {updated}</p>
          <p className="mt-6 rounded-ctl border border-z-gold/40 bg-z-gold/[0.06] p-4 text-[15px] text-z-body">This page is a working draft pending review by Zavro and its legal adviser. It is not legal advice.</p>
          <div className="mt-10 space-y-8 text-z-body [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_ul]:mt-3 [&_ul]:space-y-2">{children}</div>
        </div>
      </article>
    </>
  );
}

export function Privacy() {
  return (
    <LegalShell title="Privacy notice" path="/privacy" updated="12 October 2026" description="How Zavro Solutions Pte. Ltd. collects and uses personal data submitted through this website." testid="privacy-page">
      <section><h2>Who we are</h2><p className="mt-3">{SITE.legalName} (UEN {SITE.uen}), Singapore. Contact: {SITE.email}.</p></section>
      <section>
        <h2>What we collect</h2>
        <p className="mt-3">When you send an enquiry we collect what you enter: name, email, company or website (optional), the service area, your project summary, and optional timing and contact preference. We also record the page you submitted from, whether you used the NOVA guide, and campaign parameters (such as utm_source) or the referring website, if present.</p>
        <p className="mt-3">The NOVA guide does not send your answers anywhere unless you choose to start an enquiry. It is not an AI chatbot.</p>
      </section>
      <section><h2>How we use it</h2><p className="mt-3">Your enquiry is used to respond to your request and to discuss a possible engagement. We do not sell your data or use it for marketing without separate consent.</p></section>
      <section>
        <h2>Where it goes</h2>
        <ul>
          <li>Enquiries are stored in a database operated on our hosting platform.</li>
          <li>A notification containing your enquiry is emailed to our team inbox through a managed email delivery service.</li>
          <li>If you choose WhatsApp or email links, your message is handled by WhatsApp (Meta) or your email provider under their terms.</li>
        </ul>
      </section>
      <section><h2>Analytics and cookies</h2><p className="mt-3">No analytics or advertising cookies are currently in use. If we add analytics, we will update this notice and request consent where required. Your browser's session storage is used to remember campaign parameters and whether you've seen the intro animation.</p></section>
      <section><h2>Retention</h2><p className="mt-3">[Owner to confirm: retention period for enquiries that do not become clients, and for client records.]</p></section>
      <section><h2>Your rights</h2><p className="mt-3">Under Singapore's Personal Data Protection Act (PDPA) you may request access to, or correction of, personal data we hold about you, and withdraw consent. Send requests to {SITE.email}. [Owner to confirm: designated data protection contact.]</p></section>
      <section><h2>Security</h2><p className="mt-3">We take reasonable steps to protect your data, but no online transmission or storage is completely secure.</p></section>
    </LegalShell>
  );
}

export function Terms() {
  return (
    <LegalShell title="Terms of use" path="/terms" updated="12 October 2026" description="Terms for using the Zavro Solutions website." testid="terms-page">
      <section><h2>About this website</h2><p className="mt-3">This website is operated by {SITE.legalName} (UEN {SITE.uen}) to describe our services and receive enquiries. Using it does not create a client relationship; engagements are governed by a separate written agreement.</p></section>
      <section><h2>Information on this site</h2><p className="mt-3">We aim to keep content accurate, but it is general information, not professional advice for your specific situation. Service descriptions do not guarantee particular results, rankings, timelines or prices.</p></section>
      <section><h2>Intellectual property</h2><p className="mt-3">The Zavro name, logo and site content belong to {SITE.legalName}. Client names appear with permission and remain the property of their owners.</p></section>
      <section><h2>External links</h2><p className="mt-3">Links to client and third-party websites are provided for reference. We are not responsible for their content.</p></section>
      <section><h2>Governing law</h2><p className="mt-3">These terms are governed by the laws of Singapore. [Owner/legal review required.]</p></section>
    </LegalShell>
  );
}

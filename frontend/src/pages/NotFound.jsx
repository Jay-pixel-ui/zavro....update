import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Cta } from "@/components/Cta";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found | Zavro Solutions" description="This page doesn't exist. Find services, work or contact details." path="/404" noindex />
      <section className="relative flex min-h-[80vh] items-center px-5 pt-28 sm:px-8" data-testid="not-found-page">
        <div className="mx-auto w-full max-w-[1240px]">
          <p className="font-mono text-xs uppercase tracking-widest text-z-gold">404 · Route not found</p>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,6vw,4.6rem)] font-medium leading-[1.04]">This route doesn't <span className="grad-text">connect anywhere.</span></h1>
          <p className="mt-6 max-w-lg text-lg text-z-body">The page may have moved or never existed. These will get you back on track.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Cta to="/services" testid="nf-services">Services</Cta>
            <Cta to="/work" variant="ghost" testid="nf-work">Work</Cta>
            <Cta to="/contact" variant="ghost" testid="nf-contact">Contact</Cta>
          </div>
          <Link to="/" className="mt-8 inline-block text-z-eyebrow link-u">Back to home</Link>
        </div>
      </section>
    </>
  );
}

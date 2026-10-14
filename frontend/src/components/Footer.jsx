import { Link } from "react-router-dom";
import { FAMILIES, SITE, mailLink, waLink } from "@/data/site";
import { servicesByFamily } from "@/data/services";
import { track } from "@/lib/analytics";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-z-bg" data-testid="site-footer">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div>
            <div className="overflow-hidden rounded-card border border-white/5 bg-[#03060d]">
              <img src={SITE.lockup} alt="Zavro Solutions Pte Ltd — Digital Growth & IT Solutions logo with Singapore skyline" width="994" height="630" loading="lazy" className="h-auto w-full" />
            </div>
            <p className="mt-6 max-w-sm text-[15px] text-z-body">A Singapore-based team connecting websites, search, marketing, software and AI automation — working with clients in Singapore and remotely worldwide.</p>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-z-muted">{SITE.legalName} · UEN {SITE.uen}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FAMILIES.slice(0, 3).map((f) => (
              <div key={f.id}>
                <p className="eyebrow mb-4">{f.label}</p>
                <ul className="space-y-2.5">
                  {servicesByFamily(f.id).map((s) => (
                    <li key={s.slug}><Link className="text-[15px] text-z-body link-u hover:text-white" to={`/services/${s.slug}`}>{s.short}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="eyebrow mb-4">{FAMILIES[3].label}</p>
              <ul className="space-y-2.5">
                {servicesByFamily("strategy").map((s) => (
                  <li key={s.slug}><Link className="text-[15px] text-z-body link-u hover:text-white" to={`/services/${s.slug}`}>{s.short}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Studio</p>
              <ul className="space-y-2.5">
                {[["/services", "All services"], ["/work", "Work"], ["/process", "Process"], ["/about", "About"], ["/insights", "Insights"], ["/contact", "Contact"]].map(([to, l]) => (
                  <li key={to}><Link className="text-[15px] text-z-body link-u hover:text-white" to={to}>{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Direct</p>
              <ul className="space-y-2.5 text-[15px]">
                <li><a className="break-all text-z-body link-u hover:text-white" href={mailLink()} onClick={() => track("email_click", { location: "footer" })} data-testid="footer-email-link">{SITE.email}</a></li>
                <li><a className="text-z-body link-u hover:text-white" href={waLink()} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "footer" })} data-testid="footer-whatsapp-link">WhatsApp {SITE.phoneDisplay}</a></li>
                <li className="text-z-muted">{SITE.reach}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-z-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.legalName}. {SITE.tagline}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="link-u hover:text-white" data-testid="footer-privacy-link">Privacy</Link>
            <Link to="/terms" className="link-u hover:text-white" data-testid="footer-terms-link">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

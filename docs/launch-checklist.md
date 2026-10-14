# Launch checklist — Zavro Solutions

## Owner input still needed (launch blockers marked ★)
- ★ Data-protection contact (PDPA designated person) and retention period → `pages/Legal.jsx` placeholders.
- ★ Legal review of Privacy and Terms wording.
- Confirmed scope, approach and outcomes for UMI Spices, Feni Electrical, SGSA Construction (case studies).
- Real client testimonials + `testimonialApproved: true`; logo permission + `logoApproved: true`.
- Definition of the "growth audit" (what it includes, free or paid) before promoting it as a main CTA.
- Confirm mobile-app delivery capacity (currently "scoped per project").
- Confirm the 24-hour reply aim is sustainable.
- Analytics: GA4 measurement ID + consent approach.
- First reviewed Insights articles (named author, real date).

## Before deploy
- [ ] `REACT_APP_SHOW_DEMO_CONTENT=false`, `APP_ENV=production`, `CORS_ORIGINS` set to the live domain.
- [ ] Add prerendering for static HTML per route (see README limitation).
- [ ] Verify sender domain / deliverability for lead notification emails; send one real test, then delete it.
- [ ] Delete test leads: `db.enquiries.deleteMany({is_test: true})`.

## After deploy
- [ ] www and non-www, HTTP → HTTPS redirect to `https://www.zavrosolutions.site/` (single 301 hop).
- [ ] Every route loads directly and on refresh; `/random` shows the 404.
- [ ] View source: no `noindex` on production; canonical = www host.
- [ ] `/robots.txt` and `/sitemap.xml` reachable; submit sitemap in Google Search Console (verify via DNS TXT).
- [ ] Validate JSON-LD with Google Rich Results Test / schema.org validator.
- [ ] Run Lighthouse (mobile) on `/`, `/services/ai-automation`, `/contact`; record LCP/CLS.
- [ ] Submit a real enquiry; confirm stored + email received.

## Legacy URLs
The previous site (zavrosolutions.site) was a single page with in-page anchors only, so no path-level redirects are required. The root URL is preserved.

## Rollback
Redeploy the previous build from the hosting platform's deployment history. Content changes are code changes in `src/data/*`.

## Ownership (to confirm)
Repository, hosting, domain/DNS, Search Console, analytics property, enquiry inbox, email-delivery subscription.

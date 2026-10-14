# Zavro Solutions — PRD

## Original problem statement
"ZAVRO SOLUTIONS — Enhanced Website Master Prompt for Emergent": build a distinctive multi-page website for Zavro Solutions Pte. Ltd. (UEN 202540684M, Singapore-based, working worldwide; ceo@zavrosolutions.site; WhatsApp +65 8980 5150), with the "Signal Atlas" visual concept, custom loader, cursor, motion, NOVA guide, real routes for 11 services + Work/Process/About/Insights/Contact/Privacy/Terms, honest proof (no invented claims), working enquiry form, SEO/GEO (metadata, JSON-LD, robots, sitemap), accessibility and handover docs. Clients: UMI Spices, Feni Electrical, SGSA Construction. Follow-up: "you can use dummy testimonials too after you use our real one … make me the thing".

## User choices
Primary CTA "Discuss a project" (growth audit offered as a form option only); NOVA = guided questions, no AI; enquiries → MongoDB + email via Emergent-managed Resend; client names + links shown (no logos/quotes/metrics); robots: allow search bots, block training bots; sample testimonials allowed (labelled, preview only).

## Architecture
React CRA + react-router + framer-motion + Lenis + react-helmet-async; FastAPI `/api/enquiries`, `/api/health`; MongoDB `enquiries`. Content in `src/data/*`.

## Implemented (2026-10-14)
- Home: kinetic masked-line hero, 3D-parallax signal map, client rail, interactive connected-disciplines path, editorial marquee, aligned bento, client work list, process path, principles, insights empty state, contact band with form + lockup.
- Services index (problem → service map + family index); 11 service pages with unique SVG diagrams and 3 layout variants, FAQs, limits, related, Service JSON-LD.
- Work (real client screenshots, permissions model, sample testimonials preview-only), Process, About, Insights (+article route), Contact, Privacy, Terms, 404.
- Nav with mega-menu + mobile menu, scroll progress, first-visit loader, custom cursor, NOVA guided finder → prefilled enquiry.
- Backend validation, honeypot, rate limit, test-lead flagging, email notification (verified 202).
- robots.txt, sitemap.xml, llms.txt, noindex on preview hosts, README, launch checklist, .env.example.

## Backlog
- P0: owner PDPA contact + retention; legal review; set SHOW_DEMO_CONTENT=false + APP_ENV=production at launch; prerendering for static HTML.
- P1: approved case-study detail pages; real testimonials; first Insights articles; GA4 + consent.
- P2: /innovation-lab (exploratory capabilities); per-page OG images.

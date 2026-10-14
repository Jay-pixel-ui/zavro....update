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

## Implemented (2026-10-14, iteration 2)
- Case-study pages /work/umi-spices, /work/feni-electrical, /work/sgsa-construction (context, delivered scope, approach, honest outcomes block, next case, CTA). Scope confirmed by owner; UMI Spices industry corrected to restaurant & catering after inspecting the live site. Owner's "growth within 2 weeks" claim NOT published (unmeasured, unapproved).
- Two published Insights articles (author: Zavro Solutions team, 2026-10-14) with short-answer box, checklist, related services, BlogPosting JSON-LD. Sitemap now 25 URLs.

## Implemented (2026-10-14, iteration 3 — polish & mobile repair)
- P1 Mobile nav scroll fixed: `MobileMenu` (Nav.jsx) restructured to a flex column — fixed top bar (brand + always-visible close) + `flex-1 overflow-y-auto overscroll-contain` nav area on `100dvh`. Close stays visible, CTA reachable, background scroll locked + restored. Verified scrollable at 320/390/430px.
- P2 Lightweight animated background: new `components/SignalField.jsx` (Canvas 2D, no new deps) — faint cyan/blue particles + connecting signal lines, rare gold node; `pointer-events:none`, fixed `z-0` behind content (main/footer set `relative z-10`); density/speed reduced on mobile; pauses on tab hidden; static single frame for reduced-motion; debounced resize; dpr capped at 1.5.
- P3 Hero text reduced: tightened supporting paragraph to one line, kept two CTAs; moved "Start from what you need" intent chips out of the first viewport into a slim `IntentRail` band in Home (below hero). No service content deleted.
- P4 Responsive QA: zero horizontal overflow confirmed at 320/390/430/768/1280. P5 loader, cursor, routes, SEO, branding preserved.

## Implemented (2026-10-14, iteration 4 — permanent mobile fix + premium background)
- P1 Mobile nav scroll — PERMANENT root-cause fix: the scrollable `<nav>` is a flex child (`flex-1`) and was missing `min-h-0`. In a flex column, items default to `min-height:auto` so they refuse to shrink below content height and `overflow-y-auto` never engages on real devices (content spills out of the fixed container and is clipped with no scroll). Added `min-h-0`; kept `100dvh` panel, fixed top bar with always-visible close, `overscroll-contain`, `-webkit-overflow-scrolling:touch`, safe-area padding (top/bottom). Scroll lock sets `body.overflow:hidden` on open and restores to "" on close/navigate (verified restore + nav-link closes menu). Verified scrollable with CTA in view at 320/360/375/390/430.
- P2 Background upgraded to a cinematic layered system (`SignalField.jsx` + CSS, no new deps): (1) CSS aurora light-fields — large blurred drifting cyan/blue/purple/gold blobs (atmosphere + depth, `mix-blend-mode:screen`); (2) Canvas (additive `lighter` blending) — flowing luminous sine-ribbons in brand colours, bokeh + fine particles with subtle links, desktop lerp cursor glow, subtle scroll-driven parallax/section variation; (3) vignette overlay for text readability. Perf: dpr capped 1.5, reduced ribbon/particle counts on mobile, no cursor glow on coarse pointers, pauses RAF when tab hidden, debounced resize, `pointer-events:none`, fixed `z-0`. Reduced-motion → single static frame + paused aurora.
- P3 Restrained polish: soft cyan hover/focus glow on service family tiles (box-shadow, does not conflict with framer transforms).
- P4 QA: zero horizontal overflow and menu scroll verified at 320/360/375/390/430/768/1024/1440; no console errors; scroll lock restores after close and after link navigation. P5 loader, cursor, routes, SEO, branding preserved; no dependencies added.

## Implemented (2026-10-14, iteration 5 — service uniqueness, section moods, OG images)
- Service page uniqueness: new `components/ServiceSignature.jsx` gives 3 bespoke central compositions — AI Automation = "transparent workflow canvas" (enlarged pipeline + principle chips), Web Development = "before/after editorial" (crossed-out before vs glowing after), Digital Marketing = "channels → enquiry loop" (converging horizontal flow + measure/learn/adjust). `ServicePage.jsx` branches to a clean bespoke sequence for these 3 slugs (no duplicated diagram); the other 8 services keep the existing split/stage/inset layouts untouched.
- Per-section background moods: `SignalField.jsx` now watches `[data-mood]` sections via IntersectionObserver (re-scans every 1.2s for route changes) and gently lerps ribbon colours toward a per-mood palette (ai / build / growth / strategy / default). Home sections tagged (Hero=ai, ServicesBento=build, Work=growth, Process=strategy); each service page tagged with its family. Same system — no new background.
- Per-page OG share images: generated 6 branded 1264×848 images (default, ai, web, marketing, services, work) in `public/og/`; wired via `Seo image` on home (default), services index, work, and the 3 signature services (`ogImage` in services.js). `Seo.jsx` enhanced with og/twitter image width/height/alt and absolute-URL safety. `SITE.ogImage` → `/og/og-default.jpg`.
- Removed the service-card hover/focus glow added in iteration 4 (reverted ServicesBento FamilyTile to `transition-colors hover:border-white/20`).
- Verified: 3 signature pages render with correct mood + per-page OG; non-signature page (SEO) unchanged; home shows all 4 moods; zero horizontal overflow and zero console errors across checks.

## Backlog
- P0: owner PDPA contact + retention; legal review; set SHOW_DEMO_CONTENT=false + APP_ENV=production at launch; prerendering for static HTML.
- P1: approved case-study detail pages; real testimonials; first Insights articles; GA4 + consent.
- P2: /innovation-lab (exploratory capabilities); per-page OG images.

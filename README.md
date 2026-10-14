# Zavro Solutions — website

React (CRA) + FastAPI + MongoDB. Canonical host: `https://www.zavrosolutions.site` (redirect non-www → www at the DNS/hosting layer).

## Routes
`/` · `/services` · `/services/{ai-automation, web-development, ecommerce-development, software-development, mobile-app-development, digital-marketing, seo, geo, social-media, branding, business-consulting}` · `/work` · `/process` · `/about` · `/insights` · `/insights/:slug` · `/contact` · `/privacy` · `/terms` · `*` (404, noindex)

API: `GET /api/health`, `POST /api/enquiries`.

## Content (no layout edits needed)
- `frontend/src/data/site.js` — company facts, nav, intents (problem → services), process stages, demo switch.
- `frontend/src/data/services.js` — every service page: copy, FAQs, limits, related links, `availability` ("available" | "scoped" | "exploratory"), `visual`, `layout`.
- `frontend/src/data/projects.js` — client records with permission flags. Logos/quotes/metrics render only when `logoApproved` / `testimonialApproved` / `verified` are true. Screenshots: `frontend/public/work/{slug}.webp`.
- `frontend/src/data/insights.js` — add an article with `published: true`, real `author`, `publishedAt`.
- SEO files: `frontend/public/robots.txt`, `sitemap.xml` (update when routes change), `llms.txt` (optional).

## Design tokens
Colours in `tailwind.config.js` under `z.*` (bg #02040A, navy, surface, cyan #00E5FF, blue, gold #FFB800, ink, body #CBD5E1, muted #94A3B8, eyebrow #67E8F9). Gradients/glass in `src/index.css`. Fonts: Unbounded (display), Outfit (body), JetBrains Mono (labels). Motion ease `cubic-bezier(.2,.8,.2,1)`; framer-motion + Lenis; all motion respects `prefers-reduced-motion`. Custom cursor only on fine pointers.

## Environment variables
See `frontend/.env.example` and `backend/.env.example`.
- `REACT_APP_SHOW_DEMO_CONTENT` — `true` shows labelled SAMPLE testimonials in preview. Hard-blocked on the production host regardless of value. Set `false` for production builds.
- `REACT_APP_GA_MEASUREMENT_ID` — empty = analytics off (`track()` is a no-op). Events: primary_cta_click, service_cta_click, form_start, form_submit_success, whatsapp_click, email_click, nova_open, nova_to_enquiry. No personal data is ever sent.
- `APP_ENV` — `production` only on the live deploy; any other value marks leads `is_test: true`. Names starting `TEST_` are always test leads and their notification goes to a sandbox inbox.
- `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME` — managed email delivery. If missing, leads are still stored and `email_notification` is `not_configured`.

## Lead handling
Enquiries → validated server-side → stored in MongoDB `enquiries` (reference, fields, utm, environment, is_test, email_notification) → notification email to `LEAD_NOTIFY_EMAIL` with reply-to set to the visitor. Honeypot + 5 req / 10 min / IP rate limit. Diagnose delivery via backend logs (`Lead notification failed`) and the `email_notification` field. No admin dashboard (by design); export with `mongoexport`.

## Crawler policy (decided 2026-10-12)
Allowed: all search engines, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User. Disallowed (training): GPTBot, Google-Extended, ClaudeBot, CCBot, Applebot-Extended. Preview hosts emit `noindex`.

## Known limitations
- Client-rendered React: page text is injected by JavaScript. Google renders JS, but some AI crawlers don't. Recommended before launch: add prerendering (e.g. react-snap or a prerender service) so each route ships static HTML.
- In-memory rate limiting resets on restart and is per-instance.

See `docs/launch-checklist.md`.

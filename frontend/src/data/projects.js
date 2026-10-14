// Client records. Only fields the owner has approved may be rendered.
// Names, links and scope confirmed by Zavro on 2026-10-14. Outcomes/metrics/quotes not yet approved.
const base = {
  outcomes: null,
  metrics: [],
  testimonialQuote: null,
  testimonialAttribution: null,
  logoApproved: false,
  testimonialApproved: false,
  verified: false,
  clientNameApproved: true,
  permissionToPublish: true,
  lastReviewedAt: "2026-10-14",
};

export const PROJECTS = [
  {
    ...base,
    slug: "umi-spices",
    clientName: "UMI Spices",
    clientDomain: "https://umi-spices.shop/",
    industry: "Food & beverage · Restaurant & catering",
    services: ["web-development", "seo", "social-media", "ai-automation"],
    engagementSummary: "Website design and build, SEO, social media support and ordering automation for a family-run nasi padang business with several Singapore outlets.",
    challenge: "A family food business serving customers across more than one outlet needs people to quickly find the menu, the nearest outlet and its hours, and an easy way to order or ask about catering — mostly from a phone.",
    scopeDelivered: [
      { t: "Website design & build", d: "A mobile-first site with menu, outlet, catering and story sections." },
      { t: "Ordering paths", d: "WhatsApp ordering links with prefilled messages, including per-dish enquiries." },
      { t: "Outlet & catering pages", d: "Dedicated pages for each outlet and for catering, so each intent has a clear destination." },
      { t: "SEO", d: "Page titles, descriptions and structure built around how people search for the food and outlet locations." },
      { t: "Social media", d: "Social media support aligned with the website's menu and outlet information." },
      { t: "Automation", d: "Workflow automation around enquiries and updates, such as the new-outlet waitlist." },
    ],
    approach: ["Organise the site around the questions customers ask first: what's on the menu, where, and when", "Make WhatsApp the primary action, because that's how orders already happen", "Give each outlet and catering its own page", "Keep content consistent between the site and social channels"],
  },
  {
    ...base,
    slug: "feni-electrical",
    clientName: "Feni Electrical",
    clientDomain: "https://fenielectrical.com/",
    industry: "Electrical services",
    services: ["web-development", "seo", "ai-automation"],
    engagementSummary: "Website design and build, local SEO and enquiry automation for a Singapore electrical-services business handling urgent and planned jobs.",
    challenge: "For electrical emergencies, people search under pressure and decide quickly. The site needs to say clearly what's covered, where and how to get help — and the enquiry needs to arrive with enough detail to act on.",
    scopeDelivered: [
      { t: "Website design & build", d: "A fast, mobile-first site with emergency, repair, installation and commercial service groupings." },
      { t: "Service pages", d: "Individual pages for each service, so each type of problem has its own relevant page." },
      { t: "Local SEO", d: "Service-area content, FAQs and on-page structure aimed at Singapore local search." },
      { t: "Enquiry automation", d: "Prefilled WhatsApp messages that ask for location and issue, plus an emergency request form with preferred contact method." },
    ],
    approach: ["Lead with the urgent path: call or WhatsApp in one tap", "Group services by situation — emergency, repair, installation, commercial", "Build one page per service and a clear service-area structure for local search", "Capture location and issue details up front so the team can respond faster"],
  },
  {
    ...base,
    slug: "sgsa-construction",
    clientName: "SGSA Construction",
    clientDomain: "https://sgsa-construction.com/",
    industry: "Construction & renovation",
    services: ["web-development", "seo", "ai-automation"],
    engagementSummary: "Website design and build, local SEO and enquiry automation for a Singapore contractor covering emergency repairs, handyman work and renovation.",
    challenge: "A contractor offering everything from urgent repairs to full renovations has to serve two very different visitors: someone with a burst pipe right now, and someone planning a project over weeks. Both need a clear route to the right enquiry.",
    scopeDelivered: [
      { t: "Website design & build", d: "A site that separates urgent repairs from renovation planning, with clear paths for each." },
      { t: "Service architecture", d: "Dedicated pages for each service, from plumbing and ceiling repairs to office renovation and reinstatement." },
      { t: "Local SEO & content", d: "On-page structure, FAQs and a journal of practical guides for Singapore homeowners and businesses." },
      { t: "Enquiry automation", d: "Issue-specific WhatsApp links for emergencies and a quote form that knows whether it's a quick job or a renovation." },
    ],
    approach: ["Split the journey early: emergency, small job or renovation", "Give every service its own page with a clear next step", "Use honest, clearly labelled illustrative imagery until real project photos are available", "Route each enquiry type to the right form or message"],
  },
];

export const publicProjects = () =>
  PROJECTS.filter((p) => p.permissionToPublish && p.clientNameApproved);

export const projectBySlug = (slug) => publicProjects().find((p) => p.slug === slug);

export const hostOf = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

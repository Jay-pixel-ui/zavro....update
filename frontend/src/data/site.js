export const SITE = {
  name: "Zavro Solutions",
  legalName: "Zavro Solutions Pte. Ltd.",
  uen: "202540684M",
  url: "https://www.zavrosolutions.site",
  email: "ceo@zavrosolutions.site",
  phoneDisplay: "+65 8980 5150",
  phoneE164: "+6589805150",
  wa: "6589805150",
  tagline: "Engineered Growth. Quietly Inevitable.",
  reach: "Working worldwide · Headquartered in Singapore",
  description:
    "Zavro Solutions is a digital growth and IT team working with SMEs and founders worldwide — websites, search, marketing, software and AI automation, delivered remotely from our Singapore headquarters.",
  logo: "/brand/zavro-logo-full.png",
  mark: "/brand/zs-mark.webp",
  lockup: "/brand/zavro-lockup.webp",
  ogImage: "/og/og-default.jpg",
};

export const PRODUCTION_HOSTS = ["www.zavrosolutions.site", "zavrosolutions.site"];
export const IS_PRODUCTION =
  (typeof window !== "undefined"
    ? PRODUCTION_HOSTS.includes(window.location.hostname)
    : globalThis.__ZAVRO_PRERENDER__ === true); // static HTML is built for the production host; preview hosts are noindexed via response headers

// Hard switch: sample content can never render on the production host.
export const SHOW_DEMO_CONTENT =
  process.env.REACT_APP_SHOW_DEMO_CONTENT === "true" && !IS_PRODUCTION;

export const waLink = (text) =>
  `https://wa.me/${SITE.wa}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const mailLink = (subject = "Project enquiry — Zavro Solutions") =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const FAMILIES = [
  { id: "ai", label: "AI & Automation", code: "01", blurb: "Workflows, assistants and integrations that remove repetitive work." },
  { id: "build", label: "Web & Software", code: "02", blurb: "Websites, stores, internal tools and apps built to be maintained." },
  { id: "growth", label: "Growth & Marketing", code: "03", blurb: "Search, AI-search visibility, content and social that work together." },
  { id: "strategy", label: "Brand & Strategy", code: "04", blurb: "Positioning, identity and decisions about where to invest next." },
];

export const INTENTS = [
  { id: "discovered", label: "Get discovered", text: "People can't find you in search, maps or AI answers.", services: ["seo", "geo", "social-media", "digital-marketing"] },
  { id: "convert", label: "Convert more visitors", text: "Traffic arrives but the site or store doesn't turn it into enquiries.", services: ["web-development", "ecommerce-development", "digital-marketing"] },
  { id: "automate", label: "Remove repetitive work", text: "Enquiries, admin and data entry eat the team's week.", services: ["ai-automation", "software-development"] },
  { id: "build", label: "Build a digital product", text: "You need an MVP, portal, internal tool or mobile app.", services: ["software-development", "mobile-app-development", "ai-automation"] },
  { id: "clarify", label: "Clarify the business", text: "Positioning, priorities or the digital roadmap are unclear.", services: ["business-consulting", "branding", "digital-marketing"] },
];

export const NAV = [
  { to: "/work", label: "Work" },
  { to: "/process", label: "Process" },
  { to: "/about", label: "About" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
];

export const PROCESS = [
  { id: "discover", n: "01", title: "Discover", text: "Understand the business, audience, constraints and current systems." },
  { id: "define", n: "02", title: "Define", text: "Align scope, priorities, measurement and what success means." },
  { id: "design", n: "03", title: "Design", text: "Shape the experience, workflow, brand or technical architecture." },
  { id: "build", n: "04", title: "Build", text: "Implement, integrate, test and review with you." },
  { id: "improve", n: "05", title: "Improve", text: "Launch, measure and iterate where the engagement includes ongoing support." },
];

export const PRIMARY_CTA = { label: "Discuss a project", to: "/contact" };

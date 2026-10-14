// Client records. Only fields the owner has approved may be rendered.
// clientNameApproved + permissionToPublish confirmed by Zavro (names and links only) on 2026-10-12.
const base = {
  engagementSummary: null,
  challenge: null,
  scopeDelivered: null,
  approach: null,
  outcomes: null,
  metrics: [],
  testimonialQuote: null,
  testimonialAttribution: null,
  logoApproved: false,
  testimonialApproved: false,
  verified: false,
  lastReviewedAt: "2026-10-12",
};

export const PROJECTS = [
  { ...base, slug: "umi-spices", clientName: "UMI Spices", clientDomain: "https://umi-spices.shop/", industry: "E-commerce · Spices retail", clientNameApproved: true, permissionToPublish: true },
  { ...base, slug: "feni-electrical", clientName: "Feni Electrical", clientDomain: "https://fenielectrical.com/", industry: "Electrical services", clientNameApproved: true, permissionToPublish: true },
  { ...base, slug: "sgsa-construction", clientName: "SGSA Construction", clientDomain: "https://sgsa-construction.com/", industry: "Construction & renovation", clientNameApproved: true, permissionToPublish: true },
];

export const publicProjects = () =>
  PROJECTS.filter((p) => p.permissionToPublish && p.clientNameApproved);

export const hostOf = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

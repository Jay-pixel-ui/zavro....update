import { IS_PRODUCTION } from "@/data/site";

const ALLOWED = ["service", "location", "source", "intent", "step"];

// Privacy-aware event helper: only whitelisted, non-personal params; no-op until an analytics ID is configured.
export function track(event, params = {}) {
  const safe = Object.fromEntries(Object.entries(params).filter(([k]) => ALLOWED.includes(k)));
  safe.env = IS_PRODUCTION ? "production" : "preview";
  if (!process.env.REACT_APP_GA_MEASUREMENT_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...safe });
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function captureUtm() {
  try {
    const q = new URLSearchParams(window.location.search);
    const found = Object.fromEntries(UTM_KEYS.filter((k) => q.get(k)).map((k) => [k, q.get(k).slice(0, 100)]));
    if (Object.keys(found).length) sessionStorage.setItem("zv-utm", JSON.stringify(found));
    if (!sessionStorage.getItem("zv-ref") && document.referrer) sessionStorage.setItem("zv-ref", document.referrer.slice(0, 200));
  } catch (e) { /* storage unavailable */ }
}

export function readUtm() {
  try {
    return { ...(JSON.parse(sessionStorage.getItem("zv-utm") || "{}")), referrer: sessionStorage.getItem("zv-ref") || "" };
  } catch (e) {
    return {};
  }
}

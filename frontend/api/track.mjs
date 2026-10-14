import crypto from "node:crypto";
import { handle } from "./_lib/http.mjs";
import { admin } from "./_lib/supabase.mjs";

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch|go-http|java\//i;
const SELF = /(^|\.)zavrosolutions\.site$/i;
const clip = (v, n) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);

function parseUA(ua) {
  const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|iphone|android/i.test(ua) ? "mobile" : "desktop";
  const browser = /edg\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /firefox|fxios/i.test(ua) ? "Firefox" : /chrome|crios/i.test(ua) ? "Chrome" : /safari/i.test(ua) ? "Safari" : "Other";
  const os = /windows/i.test(ua) ? "Windows" : /iphone|ipad|ios/i.test(ua) ? "iOS" : /android/i.test(ua) ? "Android" : /mac os/i.test(ua) ? "macOS" : /linux/i.test(ua) ? "Linux" : "Other";
  return { device, browser, os };
}

// Records one page view. Never stores the IP: it is only mixed into a daily-rotating hash.
export default handle(["POST"], async (req, res) => {
  const done = () => res.status(204).end();
  try {
    const ua = String(req.headers["user-agent"] || "");
    if (!ua || BOT.test(ua)) return done();
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
    const path = clip(body?.path, 200);
    if (!path || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return done();

    let referrer_host = null;
    try { const h = new URL(body?.referrer || "").hostname.replace(/^www\./, ""); if (h && !SELF.test(h)) referrer_host = h.slice(0, 100); } catch { /* none */ }

    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "0";
    const salt = process.env.ANALYTICS_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "zavro";
    const visitor_hash = crypto.createHash("sha256").update(`${ip}|${ua}|${new Date().toISOString().slice(0, 10)}|${salt}`).digest("hex").slice(0, 32);

    let city = null;
    try { city = clip(decodeURIComponent(String(req.headers["x-vercel-ip-city"] || "")), 80); } catch { /* ignore */ }
    const utm = body?.utm && typeof body.utm === "object" ? body.utm : {};
    await admin().from("page_views").insert({
      path, referrer_host,
      country: clip(String(req.headers["x-vercel-ip-country"] || ""), 2),
      region: clip(String(req.headers["x-vercel-ip-country-region"] || ""), 20),
      city, ...parseUA(ua), visitor_hash,
      utm_source: clip(utm.utm_source, 80), utm_medium: clip(utm.utm_medium, 80), utm_campaign: clip(utm.utm_campaign, 80),
    });
  } catch (e) { console.error("track failed", e?.message || e); }
  done();
});

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { readUtm } from "@/lib/analytics";

// Sends one anonymous page view per route change to our own backend (no cookies, no third parties).
export default function Tracker() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    try {
      if (!/(^|\.)zavrosolutions\.site$/.test(window.location.hostname)) return;
      if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;
      const { referrer, ...utm } = readUtm();
      const body = JSON.stringify({ path: pathname, referrer: first.current ? document.referrer : "", utm });
      first.current = false;
      if (!(navigator.sendBeacon && navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" })))) {
        fetch("/api/track", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
      }
    } catch { /* analytics must never break the site */ }
  }, [pathname]);
  return null;
}

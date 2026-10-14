export const httpError = (status, message, details) => Object.assign(new Error(message), { status, details });
export const send = (res, status, body) => res.status(status).json(body);

// Same-origin site: no CORS needed. Only allow the production origins if a browser sends one.
const ORIGINS = new Set(["https://www.zavrosolutions.site", "https://zavrosolutions.site"]);
export function guardOrigin(req, res) {
  const origin = req.headers.origin;
  if (origin && !ORIGINS.has(origin) && !/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) && !/^http:\/\/localhost(:\d+)?$/.test(origin)) {
    send(res, 403, { error: "forbidden_origin" });
    return false;
  }
  res.setHeader("Cache-Control", "no-store");
  return true;
}

export function handle(methods, fn) {
  return async (req, res) => {
    if (!guardOrigin(req, res)) return;
    if (!methods.includes(req.method)) {
      res.setHeader("Allow", methods.join(", "));
      return send(res, 405, { error: "method_not_allowed" });
    }
    try {
      await fn(req, res);
    } catch (e) {
      if (e?.status) return send(res, e.status, { error: e.message, detail: e.details });
      console.error("api error", e?.message || e);
      send(res, 500, { error: "internal_error" });
    }
  };
}

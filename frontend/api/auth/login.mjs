import { handle, send, httpError } from "../_lib/http.mjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Password sign-in for /admin. Passes credentials to Supabase Auth and returns the session.
// Nothing is stored here; Supabase rate-limits repeated attempts.
export default handle(["POST"], async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!EMAIL_RE.test(email) || !password || password.length > 200) throw httpError(400, "invalid_input");
  const missing = ["SUPABASE_URL", "SUPABASE_ANON_KEY"].filter((k) => !process.env[k]);
  if (missing.length) throw httpError(503, "not_configured", { missing });
  let r;
  try {
    r = await fetch(`${process.env.SUPABASE_URL.trim()}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: process.env.SUPABASE_ANON_KEY.trim(), "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    throw httpError(502, "auth_unreachable");
  }
  if (!r.ok) throw httpError(401, "invalid_credentials");
  const s = await r.json();
  send(res, 200, { access_token: s.access_token, expires_in: s.expires_in });
});

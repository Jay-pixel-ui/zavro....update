import { createClient } from "@supabase/supabase-js";
const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const need = (k) => {
  const v = process.env[k];
  if (!v) throw Object.assign(new Error("not_configured"), { status: 503, details: { missing: k } });
  return v.trim();
};

// Service role bypasses RLS. Only for trusted server work (public lead capture, AI logs).
export const admin = () => createClient(need("SUPABASE_URL"), need("SUPABASE_SERVICE_ROLE_KEY"), opts);

// Acts as the signed-in user, so Row Level Security applies.
export const asUser = (token) =>
  createClient(need("SUPABASE_URL"), need("SUPABASE_ANON_KEY"), { ...opts, global: { headers: { Authorization: `Bearer ${token}` } } });

import { handle, send } from "../_lib/http.mjs";
import { requireUser } from "../_lib/auth.mjs";
import { admin } from "../_lib/supabase.mjs";

// Admin only: visitor statistics for the last N days (default 30).
export default handle(["GET"], async (req, res) => {
  await requireUser(req, ["admin"]);
  const days = Math.max(1, Math.min(365, parseInt(req.query.days, 10) || 30));
  const { data, error } = await admin().rpc("analytics_summary", { p_days: days });
  if (error) throw error;
  send(res, 200, data);
});

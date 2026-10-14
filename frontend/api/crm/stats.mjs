import { handle, send } from "../_lib/http.mjs";
import { requireUser, TEAM } from "../_lib/auth.mjs";

// Pipeline counts and revenue, limited to leads the caller can see under RLS.
export default handle(["GET"], async (req, res) => {
  const { db } = await requireUser(req, TEAM);
  const { data, error } = await db.from("leads").select("status, deal_value_cents, created_at");
  if (error) throw error;
  const pipeline = {};
  let wonCents = 0, openCents = 0, last7 = 0;
  const week = Date.now() - 7 * 86400000;
  for (const l of data) {
    pipeline[l.status] = (pipeline[l.status] || 0) + 1;
    if (l.status === "won") wonCents += Number(l.deal_value_cents);
    else if (l.status !== "lost") openCents += Number(l.deal_value_cents);
    if (new Date(l.created_at).getTime() >= week) last7 += 1;
  }
  const closed = (pipeline.won || 0) + (pipeline.lost || 0);
  send(res, 200, { pipeline, won_cents: wonCents, open_cents: openCents, total: data.length, last7, win_rate: closed ? Math.round(((pipeline.won || 0) / closed) * 100) : null });
});

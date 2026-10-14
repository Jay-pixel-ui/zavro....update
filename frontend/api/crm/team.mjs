import { handle, send } from "../_lib/http.mjs";
import { requireUser } from "../_lib/auth.mjs";

// Admin only: list team members so leads can be assigned. RLS also restricts this to admins.
export default handle(["GET"], async (req, res) => {
  const { db } = await requireUser(req, ["admin"]);
  const { data, error } = await db.from("profiles").select("id, full_name, role").in("role", ["admin", "closer", "setter"]);
  if (error) throw error;
  send(res, 200, { team: data });
});

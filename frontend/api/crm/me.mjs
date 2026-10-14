import { handle, send } from "../_lib/http.mjs";
import { requireUser, TEAM } from "../_lib/auth.mjs";

export default handle(["GET"], async (req, res) => {
  const { user, role, name } = await requireUser(req, TEAM);
  send(res, 200, { id: user.id, email: user.email, role, name });
});

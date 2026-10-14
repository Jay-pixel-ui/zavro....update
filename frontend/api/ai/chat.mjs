import { z } from "zod";
import { handle, send, httpError } from "../_lib/http.mjs";
import { requireUser, TEAM } from "../_lib/auth.mjs";
import { claude } from "../_lib/ai.mjs";
import { admin } from "../_lib/supabase.mjs";

const schema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).min(1).max(20),
});

// Team-only assistant inside /admin, so the Anthropic key cannot be used anonymously.
export default handle(["POST"], async (req, res) => {
  const { user } = await requireUser(req, TEAM);
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) throw httpError(400, "invalid_input");
  const reply = await claude({
    system: "You are the Zavro Solutions team assistant. Help the sales team with lead follow-ups, replies, qualification questions and proposals. Be concise and practical.",
    messages: parsed.data.messages,
    maxTokens: 700,
  });
  if (reply === null) throw httpError(503, "ai_not_configured");
  await admin().from("ai_logs").insert({ endpoint: "chat", user_id: user.id, input: { n: parsed.data.messages.length }, output: { chars: reply.length } });
  send(res, 200, { reply });
});

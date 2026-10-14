import { useCallback, useEffect, useRef, useState } from "react";
import Seo from "@/components/Seo";

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"];
const TOKEN_KEY = "zavro_admin_token";
const money = (c) => `$${(Number(c || 0) / 100).toLocaleString("en-SG", { maximumFractionDigits: 0 })}`;
const when = (d) => new Date(d).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" });

function readToken() { try { return sessionStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } }
function writeToken(t) { try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } }

async function api(path, { token, method = "GET", body } = {}) {
  const r = await fetch(path, {
    method,
    headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(data.error || `http_${r.status}`); e.status = r.status; e.data = data; throw e; }
  return data;
}

const field = "w-full rounded-ctl border border-black/10 bg-white/70 px-3 py-2 text-sm text-z-navy outline-none focus:border-z-cyan";

function Login({ onToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const { access_token } = await api("/api/auth/login", { method: "POST", body: { email, password } });
      writeToken(access_token); onToken(access_token);
    } catch (x) {
      setErr(x.status === 401 ? "Wrong email or password." : x.status === 503 ? "Backend is not configured yet." : "Could not sign in. Try again.");
    } finally { setBusy(false); }
  }
  return (
    <main className="min-h-screen grid place-items-center px-4 bg-z-bg">
      <form onSubmit={submit} className="glass-strong rounded-card p-8 w-full max-w-sm space-y-4">
        <h1 className="font-display text-2xl text-z-navy">Team sign in</h1>
        <p className="text-sm text-z-muted">Zavro Solutions admin</p>
        <label className="block text-sm text-z-body">Email
          <input className={field} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm text-z-body">Password
          <input className={field} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

function Chat({ token, onAuthFail }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs]);
  async function send(e) {
    e.preventDefault();
    const t = text.trim(); if (!t || busy) return;
    const next = [...msgs, { role: "user", content: t }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const { reply } = await api("/api/ai/chat", { token, method: "POST", body: { messages: next.slice(-20) } });
      setMsgs([...next, { role: "assistant", content: reply }]);
    } catch (x) {
      if (x.status === 401) return onAuthFail();
      setMsgs([...next, { role: "assistant", content: x.message === "ai_not_configured" ? "AI is not configured yet (ANTHROPIC_API_KEY)." : "Sorry, that failed." }]);
    } finally { setBusy(false); }
  }
  return (
    <section className="glass rounded-card p-4 flex flex-col h-[28rem]">
      <h2 className="font-display text-lg text-z-navy mb-2">Sales assistant</h2>
      <div className="flex-1 overflow-y-auto space-y-2 text-sm">
        {!msgs.length && <p className="text-z-muted">Ask for a follow-up email, objection reply, or proposal outline.</p>}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <span className={`inline-block max-w-[90%] whitespace-pre-wrap rounded-ctl px-3 py-2 text-left ${m.role === "user" ? "bg-z-navy text-white" : "bg-white/70 text-z-body"}`}>{m.content}</span>
          </div>
        ))}
        {busy && <p className="text-z-muted">Thinking…</p>}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="mt-2 flex gap-2">
        <input className={field} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask the assistant…" maxLength={4000} />
        <button className="btn-primary" disabled={busy}>Send</button>
      </form>
    </section>
  );
}

function LeadDetail({ lead, token, me, team, onChange, onAuthFail }) {
  const [acts, setActs] = useState([]);
  const [note, setNote] = useState("");
  const [kind, setKind] = useState("note");
  const [msg, setMsg] = useState("");
  const [deal, setDeal] = useState(String(Math.round(Number(lead.deal_value_cents || 0) / 100)));
  const isAdmin = me.role === "admin";

  const guard = useCallback((x) => { if (x.status === 401) onAuthFail(); else setMsg("Action failed."); }, [onAuthFail]);
  useEffect(() => {
    setDeal(String(Math.round(Number(lead.deal_value_cents || 0) / 100)));
    api(`/api/crm/activities?lead_id=${lead.id}`, { token }).then((d) => setActs(d.activities)).catch(guard);
  }, [lead.id, lead.deal_value_cents, token, guard]);

  const patch = async (changes) => {
    try { const { lead: l } = await api("/api/crm/leads", { token, method: "PATCH", body: { id: lead.id, ...changes } }); onChange(l); setMsg("Saved."); } catch (x) { guard(x); }
  };
  async function addNote(e) {
    e.preventDefault();
    try { const { activity } = await api("/api/crm/activities", { token, method: "POST", body: { lead_id: lead.id, kind, note } }); setActs([activity, ...acts]); setNote(""); } catch (x) { guard(x); }
  }
  async function rescore() {
    setMsg("Scoring…");
    try { const r = await api("/api/ai/qualify", { token, method: "POST", body: { lead_id: lead.id } }); onChange({ ...lead, ai_score: r.score ?? r.ai_score ?? lead.ai_score, ai_summary: r.summary ?? r.ai_summary ?? lead.ai_summary }); setMsg("Scored."); }
    catch (x) { x.message === "ai_not_configured" ? setMsg("AI is not configured yet.") : guard(x); }
  }
  const people = team.filter((t) => t.role !== "admin" || true);

  return (
    <section className="glass-strong rounded-card p-5 space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display text-xl text-z-navy break-words">{lead.name}</h2>
          <p className="text-sm text-z-body break-all"><a href={`mailto:${lead.email}`} className="underline">{lead.email}</a>{lead.phone ? ` · ${lead.phone}` : ""}</p>
          <p className="text-xs text-z-muted">{[lead.company, lead.service, lead.timing, lead.reference, when(lead.created_at)].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="text-right text-sm">
          <div className="text-z-navy font-semibold">AI score: {lead.ai_score ?? "—"}</div>
          <button type="button" onClick={rescore} className="underline text-z-cyan">Re-score with AI</button>
        </div>
      </header>
      {lead.message && <p className="whitespace-pre-wrap text-sm text-z-body bg-white/60 rounded-ctl p-3">{lead.message}</p>}
      {lead.ai_summary && <p className="text-sm text-z-muted"><strong>AI summary:</strong> {lead.ai_summary}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-z-body">Status
          <select className={field} value={lead.status} onChange={(e) => patch({ status: e.target.value })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        {isAdmin && (
          <label className="text-sm text-z-body">Deal value (SGD)
            <input className={field} inputMode="numeric" value={deal} onChange={(e) => setDeal(e.target.value.replace(/\D/g, ""))} onBlur={() => patch({ deal_value_cents: Number(deal || 0) * 100 })} />
          </label>
        )}
        {isAdmin && ["assigned_setter", "assigned_closer"].map((k) => (
          <label key={k} className="text-sm text-z-body">{k === "assigned_setter" ? "Setter" : "Closer"}
            <select className={field} value={lead[k] || ""} onChange={(e) => patch({ [k]: e.target.value || null })}>
              <option value="">Unassigned</option>
              {people.map((t) => <option key={t.id} value={t.id}>{t.full_name || t.id.slice(0, 8)} ({t.role})</option>)}
            </select>
          </label>
        ))}
      </div>
      <form onSubmit={addNote} className="space-y-2">
        <div className="flex gap-2">
          <select className={`${field} max-w-[8rem]`} value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Activity type">
            {["note", "call", "email", "meeting"].map((k) => <option key={k}>{k}</option>)}
          </select>
          <input className={field} required maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" />
          <button className="btn-primary">Add</button>
        </div>
      </form>
      <ul className="space-y-2 text-sm">
        {acts.map((a) => <li key={a.id} className="bg-white/60 rounded-ctl p-2"><span className="text-z-muted">{a.kind} · {when(a.created_at)}</span><br />{a.note}</li>)}
        {!acts.length && <li className="text-z-muted">No activity yet.</li>}
      </ul>
      {msg && <p role="status" className="text-xs text-z-muted">{msg}</p>}
    </section>
  );
}

function Dashboard({ token, onSignOut }) {
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [team, setTeam] = useState([]);
  const [filter, setFilter] = useState("");
  const [sel, setSel] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [m, s, l] = await Promise.all([
        api("/api/crm/me", { token }),
        api("/api/crm/stats", { token }),
        api(`/api/crm/leads${filter ? `?status=${filter}` : ""}`, { token }),
      ]);
      setMe(m); setStats(s); setLeads(l.leads); setError("");
      if (m.role === "admin") api("/api/crm/team", { token }).then((t) => setTeam(t.team)).catch(() => {});
    } catch (x) {
      if (x.status === 401 || x.status === 403) onSignOut(); else setError("Could not load data. Check the backend configuration.");
    }
  }, [token, filter, onSignOut]);
  useEffect(() => { load(); }, [load]);

  const update = (l) => { setLeads((p) => p.map((x) => (x.id === l.id ? { ...x, ...l } : x))); setSel((p) => (p && p.id === l.id ? { ...p, ...l } : p)); };
  const current = sel && leads.find((x) => x.id === sel);

  return (
    <main className="min-h-screen bg-z-bg px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl text-z-navy">Zavro admin</h1>
          <div className="flex items-center gap-3 text-sm text-z-body">
            {me && <span className="hidden sm:inline">{me.name || me.email} · {me.role}</span>}
            <button type="button" onClick={load} className="underline">Refresh</button>
            <button type="button" onClick={onSignOut} className="underline">Sign out</button>
          </div>
        </header>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {stats && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {[["Leads", stats.total], ["Last 7 days", stats.last7], ["Open pipeline", money(stats.open_cents / 1)], ["Won", money(stats.won_cents)], ["Win rate", stats.win_rate == null ? "—" : `${stats.win_rate}%`]].map(([k, v]) => (
              <div key={k} className="glass rounded-card p-4"><div className="text-xs text-z-muted">{k}</div><div className="font-display text-xl text-z-navy">{v}</div></div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lead status">
          {["", ...STATUSES].map((s) => (
            <button key={s || "all"} type="button" onClick={() => setFilter(s)} className={`rounded-ctl px-3 py-1 text-sm ${filter === s ? "bg-z-navy text-white" : "glass text-z-body"}`}>
              {s || "all"}{stats && s ? ` (${stats.pipeline[s] || 0})` : ""}
            </button>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-5 min-w-0">
            <section className="glass rounded-card overflow-hidden">
              <ul className="divide-y divide-black/5 max-h-[34rem] overflow-y-auto">
                {leads.map((l) => (
                  <li key={l.id}>
                    <button type="button" onClick={() => setSel(l.id)} className={`w-full text-left px-4 py-3 hover:bg-white/60 ${sel === l.id ? "bg-white/70" : ""}`}>
                      <div className="flex justify-between gap-2"><span className="font-medium text-z-navy truncate">{l.name}</span><span className="text-xs rounded-full bg-z-navy/10 px-2 py-0.5">{l.status}</span></div>
                      <div className="text-xs text-z-muted truncate">{[l.company, l.service, l.email].filter(Boolean).join(" · ")}</div>
                      <div className="text-xs text-z-muted">{when(l.created_at)}{l.ai_score != null ? ` · AI ${l.ai_score}` : ""}</div>
                    </button>
                  </li>
                ))}
                {!leads.length && <li className="px-4 py-6 text-sm text-z-muted">No leads here yet.</li>}
              </ul>
            </section>
            <Chat token={token} onAuthFail={onSignOut} />
          </div>
          <div className="min-w-0">
            {current ? <LeadDetail key={current.id} lead={current} token={token} me={me || {}} team={team} onChange={update} onAuthFail={onSignOut} /> : <p className="glass rounded-card p-5 text-sm text-z-muted">Select a lead to see details.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Admin() {
  // Server render and first client render are identical (login shell); the session is read after mount.
  const [token, setToken] = useState("");
  useEffect(() => { setToken(readToken()); }, []);
  const signOut = useCallback(() => { writeToken(""); setToken(""); }, []);
  return (
    <>
      <Seo title="Team sign in | Zavro Solutions" description="Zavro Solutions team area." path="/admin" noindex />
      {token ? <Dashboard token={token} onSignOut={signOut} /> : <Login onToken={setToken} />}
    </>
  );
}

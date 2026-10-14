// Build-time prerender: turns every public route into static HTML so crawlers
// (including AI crawlers that don't run JavaScript) get real content, titles,
// canonicals and JSON-LD. Run automatically after `craco build`.
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.join(root, "build");
const tmpFile = path.join(root, "node_modules", ".cache", "prerender", "entry.mjs");

// Mark this bundle as building for the production host (see IS_PRODUCTION in src/data/site.js).
globalThis.__ZAVRO_PRERENDER__ = true;
// Minimal browser shims so libraries that probe `window` at import time don't throw.
globalThis.matchMedia = undefined;

const envDefs = {};
for (const [k, v] of Object.entries(process.env)) {
  if (k.startsWith("REACT_APP_")) envDefs[`process.env.${k}`] = JSON.stringify(v);
}

await build({
  entryPoints: [path.join(root, "scripts", "prerender-entry.jsx")],
  outfile: tmpFile,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  jsx: "automatic",
  loader: { ".js": "jsx", ".css": "empty", ".svg": "dataurl", ".png": "dataurl", ".jpg": "dataurl", ".webp": "dataurl", ".woff2": "dataurl" },
  alias: { "@": path.join(root, "src") },
  define: { "process.env.NODE_ENV": '"production"', ...envDefs },
  banner: { js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);" },
  logLevel: "warning",
});

const mod = await import(pathToFileURL(tmpFile).href);
const template = fs.readFileSync(path.join(buildDir, "index.html"), "utf8");
if (template.includes('data-prerendered="true"')) {
  console.error("build/index.html is already prerendered. Run a fresh `craco build` first.");
  process.exit(1);
}

// Routes come from the same data files the app renders, so they can't drift.
const routes = [
  "/", "/services", "/work", "/process", "/about", "/insights", "/contact", "/privacy", "/terms",
  ...mod.SERVICES.map((s) => `/services/${s.slug}`),
  ...mod.publicProjects().map((p) => `/work/${p.slug}`),
  ...mod.publishedInsights().map((a) => `/insights/${a.slug}`),
];

// Remove the static placeholders from the CRA template: each page supplies its own
// title/description/canonical (via react-helmet-async) and its own visible content.
const strip = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/i, "")
    .replace(/<noscript>\s*<main[\s\S]*?<\/noscript>\s*/i, "");

// React renders <title>/<meta>/<link> as the first nodes of a fragment root. Lift that
// leading run into <head> (this is also where React 19 expects them when hydrating).
const HOISTABLE_RUN = /^(?:<title>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*>)+/;
function splitHoisted(html) {
  const m = html.match(HOISTABLE_RUN);
  return m ? { hoisted: m[0], body: html.slice(m[0].length) } : { hoisted: "", body: html };
}

function compose(page, { notFound = false } = {}) {
  const { hoisted, body } = splitHoisted(page.html);
  let out = strip(template);
  out = out.replace("</head>", `    ${hoisted}\n  </head>`);
  out = out.replace('<div id="root"></div>', `<div id="root" data-prerendered="${notFound ? "false" : "true"}">${body}</div>`);
  return out;
}

let failed = 0;
for (const route of routes) {
  try {
    const page = await mod.render(route);
    if (!page.html || page.html.length < 500) throw new Error("empty render");
    const dir = route === "/" ? buildDir : path.join(buildDir, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), compose(page));
    console.log(`prerendered ${route}  (${(page.html.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    failed += 1;
    console.error(`FAILED ${route}: ${e && e.stack ? e.stack.split("\n").slice(0, 4).join("\n") : e}`);
  }
}

// ---------------------------------------------------------------------------
// Generated discovery files, built from the same data as the pages so they never drift.
// ---------------------------------------------------------------------------
const SITE = mod.SITE;
const abs = (r) => `${SITE.url}${r === "/" ? "/" : r}`;
const siteDate = (() => {
  try { return execSync("git log -1 --format=%cs", { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { return ""; }
})() || new Date().toISOString().slice(0, 10);
const articles = mod.publishedInsights();
const articleDate = (r) => {
  const a = articles.find((x) => `/insights/${x.slug}` === r);
  return a ? a.updatedAt || a.publishedAt : siteDate;
};
const priority = (r) => (r === "/" ? "1.0" : r === "/services" || r === "/contact" || r.startsWith("/services/") ? "0.8" : r === "/privacy" || r === "/terms" ? "0.2" : "0.6");

fs.writeFileSync(
  path.join(buildDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map((r) => `  <url><loc>${abs(r)}</loc><lastmod>${articleDate(r)}</lastmod><priority>${priority(r)}</priority></url>`).join("\n") +
    `\n</urlset>\n`,
);

const projects = mod.publicProjects();
const llms = [
  `# ${SITE.legalName}`,
  "",
  `> ${SITE.description} (UEN ${SITE.uen}).`,
  "",
  `Contact: ${SITE.email} · WhatsApp ${SITE.phoneDisplay}`,
  `Full machine-readable summary: ${SITE.url}/llms-full.txt`,
  "",
  "## Services",
  ...mod.SERVICES.map((s) => `- [${s.short}](${abs(`/services/${s.slug}`)}): ${s.description}`),
  "",
  "## Work",
  ...projects.map((p) => `- [${p.clientName}](${abs(`/work/${p.slug}`)}): ${p.engagementSummary}`),
  "",
  "## Insights",
  ...articles.map((a) => `- [${a.title}](${abs(`/insights/${a.slug}`)}): ${a.description}`),
  "",
  "## Company",
  `- [About](${abs("/about")}) · [Process](${abs("/process")}) · [Contact](${abs("/contact")}) · [Privacy](${abs("/privacy")}) · [Terms](${abs("/terms")})`,
  "",
].join("\n");
fs.writeFileSync(path.join(buildDir, "llms.txt"), llms);

const full = [
  `# ${SITE.legalName} — full site summary`,
  `Updated: ${siteDate}`,
  "",
  `${SITE.description}`,
  `Registered in Singapore, UEN ${SITE.uen}. Contact: ${SITE.email}, WhatsApp ${SITE.phoneDisplay}. ${SITE.reach}.`,
  "",
  ...mod.SERVICES.flatMap((s) => [
    `## ${s.short}`,
    `URL: ${abs(`/services/${s.slug}`)}`,
    "",
    s.answer,
    "",
    "What is included:",
    ...(s.includes || []).map((i) => `- ${i.t}: ${i.d}`),
    "",
    "Limits and honest caveats:",
    ...(s.limits || []).map((l) => `- ${l}`),
    "",
    "Frequently asked questions:",
    ...(s.faqs || []).flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, ""]),
  ]),
  ...articles.flatMap((a) => [`## Article: ${a.title}`, `URL: ${abs(`/insights/${a.slug}`)} · Published ${a.publishedAt}`, "", a.answer, ""]),
  ...projects.flatMap((p) => [`## Case study: ${p.clientName}`, `URL: ${abs(`/work/${p.slug}`)}`, "", p.engagementSummary, ""]),
].join("\n");
fs.writeFileSync(path.join(buildDir, "llms-full.txt"), full);
console.log(`Wrote sitemap.xml (${routes.length} URLs), llms.txt, llms-full.txt (${(full.length / 1024).toFixed(0)} KB)`);

// 404 page (served with a real 404 status by the host config); client-rendered, noindex via NotFound.
try {
  const nf = await mod.render("/__not-found__");
  fs.writeFileSync(path.join(buildDir, "404.html"), compose(nf, { notFound: true }));
  console.log("prerendered 404.html");
} catch (e) {
  console.warn("404 prerender skipped:", e.message);
}

if (failed) {
  console.error(`${failed} route(s) failed to prerender`);
  process.exit(1);
}
console.log(`Prerendered ${routes.length} routes.`);

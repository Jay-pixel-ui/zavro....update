// Server-side entry used ONLY by scripts/prerender.mjs at build time.
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AppRoutes } from "@/App";
import { SERVICES } from "@/data/services";
import { PROJECTS, publicProjects } from "@/data/projects";
import { publishedInsights } from "@/data/insights";
import { SITE } from "@/data/site";

export { SERVICES, PROJECTS, publicProjects, publishedInsights, SITE };

async function streamToString(stream) {
  const chunks = [];
  for await (const c of stream) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks).toString("utf8");
}

export async function render(url) {
  const helmetContext = {};
  const { prelude } = await prerenderToNodeStream(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </HelmetProvider>,
  );
  const html = await streamToString(prelude);
  const h = helmetContext.helmet;
  const head = h
    ? [h.title, h.priority, h.meta, h.link, h.script].map((x) => (x ? x.toString() : "")).join("\n    ")
    : "";
  return { html, head };
}

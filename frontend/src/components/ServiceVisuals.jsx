import { motion } from "framer-motion";
import { EASE } from "@/components/motion";

const CY = "#00E5FF", GD = "#FFB800", SK = "#5EA8FF", LI = "#B98CFF", MU = "rgba(255,255,255,.16)";
const F = "JetBrains Mono, monospace";

const fade = (delay = 0) => ({ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } } });

const P = ({ d, c = CY, w = 1.5, delay = 0 }) => (
  <motion.path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease: EASE, delay } } }} />
);
const Dash = ({ d, c = MU }) => <path d={d} fill="none" stroke={c} strokeWidth="1.2" className="route-dash" />;
const T = ({ x, y, children, c = "#fff", s = 15, a = "middle", w = 400 }) => (
  <text x={x} y={y} textAnchor={a} fill={c} fontSize={s} fontFamily={F} fontWeight={w}>{children}</text>
);
const N = ({ x, y, w = 130, h = 44, label, c = CY, delay = 0, sub }) => (
  <motion.g variants={fade(delay)}>
    <rect x={x} y={y} width={w} height={h} rx="10" fill="#0D1322" stroke={c} strokeOpacity=".7" />
    <T x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 5)}>{label}</T>
    {sub && <T x={x + w / 2} y={y + h / 2 + 15} s={12} c="#94A3B8">{sub}</T>}
  </motion.g>
);

function Workflow() {
  return (<>
    <N x={10} y={178} w={110} label="Enquiry" sub="form · email" />
    <N x={160} y={178} w={120} label="AI classify" c={GD} delay={0.2} sub="intent · urgency" />
    <P d="M120 200 H160" delay={0.1} />
    <P d="M280 200 C 320 200 320 98 360 98" delay={0.4} />
    <P d="M280 200 H360" delay={0.45} />
    <P d="M280 200 C 320 200 320 302 360 302" c={GD} delay={0.5} />
    <N x={360} y={76} w={150} label="Update CRM" delay={0.6} />
    <N x={360} y={178} w={150} label="Draft reply" delay={0.7} sub="sent after approval" />
    <N x={360} y={280} w={150} label="Person reviews" c={GD} delay={0.8} sub="low confidence" />
    <T x={318} y={150} s={12} c="#94A3B8">confident</T>
    <T x={318} y={262} s={12} c="#94A3B8">unsure</T>
    <Dash d="M20 365 H500" c="rgba(0,229,255,.35)" />
    <T x={260} y={392} s={13} c="#94A3B8">every step logged · failures alert a person</T>
  </>);
}

function Responsive() {
  const blocks = (x, y, w) => (<>
    <rect x={x} y={y} width={w * 0.5} height="10" rx="3" fill="rgba(255,255,255,.7)" />
    <rect x={x} y={y + 18} width={w * 0.8} height="6" rx="3" fill={MU} />
    <rect x={x} y={y + 30} width={w * 0.65} height="6" rx="3" fill={MU} />
    <rect x={x} y={y + 46} width={Math.min(70, w * 0.4)} height="16" rx="8" fill={GD} />
  </>);
  return (<>
    <motion.g variants={fade(0)}>
      <rect x="20" y="40" width="330" height="220" rx="12" fill="#0D1322" stroke={CY} strokeOpacity=".5" />
      <rect x="20" y="40" width="330" height="26" rx="12" fill="rgba(255,255,255,.04)" />
      {blocks(44, 92, 200)}
      <rect x="250" y="88" width="80" height="120" rx="8" fill="rgba(0,229,255,.08)" stroke={CY} strokeOpacity=".3" />
    </motion.g>
    <motion.g variants={fade(0.25)}>
      <rect x="300" y="150" width="120" height="190" rx="14" fill="#0D1322" stroke={SK} strokeOpacity=".6" />
      {blocks(314, 178, 92)}
      <rect x="314" y="256" width="92" height="64" rx="6" fill="rgba(94,168,255,.08)" />
    </motion.g>
    <motion.g variants={fade(0.45)}>
      <rect x="440" y="200" width="66" height="140" rx="12" fill="#0D1322" stroke={GD} strokeOpacity=".7" />
      {blocks(450, 222, 48)}
    </motion.g>
    <P d="M60 300 V 360 H 470 V 340" c={MU} w={1} delay={0.6} />
    <T x={60} y={384} a="start" s={13} c="#94A3B8">one content model → every screen size</T>
  </>);
}

function Commerce() {
  const pts = [[40, 90, "Discover"], [190, 60, "Collection"], [350, 100, "Product"], [440, 200, "Checkout"], [300, 250, "After purchase"]];
  return (<>
    <P d="M40 90 C 110 40 140 60 190 60 S 300 70 350 100 S 470 150 440 200 S 360 260 300 250" w={2} />
    {pts.map(([x, y, l], i) => (
      <motion.g key={l} variants={fade(0.2 + i * 0.12)}>
        <circle cx={x} cy={y} r="7" fill={i === 3 ? GD : CY} />
        <T x={x} y={y - 16} s={14}>{l}</T>
      </motion.g>
    ))}
    {[["Payments", 60], ["Shipping", 170], ["Stock", 280], ["CRM", 390]].map(([l, x], i) => (
      <g key={l}>
        <Dash d={`M${x + 50} 330 L ${i < 2 ? 440 : 300} ${i < 2 ? 208 : 258}`} />
        <N x={x} y={330} w={100} h={38} label={l} c={SK} delay={0.8 + i * 0.08} />
      </g>
    ))}
  </>);
}

function Architecture() {
  const layers = [["Interface", "dashboards · portals", CY], ["Application logic", "rules · permissions", SK], ["Data", "records · audit trail", LI], ["Integrations", "APIs · third parties", GD]];
  return (<>
    {layers.map(([l, s, c], i) => (
      <motion.g key={l} variants={fade(i * 0.15)}>
        <path d={`M${110 - i * 6} ${50 + i * 80} h ${300 + i * 12} l -30 50 h ${-300 - i * 12} z`} fill="#0D1322" stroke={c} strokeOpacity=".7" />
        <T x={250} y={76 + i * 80} s={15}>{l}</T>
        <T x={250} y={94 + i * 80} s={12} c="#94A3B8">{s}</T>
      </motion.g>
    ))}
    <P d="M40 70 V 340" c={MU} w={1} delay={0.6} />
    <T x={30} y={60} a="start" s={12} c="#94A3B8">users</T>
    <P d="M480 70 V 340" c={MU} w={1} delay={0.7} />
    <T x={490} y={360} a="end" s={12} c="#94A3B8">reporting</T>
  </>);
}

function Storyboard() {
  return (<>
    {["Problem", "Flow", "Prototype", "Release"].map((l, i) => (
      <motion.g key={l} variants={fade(i * 0.15)}>
        <rect x={20 + i * 125} y="70" width="100" height="190" rx="16" fill="#0D1322" stroke={i === 2 ? GD : CY} strokeOpacity=".6" />
        <rect x={50 + i * 125} y="80" width="40" height="5" rx="2.5" fill={MU} />
        <rect x={34 + i * 125} y={100 + (i % 2) * 20} width="72" height="40" rx="6" fill="rgba(0,229,255,.08)" />
        <rect x={34 + i * 125} y="160" width="60" height="6" rx="3" fill={MU} />
        <rect x={34 + i * 125} y="174" width="48" height="6" rx="3" fill={MU} />
        <rect x={34 + i * 125} y="226" width="72" height="20" rx="10" fill={i === 3 ? GD : "rgba(255,255,255,.12)"} />
        <T x={70 + i * 125} y={292} s={13} c="#94A3B8">0{i + 1}</T>
        <T x={70 + i * 125} y={314} s={15}>{l}</T>
        {i < 3 && <P d={`M${122 + i * 125} 165 h 21`} delay={0.3 + i * 0.15} />}
      </motion.g>
    ))}
    <Dash d="M20 350 H500" c="rgba(255,184,0,.35)" />
    <T x={260} y={380} s={12} c="#94A3B8">test with people before writing production code</T>
  </>);
}

function Demand() {
  return (<>
    <N x={10} y={176} w={120} h={48} label="Audience" sub="& intent" />
    {[["Search", 70, CY], ["AI answers", 176, LI], ["Social", 282, SK]].map(([l, y, c], i) => (
      <g key={l}>
        <P d={`M130 200 C 160 200 160 ${y + 20} 190 ${y + 20}`} c={c} delay={0.2 + i * 0.1} />
        <N x={190} y={y} w={110} h={40} label={l} c={c} delay={0.3 + i * 0.1} />
        <P d={`M300 ${y + 20} C 330 ${y + 20} 330 200 352 200`} c={c} delay={0.5 + i * 0.1} />
      </g>
    ))}
    <N x={352} y={176} w={150} h={48} label="Website" sub="& content" c={GD} delay={0.7} />
    <P d="M427 224 V 290" delay={0.8} />
    <N x={352} y={290} w={150} h={40} label="Enquiry" c={GD} delay={0.9} />
    <Dash d="M352 310 C 200 380 80 340 70 226" c="rgba(0,229,255,.4)" />
    <T x={180} y={378} s={12} c="#94A3B8">measure → learn → adjust</T>
  </>);
}

function Sitemap() {
  const kids = [["Services", 60, "commercial"], ["Work", 205, "evidence"], ["Insights", 350, "informational"]];
  return (<>
    <N x={195} y={20} w={130} label="Home" c={GD} />
    {kids.map(([l, x, intent], i) => (
      <g key={l}>
        <P d={`M260 64 C 260 100 ${x + 55} 90 ${x + 55} 120`} delay={0.2 + i * 0.1} />
        <N x={x} y={120} w={110} h={40} label={l} delay={0.3 + i * 0.1} />
        <T x={x + 55} y={180} s={11} c="#94A3B8">{intent}</T>
        {[0, 1].map((j) => (
          <g key={j}>
            <P d={`M${x + 55} 160 V 205 H ${x + 15 + j * 70} V 230`} c={MU} w={1} delay={0.5 + i * 0.1} />
            <motion.rect variants={fade(0.6 + i * 0.1)} x={x - 5 + j * 70} y={230} width="50" height="28" rx="6" fill="#0D1322" stroke={SK} strokeOpacity=".5" />
          </g>
        ))}
      </g>
    ))}
    <Dash d="M90 258 C 150 330 300 330 345 258" c="rgba(255,184,0,.5)" />
    <Dash d="M230 258 C 300 310 390 310 445 258" c="rgba(255,184,0,.35)" />
    <T x={260} y={360} s={12} c="#94A3B8">internal links connect related intent</T>
    <T x={260} y={384} s={12} c="#94A3B8">one main intent per page</T>
  </>);
}

function Graph() {
  const nodes = [["Services", 100, 80, CY], ["Location", 420, 80, CY], ["Evidence", 460, 220, GD], ["Answers", 380, 330, SK], ["Profiles", 130, 330, SK], ["Structured data", 70, 210, LI]];
  return (<>
    {nodes.map(([l, x, y, c], i) => <P key={`p${l}`} d={`M260 200 L ${x} ${y}`} c={c} w={1.2} delay={0.1 + i * 0.08} />)}
    {nodes.map(([, x, y], i) => { const [, x2, y2] = nodes[(i + 1) % nodes.length]; return <Dash key={`d${i}`} d={`M${x} ${y} L ${x2} ${y2}`} />; })}
    <motion.g variants={fade(0)}>
      <circle cx="260" cy="200" r="54" fill="#0D1322" stroke={GD} strokeOpacity=".8" />
      <T x={260} y={197} s={14}>Your</T>
      <T x={260} y={216} s={14}>business</T>
    </motion.g>
    {nodes.map(([l, x, y, c], i) => (
      <motion.g key={l} variants={fade(0.4 + i * 0.08)}>
        <circle cx={x} cy={y} r="8" fill={c} />
        <T x={x} y={y + (y < 200 ? -16 : 28)} s={13}>{l}</T>
      </motion.g>
    ))}
  </>);
}

function Content() {
  const items = ["Strategy", "Pillars", "Formats", "Publish", "Learn"];
  return (<>
    <circle cx="260" cy="200" r="130" fill="none" stroke={MU} strokeDasharray="3 6" />
    <P d="M260 70 A130 130 0 1 1 259.9 70" w={1.6} delay={0.1} />
    <motion.g variants={fade(0.2)}>
      <T x={260} y={196} s={15}>Content</T>
      <T x={260} y={216} s={15}>system</T>
    </motion.g>
    {items.map((l, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / items.length;
      const x = 260 + 130 * Math.cos(a), y = 200 + 130 * Math.sin(a);
      return (
        <motion.g key={l} variants={fade(0.3 + i * 0.1)}>
          <rect x={x - 52} y={y - 18} width="104" height="36" rx="18" fill="#0D1322" stroke={i === 4 ? GD : CY} strokeOpacity=".8" />
          <T x={x} y={y + 5} s={14}>{l}</T>
        </motion.g>
      );
    })}
  </>);
}

function Specimen() {
  return (<>
    <motion.g variants={fade(0)}>
      <rect x="20" y="20" width="480" height="360" rx="14" fill="none" stroke={MU} />
      {[1, 2, 3, 4, 5].map((i) => <line key={i} x1={20 + i * 80} x2={20 + i * 80} y1="20" y2="380" stroke="rgba(255,255,255,.05)" />)}
      <text x="44" y="170" fill="#fff" fontSize="128" fontFamily="Unbounded, sans-serif" fontWeight="600">Aa</text>
      <T x={46} y={208} a="start" s={13} c="#94A3B8">Display · Body · Mono</T>
    </motion.g>
    {[CY, SK, LI, GD, "#0D1322"].map((c, i) => (
      <motion.rect key={c} variants={fade(0.2 + i * 0.08)} x={44 + i * 64} y="240" width="52" height="52" rx="10" fill={c} stroke={MU} />
    ))}
    <motion.g variants={fade(0.6)}>
      <rect x="380" y="60" width="96" height="96" rx="8" fill="none" stroke={GD} strokeDasharray="4 4" />
      <rect x="402" y="82" width="52" height="52" rx="6" fill="rgba(255,184,0,.15)" stroke={GD} />
      <T x={428} y={180} s={12} c="#94A3B8">clear space</T>
    </motion.g>
    <T x={44} y={334} a="start" s={13} c="#94A3B8">colour · type · mark · rules</T>
  </>);
}

function Matrix() {
  const dots = [["Enquiry flow", 140, 110, GD], ["Website", 330, 120, CY], ["AI pilot", 380, 250, LI], ["Brand refresh", 160, 260, SK]];
  return (<>
    <P d="M60 360 V 30" c={MU} w={1.2} />
    <P d="M60 360 H 500" c={MU} w={1.2} delay={0.1} />
    <line x1="280" x2="280" y1="30" y2="360" stroke="rgba(255,255,255,.08)" />
    <line x1="60" x2="500" y1="195" y2="195" stroke="rgba(255,255,255,.08)" />
    <T x={170} y={56} s={13} c={GD}>Quick wins</T>
    <T x={390} y={56} s={13} c="#94A3B8">Major projects</T>
    <T x={170} y={340} s={13} c="#94A3B8">Fill-ins</T>
    <T x={390} y={340} s={13} c="#94A3B8">Reconsider</T>
    <T x={30} y={200} s={12} c="#94A3B8" a="middle">impact</T>
    <T x={480} y={385} s={12} c="#94A3B8" a="end">effort →</T>
    {dots.map(([l, x, y, c], i) => (
      <motion.g key={l} variants={fade(0.4 + i * 0.12)}>
        <circle cx={x} cy={y} r="9" fill={c} />
        <circle cx={x} cy={y} r="18" fill="none" stroke={c} strokeOpacity=".35" />
        <T x={x} y={y + 36} s={13}>{l}</T>
      </motion.g>
    ))}
  </>);
}

const MAP = { workflow: Workflow, responsive: Responsive, commerce: Commerce, architecture: Architecture, storyboard: Storyboard, demand: Demand, sitemap: Sitemap, graph: Graph, content: Content, specimen: Specimen, matrix: Matrix };

export default function ServiceVisual({ kind, label }) {
  const V = MAP[kind];
  if (!V) return null;
  return (
    <motion.figure initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="glass relative overflow-hidden rounded-[20px] p-3 sm:p-6" data-testid={`service-visual-${kind}`}>
      <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-60" />
      <svg viewBox="0 0 520 400" role="img" aria-label={label} className="relative h-auto w-full">
        <V />
      </svg>
      <figcaption className="relative mt-2 px-1 font-mono text-[12px] uppercase tracking-widest text-z-muted">Illustrative diagram — not a live client system</figcaption>
    </motion.figure>
  );
}

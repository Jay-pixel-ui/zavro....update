import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { publicProjects, hostOf } from "@/data/projects";
import { SHOW_DEMO_CONTENT } from "@/data/site";
import { EASE } from "@/components/motion";

// Renders only approved fields; testimonial/metric/logo blocks appear only when their approval flags are true.
export default function ProjectList({ large = false }) {
  const list = publicProjects();
  return (
    <ul className="border-t border-white/10" data-testid="project-list">
      {list.map((p, i) => (
        <motion.li
          key={p.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
          className="border-b border-white/10"
          data-testid={`project-${p.slug}`}
        >
          <a href={p.clientDomain} target="_blank" rel="noopener noreferrer" data-cursor="view" className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 py-7 sm:grid-cols-[60px_1fr_auto_auto] sm:gap-x-8 sm:py-9">
            <span className="font-mono text-xs text-z-muted">0{i + 1}</span>
            <span className={`font-display font-medium leading-none text-white transition-transform duration-500 ease-signal group-hover:translate-x-2 ${large ? "text-[clamp(2rem,6vw,4.8rem)]" : "text-[clamp(1.7rem,4.6vw,3.6rem)]"}`}>
              {p.clientName}
            </span>
            <span className="col-start-2 font-mono text-[12px] uppercase tracking-widest text-z-body sm:col-start-auto">{p.industry}</span>
            <span className="col-start-2 inline-flex items-center gap-2 text-[15px] text-z-eyebrow sm:col-start-auto">
              {hostOf(p.clientDomain)} <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              <span className="sr-only">(opens client website in a new tab)</span>
            </span>
          </a>
          {p.testimonialApproved && p.testimonialQuote && (
            <blockquote className="pb-8 pl-[60px] text-z-body">“{p.testimonialQuote}” — {p.testimonialAttribution}</blockquote>
          )}
        </motion.li>
      ))}
      {SHOW_DEMO_CONTENT && (
        <li className="py-6 font-mono text-xs uppercase tracking-widest text-z-gold">SAMPLE CONTENT — NOT A REAL TESTIMONIAL (preview only)</li>
      )}
    </ul>
  );
}

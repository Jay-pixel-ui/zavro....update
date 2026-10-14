import { motion } from "framer-motion";
import { PROCESS } from "@/data/site";
import { EASE } from "@/components/motion";

export default function ProcessPath() {
  return (
    <div className="relative" data-testid="process-path">
      <motion.div
        aria-hidden="true"
        className="absolute left-[19px] top-0 h-full w-px origin-top bg-gradient-to-b from-z-cyan via-z-lilac to-z-gold lg:left-0 lg:top-[19px] lg:h-px lg:w-full lg:origin-left lg:bg-gradient-to-r"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
        {PROCESS.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.08 }}
            className="relative pl-14 lg:pl-0 lg:pt-14"
            data-testid={`process-step-${s.id}`}
          >
            <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-z-bg font-mono text-xs text-z-cyan">{s.n}</span>
            <h3 className="font-display text-xl">{s.title}</h3>
            <p className="mt-2 text-[15px] text-z-body">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

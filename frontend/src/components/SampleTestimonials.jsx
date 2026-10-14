import { SHOW_DEMO_CONTENT } from "@/data/site";
import { Reveal, Eyebrow } from "@/components/motion";

// Preview-only placeholders. Never attributed to real clients; hidden automatically on the production host.
const SAMPLES = [
  { quote: "Placeholder quote describing how the team explained trade-offs clearly and kept the project moving.", who: "Sample attribution · Retail business" },
  { quote: "Placeholder quote about enquiries arriving with the right context and the website being easier to update.", who: "Sample attribution · Home services" },
  { quote: "Placeholder quote about joined-up delivery across website, search and workflow automation.", who: "Sample attribution · Professional services" },
];

export default function SampleTestimonials() {
  if (!SHOW_DEMO_CONTENT) return null;
  return (
    <section className="px-5 py-20 sm:px-8" data-testid="sample-testimonials" aria-label="Sample testimonial layout (preview only)">
      <div className="mx-auto max-w-[1240px]">
        <Eyebrow>Testimonials · layout preview</Eyebrow>
        <p className="mt-4 inline-flex rounded-full border border-z-gold/60 bg-z-gold/10 px-4 py-1.5 font-mono text-[12px] font-semibold uppercase tracking-widest text-z-gold">SAMPLE CONTENT — NOT A REAL TESTIMONIAL</p>
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          {SAMPLES.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className={`glass relative rounded-[20px] p-6 sm:p-8 ${i === 0 ? "lg:row-span-2" : ""}`}>
              <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-z-gold">SAMPLE CONTENT — NOT A REAL TESTIMONIAL</p>
              <blockquote className={`font-display leading-snug text-white ${i === 0 ? "text-[clamp(1.4rem,2.6vw,2.1rem)]" : "text-lg"}`}>“{s.quote}”</blockquote>
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-z-muted">{s.who}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

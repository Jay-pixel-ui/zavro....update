const WORDS = ["AI automation", "Websites", "E-commerce", "Custom software", "Mobile apps", "SEO", "GEO", "Social & content", "Branding", "Strategy"];

function Row({ hidden }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {WORDS.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className={`whitespace-nowrap px-6 font-display text-[clamp(2rem,6vw,5.5rem)] font-medium leading-none sm:px-10 ${i % 2 ? "text-transparent [-webkit-text-stroke:1px_rgba(203,213,225,0.55)]" : "text-white"}`}>{w}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 0l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" fill={i % 2 ? "#FFB800" : "#00E5FF"} /></svg>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="Disciplines" className="relative overflow-hidden border-y border-white/10 py-8 sm:py-12" data-testid="disciplines-marquee">
      <p className="sr-only">Disciplines: {WORDS.join(", ")}.</p>
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-z-bg to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-z-bg to-transparent sm:w-40" />
    </section>
  );
}

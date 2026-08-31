import { Reveal } from "./Reveal";
import { useLang } from "../i18n";

export default function Manifesto() {
  const { t } = useLang();
  return (
    <section className="py-12 sm:py-16" data-testid="manifesto-section">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <Reveal>
          <div className="border border-gold/25 bg-cream/50 rounded-2xl px-6 sm:px-10 py-8 sm:py-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <h2 className="font-deco text-sm sm:text-base tracking-[0.2em] uppercase text-charcoal text-center leading-relaxed">
              {t.manifesto.title}
            </h2>
            <div className="mt-6 divide-y divide-charcoal/8">
              {t.manifesto.chapters.map((ch, i) => (
                <div key={ch.n} data-testid={`manifesto-chapter-${i}`} className="flex items-baseline gap-4 py-3">
                  <span className="font-deco text-sm text-champagne shrink-0">{ch.n}</span>
                  <p className="text-sm sm:text-base text-smoke leading-relaxed">
                    <span className="font-semibold text-charcoal">{ch.h}</span> {ch.p}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center font-serif italic text-base sm:text-lg text-gold" data-testid="manifesto-quote">
              “{t.manifesto.quote}”
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

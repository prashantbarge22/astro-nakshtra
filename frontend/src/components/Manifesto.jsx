import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

export default function Manifesto() {
  const { t } = useLang();
  return (
    <section className="py-24 sm:py-32" data-testid="manifesto-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal max-w-3xl">
            {t.manifesto.title}
          </h2>
        </Reveal>
        <div className="mt-16 sm:mt-20">
          {t.manifesto.chapters.map((ch, i) => (
            <Reveal key={ch.n} delay={0.05}>
              <div
                data-testid={`manifesto-chapter-${i}`}
                className={`grid sm:grid-cols-12 gap-4 sm:gap-8 py-10 sm:py-14 border-t border-charcoal/10 ${i % 2 === 1 ? "sm:text-right" : ""}`}
              >
                <div className={`sm:col-span-3 ${i % 2 === 1 ? "sm:order-3" : ""}`}>
                  <span className="font-serif italic text-5xl sm:text-7xl text-champagne/60">{ch.n}</span>
                </div>
                <div className="sm:col-span-4">
                  <h3 className="font-serif text-2xl sm:text-3xl leading-snug text-charcoal">{ch.h}</h3>
                </div>
                <div className="sm:col-span-5">
                  <p className="text-smoke leading-relaxed text-base sm:text-lg">{ch.p}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 sm:mt-20 text-center">
          <p className="font-serif italic text-2xl sm:text-3xl text-gold" data-testid="manifesto-quote">
            “{t.manifesto.quote}”
          </p>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "./Reveal";
import { useLang } from "../i18n";

export default function Manifesto() {
  const { t } = useLang();
  return (
    <section className="py-16 sm:py-20" data-testid="manifesto-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <h2 className="font-deco text-2xl sm:text-3xl lg:text-4xl tracking-wide leading-tight text-charcoal max-w-3xl uppercase">
            {t.manifesto.title}
          </h2>
        </Reveal>
        <div className="mt-10 sm:mt-12">
          {t.manifesto.chapters.map((ch, i) => (
            <Reveal key={ch.n} delay={0.05}>
              <div
                data-testid={`manifesto-chapter-${i}`}
                className={`grid sm:grid-cols-12 gap-3 sm:gap-8 py-6 sm:py-8 border-t border-charcoal/10 ${i % 2 === 1 ? "sm:text-right" : ""}`}
              >
                <div className={`sm:col-span-3 ${i % 2 === 1 ? "sm:order-3" : ""}`}>
                  <span className="font-deco text-4xl sm:text-5xl text-champagne/70">{ch.n}</span>
                </div>
                <div className="sm:col-span-4">
                  <h3 className="font-deco text-lg sm:text-xl tracking-wide leading-snug text-charcoal uppercase">{ch.h}</h3>
                </div>
                <div className="sm:col-span-5">
                  <p className="text-smoke leading-relaxed text-sm sm:text-base">{ch.p}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <p className="font-serif italic text-xl sm:text-2xl text-gold" data-testid="manifesto-quote">
            “{t.manifesto.quote}”
          </p>
        </Reveal>
      </div>
    </section>
  );
}

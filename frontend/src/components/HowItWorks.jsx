import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

export default function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how" className="py-24 sm:py-32 bg-charcoal text-ivory" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] font-semibold text-champagne mb-5">{t.how.eyebrow}</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight max-w-3xl">{t.how.title}</h2>
        </Reveal>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {t.how.steps.map((step, i) => (
            <Reveal key={i} delay={0.06 * (i % 3)}>
              <div data-testid={`how-step-${i}`} className="border-t border-ivory/15 pt-6">
                <span className="font-serif italic text-4xl text-champagne/70">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-xl sm:text-2xl leading-snug">{step.h}</h3>
                <p className="mt-3 text-ivory/60 text-sm sm:text-base leading-relaxed">{step.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16">
          <p className="font-serif italic text-xl sm:text-2xl text-champagne text-center" data-testid="how-note">{t.how.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

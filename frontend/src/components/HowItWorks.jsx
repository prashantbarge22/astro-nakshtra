import { Reveal } from "./Reveal";
import { useLang } from "../i18n";

export default function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how" className="py-16 sm:py-20 bg-charcoal text-ivory" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] font-semibold text-champagne">{t.how.eyebrow}</p>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          {t.how.steps.map((step, i) => (
            <Reveal key={i} delay={0.05 * (i % 3)}>
              <div data-testid={`how-step-${i}`} className="border-t border-ivory/15 pt-5">
                <span className="font-serif italic text-3xl text-champagne/70">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-lg sm:text-xl leading-snug">{step.h}</h3>
                <p className="mt-2 text-ivory/60 text-sm leading-relaxed">{step.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <p className="font-serif italic text-lg sm:text-xl text-champagne text-center" data-testid="how-note">{t.how.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

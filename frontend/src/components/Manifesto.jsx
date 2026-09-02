import { Reveal } from "./Reveal";
import { useLang } from "../i18n";

const ADVANCE_BG = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80";

export default function Manifesto() {
  const { t } = useLang();
  return (
    <section className="py-14 sm:py-18 sm:py-20" data-testid="manifesto-section">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden border border-gold/25">
            <img src={ADVANCE_BG} alt="" aria-hidden="true" loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-25"
              style={{ filter: "sepia(0.4) brightness(1.05)" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-ivory/60 via-ivory/40 to-ivory/85" />
            <div className="relative px-6 sm:px-10 py-10 sm:py-12 text-center">
              <h2 className="font-deco text-xl sm:text-2xl lg:text-3xl tracking-[0.12em] uppercase text-charcoal leading-relaxed">
                {t.v4.manifestoTitle}
              </h2>
              <p className="mt-3 font-serif italic text-sm sm:text-base text-smoke max-w-xl mx-auto">{t.v4.manifestoTag}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-6 border border-gold/25 bg-cream/50 rounded-2xl px-6 sm:px-10 py-8 sm:py-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <div className="divide-y divide-charcoal/8">
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

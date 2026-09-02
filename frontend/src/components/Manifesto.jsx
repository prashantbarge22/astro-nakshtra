import { Reveal } from "./Reveal";
import { useLang } from "../i18n";

const ADVANCE_BG = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80";

export default function Manifesto() {
  const { t } = useLang();
  return (
    <section className="py-14 sm:py-20" data-testid="manifesto-section">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <Reveal className="h-full">
            <div className="relative rounded-2xl overflow-hidden border border-gold/25 h-full min-h-[320px]">
              <img src={ADVANCE_BG} alt="" aria-hidden="true" loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                style={{ filter: "sepia(0.4) brightness(1.05)" }} />
              <div className="absolute inset-0 bg-gradient-to-b from-ivory/55 via-ivory/35 to-ivory/85" />
              <div className="relative h-full flex flex-col justify-center px-8 sm:px-10 py-10">
                <h2 className="font-deco text-xl sm:text-2xl tracking-[0.12em] uppercase text-charcoal leading-relaxed">
                  {t.v4.manifestoTitle}
                </h2>
                <p className="mt-4 font-serif italic text-sm sm:text-base text-smoke max-w-md">{t.v4.manifestoTag}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <div className="h-full border border-gold/25 bg-cream/50 rounded-2xl px-6 sm:px-8 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <div className="divide-y divide-charcoal/8">
                {t.manifesto.chapters.map((ch) => (
                  <div key={ch.n} data-testid={`manifesto-chapter-${ch.n}`} className="flex items-baseline gap-4 py-2.5">
                    <span className="font-deco text-sm text-champagne shrink-0">{ch.n}</span>
                    <p className="text-sm sm:text-base text-smoke leading-relaxed">
                      <span className="font-semibold text-charcoal">{ch.h}</span> {ch.p}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center font-serif italic text-base sm:text-lg text-gold" data-testid="manifesto-quote">
                “{t.manifesto.quote}”
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

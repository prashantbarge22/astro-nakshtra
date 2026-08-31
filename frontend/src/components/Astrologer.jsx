import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

const PORTRAIT = "https://images.unsplash.com/photo-1603796868286-f684c57d3cee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxlbGRlcmx5JTIwaW5kaWFuJTIwbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwY2FsbXxlbnwwfHx8fDE3ODgyMDYwNDd8MA&ixlib=rb-4.1.0&q=85";

export default function Astrologer() {
  const { t } = useLang();
  return (
    <section id="astrologer" className="py-24 sm:py-32" data-testid="astrologer-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="relative max-w-md">
              <div className="rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
                <img src={PORTRAIT} alt={t.astrologer.name} className="w-full h-[420px] sm:h-[500px] object-cover" loading="lazy" data-testid="astrologer-portrait" />
              </div>
              <span className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-gold/40 pointer-events-none" aria-hidden="true" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>{t.astrologer.eyebrow}</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal">{t.astrologer.name}</h2>
            <p className="mt-6 text-smoke text-base sm:text-lg leading-relaxed">{t.astrologer.p1}</p>
            <p className="mt-4 font-serif italic text-lg sm:text-xl text-gold leading-relaxed">{t.astrologer.p2}</p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {t.astrologer.stats.map((s, i) => (
                <div key={i} data-testid={`astrologer-stat-${i}`} className="border-t border-gold/30 pt-4">
                  <p className="font-serif text-3xl sm:text-4xl text-charcoal">{s.n}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-smoke">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

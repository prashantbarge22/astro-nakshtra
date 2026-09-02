import { Reveal, Eyebrow, CountUp } from "./Reveal";
import { useLang } from "../i18n";

const DESTINY_IMG = "https://images.unsplash.com/photo-1429305336325-b84ace7eba3b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxzdWJ0bGUlMjBuaWdodCUyMHNreSUyMHN0YXJzJTIwdGV4dHVyZSUyMGxpZ2h0fGVufDB8fHx8MTc4ODIwNjA0N3ww&ixlib=rb-4.1.0&q=85";

export default function Astrologer() {
  const { t } = useLang();
  return (
    <section id="astrologer" className="py-20 sm:py-24" data-testid="astrologer-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.10)]" data-testid="astrologer-destiny-image">
            <img src={DESTINY_IMG} alt="A sky of stars — destiny" className="w-full aspect-[16/10] sm:aspect-[21/9] object-cover" loading="lazy" />
            <div className="absolute inset-0 aurora" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
            <p className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 font-serif italic text-2xl sm:text-3xl lg:text-4xl text-ivory leading-snug max-w-2xl" data-testid="astrologer-trust-line">
              {t.astrologer.trust}
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid lg:grid-cols-2 gap-10 items-start">
          <Reveal delay={0.05}>
            <Eyebrow>{t.astrologer.eyebrow}</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-tight leading-tight text-charcoal">{t.astrologer.name}</h2>
            <p className="mt-4 text-smoke text-sm sm:text-base leading-relaxed max-w-md">{t.astrologer.p1}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-4 lg:pt-12">
              {t.astrologer.stats.map((s, i) => (
                <div key={i} data-testid={`astrologer-stat-${i}`} className="bg-cream/60 border border-gold/25 rounded-xl px-4 py-5 shadow-[0_8px_24px_rgba(197,155,39,0.10)]">
                  <p className="font-deco text-3xl sm:text-4xl bg-gradient-to-b from-gold to-champagne bg-clip-text text-transparent">
                    <CountUp value={s.n} />
                  </p>
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

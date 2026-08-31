import { useContext } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

export default function Blueprint() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  return (
    <section className="py-24 sm:py-32 bg-cream/50" data-testid="blueprint-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <Reveal>
            <Eyebrow>{t.blueprint.eyebrow}</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal">{t.blueprint.title}</h2>
            <p className="mt-5 text-smoke text-base sm:text-lg leading-relaxed">{t.blueprint.sub}</p>
            <p className="mt-6 font-serif italic text-xl text-gold leading-snug">{t.blueprint.popular}</p>
            <button
              data-testid="blueprint-cta-button"
              onClick={() => openBooking("blueprint")}
              className="mt-10 rounded-full border border-charcoal text-charcoal font-semibold text-sm sm:text-base px-8 py-4 hover:bg-charcoal hover:text-ivory transition-colors active:scale-[0.98] inline-flex items-center gap-2"
            >
              {t.blueprint.cta} <ArrowUpRight size={17} />
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-smoke">{t.blueprint.footnote}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {t.blueprint.items.map((item, i) => (
                <div
                  key={i}
                  data-testid={`blueprint-item-${i}`}
                  className="bg-ivory border border-charcoal/8 rounded-xl px-5 py-5 text-sm sm:text-base text-charcoal font-medium shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

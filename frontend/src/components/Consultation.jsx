import { useContext } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

export default function Consultation() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  return (
    <section className="py-24 sm:py-32" data-testid="consultation-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
          <Reveal>
            <Eyebrow>{t.consult.eyebrow}</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal">{t.consult.title}</h2>
            <p className="mt-4 text-gold font-semibold text-sm uppercase tracking-[0.18em]">{t.consult.sub}</p>
            <ul className="mt-10 space-y-4">
              {t.consult.gets.map((g, i) => (
                <li key={i} data-testid={`consult-get-${i}`} className="flex items-start gap-3 text-smoke text-base">
                  <Check size={18} strokeWidth={2} className="text-gold mt-0.5 shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="flex flex-col gap-6">
            <Reveal delay={0.1}>
              <div className="bg-cream/70 border border-gold/20 rounded-2xl p-8 sm:p-10">
                <p className="font-serif italic text-6xl sm:text-7xl text-charcoal">₹99</p>
                <div className="mt-8 space-y-0">
                  {t.consult.journey.map((j, i) => (
                    <div key={i} data-testid={`journey-step-${i}`} className="flex items-center gap-4 py-3 border-b border-charcoal/8 last:border-0">
                      <span className="font-serif italic text-lg text-champagne w-8">0{i + 1}</span>
                      <span className="text-charcoal text-sm sm:text-base font-medium">{j}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-smoke font-semibold">{t.consult.journeyLine}</p>
                <button
                  data-testid="consult-book-button"
                  onClick={() => openBooking("consultation")}
                  className="mt-8 w-full rounded-full bg-champagne text-charcoal font-semibold px-8 py-4 hover:bg-gold transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {t.consult.cta} <ArrowRight size={17} />
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="border-l-2 border-gold pl-6 py-2" data-testid="objection-block">
                <p className="font-serif italic text-xl sm:text-2xl text-charcoal">{t.consult.objectionQ}</p>
                <p className="mt-3 text-smoke text-sm sm:text-base leading-relaxed">{t.consult.objectionA1}</p>
                <p className="mt-2 text-smoke text-sm sm:text-base leading-relaxed font-medium">{t.consult.objectionA2}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

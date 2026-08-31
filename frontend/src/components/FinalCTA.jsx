import { useContext, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";
import { useLang } from "../i18n";
import { BookingContext } from "../App";
import StarCanvas from "./StarCanvas";

export default function FinalCTA() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const starsY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="relative py-32 sm:py-40 overflow-hidden" data-testid="final-cta-section">
      <motion.div style={{ y: starsY }} className="absolute inset-0 pointer-events-none opacity-80">
        <StarCanvas density={70} />
      </motion.div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center">
        <Reveal>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-charcoal">{t.final.h1}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-serif italic text-2xl sm:text-3xl text-gold leading-snug">{t.final.h2}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-6 text-smoke text-base sm:text-lg max-w-xl mx-auto leading-relaxed">{t.final.sub}</p>
        </Reveal>
        <Reveal delay={0.26}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              data-testid="final-book-button"
              onClick={() => openBooking("consultation")}
              className="rounded-full bg-champagne text-charcoal font-semibold text-base px-10 py-4 hover:bg-gold transition-colors active:scale-[0.98] shadow-[0_10px_36px_rgba(197,155,39,0.35)]"
            >
              {t.final.cta}
            </button>
            <span className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-smoke">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-pulse-soft" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
              </span>
              {t.hero.limited}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.34}>
          <p className="mt-12 text-xs uppercase tracking-[0.28em] text-smoke/70 font-semibold">{t.final.line}</p>
        </Reveal>
      </div>
    </section>
  );
}

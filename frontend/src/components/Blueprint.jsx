import { useContext } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

export default function Blueprint() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  return (
    <section className="py-20 sm:py-24 bg-cream/50" data-testid="blueprint-section">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <Reveal>
          <Eyebrow>{t.blueprint.eyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal">{t.v3.bpTitle}</h2>
          <p className="mt-4 font-serif italic text-lg sm:text-xl text-gold leading-snug">{t.v3.bpLine}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative mt-12 mx-auto max-w-xs rounded-3xl border border-gold/40 bg-gradient-to-b from-champagne/25 to-gold/10 px-10 py-12 overflow-hidden shadow-[0_20px_50px_rgba(197,155,39,0.28)]"
            data-testid="blueprint-price-box"
          >
            <span className="gold-shine" aria-hidden="true" />
            <p className="font-deco text-6xl sm:text-7xl text-charcoal" data-testid="blueprint-price">₹149</p>
            <button
              data-testid="blueprint-cta-button"
              onClick={() => openBooking("blueprint")}
              className="mt-8 w-full rounded-full bg-charcoal text-ivory font-semibold text-sm sm:text-base px-8 py-4 hover:bg-gold hover:text-charcoal transition-colors active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              {t.v3.bpTitle} <ArrowUpRight size={17} />
            </button>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Star, Gift } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

const Stars = () => (
  <span className="flex text-champagne gap-0.5">
    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
  </span>
);

export default function Testimonials() {
  const { t } = useLang();
  return (
    <section className="py-24 sm:py-32 bg-cream/50" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.testimonials.eyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal">{t.testimonials.title}</h2>
          <p className="mt-4 text-smoke text-base sm:text-lg">{t.testimonials.sub}</p>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.testimonials.quotes.map((q, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4 }}
                data-testid={`testimonial-card-${i}`}
                className="h-full bg-ivory border border-charcoal/8 rounded-2xl p-7 flex flex-col gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
              >
                <Stars />
                <p className="font-serif italic text-lg text-charcoal leading-relaxed">“{q}”</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <div data-testid="referral-band" className="rounded-2xl border border-gold/30 bg-ivory px-8 py-8 sm:px-12 flex flex-col sm:flex-row sm:items-center gap-6">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold shrink-0">
              <Gift size={22} strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="font-serif text-2xl text-charcoal">{t.testimonials.referralH}</h3>
              <p className="mt-2 text-smoke text-sm sm:text-base leading-relaxed">{t.testimonials.referralP}</p>
              <p className="mt-1 text-xs text-smoke/60 italic">{t.testimonials.referralNote}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

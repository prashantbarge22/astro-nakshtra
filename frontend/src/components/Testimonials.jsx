import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Reveal, Eyebrow, CountUp } from "./Reveal";
import { useLang } from "../i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Stars = () => (
  <span className="flex text-champagne gap-0.5">
    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
  </span>
);

export default function Testimonials() {
  const { t } = useLang();
  const [slots, setSlots] = useState(null);

  useEffect(() => {
    const fetchStats = () =>
      fetch(`${API}/stats`)
        .then((r) => r.json())
        .then((d) => setSlots(d.slots_booked))
        .catch(() => {});
    fetchStats();
    const timer = setInterval(fetchStats, 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="py-24 sm:py-32 bg-cream/50" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.testimonials.eyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal">{t.testimonials.title}</h2>
          <p className="mt-4 text-smoke text-base sm:text-lg">{t.testimonials.sub}</p>
        </Reveal>
        <Reveal className="mt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="testimonials-dashboard">
            <div className="bg-ivory border border-charcoal/8 rounded-2xl px-6 py-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <p className="font-serif text-3xl sm:text-4xl text-charcoal"><CountUp value="4.9" /></p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold">Rating</p>
            </div>
            <div className="bg-ivory border border-charcoal/8 rounded-2xl px-6 py-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <p className="font-serif text-3xl sm:text-4xl text-charcoal"><CountUp value="5,000+" /></p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold">Customers</p>
            </div>
            <div className="bg-ivory border border-charcoal/8 rounded-2xl px-6 py-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <p className="font-serif text-3xl sm:text-4xl text-charcoal"><CountUp value="40+" /></p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold">Years</p>
            </div>
            <div className="bg-ivory border border-gold/40 rounded-2xl px-6 py-6 text-center shadow-[0_8px_32px_rgba(197,155,39,0.12)]" data-testid="live-slots-card">
              <p className="font-serif text-3xl sm:text-4xl text-gold" data-testid="live-slots-count">
                {slots === null ? "—" : <CountUp key={slots} value={String(slots)} duration={0.9} />}
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold flex items-center justify-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-blink-dot" />
                {t.v3.liveLabel}
              </p>
              <p className="mt-1 text-[10px] text-smoke/60 italic">{t.v3.liveNote}</p>
            </div>
          </div>
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
      </div>
    </section>
  );
}

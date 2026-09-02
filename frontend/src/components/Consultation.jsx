import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

const ORDER_FEED = [
  ["Aarav", "Mumbai"], ["Priya", "Bengaluru"], ["Rohit", "Delhi"], ["Sneha", "Ahmedabad"],
  ["Arjun", "Chandigarh"], ["Kavya", "Chennai"], ["Vikram", "Jaipur"], ["Ananya", "Kolkata"],
];

const PlanCard = ({ testid, ctaTestid, price, title, tag, items, cta, onClick, delay = 0 }) => (
  <Reveal delay={delay} className="h-full">
    <div className="beam-border rounded-3xl h-full" data-testid={testid}>
      <div className="beam-inner bg-ivory rounded-[calc(1.5rem-1.5px)] p-8 sm:p-10 h-full flex flex-col">
        <p className="font-deco text-5xl sm:text-6xl text-charcoal">{price}</p>
        <h3 className="mt-4 font-serif text-2xl text-charcoal leading-snug">{title}</h3>
        <p className="mt-2 font-serif italic text-gold">{tag}</p>
        <ul className="mt-7 space-y-3 flex-1">
          {items.map((g, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 text-smoke text-sm sm:text-base"
            >
              <Check size={16} strokeWidth={2} className="text-gold mt-0.5 shrink-0" /> {g}
            </motion.li>
          ))}
        </ul>
        <button
          data-testid={ctaTestid}
          onClick={onClick}
          className="mt-8 rounded-full bg-charcoal text-ivory font-semibold text-sm sm:text-base px-8 py-4 hover:bg-gold hover:text-charcoal transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {cta} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  </Reveal>
);

export default function Consultation() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  const [reports, setReports] = useState(2000);
  const [people, setPeople] = useState(52);
  const [orderIdx, setOrderIdx] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setReports((r) => r + 1), 18000);
    const t2 = setInterval(() => setPeople((p) => Math.max(47, Math.min(63, p + (Math.random() > 0.5 ? 1 : -1)))), 4000);
    const t3 = setInterval(() => setOrderIdx((i) => i + 1), 4000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
  }, []);

  const order = ORDER_FEED[orderIdx % ORDER_FEED.length];
  const orderAction = orderIdx % 3 === 2 ? t.v4.orderBlueprint : t.v4.orderBooked;

  return (
    <section id="plans" className="py-20 sm:py-24" data-testid="plans-section">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.v4.plansEyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-charcoal">{t.v4.plansTitle}</h2>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <PlanCard
            testid="plan-card-99" ctaTestid="plan-99-cta"
            price="₹99" title={t.v4.plan99Title} tag={t.consult.title}
            items={t.consult.gets.slice(0, 6)} cta={t.v4.plan99Cta}
            onClick={() => openBooking("consultation")}
          />
          <PlanCard
            testid="plan-card-149" ctaTestid="plan-149-cta" delay={0.1}
            price="₹149" title={t.v4.plan149Title} tag={t.v3.bpLine}
            items={t.blueprint.items} cta={t.v4.plan149Cta}
            onClick={() => openBooking("blueprint")}
          />
        </div>

        <Reveal className="mt-12">
          <div className="border-l-2 border-gold pl-6 py-2 max-w-2xl" data-testid="objection-block">
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal">{t.consult.objectionQ}</p>
            <p className="mt-3 text-smoke text-sm sm:text-base leading-relaxed">{t.consult.objectionA1}</p>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div className="grid sm:grid-cols-3 gap-4" data-testid="plans-live-dashboard">
            <div className="bg-cream/60 border border-gold/25 rounded-2xl px-6 py-5 text-center">
              <p className="font-deco text-3xl text-charcoal" data-testid="reports-sold-count">
                <AnimatePresence mode="wait">
                  <motion.span key={reports} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="inline-block">
                    {reports.toLocaleString("en-IN")}+
                  </motion.span>
                </AnimatePresence>
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold">{t.v4.reportsSold}</p>
            </div>
            <div className="bg-cream/60 border border-gold/25 rounded-2xl px-6 py-5 text-center">
              <p className="font-deco text-3xl text-charcoal flex items-center justify-center gap-2" data-testid="people-live-count">
                <span className="inline-block h-2 w-2 rounded-full bg-gold animate-blink-dot" />
                <AnimatePresence mode="wait">
                  <motion.span key={people} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="inline-block">
                    {people}+
                  </motion.span>
                </AnimatePresence>
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold">{t.v4.peopleLive}</p>
            </div>
            <div className="bg-charcoal text-ivory rounded-2xl px-6 py-5 flex items-center gap-3" data-testid="orders-ticker">
              <span className="text-champagne shrink-0 text-lg">✦</span>
              <AnimatePresence mode="wait">
                <motion.p key={orderIdx} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.45 }} className="text-sm text-ivory/85 leading-snug">
                  <span className="font-semibold text-ivory">{order[0]}</span> {t.v3.from} {order[1]} {orderAction}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

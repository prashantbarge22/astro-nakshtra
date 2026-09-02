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

const TitleRotator = ({ words }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="inline-block text-gold italic" data-testid="plans-title-rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const PlanCard = ({ testid, ctaTestid, price, title, tag, items, cta, onClick, badge, delay = 0 }) => (
  <Reveal delay={delay} className="h-full">
    <div className="beam-border rounded-3xl h-full" data-testid={testid}>
      <div className="beam-inner bg-ivory rounded-[calc(1.5rem-1.5px)] p-6 sm:p-8 h-full flex flex-col">
        {badge && (
          <span className="w-fit rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] uppercase tracking-[0.2em] font-bold px-3.5 py-1.5 mb-4" data-testid={`${testid}-badge`}>
            {badge}
          </span>
        )}
        <p className="font-deco text-4xl sm:text-5xl text-charcoal">
          {price} <span className="font-serif italic text-lg sm:text-xl text-gold">only</span>
        </p>
        <h3 className="mt-3 font-serif text-xl sm:text-2xl text-charcoal leading-snug">{title}</h3>
        <p className="mt-2 font-serif italic text-gold text-sm sm:text-base">{tag}</p>
        <ul className="mt-6 space-y-2.5 flex-1">
          {items.map((g, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-2.5 text-smoke text-sm"
            >
              <Check size={15} strokeWidth={2} className="text-gold mt-0.5 shrink-0" /> {g}
            </motion.li>
          ))}
        </ul>
        <button
          data-testid={ctaTestid}
          onClick={onClick}
          className="relative overflow-hidden mt-7 rounded-full bg-gradient-to-b from-champagne to-gold text-charcoal font-bold text-sm sm:text-base px-6 py-4 hover:shadow-[0_12px_36px_rgba(197,155,39,0.45)] transition-shadow active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="gold-shine" aria-hidden="true" />
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
  const [objIdx, setObjIdx] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setReports((r) => r + 1), 18000);
    const t2 = setInterval(() => setPeople((p) => Math.max(47, Math.min(63, p + (Math.random() > 0.5 ? 1 : -1)))), 4000);
    const t3 = setInterval(() => setOrderIdx((i) => i + 1), 4000);
    const t4 = setInterval(() => setObjIdx((i) => (i + 1) % t.v4.objectionLines.length), 3600);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); };
  }, [t]);

  const order = ORDER_FEED[orderIdx % ORDER_FEED.length];
  const orderAction = orderIdx % 3 === 2 ? t.v4.orderBlueprint : t.v4.orderBooked;

  return (
    <section id="plans" className="relative py-20 sm:py-24 overflow-hidden" data-testid="plans-section">
      <div className="absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),transparent_65%)] blur-3xl animate-pulse-soft pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(197,155,39,0.16),transparent_65%)] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.v4.plansEyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-charcoal">
            {t.v4.plansTitle} <TitleRotator words={t.v4.planWords} />
          </h2>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <PlanCard
            testid="plan-card-99" ctaTestid="plan-99-cta" badge={t.v4.basicBadge}
            price="₹99" title={t.v4.plan99Title} tag={t.consult.title}
            items={t.v4.plan99Items} cta={t.v4.plan99Cta}
            onClick={() => openBooking("consultation")}
          />
          <PlanCard
            testid="plan-card-149" ctaTestid="plan-149-cta" delay={0.08}
            price="₹399" title={t.v4.plan149Title} tag={t.v3.bpLine} badge={t.v4.cheapestBadge}
            items={t.v4.plan149Items} cta={t.v4.plan149Cta}
            onClick={() => openBooking("blueprint")}
          />
          <PlanCard
            testid="plan-card-299" ctaTestid="plan-299-cta" delay={0.16}
            price="₹299" title={t.v4.plan299Title} tag={t.v4.plan299Tag} badge={t.v4.bestValue}
            items={t.v4.plan299Items} cta={t.v4.plan299Cta}
            onClick={() => openBooking("bundle")}
          />
        </div>

        <Reveal className="mt-12">
          <div className="border-l-2 border-gold pl-6 py-2 max-w-2xl min-h-[96px]" data-testid="objection-block">
            <AnimatePresence mode="wait">
              <motion.p
                key={objIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif italic text-xl sm:text-2xl text-charcoal leading-snug"
                data-testid="objection-rotator"
              >
                {t.v4.objectionLines[objIdx]}
              </motion.p>
            </AnimatePresence>
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

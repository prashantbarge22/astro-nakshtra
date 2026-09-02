import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import { useLang } from "../i18n";

const WORLD_MAP = "https://images.unsplash.com/photo-1524661135-423995f22d0b?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80";

const GWALIOR = { x: 672, y: 178 };
const ORIGINS = [
  { name: "New York", x: 262, y: 150 },
  { name: "London", x: 468, y: 100 },
  { name: "Dubai", x: 598, y: 185 },
  { name: "Singapore", x: 762, y: 252 },
  { name: "Sydney", x: 885, y: 332 },
];

const arc = (o) => {
  const cx = (o.x + GWALIOR.x) / 2;
  const cy = Math.min(o.y, GWALIOR.y) - 90;
  return `M ${o.x} ${o.y} Q ${cx} ${cy} ${GWALIOR.x} ${GWALIOR.y}`;
};

const TICKER = [
  ["Ritu", "Jaipur"], ["Farhan", "Dubai"], ["Meera", "London"], ["Dev", "Pune"],
  ["Sana", "New York"], ["Arnav", "Singapore"], ["Zoya", "Sydney"], ["Kabir", "Lucknow"],
];

export default function LiveMap() {
  const { t } = useLang();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t2 = setInterval(() => setTick((i) => i + 1), 4200);
    return () => clearInterval(t2);
  }, []);

  const order = TICKER[tick % TICKER.length];

  return (
    <section className="py-20 sm:py-24 bg-charcoal text-ivory" data-testid="live-map-section">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <Reveal className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight">{t.v4.mapTitle}</h2>
          <p className="mt-3 text-ivory/60 text-sm sm:text-base">{t.v4.mapSub}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative mt-12 rounded-3xl border border-ivory/10 overflow-hidden aspect-[4/3] sm:aspect-[21/9]" data-testid="live-map-panel">
            <img
              src={WORLD_MAP}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
              style={{ filter: "grayscale(0.8) sepia(0.35) brightness(0.7)" }}
              loading="lazy"
            />
            <svg viewBox="0 0 1000 480" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              {ORIGINS.map((o, i) => (
                <g key={o.name}>
                  <motion.path
                    d={arc(o)}
                    fill="none"
                    stroke="#C59B27"
                    strokeWidth="1.2"
                    strokeDasharray="6 6"
                    opacity="0.55"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.3 + i * 0.25, ease: "easeInOut" }}
                  />
                  <circle r="4" fill="#D4AF37">
                    <animateMotion dur={`${3 + i * 0.7}s`} repeatCount="indefinite" path={arc(o)} begin={`${i * 0.6}s`} />
                  </circle>
                  <circle cx={o.x} cy={o.y} r="3" fill="#C59B27" opacity="0.8" />
                </g>
              ))}
              <motion.circle
                cx={GWALIOR.x} cy={GWALIOR.y} fill="#D4AF37"
                animate={{ r: [6, 10, 6], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx={GWALIOR.x} cy={GWALIOR.y} fill="none" stroke="#D4AF37" strokeWidth="1.5"
                animate={{ r: [10, 34], opacity: [0.7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
            </svg>
            <span
              className="absolute text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-champagne bg-charcoal/70 backdrop-blur px-3 py-1.5 rounded-full border border-gold/40"
              style={{ left: `${(GWALIOR.x / 1000) * 100}%`, top: `${(GWALIOR.y / 480) * 100}%`, transform: "translate(14px, -50%)" }}
              data-testid="gwalior-marker"
            >
              Gwalior
            </span>
            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tick}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-xs sm:text-sm text-ivory/85 bg-charcoal/70 backdrop-blur px-4 py-2 rounded-full border border-gold/25"
                  data-testid="map-order-ticker"
                >
                  <span className="text-champagne">✦</span> <span className="font-semibold">{order[0]}</span> {t.v3.from} {order[1]} {tick % 3 === 2 ? t.v4.orderBlueprint : t.v4.orderBooked}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

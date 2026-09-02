import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import { useLang } from "../i18n";
import StarCanvas from "./StarCanvas";

const CITIES = [
  { name: "Delhi", x: 30, y: 16 }, { name: "Jaipur", x: 24, y: 28 },
  { name: "Lucknow", x: 40, y: 22 }, { name: "Ahmedabad", x: 18, y: 44 },
  { name: "Mumbai", x: 16, y: 60 }, { name: "Kolkata", x: 66, y: 38 },
  { name: "Hyderabad", x: 34, y: 58 }, { name: "Pune", x: 20, y: 64 },
  { name: "Bengaluru", x: 30, y: 80 }, { name: "Chennai", x: 38, y: 76 },
];

const TICKER = [
  ["Ritu", "Jaipur"], ["Farhan", "Delhi"], ["Meera", "Kochi"], ["Dev", "Pune"],
  ["Sana", "Mumbai"], ["Arnav", "Bengaluru"], ["Zoya", "Hyderabad"], ["Kabir", "Lucknow"],
];

export default function LiveMap() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setActive((i) => (i + 1) % CITIES.length), 2200);
    const t2 = setInterval(() => setTick((i) => i + 1), 4200);
    return () => { clearInterval(t1); clearInterval(t2); };
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
          <div className="relative mt-12 rounded-3xl border border-ivory/10 overflow-hidden aspect-[16/9] sm:aspect-[21/9]"
            style={{ backgroundImage: "radial-gradient(rgba(212,175,55,0.14) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
            data-testid="live-map-panel"
          >
            <div className="absolute inset-0 opacity-40"><StarCanvas density={50} /></div>
            {CITIES.map((c, i) => (
              <div key={c.name} className="absolute" style={{ left: `${c.x}%`, top: `${c.y}%` }} data-testid={`map-city-${i}`}>
                <span className={`block h-2 w-2 rounded-full ${i === active ? "bg-champagne" : "bg-gold/50"}`} />
                {i === active && (
                  <motion.span
                    key={active}
                    initial={{ scale: 0.4, opacity: 0.9 }}
                    animate={{ scale: 3.4, opacity: 0 }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-gold/60"
                  />
                )}
                <AnimatePresence>
                  {i === active && (
                    <motion.span
                      key={`label-${active}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-3 -top-1 text-[10px] uppercase tracking-[0.18em] text-champagne whitespace-nowrap"
                    >
                      {c.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tick}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-xs sm:text-sm text-ivory/80 bg-charcoal/70 backdrop-blur px-4 py-2 rounded-full border border-gold/25"
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

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Globe from "react-globe.gl";
import { Reveal } from "./Reveal";
import { useLang } from "../i18n";

const HQ = { name: "Astro Nakshatra HQ", lat: 26.2183, lng: 78.1828 };
const CITY_POOL = [
  { name: "New York", lat: 40.71, lng: -74.0 },
  { name: "London", lat: 51.5, lng: -0.12 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Singapore", lat: 1.35, lng: 103.8 },
  { name: "Sydney", lat: -33.87, lng: 151.2 },
  { name: "Toronto", lat: 43.65, lng: -79.38 },
  { name: "Doha", lat: 25.28, lng: 51.53 },
  { name: "Auckland", lat: -36.85, lng: 174.76 },
  { name: "Berlin", lat: 52.52, lng: 13.4 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Mumbai", lat: 19.07, lng: 72.87 },
  { name: "Delhi", lat: 28.61, lng: 77.2 },
  { name: "Bengaluru", lat: 12.97, lng: 77.59 },
  { name: "Kolkata", lat: 22.57, lng: 88.36 },
  { name: "Chennai", lat: 13.08, lng: 80.27 },
  { name: "Jaipur", lat: 26.9, lng: 75.8 },
];

const TICKER = [
  ["Ritu", "Jaipur"], ["Farhan", "Dubai"], ["Meera", "London"], ["Dev", "Pune"],
  ["Sana", "New York"], ["Arnav", "Singapore"], ["Zoya", "Sydney"], ["Kabir", "Lucknow"],
];

export default function LiveMap() {
  const { t } = useLang();
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 480 });
  const [live, setLive] = useState(38);
  const [orders, setOrders] = useState(23);
  const [totalVisitors, setTotalVisitors] = useState(12483);
  const [ordersToday, setOrdersToday] = useState(1264);
  const [tick, setTick] = useState(0);
  const [arcRound, setArcRound] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth;
      setSize({ w, h: Math.min(560, Math.max(360, Math.round(w * 0.55))) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t1 = setInterval(() => setLive((v) => Math.max(30, Math.min(55, v + (Math.random() > 0.5 ? 1 : -1)))), 3500);
    const t2 = setInterval(() => setOrders((v) => v + 1), 20000);
    const t3 = setInterval(() => setTick((i) => i + 1), 4200);
    const t4 = setInterval(() => setTotalVisitors((v) => v + 7), 6000);
    const t5 = setInterval(() => setOrdersToday((v) => v + 1), 18000);
    const t6 = setInterval(() => setArcRound((r) => r + 1), 9000);
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearInterval);
  }, []);

  const { arcs, points } = useMemo(() => {
    const rotated = [...CITY_POOL.slice(arcRound % CITY_POOL.length), ...CITY_POOL.slice(0, arcRound % CITY_POOL.length)];
    const active = rotated.slice(0, 10);
    return {
      arcs: active.map((o, i) => ({
        startLat: o.lat, startLng: o.lng, endLat: HQ.lat, endLng: HQ.lng,
        dash: 0.25 + (i % 3) * 0.18,
        gap: 0.12 + (i % 4) * 0.09,
        time: 1300 + i * 340,
        alt: 0.22 + (i % 3) * 0.14,
      })),
      points: [...active, HQ],
    };
  }, [arcRound]);

  const order = TICKER[tick % TICKER.length];

  const chips = [
    { id: "globe-live-visitors", value: `${live}+`, label: t.v4.liveVisitors, blink: true },
    { id: "globe-live-orders", value: `${orders}+`, label: t.v4.ordersLive, blink: false },
    { id: "globe-total-visitors", value: totalVisitors.toLocaleString("en-IN"), label: t.v4.totalVisitors, blink: false },
    { id: "globe-orders-today", value: ordersToday.toLocaleString("en-IN"), label: t.v4.ordersToday, blink: false },
  ];

  return (
    <section className="py-20 sm:py-24 bg-charcoal text-ivory" data-testid="live-map-section">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <Reveal className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight max-w-3xl mx-auto leading-snug">{t.v4.mapTitle}</h2>
          <p className="mt-3 text-ivory/60 text-sm sm:text-base max-w-2xl mx-auto">{t.v4.mapSub}</p>
          <p className="mt-2 font-serif italic text-champagne text-base sm:text-lg" data-testid="map-trust-tagline">{t.v4.mapTrust}</p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {chips.map((c) => (
              <div key={c.id} className="flex items-center gap-2.5 bg-ivory/5 border border-gold/25 rounded-full px-5 py-2.5" data-testid={c.id}>
                {c.blink && <span className="inline-block h-2 w-2 rounded-full bg-gold animate-blink-dot" />}
                <span className="font-deco text-lg sm:text-xl text-champagne">{c.value}</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/60 font-semibold">{c.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div ref={wrapRef} className="relative mt-8 rounded-3xl border border-ivory/10 overflow-hidden bg-[#0d0d0f]" data-testid="globe-panel">
            <Globe
              width={size.w}
              height={size.h}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              arcsData={arcs}
              arcColor={() => ["#FFD700", "#C59B27"]}
              arcDashLength={(d) => d.dash}
              arcDashGap={(d) => d.gap}
              arcDashAnimateTime={(d) => d.time}
              arcAltitude={(d) => d.alt}
              arcStroke={1.1}
              pointsData={points}
              pointColor={(d) => (d.name === "Astro Nakshatra HQ" ? "#FFD700" : "#C59B27")}
              pointAltitude={(d) => (d.name === "Astro Nakshatra HQ" ? 0.05 : 0.015)}
              pointRadius={(d) => (d.name === "Astro Nakshatra HQ" ? 0.9 : 0.5)}
              labelsData={[HQ]}
              labelText="name"
              labelSize={2.4}
              labelColor={() => "#D4AF37"}
              labelDotRadius={0.4}
              autoRotate
              autoRotateSpeed={0.35}
              enableZoom={false}
            />
            <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-ivory/40 font-semibold pointer-events-none" data-testid="globe-drag-hint">
              {t.v4.dragHint}
            </p>
            <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
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

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

const DESTINY_IMG = "https://images.unsplash.com/photo-1429305336325-b84ace7eba3b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxzdWJ0bGUlMjBuaWdodCUyMHNreSUyMHN0YXJzJTIwdGV4dHVyZSUyMGxpZ2h0fGVufDB8fHx8MTc4ODIwNjA0N3ww&ixlib=rb-4.1.0&q=85";

const CountUp = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const numeric = parseFloat(value.replace(/,/g, ""));
  const suffix = value.includes("+") ? "+" : "";
  const decimals = value.includes(".") ? 1 : 0;
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, numeric, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(decimals ? v.toFixed(1) : Math.round(v).toLocaleString("en-IN")),
    });
    return () => controls.stop();
  }, [inView, numeric, decimals]);
  return <span ref={ref}>{display}{suffix}</span>;
};

export default function Astrologer() {
  const { t } = useLang();
  return (
    <section id="astrologer" className="py-20 sm:py-24" data-testid="astrologer-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.10)]" data-testid="astrologer-destiny-image">
            <img src={DESTINY_IMG} alt="A sky of stars — destiny" className="w-full aspect-[16/10] sm:aspect-[21/9] object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
            <p className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 font-serif italic text-2xl sm:text-3xl lg:text-4xl text-ivory leading-snug max-w-2xl" data-testid="astrologer-trust-line">
              {t.astrologer.trust}
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid lg:grid-cols-2 gap-10 items-start">
          <Reveal delay={0.05}>
            <Eyebrow>{t.astrologer.eyebrow}</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-tight leading-tight text-charcoal">{t.astrologer.name}</h2>
            <p className="mt-4 text-smoke text-sm sm:text-base leading-relaxed max-w-md">{t.astrologer.p1}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-4 lg:pt-12">
              {t.astrologer.stats.map((s, i) => (
                <div key={i} data-testid={`astrologer-stat-${i}`} className="border-t border-gold/30 pt-4">
                  <p className="font-serif text-3xl sm:text-4xl text-charcoal">
                    <CountUp value={s.n} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-smoke">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

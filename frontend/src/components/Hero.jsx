import { useContext, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { useLang } from "../i18n";
import { BookingContext } from "../App";
import StarCanvas from "./StarCanvas";

const MaskedLine = ({ children, delay, className = "" }) => (
  <span className={`block overflow-hidden pb-1 ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const starsY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden">
      <motion.div style={{ y: starsY }} className="absolute inset-0 pointer-events-none">
        <StarCanvas density={100} />
      </motion.div>
      <motion.svg
        viewBox="0 0 220 180"
        className="absolute right-[8%] top-[16%] w-36 sm:w-52 opacity-70 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2, duration: 1 }}
        aria-hidden="true"
      >
        <motion.path
          d="M30 140 L80 70 L130 105 L185 35"
          stroke="#C59B27" strokeWidth="0.8" fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.6, delay: 1.3, ease: "easeInOut" }}
        />
        {[[30, 140], [80, 70], [130, 105], [185, 35]].map(([cx, cy], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r="2.4" fill="#C59B27"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 1.3 + i * 0.55, duration: 0.5 }} />
        ))}
      </motion.svg>

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pt-28 pb-20 w-full text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-gold mb-8"
          data-testid="hero-eyebrow"
        >
          {t.hero.eyebrow}
        </motion.p>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.12] tracking-tight text-charcoal" data-testid="hero-heading">
          <MaskedLine delay={0.25}>{t.final.h1}</MaskedLine>
        </h1>
        <h2 className="font-serif italic text-xl sm:text-2xl lg:text-3xl leading-snug text-gold mt-5">
          <MaskedLine delay={0.42}>{t.final.h2}</MaskedLine>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 font-deco text-[11px] sm:text-xs uppercase tracking-[0.35em] text-smoke/80"
          data-testid="hero-tagline"
        >
          {t.hero.l1.replace(/\.$/, "")} <span className="text-gold mx-1">✦</span> {t.hero.l2.replace(/\.$/, "")} <span className="text-gold mx-1">✦</span> {t.hero.l3.replace(/\.$/, "")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-sm sm:text-base uppercase tracking-[0.22em] text-smoke font-medium"
          data-testid="hero-subline"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5"
        >
          <button
            data-testid="hero-book-button"
            onClick={() => openBooking("consultation")}
            className="rounded-full bg-champagne text-charcoal font-semibold text-sm sm:text-base px-8 sm:px-10 py-4 tracking-wide hover:bg-gold transition-colors active:scale-[0.98] shadow-[0_10px_36px_rgba(197,155,39,0.35)]"
          >
            {t.hero.cta}
          </button>
          <span data-testid="limited-slots-indicator" className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-smoke">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-pulse-soft" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
            </span>
            {t.hero.limited}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          data-testid="hero-trust-row"
        >
          <span className="flex items-center gap-2">
            <span className="flex text-champagne">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" strokeWidth={0} />)}
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-charcoal">{t.hero.rating}</span>
          </span>
          <span className="h-3 w-px bg-gold/40" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-smoke">{t.hero.customers}</span>
          <span className="h-3 w-px bg-gold/40" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-smoke">{t.hero.experience}</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-smoke/60"
      >
        {t.hero.scroll}
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block w-px h-8 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}

import { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Star, X } from "lucide-react";
import { useLang } from "../i18n";
import { BookingContext } from "../App";
import StarCanvas from "./StarCanvas";
import { CountUp } from "./Reveal";

const GOLD_STARS_BG = "https://images.unsplash.com/photo-1462331940025-496dfbfc7569?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80";

const PEOPLE = [
  ["Aarav", "Maharashtra"], ["Priya", "Karnataka"], ["Rohit", "Delhi"],
  ["Sneha", "Gujarat"], ["Arjun", "Punjab"], ["Kavya", "Tamil Nadu"],
  ["Vikram", "Rajasthan"], ["Ananya", "West Bengal"], ["Kabir", "Uttar Pradesh"],
  ["Meera", "Kerala"], ["Ishan", "Madhya Pradesh"], ["Divya", "Telangana"],
];

const ShootingStars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" data-testid="shooting-stars">
    {[
      { "--t": "12%", "--r": "8%", "--d": "7s", "--dl": "0s" },
      { "--t": "30%", "--r": "22%", "--d": "9s", "--dl": "2.8s" },
      { "--t": "6%", "--r": "40%", "--d": "11s", "--dl": "5.2s" },
    ].map((style, i) => (
      <span key={i} className="shooting-star" style={style} />
    ))}
  </div>
);

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

const RotatingWords = ({ words }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((w) => (w + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="inline-flex justify-center min-w-[16ch]" data-testid="hero-rotating-word">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-deco text-xs sm:text-sm uppercase tracking-[0.35em] text-gold"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const BookingNotifications = () => {
  const { t } = useLang();
  const [note, setNote] = useState(null);
  useEffect(() => {
    let showT, hideT;
    const cycle = () => {
      const [name, state] = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
      const action = Math.random() > 0.45 ? t.v3.notifyBooked : t.v3.notifyBlueprint;
      setNote({ name, state, action, key: Date.now() });
      hideT = setTimeout(() => setNote(null), 3400);
      showT = setTimeout(cycle, 5000);
    };
    showT = setTimeout(cycle, 4500);
    return () => { clearTimeout(showT); clearTimeout(hideT); };
  }, [t]);
  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-40 pointer-events-none max-w-[280px]">
      <AnimatePresence>
        {note && (
          <motion.div
            key={note.key}
            initial={{ x: -70, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -70, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 bg-ivory/95 backdrop-blur border border-gold/25 rounded-xl px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.12)]"
            data-testid="booking-notification"
          >
            <span className="text-champagne shrink-0"><Star size={14} fill="currentColor" strokeWidth={0} /></span>
            <p className="text-xs text-smoke leading-snug">
              <span className="font-semibold text-charcoal">{note.name}</span> {t.v3.from} {note.state} {note.action}
            </p>
            <button onClick={() => setNote(null)} className="text-smoke/50 hover:text-charcoal shrink-0" aria-label="Dismiss" data-testid="notification-dismiss">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Hero() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const starsY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const words = [t.hero.l1, t.hero.l2, t.hero.l3].map((w) => w.replace(/\.$/, "").replace(/।$/, ""));

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden">
      <img
        src={GOLD_STARS_BG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.17] pointer-events-none"
        style={{ filter: "sepia(0.7) hue-rotate(-15deg) brightness(1.15)" }}
      />
      <ShootingStars />
      <motion.div style={{ y: starsY }} className="absolute inset-0 pointer-events-none">
        <StarCanvas density={100} />
      </motion.div>

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

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 font-serif italic text-base sm:text-lg text-smoke"
          data-testid="hero-trust-tagline"
        >
          {t.v3.trustLine}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="mt-6"
        >
          <RotatingWords words={words} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-sm sm:text-base uppercase tracking-[0.22em] font-medium text-shimmer"
          data-testid="hero-subline"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <motion.button
            data-testid="hero-book-button"
            onClick={() => openBooking("consultation")}
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full bg-champagne text-charcoal font-bold text-lg sm:text-xl px-12 sm:px-16 py-5 sm:py-6 tracking-wide hover:bg-gold transition-colors active:scale-[0.98] shadow-[0_16px_48px_rgba(197,155,39,0.45)]"
          >
            {t.hero.cta}
          </motion.button>
          <span data-testid="limited-slots-indicator" className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-smoke">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-ping opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold animate-blink-dot" />
            </span>
            {t.hero.limited}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
          data-testid="hero-trust-row"
        >
          <span className="flex items-center gap-2">
            <span className="flex text-champagne">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" strokeWidth={0} />)}
            </span>
            <span className="font-serif text-xl text-charcoal"><CountUp value="4.9" /></span>
          </span>
          <span className="h-4 w-px bg-gold/40" />
          <span className="flex items-baseline gap-2">
            <span className="font-serif text-xl text-charcoal" data-testid="hero-customers-count"><CountUp value="5,000+" /></span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-smoke">customers</span>
          </span>
          <span className="h-4 w-px bg-gold/40" />
          <span className="flex items-baseline gap-2">
            <span className="font-serif text-xl text-charcoal"><CountUp value="40+" /></span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-smoke">years</span>
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-smoke/60"
      >
        {t.hero.scroll}
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block w-px h-8 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>

      <BookingNotifications />
    </section>
  );
}

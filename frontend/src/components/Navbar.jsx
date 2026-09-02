import { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Timer } from "lucide-react";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "gu", label: "ગુજરાતી", soon: true },
  { code: "sd", label: "سنڌي", soon: true },
  { code: "mr", label: "मराठी", soon: true },
  { code: "ta", label: "தமிழ்", soon: true },
  { code: "bn", label: "বাংলা", soon: true },
  { code: "pa", label: "ਪੰਜਾਬੀ", soon: true },
];

export const LangSwitch = ({ className = "" }) => {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        data-testid="lang-switch"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase text-smoke hover:text-charcoal transition-colors"
        aria-label="Choose language"
      >
        <Globe size={14} className="text-gold" /> {lang === "en" ? "EN" : "हिंदी"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 top-8 w-44 bg-ivory border border-gold/25 rounded-xl shadow-xl py-2 z-50"
            data-testid="lang-menu"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                data-testid={`lang-option-${l.code}`}
                disabled={l.soon}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                  l.soon ? "text-smoke/40 cursor-not-allowed" : "text-charcoal hover:bg-cream"
                } ${lang === l.code ? "text-gold font-semibold" : ""}`}
              >
                {l.label}
                {l.soon && <span className="text-[10px] uppercase tracking-wider">soon</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OfferTimer = () => {
  const [secs, setSecs] = useState(600);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s <= 1 ? 600 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <motion.span
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gold"
      data-testid="offer-timer"
    >
      <Timer size={13} /> {mm}:{ss} left
    </motion.span>
  );
};

export default function Navbar() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  const links = [
    { href: "#why", label: t.nav.why, id: "nav-link-why" },
    { href: "#ask", label: t.nav.ask, id: "nav-link-ask" },
    { href: "#astrologer", label: t.nav.astrologer, id: "nav-link-astrologer" },
  ];
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 bg-ivory/80 backdrop-blur-md border-b border-charcoal/5"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <a href="#top" data-testid="nav-brand" className="font-deco text-base sm:text-lg tracking-[0.22em] text-charcoal">
          ASTRO <span className="text-gold">NAKSHATRA</span>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} data-testid={l.id} className="text-sm text-smoke hover:text-charcoal transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 sm:gap-5">
          <OfferTimer />
          <LangSwitch />
          <button
            data-testid="nav-book-button"
            onClick={() => openBooking("consultation")}
            className="rounded-full bg-charcoal text-ivory text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2.5 hover:bg-gold hover:text-charcoal transition-colors active:scale-[0.98]"
          >
            {t.nav.book}
          </button>
        </div>
      </div>
    </motion.header>
  );
}

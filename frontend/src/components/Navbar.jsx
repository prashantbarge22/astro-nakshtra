import { useContext } from "react";
import { motion } from "framer-motion";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

export const LangSwitch = ({ className = "" }) => {
  const { lang, setLang } = useLang();
  return (
    <button
      data-testid="lang-switch"
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className={`text-xs font-semibold tracking-[0.15em] uppercase text-smoke hover:text-charcoal transition-colors ${className}`}
      aria-label="Switch language"
    >
      <span className={lang === "en" ? "text-gold" : ""}>EN</span>
      <span className="mx-1.5 text-charcoal/30">|</span>
      <span className={lang === "hi" ? "text-gold" : ""}>हिंदी</span>
    </button>
  );
};

export default function Navbar() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  const links = [
    { href: "#why", label: t.nav.why, id: "nav-link-why" },
    { href: "#ask", label: t.nav.ask, id: "nav-link-ask" },
    { href: "#how", label: t.nav.how, id: "nav-link-how" },
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
        <a href="#top" data-testid="nav-brand" className="font-serif text-lg sm:text-xl tracking-wide text-charcoal">
          ASTRO <span className="italic text-gold">Nakshatra</span>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} data-testid={l.id} className="text-sm text-smoke hover:text-charcoal transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
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

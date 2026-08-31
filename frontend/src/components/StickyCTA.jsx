import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

export default function StickyCTA() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-ivory/90 backdrop-blur-md border-t border-gold/20 px-5 py-3.5 flex items-center justify-between gap-4"
          data-testid="sticky-cta"
        >
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-smoke">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-pulse-soft" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            {t.sticky.limited}
          </span>
          <button
            data-testid="sticky-book-button"
            onClick={() => openBooking("consultation")}
            className="rounded-full bg-champagne text-charcoal font-semibold text-sm px-6 py-3 active:scale-[0.98]"
          >
            {t.sticky.cta}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

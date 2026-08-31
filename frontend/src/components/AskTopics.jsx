import { useContext } from "react";
import { motion } from "framer-motion";
import { Briefcase, Heart, Users, Coins, HeartPulse, Compass, Gem } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

const icons = [Briefcase, Heart, Users, Coins, HeartPulse, Compass, Gem];
const STAR_BG = "https://images.unsplash.com/photo-1429305336325-b84ace7eba3b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxzdWJ0bGUlMjBuaWdodCUyMHNreSUyMHN0YXJzJTIwdGV4dHVyZSUyMGxpZ2h0fGVufDB8fHx8MTc4ODIwNjA0N3ww&ixlib=rb-4.1.0&q=85";

export default function AskTopics() {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  return (
    <section id="ask" className="py-14 sm:py-16" data-testid="ask-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden border border-gold/20">
            <img src={STAR_BG} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-b from-ivory/70 via-ivory/40 to-ivory/85" />
            <div className="relative px-6 py-12 sm:py-14 text-center">
              <p className="font-deco text-3xl sm:text-4xl lg:text-5xl tracking-wide text-charcoal" data-testid="ask-eyebrow-big">
                {t.ask.eyebrow}
              </p>
              <h2 className="mt-3 text-xs sm:text-sm uppercase tracking-[0.25em] text-smoke font-semibold">{t.ask.title}</h2>
            </div>
          </div>
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.ask.topics.map((topic, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={i} delay={0.04 * (i % 4)}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  data-testid={`topic-card-${i}`}
                  className="h-full bg-cream/60 border border-charcoal/8 rounded-2xl p-5 group"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold group-hover:bg-gold group-hover:text-ivory transition-colors duration-300">
                    <Icon size={17} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-serif text-lg text-charcoal leading-snug">{topic.h}</h3>
                  <p className="mt-2 text-smoke text-sm leading-relaxed">{topic.p}</p>
                </motion.div>
              </Reveal>
            );
          })}
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl bg-charcoal text-ivory p-5 flex flex-col justify-center gap-3" data-testid="topic-card-reminder">
              <p className="font-serif italic text-lg leading-snug">{t.v3.remindTitle}</p>
              <p className="text-ivory/60 text-sm leading-relaxed">{t.v3.remindLine}</p>
              <button
                data-testid="ask-book-button"
                onClick={() => openBooking("consultation")}
                className="mt-1 w-fit rounded-full bg-champagne text-charcoal text-sm font-semibold px-5 py-2.5 hover:bg-gold transition-colors active:scale-[0.98]"
              >
                {t.nav.book}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

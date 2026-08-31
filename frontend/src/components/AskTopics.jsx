import { motion } from "framer-motion";
import { Briefcase, Heart, Users, Coins, HeartPulse, Compass, Gem } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

const icons = [Briefcase, Heart, Users, Coins, HeartPulse, Compass, Gem];

export default function AskTopics() {
  const { t } = useLang();
  return (
    <section id="ask" className="py-24 sm:py-32" data-testid="ask-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.ask.eyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal max-w-3xl">{t.ask.title}</h2>
          <p className="mt-5 text-smoke text-base sm:text-lg max-w-2xl leading-relaxed">{t.ask.sub}</p>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.ask.topics.map((topic, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={i} delay={0.05 * (i % 3)} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  data-testid={`topic-card-${i}`}
                  className="h-full bg-cream/60 border border-charcoal/8 rounded-2xl p-7 sm:p-8 group"
                >
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-gold/30 text-gold group-hover:bg-gold group-hover:text-ivory transition-colors duration-300">
                    <Icon size={19} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl sm:text-2xl text-charcoal leading-snug">{topic.h}</h3>
                  <p className="mt-3 text-smoke text-sm sm:text-base leading-relaxed">{topic.p}</p>
                </motion.div>
              </Reveal>
            );
          })}
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-dashed border-gold/40 p-7 sm:p-8 flex flex-col justify-center bg-ivory" data-testid="topic-card-anything">
              <p className="font-serif italic text-xl sm:text-2xl text-gold leading-snug">“You ask. We listen. We guide.”</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

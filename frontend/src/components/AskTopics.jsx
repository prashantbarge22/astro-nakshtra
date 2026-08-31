import { motion } from "framer-motion";
import { Briefcase, Heart, Users, Coins, HeartPulse, Compass, Gem } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

const icons = [Briefcase, Heart, Users, Coins, HeartPulse, Compass, Gem];

export default function AskTopics() {
  const { t } = useLang();
  return (
    <section id="ask" className="py-16 sm:py-20" data-testid="ask-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.ask.eyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight leading-tight text-charcoal max-w-3xl">{t.ask.title}</h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.ask.topics.map((topic, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={i} delay={0.04 * (i % 4)}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  data-testid={`topic-card-${i}`}
                  className="h-full bg-cream/60 border border-charcoal/8 rounded-2xl p-6 group"
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
            <div className="h-full rounded-2xl border border-dashed border-gold/40 p-6 flex flex-col justify-center bg-ivory" data-testid="topic-card-anything">
              <p className="font-serif italic text-lg text-gold leading-snug">“You ask. We listen. We guide.”</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

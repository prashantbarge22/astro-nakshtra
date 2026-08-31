import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

const HANDS_IMG = "https://images.unsplash.com/photo-1564020435666-f67ed5319a32?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHx0d28lMjBoYW5kcyUyMGdlbnRseSUyMGhvbGRpbmclMjBzdXBwb3J0JTIwdHJ1c3R8ZW58MHx8fHwxNzg4MjA2MDQ4fDA&ixlib=rb-4.1.0&q=85";

export default function WhyUs() {
  const { t } = useLang();
  return (
    <section id="why" className="py-16 sm:py-20 bg-cream/50" data-testid="why-us-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.why.eyebrow}</Eyebrow>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight leading-snug text-charcoal max-w-xl">{t.why.title}</h2>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Reveal className="sm:col-span-2">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
              className="relative h-full rounded-2xl overflow-hidden"
              data-testid="why-hands-image"
            >
              <img src={HANDS_IMG} alt="Two hands gently holding" className="w-full aspect-[16/9] sm:h-full sm:aspect-auto object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <p className="absolute bottom-5 left-5 right-5 font-serif italic text-lg text-ivory leading-snug">
                {t.why.imageCaption}
              </p>
            </motion.div>
          </Reveal>
          {t.why.items.map((item, i) => (
            <Reveal key={i} delay={0.04 * (i % 3)}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4 }}
                data-testid={`why-card-${i}`}
                className="h-full bg-ivory border border-charcoal/8 rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
              >
                <span className="font-deco text-sm text-champagne">0{i + 1}</span>
                <h3 className="mt-2.5 font-serif text-base sm:text-lg text-charcoal leading-snug">{item.h}</h3>
                <p className="mt-1.5 text-smoke text-sm leading-relaxed">{item.p}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

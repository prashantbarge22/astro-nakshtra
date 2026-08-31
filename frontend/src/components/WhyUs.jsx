import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

const HANDS_IMG = "https://images.unsplash.com/photo-1564020435666-f67ed5319a32?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHx0d28lMjBoYW5kcyUyMGdlbnRseSUyMGhvbGRpbmclMjBzdXBwb3J0JTIwdHJ1c3R8ZW58MHx8fHwxNzg4MjA2MDQ4fDA&ixlib=rb-4.1.0&q=85";

export default function WhyUs() {
  const { t } = useLang();
  return (
    <section id="why" className="py-24 sm:py-32 bg-cream/50" data-testid="why-us-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.why.eyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal max-w-3xl">{t.why.title}</h2>
          <p className="mt-5 text-smoke text-base sm:text-lg max-w-2xl leading-relaxed">{t.why.sub}</p>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Reveal className="sm:row-span-2">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
              className="relative h-full min-h-[320px] rounded-2xl overflow-hidden"
              data-testid="why-hands-image"
            >
              <img src={HANDS_IMG} alt="Two hands gently holding" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <p className="absolute bottom-6 left-6 right-6 font-serif italic text-xl text-ivory leading-snug">
                {t.why.imageCaption}
              </p>
            </motion.div>
          </Reveal>
          {t.why.items.map((item, i) => (
            <Reveal key={i} delay={0.05 * (i % 3)}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4 }}
                data-testid={`why-card-${i}`}
                className="h-full bg-ivory border border-charcoal/8 rounded-2xl p-7 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
              >
                <span className="font-serif italic text-2xl text-champagne">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-xl sm:text-2xl text-charcoal leading-snug">{item.h}</h3>
                <p className="mt-3 text-smoke text-sm sm:text-base leading-relaxed">{item.p}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { useLang } from "../i18n";

const GEM_1 = "https://images.unsplash.com/photo-1609216970211-cc9814865e93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxnZW1zdG9uZSUyMG1hY3JvJTIwY3J5c3RhbHxlbnwwfHx8fDE3ODgyMDYwNTV8MA&ixlib=rb-4.1.0&q=85";
const GEM_2 = "https://images.pexels.com/photos/37955298/pexels-photo-37955298.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function Gemstones() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -20]);

  return (
    <section ref={ref} className="py-24 sm:py-32 overflow-hidden" data-testid="gemstones-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative h-[420px] sm:h-[520px]">
            <motion.div style={{ y: y1 }} className="absolute left-0 top-0 w-[62%] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
              <img src={GEM_1} alt="Natural gemstone macro" className="w-full h-72 sm:h-96 object-cover" loading="lazy" data-testid="gemstone-image-1" />
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute right-0 bottom-0 w-[52%] rounded-t-[8rem] rounded-b-2xl overflow-hidden border-4 border-ivory shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
              <img src={GEM_2} alt="Blue gemstone macro" className="w-full h-64 sm:h-80 object-cover" loading="lazy" data-testid="gemstone-image-2" />
            </motion.div>
          </div>
          <Reveal>
            <Eyebrow>{t.gems.eyebrow}</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal">{t.gems.title}</h2>
            <p className="mt-5 text-smoke text-base sm:text-lg leading-relaxed">{t.gems.sub}</p>
            <ul className="mt-8 space-y-3">
              {t.gems.points.map((p, i) => (
                <li key={i} data-testid={`gems-point-${i}`} className="flex items-center gap-3 text-charcoal font-medium text-sm sm:text-base">
                  <span className="text-gold">✦</span> {p}
                </li>
              ))}
            </ul>
            <a
              data-testid="gems-cta-button"
              href="https://wa.me/919999999999?text=I%20want%20to%20explore%20gemstones"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 rounded-full border border-charcoal text-charcoal font-semibold text-sm sm:text-base px-8 py-4 hover:bg-charcoal hover:text-ivory transition-colors active:scale-[0.98] inline-flex items-center gap-2"
            >
              {t.gems.cta} <ArrowUpRight size={17} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

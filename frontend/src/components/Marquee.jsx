import { useLang } from "../i18n";

export default function Marquee() {
  const { t } = useLang();
  const items = [...t.marquee, ...t.marquee];
  return (
    <div data-testid="editorial-marquee" className="border-y border-gold/15 bg-cream/60 py-5 overflow-hidden select-none" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-0">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="font-serif italic text-lg sm:text-xl text-charcoal/70 px-6">{item}</span>
                <span className="text-gold text-sm">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

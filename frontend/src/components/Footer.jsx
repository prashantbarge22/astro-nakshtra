import { Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import { useLang } from "../i18n";
import { LangSwitch } from "./Navbar";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-charcoal/10 bg-cream/60 py-14" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-10">
          <div>
            <p className="font-serif text-xl text-charcoal">ASTRO <span className="italic text-gold">Nakshatra</span></p>
            <p className="mt-2 text-sm text-smoke max-w-xs">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-smoke">
            <a data-testid="footer-phone" href="tel:+919999999999" className="flex items-center gap-2.5 hover:text-charcoal transition-colors">
              <Phone size={15} strokeWidth={1.5} className="text-gold" /> {t.footer.phone}
            </a>
            <a data-testid="footer-whatsapp" href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-charcoal transition-colors">
              <MessageCircle size={15} strokeWidth={1.5} className="text-gold" /> WhatsApp
            </a>
            <a data-testid="footer-email" href="mailto:care@astronakshatra.in" className="flex items-center gap-2.5 hover:text-charcoal transition-colors">
              <Mail size={15} strokeWidth={1.5} className="text-gold" /> {t.footer.email}
            </a>
            <a data-testid="footer-instagram" href="https://instagram.com/astronakshatra" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-charcoal transition-colors">
              <Instagram size={15} strokeWidth={1.5} className="text-gold" /> {t.footer.instagram}
            </a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-smoke/70 font-semibold">{t.footer.language}</span>
            <LangSwitch />
            <div className="flex gap-5 mt-2">
              <a data-testid="footer-privacy" href="#top" className="text-smoke hover:text-charcoal transition-colors">{t.footer.privacy}</a>
              <a data-testid="footer-terms" href="#top" className="text-smoke hover:text-charcoal transition-colors">{t.footer.terms}</a>
            </div>
          </div>
        </div>
        <p className="mt-12 pt-6 border-t border-charcoal/8 text-xs text-smoke/60">{t.footer.rights}</p>
      </div>
    </footer>
  );
}

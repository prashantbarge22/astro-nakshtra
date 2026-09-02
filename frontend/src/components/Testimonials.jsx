import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Reveal, Eyebrow, CountUp } from "./Reveal";
import { useLang } from "../i18n";
import { BookingContext } from "../App";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Stars = ({ size = 14 }) => (
  <span className="flex text-champagne gap-0.5">
    {[...Array(5)].map((_, i) => <Star key={i} size={size} fill="currentColor" strokeWidth={0} />)}
  </span>
);

const KundliBg = () => (
  <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] opacity-[0.05] animate-spin-slow pointer-events-none" aria-hidden="true">
    <g stroke="#C59B27" strokeWidth="1.5" fill="none">
      <rect x="40" y="40" width="320" height="320" />
      <rect x="40" y="40" width="320" height="320" transform="rotate(45 200 200)" />
      <line x1="40" y1="40" x2="360" y2="360" />
      <line x1="360" y1="40" x2="40" y2="360" />
      <line x1="200" y1="40" x2="200" y2="360" />
      <line x1="40" y1="200" x2="360" y2="200" />
    </g>
  </svg>
);

const REVIEW_POOL = [
  { text: "Worth every rupee.", name: "Ritu", place: "India" },
  { text: "Felt like talking to family.", name: "Farhan", place: "UAE" },
  { text: "Straight answers, no drama.", name: "Mei", place: "Singapore" },
  { text: "Booked again for next week.", name: "Aisha", place: "UK" },
  { text: "My chart finally made sense.", name: "Dev", place: "Canada" },
  { text: "Honest and to the point.", name: "Sana", place: "Australia" },
  { text: "The 20 minutes flew by.", name: "Arnav", place: "India" },
  { text: "Exactly what I needed to hear.", name: "Zoya", place: "USA" },
  { text: "No bots, just a real person.", name: "Karan", place: "India" },
  { text: "My blueprint was spot on.", name: "Lena", place: "Germany" },
  { text: "Clear direction in one call.", name: "Omar", place: "Qatar" },
  { text: "Best ₹99 I ever spent.", name: "Nidhi", place: "India" },
];

export default function Testimonials() {
  const { t } = useLang();
  const [slots, setSlots] = useState(56920);
  const [reviews, setReviews] = useState(REVIEW_POOL.slice(0, 6));
  const [nextIdx, setNextIdx] = useState(6);

  useEffect(() => {
    const t1 = setInterval(() => setSlots((s) => s + 2), 15000);
    const t2 = setInterval(() => {
      setReviews((r) => [REVIEW_POOL[nextIdx % REVIEW_POOL.length], ...r].slice(0, 6));
      setNextIdx((i) => i + 1);
    }, 6000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, [nextIdx]);

  return (
    <section className="relative py-20 sm:py-24 bg-cream/50 overflow-hidden" data-testid="testimonials-section">
      <KundliBg />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
        <Reveal>
          <Eyebrow>{t.testimonials.eyebrow}</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal">{t.testimonials.title}</h2>
          <p className="mt-4 text-smoke text-base sm:text-lg">{t.testimonials.sub}</p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="testimonials-dashboard">
            <motion.div whileHover={{ y: -4 }} className="bg-ivory border border-charcoal/8 rounded-2xl px-6 py-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <p className="font-serif text-3xl sm:text-4xl text-charcoal"><CountUp value="4.8" /></p>
              <div className="mt-1.5 flex justify-center"><Stars size={11} /></div>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold">Rating</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-ivory border border-charcoal/8 rounded-2xl px-6 py-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <p className="font-serif text-3xl sm:text-4xl text-charcoal"><CountUp value="5,000+" /></p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold">Customers</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-ivory border border-charcoal/8 rounded-2xl px-6 py-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <p className="font-serif text-3xl sm:text-4xl text-charcoal"><CountUp value="40+" /></p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold">Years</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-ivory border border-gold/40 rounded-2xl px-6 py-6 text-center shadow-[0_8px_32px_rgba(197,155,39,0.12)]" data-testid="live-slots-card">
              <p className="font-serif text-3xl sm:text-4xl text-gold" data-testid="live-slots-count">
                <AnimatePresence mode="wait">
                  <motion.span key={slots} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="inline-block">
                    {slots.toLocaleString("en-IN")}
                  </motion.span>
                </AnimatePresence>
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-smoke font-semibold flex items-center justify-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-blink-dot" />
                {t.v3.liveLabel}
              </p>
              <p className="mt-1 text-[10px] text-smoke/60 italic">{t.v3.liveNote}</p>
            </motion.div>
          </div>
        </Reveal>

        <div className="mt-10 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-smoke font-semibold flex items-center gap-2">
            <Stars size={11} /> 4.5 · {t.v4.reviewsWorld}
          </p>
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-blink-dot" /> Live
          </span>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {reviews.map((r, i) => (
              <motion.div
                key={`${r.name}-${r.place}-${r.text}`}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`testimonial-card-${i}`}
                className="bg-ivory border border-charcoal/8 rounded-2xl p-6 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
              >
                <Stars size={12} />
                <p className="font-serif italic text-lg text-charcoal leading-relaxed">“{r.text}”</p>
                <p className="mt-auto text-xs text-smoke">{r.name} · {r.place}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Reveal className="mt-12 text-center">
          <p className="font-serif italic text-xl sm:text-2xl text-gold max-w-2xl mx-auto leading-snug" data-testid="trust-closing-line">
            “{t.v4.trustClosing}”
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <FeedbackCard />
            <BookAgainCard />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FeedbackCard = () => {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      if (!res.ok) throw new Error();
      toast.success(t.v4.feedbackThanks);
      setName("");
      setMessage("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-ivory border border-gold/25 rounded-2xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.04)]" data-testid="feedback-form">
      <p className="font-serif text-xl text-charcoal text-left">{t.v4.feedbackTitle}</p>
      <input
        data-testid="feedback-name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.v4.feedbackName}
        className="mt-4 w-full rounded-xl border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-smoke/50"
      />
      <textarea
        data-testid="feedback-message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t.v4.feedbackMsg}
        rows={3}
        className="mt-3 w-full rounded-xl border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-smoke/50"
      />
      <button
        data-testid="feedback-submit-button"
        disabled={sending}
        className="mt-4 rounded-full bg-charcoal text-ivory text-sm font-semibold px-6 py-3 hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-60"
      >
        {t.v4.feedbackBtn}
      </button>
    </form>
  );
};

const BookAgainCard = () => {
  const { t } = useLang();
  const { openBooking } = useContext(BookingContext);
  return (
    <div className="bg-charcoal text-ivory rounded-2xl p-6 sm:p-7 flex flex-col items-start justify-center" data-testid="book-today-card">
      <p className="font-serif italic text-xl sm:text-2xl leading-snug">{t.final.line}</p>
      <button
        data-testid="book-today-button"
        onClick={() => openBooking("consultation")}
        className="mt-5 rounded-full bg-champagne text-charcoal text-sm font-bold px-6 py-3 hover:bg-gold transition-colors active:scale-[0.98] flex items-center gap-2"
      >
        {t.v4.bookToday} <ArrowRight size={15} />
      </button>
    </div>
  );
};

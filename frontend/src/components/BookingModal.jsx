import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Loader2, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "../i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const s = document.createElement("script");
  s.src = "https://checkout.razorpay.com/v1/checkout.js";
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

const inputCls = "w-full rounded-xl border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-smoke/50 focus:border-gold transition-colors";

const Field = ({ label, children, id }) => (
  <label htmlFor={id} className="block">
    <span className="block text-xs uppercase tracking-[0.15em] font-semibold text-smoke mb-2">{label}</span>
    {children}
  </label>
);

export default function BookingModal({ open, pkg, onClose }) {
  const { t, lang } = useLang();
  const b = t.booking;
  const AMOUNTS = { consultation: 99, blueprint: 399, bundle: 299 };
  const amount = AMOUNTS[pkg] || 99;
  const pkgTitle = pkg === "blueprint" ? b.titleBlueprint : pkg === "bundle" ? (lang === "hi" ? "कंप्लीट बंडल — ₹299" : "Complete Bundle — ₹299") : b.titleConsult;
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [provider, setProvider] = useState(null);
  const [form, setForm] = useState({
    full_name: "", dob: "", birth_time: "", birth_place: "",
    questions: "", preferred_day: "", preferred_time: "", email: "", phone: "",
  });

  useEffect(() => {
    if (!open) return;
    fetch(`${API}/config`)
      .then((r) => r.json())
      .then((d) => { setPaymentsEnabled(!!d.payments_enabled); setProvider(d.provider || null); })
      .catch(() => {});
  }, [open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const stepValid = () => {
    if (step === 1) return form.full_name && form.dob && form.birth_time && form.birth_place;
    if (step === 3) return form.preferred_day && form.preferred_time && form.email && form.phone;
    return true;
  };

  const next = () => {
    if (!stepValid()) { toast.error(b.required); return; }
    setStep((s) => Math.min(4, s + 1));
  };

  const pay = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, package: pkg }),
      });
      if (!res.ok) throw new Error("booking failed");
      const data = await res.json();

      if (!data.payments_enabled) {
        setResult(data.booking);
        return;
      }

      if (data.provider === "stripe") {
        const cres = await fetch(`${API}/payments/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: data.booking.id, origin_url: window.location.origin }),
        });
        if (!cres.ok) throw new Error("checkout failed");
        const cdata = await cres.json();
        window.location.href = cdata.checkout_url;
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("checkout failed to load");

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Astro Nakshatra",
        description: pkg === "consultation" ? "20-minute personal consultation" : pkgTitle,
        order_id: data.order.id,
        prefill: { name: form.full_name, email: form.email, contact: form.phone },
        theme: { color: "#C59B27" },
        handler: async (resp) => {
          try {
            const vres = await fetch(`${API}/bookings/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                booking_id: data.booking.id,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });
            if (!vres.ok) throw new Error("verify failed");
            const vdata = await vres.json();
            setResult(vdata.booking);
          } catch {
            toast.error("Payment received but confirmation failed. We will verify it manually.");
          }
        },
        modal: { ondismiss: () => toast.error("Payment cancelled — your details are saved, you can try again.") },
      });
      rzp.open();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => { setStep(1); setResult(null); }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center" data-testid="booking-modal">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={close}
      />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full sm:max-w-lg bg-ivory rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92svh] overflow-y-auto"
      >
        <div className="p-6 sm:p-8">
          {!result ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal" data-testid="booking-modal-title">
                    {pkgTitle}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold font-semibold">
                    {b.steps[step - 1]} · {step}/4
                  </p>
                </div>
                <button data-testid="booking-close-button" onClick={close} className="text-smoke hover:text-charcoal text-2xl leading-none px-1" aria-label="Close">×</button>
              </div>
              <div className="mt-5 flex gap-1.5" data-testid="booking-progress">
                {[1, 2, 3, 4].map((s) => (
                  <span key={s} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${s <= step ? "bg-gold" : "bg-charcoal/10"}`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-7 space-y-5"
                >
                  {step === 1 && (
                    <div data-testid="booking-step-1" className="space-y-5">
                      <Field label={b.name} id="bk-name">
                        <input id="bk-name" data-testid="booking-name-input" className={inputCls} value={form.full_name} onChange={set("full_name")} placeholder="Aarav Sharma" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label={b.dob} id="bk-dob">
                          <input id="bk-dob" data-testid="booking-dob-input" type="date" className={inputCls} value={form.dob} onChange={set("dob")} />
                        </Field>
                        <Field label={b.time} id="bk-time">
                          <input id="bk-time" data-testid="booking-time-input" type="time" className={inputCls} value={form.birth_time} onChange={set("birth_time")} />
                        </Field>
                      </div>
                      <Field label={b.place} id="bk-place">
                        <input id="bk-place" data-testid="booking-place-input" className={inputCls} value={form.birth_place} onChange={set("birth_place")} placeholder="Jaipur, Rajasthan" />
                      </Field>
                    </div>
                  )}

                  {step === 2 && (
                    <div data-testid="booking-step-2">
                      <Field label={b.questions} id="bk-q">
                        <textarea id="bk-q" data-testid="booking-questions-input" rows={5} className={inputCls} value={form.questions} onChange={set("questions")} placeholder={b.questionsHint} />
                      </Field>
                    </div>
                  )}

                  {step === 3 && (
                    <div data-testid="booking-step-3" className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label={b.day} id="bk-day">
                          <select id="bk-day" data-testid="booking-day-select" className={inputCls} value={form.preferred_day} onChange={set("preferred_day")}>
                            <option value="">—</option>
                            {b.dayOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </Field>
                        <Field label={b.timeWindow} id="bk-window">
                          <select id="bk-window" data-testid="booking-window-select" className={inputCls} value={form.preferred_time} onChange={set("preferred_time")}>
                            <option value="">—</option>
                            {b.windowOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </Field>
                      </div>
                      <Field label={b.email} id="bk-email">
                        <input id="bk-email" data-testid="booking-email-input" type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="you@example.com" />
                      </Field>
                      <Field label={b.phone} id="bk-phone">
                        <input id="bk-phone" data-testid="booking-phone-input" type="tel" className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+91 98XXX XXXXX" />
                      </Field>
                    </div>
                  )}

                  {step === 4 && (
                    <div data-testid="booking-step-4">
                      <div className="rounded-2xl border border-gold/25 bg-cream/60 p-6">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-smoke">{pkgTitle}</span>
                          <span className="font-serif text-4xl text-charcoal" data-testid="booking-amount">₹{amount}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-charcoal/10 text-sm text-smoke space-y-1.5">
                          <p><span className="font-semibold text-charcoal">{form.full_name}</span> · {form.birth_place}</p>
                          <p>{form.preferred_day} · {form.preferred_time}</p>
                          <p>{form.email} · {form.phone}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] text-smoke/70 italic" data-testid="booking-pay-note">
                        {paymentsEnabled
                          ? (provider === "stripe"
                              ? (lang === "hi" ? "Stripe द्वारा सुरक्षित भुगतान — कार्ड और अन्य।" : "Secure payment via Stripe — cards & more.")
                              : (lang === "hi" ? "Razorpay द्वारा सुरक्षित भुगतान — UPI, कार्ड, नेट बैंकिंग।" : "Secure payment via Razorpay — UPI, cards, net banking."))
                          : b.payNote}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button data-testid="booking-back-button" onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 text-sm font-semibold text-smoke hover:text-charcoal transition-colors px-2 py-2">
                    <ArrowLeft size={16} /> {b.back}
                  </button>
                ) : <span />}
                {step < 4 ? (
                  <button data-testid="booking-next-button" onClick={next} className="rounded-full bg-charcoal text-ivory font-semibold text-sm px-7 py-3.5 hover:bg-gold hover:text-charcoal transition-colors active:scale-[0.98] flex items-center gap-2">
                    {b.next} <ArrowRight size={16} />
                  </button>
                ) : (
                  <button data-testid="booking-pay-button" onClick={pay} disabled={submitting} className="rounded-full bg-champagne text-charcoal font-semibold text-sm px-7 py-3.5 hover:bg-gold transition-colors active:scale-[0.98] flex items-center gap-2 disabled:opacity-60">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {b.pay} ₹{amount}
                  </button>
                )}
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="py-8 text-center" data-testid="booking-success">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6">
                <BadgeCheck size={30} strokeWidth={1.5} />
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">{b.successTitle}</h2>
              <p className="mt-4 text-smoke text-sm sm:text-base leading-relaxed max-w-sm mx-auto">{b.successMsg}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-smoke/70 font-semibold">
                {b.refLabel}: <span className="text-gold" data-testid="booking-reference">{result.id.slice(0, 8).toUpperCase()}</span>
              </p>
              <button data-testid="booking-done-button" onClick={close} className="mt-8 rounded-full bg-charcoal text-ivory font-semibold text-sm px-10 py-3.5 hover:bg-gold hover:text-charcoal transition-colors">
                {b.close}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

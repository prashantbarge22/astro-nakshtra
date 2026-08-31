import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { BadgeCheck, Loader2, XCircle, ArrowLeft } from "lucide-react";
import { useLang } from "../i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TXT = {
  en: {
    confirming: "Confirming your payment…",
    successTitle: "Payment confirmed",
    successMsg: "Your booking is received. Our team will confirm your slot on WhatsApp and email shortly. Come curious. Come prepared.",
    failTitle: "We couldn't confirm the payment",
    failMsg: "If money was debited, it will be verified automatically or refunded. You can also reach us on WhatsApp.",
    cancelTitle: "Payment cancelled",
    cancelMsg: "No charge was made. Your slot is still waiting whenever you're ready.",
    home: "Back to home",
  },
  hi: {
    confirming: "आपके भुगतान की पुष्टि हो रही है…",
    successTitle: "भुगतान की पुष्टि हो गई",
    successMsg: "आपकी बुकिंग मिल गई है। हमारी टीम जल्द ही व्हाट्सऐप और ईमेल पर आपके स्लॉट की पुष्टि करेगी। जिज्ञासा लेकर आएं। तैयार होकर आएं।",
    failTitle: "भुगतान की पुष्टि नहीं हो सकी",
    failMsg: "अगर पैसा कटा है, तो वो अपने आप सत्यापित होगा या वापस आ जाएगा। आप हमें व्हाट्सऐप पर भी संपर्क कर सकते हैं।",
    cancelTitle: "भुगतान रद्द किया गया",
    cancelMsg: "कोई शुल्क नहीं लगा। जब भी तैयार हों, आपका स्लॉट इंतज़ार कर रहा है।",
    home: "होम पर वापस जाएं",
  },
};

export default function PaymentResult({ mode }) {
  const { lang } = useLang();
  const t = TXT[lang] || TXT.en;
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState(mode === "cancel" ? "cancelled" : "pending");

  useEffect(() => {
    if (mode !== "success" || !sessionId) return;
    let tries = 0;
    let timer;
    const poll = async () => {
      try {
        const res = await fetch(`${API}/payments/status/${sessionId}`);
        if (res.ok) {
          const d = await res.json();
          if (d.payment_status === "paid") { setState("paid"); return; }
        }
      } catch { /* keep polling */ }
      tries += 1;
      if (tries < 20) timer = setTimeout(poll, 2000);
      else setState("timeout");
    };
    poll();
    return () => clearTimeout(timer);
  }, [mode, sessionId]);

  const content = {
    pending: { icon: <Loader2 size={30} className="animate-spin" />, title: t.confirming, msg: "" },
    paid: { icon: <BadgeCheck size={30} strokeWidth={1.5} />, title: t.successTitle, msg: t.successMsg },
    timeout: { icon: <XCircle size={30} strokeWidth={1.5} />, title: t.failTitle, msg: t.failMsg },
    cancelled: { icon: <XCircle size={30} strokeWidth={1.5} />, title: t.cancelTitle, msg: t.cancelMsg },
  }[state];

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6" data-testid={`payment-${state}`}>
      <div className="w-full max-w-md text-center bg-cream/60 border border-gold/20 rounded-3xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${state === "paid" ? "bg-gold/10 text-gold" : state === "pending" ? "bg-charcoal/5 text-smoke" : "bg-red-50 text-red-500"}`}>
          {content.icon}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal">{content.title}</h1>
        {content.msg && <p className="mt-4 text-smoke text-sm sm:text-base leading-relaxed">{content.msg}</p>}
        <Link
          to="/"
          data-testid="payment-home-link"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-charcoal text-ivory font-semibold text-sm px-8 py-3.5 hover:bg-gold hover:text-charcoal transition-colors"
        >
          <ArrowLeft size={15} /> {t.home}
        </Link>
      </div>
    </div>
  );
}

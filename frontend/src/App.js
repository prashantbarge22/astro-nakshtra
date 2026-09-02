import { createContext, useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import "@/App.css";
import { LanguageProvider } from "./i18n";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import WhyUs from "./components/WhyUs";
import AskTopics from "./components/AskTopics";
import Consultation from "./components/Consultation";
import LiveMap from "./components/LiveMap";
import Testimonials from "./components/Testimonials";
import Astrologer from "./components/Astrologer";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import StickyCTA from "./components/StickyCTA";
import Admin from "./pages/Admin";
import PaymentResult from "./pages/PaymentResult";
import { Toaster } from "./components/ui/sonner";

export const BookingContext = createContext({ openBooking: () => {} });

function Landing() {
  const [modal, setModal] = useState({ open: false, pkg: "consultation" });
  const openBooking = useCallback((pkg = "consultation") => setModal({ open: true, pkg }), []);
  const closeBooking = useCallback(() => setModal((m) => ({ ...m, open: false })), []);

  useEffect(() => {
    document.title = "Astro Nakshatra — ₹99 Personal Astrology Consultation";
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      <div className="App grain">
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Astrologer />
          <Manifesto />
          <WhyUs />
          <AskTopics />
          <Consultation />
          <LiveMap />
          <Testimonials />
        </main>
        <Footer />
        <StickyCTA />
        <BookingModal open={modal.open} pkg={modal.pkg} onClose={closeBooking} />
        <Toaster position="top-center" />
      </div>
    </BookingContext.Provider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/payment/success" element={<PaymentResult mode="success" />} />
          <Route path="/payment/cancel" element={<PaymentResult mode="cancel" />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

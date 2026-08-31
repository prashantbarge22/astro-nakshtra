import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 28 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export const Eyebrow = ({ children }) => (
  <p className="text-xs uppercase tracking-[0.28em] font-semibold text-gold mb-5">{children}</p>
);

export const CountUp = ({ value, duration = 1.6 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const numeric = parseFloat(String(value).replace(/,/g, "")) || 0;
  const suffix = String(value).includes("+") ? "+" : "";
  const decimals = String(value).includes(".") ? 1 : 0;
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, numeric, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(decimals ? v.toFixed(1) : Math.round(v).toLocaleString("en-IN")),
    });
    return () => controls.stop();
  }, [inView, numeric, decimals, duration]);
  return <span ref={ref}>{display}{suffix}</span>;
};

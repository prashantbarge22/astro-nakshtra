import { useEffect, useRef } from "react";

export default function StarCanvas({ density = 90 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let raf;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.4,
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random() * 0.9,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const st of stars) {
        const a = 0.18 + 0.32 * Math.abs(Math.sin(t * 0.00045 * st.s + st.p));
        ctx.beginPath();
        ctx.arc(st.x * dpr, st.y * dpr, st.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197,155,39,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />;
}

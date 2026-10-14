import { useEffect, useRef } from "react";

/**
 * Lightweight Canvas 2D "signal field" background.
 * - Fixed behind all content, never intercepts pointer events.
 * - Faint cyan/blue particles connected by thin signal lines, rare gold node.
 * - Density + motion reduced on small screens.
 * - Pauses when the tab is hidden; renders a single static frame for reduced-motion.
 * - No external dependencies.
 */
export default function SignalField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let particles = [];
    let rafId = null;
    let running = true;

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = w < 768;
      const base = mobile ? 14000 : 9000;
      const count = Math.min(Math.round((w * h) / base), mobile ? 34 : 80);
      const speed = mobile ? 0.12 : 0.18;
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.4 + 0.6,
        gold: i % 13 === 0,
      }));
    };

    const linkDist = () => (w < 768 ? 120 : 160);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const maxD = linkDist();

      // connecting signal lines
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD * maxD) {
            const o = (1 - Math.sqrt(d2) / maxD) * 0.14;
            ctx.strokeStyle = `rgba(94,168,255,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? "rgba(255,184,0,0.55)" : "rgba(0,229,255,0.5)";
        ctx.fill();
      }
    };

    const step = () => {
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        else if (p.y > h + 20) p.y = -20;
      }
      draw();
      if (running) rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (rafId == null) {
        running = true;
        rafId = requestAnimationFrame(step);
      }
    };
    const stop = () => {
      running = false;
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduced) start();
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        build();
        if (reduced) draw();
      }, 200);
    };

    build();
    if (reduced) {
      draw();
    } else {
      start();
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      data-testid="signal-field-bg"
    />
  );
}

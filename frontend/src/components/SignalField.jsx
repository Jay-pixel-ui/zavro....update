import { useEffect, useRef } from "react";

/**
 * Cinematic, layered "signal field" background for Zavro.
 * Layers (back to front):
 *   1. CSS aurora blobs — large, softly-blurred cyan/blue/purple/gold light fields (atmosphere + depth).
 *   2. Canvas — flowing luminous ribbons + bokeh particles + (desktop) cursor glow, additive blending.
 *   3. Vignette — keeps foreground text readable.
 * Fixed behind all content, never intercepts pointer events. No external dependencies.
 * Respects prefers-reduced-motion (single static frame), reduces density on mobile,
 * and pauses the RAF loop when the tab is hidden.
 */
export default function SignalField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let mobile = false;
    let ribbons = [];
    let particles = [];
    let rafId = null;
    let running = true;
    let t = 0;
    let scrollY = window.scrollY || 0;

    const mouse = { x: -9999, y: -9999, cx: -9999, cy: -9999, active: false };

    const RIBBON_COLORS = [
      [0, 229, 255], // cyan
      [94, 168, 255], // sky blue
      [185, 140, 255], // lilac/purple
      [255, 184, 0], // gold
    ];

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      mobile = w < 768;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Flowing ribbons
      const ribbonCount = mobile ? 3 : 5;
      ribbons = Array.from({ length: ribbonCount }, (_, i) => {
        const color = RIBBON_COLORS[i % RIBBON_COLORS.length];
        return {
          color,
          yBase: h * (0.18 + 0.64 * (i / (ribbonCount - 1 || 1))),
          amp: h * (mobile ? 0.05 : 0.07) * (0.7 + Math.random() * 0.6),
          freq: (0.6 + Math.random() * 0.5) / Math.max(w, 1) * Math.PI * 2,
          speed: 0.08 + Math.random() * 0.06,
          phase: Math.random() * Math.PI * 2,
          drift: (i % 2 === 0 ? 1 : -1) * (0.02 + Math.random() * 0.02),
          width: (mobile ? 1.1 : 1.6) + Math.random() * 0.8,
          depth: 0.4 + (i / ribbonCount) * 0.6, // parallax factor
        };
      });

      // Bokeh particles
      const base = mobile ? 20000 : 13000;
      const count = Math.min(Math.round((w * h) / base), mobile ? 26 : 64);
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (mobile ? 0.1 : 0.16),
        vy: (Math.random() - 0.5) * (mobile ? 0.1 : 0.16),
        r: Math.random() < 0.18 ? Math.random() * 6 + 3 : Math.random() * 1.6 + 0.6, // some soft bokeh
        gold: i % 11 === 0,
        depth: 0.3 + Math.random() * 0.7,
      }));
    };

    const drawRibbon = (rb) => {
      const [r, g, b] = rb.color;
      const px = scrollY * rb.drift; // subtle scroll-driven evolution between sections
      const y0 = rb.yBase - scrollY * 0.03 * rb.depth;
      const step = mobile ? 20 : 14;
      ctx.beginPath();
      for (let x = -40; x <= w + 40; x += step) {
        const y =
          y0 +
          Math.sin(x * rb.freq + t * rb.speed + rb.phase + px) * rb.amp +
          Math.sin(x * rb.freq * 2.3 + t * rb.speed * 0.6) * rb.amp * 0.25;
        if (x === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // soft wide glow
      ctx.strokeStyle = `rgba(${r},${g},${b},0.06)`;
      ctx.lineWidth = rb.width * 7;
      ctx.stroke();
      // mid
      ctx.strokeStyle = `rgba(${r},${g},${b},0.14)`;
      ctx.lineWidth = rb.width * 2.6;
      ctx.stroke();
      // bright core
      ctx.strokeStyle = `rgba(${Math.min(r + 60, 255)},${Math.min(g + 60, 255)},${Math.min(b + 60, 255)},0.5)`;
      ctx.lineWidth = rb.width;
      ctx.stroke();
    };

    const drawParticle = (p) => {
      const col = p.gold ? [255, 184, 0] : [120, 220, 255];
      const [r, g, b] = col;
      if (p.r > 3) {
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grd.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(${r},${g},${b},0.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < ribbons.length; i += 1) drawRibbon(ribbons[i]);

      // connecting lines between nearby small particles (subtle)
      const maxD = mobile ? 100 : 140;
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        if (a.r > 3) continue;
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          if (b.r > 3) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD * maxD) {
            const o = (1 - Math.sqrt(d2) / maxD) * 0.08;
            ctx.strokeStyle = `rgba(94,168,255,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (let i = 0; i < particles.length; i += 1) drawParticle(particles[i]);

      // cursor glow (desktop only)
      if (mouse.active && finePointer) {
        mouse.cx += (mouse.x - mouse.cx) * 0.08;
        mouse.cy += (mouse.y - mouse.cy) * 0.08;
        const R = Math.min(w, h) * 0.26;
        const grd = ctx.createRadialGradient(mouse.cx, mouse.cy, 0, mouse.cx, mouse.cy, R);
        grd.addColorStop(0, "rgba(0,229,255,0.10)");
        grd.addColorStop(0.5, "rgba(30,144,255,0.04)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(mouse.cx - R, mouse.cy - R, R * 2, R * 2);
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const step = () => {
      t += 1;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -30) p.x = w + 30;
        else if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        else if (p.y > h + 30) p.y = -30;
      }
      render();
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
    const onScroll = () => { scrollY = window.scrollY || 0; };
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; if (!mouse.active) { mouse.cx = e.clientX; mouse.cy = e.clientY; } mouse.active = true; };
    const onLeave = () => { mouse.active = false; };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        build();
        if (reduced) render();
      }, 200);
    };

    build();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduced) {
      render();
    } else {
      if (finePointer) {
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerout", onLeave, { passive: true });
      }
      start();
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden" data-testid="signal-field-bg">
      <div className="signal-aurora signal-aurora--cyan" />
      <div className="signal-aurora signal-aurora--blue" />
      <div className="signal-aurora signal-aurora--purple" />
      <div className="signal-aurora signal-aurora--gold" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="signal-vignette absolute inset-0" />
    </div>
  );
}

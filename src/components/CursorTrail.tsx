"use client";

import { useEffect, useRef } from "react";

export type TrailConfig = {
  enabled: boolean;
  pixel_size: number;
  fade_ms: number;
  spacing: number;
  max_pixels: number;
  click_explosion: boolean;
  explosion_pixels: number;
  colors_light: string[];
  colors_dark: string[];
};

type Particle = {
  x: number;
  y: number;
  size: number;
  color: string;
  born: number;
  life: number;
  // burst particles only
  vx?: number;
  vy?: number;
};

const MAX_TOTAL = 150;
const MAX_STEPS = 24; // cells filled in per move event on very fast flicks

/**
 * One full-viewport canvas: a sparse pixel trail behind the mouse (desktop)
 * and a pixel burst on click/tap. A single rAF loop runs only while pixels are
 * alive; nothing runs when idle.
 */
export function CursorTrail({ config }: { config: TrailConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const trailOn = config.enabled && fine;
    const burstOn = config.click_explosion;
    if (!trailOn && !burstOn) return;

    const cell = config.pixel_size;
    let parts: Particle[] = [];
    let trailCount = 0;
    let raf = 0;
    let lastCell: [number, number] | null = null;
    let crossed = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();

    const color = () => {
      const pal = document.documentElement.classList.contains("dark")
        ? config.colors_dark
        : config.colors_light;
      return pal[(Math.random() * pal.length) | 0];
    };

    const tick = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      parts = parts.filter((p) => now - p.born < p.life);
      trailCount = 0;
      for (const p of parts) {
        const t = (now - p.born) / p.life;
        let x = p.x;
        let y = p.y;
        if (p.vx !== undefined && p.vy !== undefined) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.9;
          p.vx *= 0.94;
          x = Math.round(p.x / 4) * 4;
          y = Math.round(p.y / 4) * 4;
        } else {
          trailCount++;
        }
        ctx.globalAlpha = 1 - (1 - (1 - t) * (1 - t)); // ease-out fade
        ctx.fillStyle = p.color;
        ctx.fillRect(x, y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    };

    const add = (p: Particle) => {
      parts.push(p);
      if (p.vx === undefined) {
        trailCount++;
        if (trailCount > config.max_pixels) {
          const i = parts.findIndex((q) => q.vx === undefined);
          if (i >= 0) parts.splice(i, 1);
          trailCount--;
        }
      }
      if (parts.length > MAX_TOTAL) parts.shift();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const cx = Math.floor(e.clientX / cell);
      const cy = Math.floor(e.clientY / cell);
      if (!lastCell) {
        lastCell = [cx, cy];
        return;
      }
      const dx = cx - lastCell[0];
      const dy = cy - lastCell[1];
      const steps = Math.min(Math.max(Math.abs(dx), Math.abs(dy)), MAX_STEPS);
      if (!steps) return;
      const now = performance.now();
      for (let i = 1; i <= steps; i++) {
        crossed++;
        if (crossed % config.spacing !== 0) continue;
        add({
          x: (lastCell[0] + Math.round((dx * i) / steps)) * cell,
          y: (lastCell[1] + Math.round((dy * i) / steps)) * cell,
          size: cell,
          color: color(),
          born: now,
          life: config.fade_ms,
        });
      }
      lastCell = [cx, cy];
    };

    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) lastCell = null;
    };

    const onDown = (e: PointerEvent) => {
      const n = config.explosion_pixels;
      const now = performance.now();
      for (let k = 0; k < n; k++) {
        const angle = (Math.PI * 2 * k) / n + Math.random() * 0.4;
        const speed = 7 + Math.random() * 9;
        const size = Math.random() < 0.3 ? 12 : 8;
        add({
          x: e.clientX - size / 2,
          y: e.clientY - size / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size,
          color: color(),
          born: now,
          life: 650 + Math.random() * 250,
        });
      }
    };

    const onVisibility = () => {
      if (!document.hidden) return;
      parts = [];
      trailCount = 0;
      lastCell = null;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const opts = { passive: true } as const;
    window.addEventListener("resize", resize, opts);
    document.addEventListener("visibilitychange", onVisibility);
    if (trailOn) {
      window.addEventListener("pointermove", onMove, opts);
      document.addEventListener("pointerout", onLeave, opts);
    }
    if (burstOn) window.addEventListener("pointerdown", onDown, opts);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("pointerdown", onDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [config]);

  return <canvas ref={canvasRef} className="fx" aria-hidden="true" />;
}

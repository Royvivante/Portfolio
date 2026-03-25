"use client";

import { useRef, useEffect, useCallback } from "react";

const PARTICLE_COUNT = 60;
const COLORS = [
  "rgba(124,58,237,0.25)",   // violet
  "rgba(139,92,246,0.2)",    // soft violet
  "rgba(196,181,253,0.15)",  // lavender
  "rgba(212,168,83,0.1)",    // gold (rare)
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseAlpha: number;
}

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = document.documentElement.scrollHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${document.documentElement.scrollHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const W = () => window.innerWidth;
    const H = () => document.documentElement.scrollHeight;

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isGold = Math.random() < 0.08;
      particles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 1.5 + 0.5,
        color: isGold ? COLORS[3] : COLORS[Math.floor(Math.random() * 3)],
        baseAlpha: 0.3 + Math.random() * 0.4,
      });
    }

    function tick() {
      ctx.clearRect(0, 0, W(), H());

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = W() + 10;
        if (p.x > W() + 10) p.x = -10;
        if (p.y < -10) p.y = H() + 10;
        if (p.y > H() + 10) p.y = -10;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    // Reduced motion check
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    rafRef.current = requestAnimationFrame(tick);

    const onResize = () => { resize(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return () => { if (cleanup) cleanup(); cancelAnimationFrame(rafRef.current); };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}

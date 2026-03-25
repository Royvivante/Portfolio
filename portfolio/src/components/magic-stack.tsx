"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const SKILLS = [
  "Python",
  "Django",
  "Django REST Framework",
  "Next.js",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Docker",
  "C#",
  ".NET",
  "REST APIs",
  "Clean Architecture",
  "OOP",
  "Git",
  "Tailwind CSS",
];

/* ── Timing (ms) ── */
const FIRE_DELAY = 300;
const TRAVEL_DURATION = 800;
const BURST_DURATION = 400;
const FORM_DURATION = 700;
const HOLD_DURATION = 2400;
const DISSOLVE_DURATION = 900;
const CYCLE_GAP = 350;

/* ── Visual ── */
const ORB_RADIUS = 6;
const TRAIL_LENGTH = 16;
const PARTICLE_COUNT = 180;
const TEXT_SIZE_RATIO = 0.06;
const MIN_FONT = 30;
const MAX_FONT = 54;

type Phase = "idle" | "travel" | "burst" | "form" | "hold" | "dissolve" | "gap";

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
}

interface Trail {
  x: number;
  y: number;
  a: number;
}

function easeOut3(t: number) {
  return 1 - (1 - t) ** 3;
}
function easeInOut4(t: number) {
  return t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
}

/** Sample filled pixel positions from text rendered offscreen */
function sampleText(
  text: string,
  w: number,
  h: number,
  size: number,
  n: number
): { x: number; y: number }[] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d")!;
  x.clearRect(0, 0, w, h);
  x.fillStyle = "#fff";
  x.font = `bold ${size}px "Inter", system-ui, sans-serif`;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(text, w / 2, h / 2);
  const d = x.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y += 2) {
    for (let xx = 0; xx < w; xx += 2) {
      if (d[(y * w + xx) * 4 + 3] > 128) pts.push({ x: xx, y });
    }
  }
  const out: { x: number; y: number }[] = [];
  if (!pts.length) return out;
  const s = Math.max(1, Math.floor(pts.length / n));
  for (let i = 0; i < n && i * s < pts.length; i++) out.push(pts[i * s]);
  return out;
}

export function MagicStack({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const prefersReduced = useRef(false);

  const run = useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    let idx = 0;
    let phase: Phase = "idle";
    let t0 = performance.now();
    let orbX = 0,
      orbY = 0;
    const trail: Trail[] = [];
    let particles: Particle[] = [];

    const wandX = W * 0.87;
    const wandY = H * 0.48;
    const hitX = W * 0.5;
    const hitY = H * 0.5;
    const fs = Math.max(MIN_FONT, Math.min(MAX_FONT, W * TEXT_SIZE_RATIO));

    function go(p: Phase, now: number) {
      phase = p;
      t0 = now;
    }

    function mkParticles(cx: number, cy: number) {
      const pts = sampleText(SKILLS[idx], W, H, fs, PARTICLE_COUNT);
      particles = pts.map((p) => {
        const a = Math.random() * Math.PI * 2;
        return {
          x: cx + (Math.random() - 0.5) * 16,
          y: cy + (Math.random() - 0.5) * 16,
          tx: p.x,
          ty: p.y,
          vx: Math.cos(a) * (1.5 + Math.random() * 2.5),
          vy: Math.sin(a) * (1.5 + Math.random() * 2.5),
          size: 1.2 + Math.random() * 1.4,
          alpha: 1,
          hue: 258 + Math.random() * 35,
        };
      });
    }

    /* ── Draw helpers ── */

    function drawWand() {
      ctx.save();
      ctx.translate(wandX, wandY);
      ctx.rotate(-0.35);
      // Shaft
      const g = ctx.createLinearGradient(0, -32, 0, 36);
      g.addColorStop(0, "rgba(170,150,200,0.12)");
      g.addColorStop(1, "rgba(90,70,130,0.04)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(-2, -30, 4, 60, 2);
      ctx.fill();
      // Tip glow
      const tg = ctx.createRadialGradient(0, -30, 0, 0, -30, 10);
      tg.addColorStop(0, "rgba(167,139,250,0.5)");
      tg.addColorStop(0.5, "rgba(139,92,246,0.15)");
      tg.addColorStop(1, "transparent");
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.arc(0, -30, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawOrb(x: number, y: number, s: number) {
      // Bloom
      const b = ctx.createRadialGradient(x, y, 0, x, y, 36 * s);
      b.addColorStop(0, `rgba(167,139,250,${0.25 * s})`);
      b.addColorStop(0.5, `rgba(139,92,246,${0.08 * s})`);
      b.addColorStop(1, "transparent");
      ctx.fillStyle = b;
      ctx.beginPath();
      ctx.arc(x, y, 36 * s, 0, Math.PI * 2);
      ctx.fill();
      // Core
      const c = ctx.createRadialGradient(x, y, 0, x, y, ORB_RADIUS);
      c.addColorStop(0, "rgba(255,255,255,0.95)");
      c.addColorStop(0.35, "rgba(196,181,253,0.85)");
      c.addColorStop(0.7, "rgba(139,92,246,0.5)");
      c.addColorStop(1, "transparent");
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y, ORB_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawTrail() {
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const a = p.a * (i / trail.length) * 0.5;
        if (a < 0.005) continue;
        ctx.fillStyle = `rgba(167,139,250,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 + (i / trail.length) * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawParticles() {
      for (const p of particles) {
        if (p.alpha < 0.01) continue;
        ctx.fillStyle = `hsla(${p.hue},75%,72%,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.alpha > 0.35) {
          ctx.fillStyle = `hsla(${p.hue},85%,78%,${p.alpha * 0.12})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    /** Draw the readable skill text with a soft purple glow behind it */
    function drawText(alpha: number) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const label = SKILLS[idx];

      // Background glow halo — makes text pop without being harsh
      ctx.shadowColor = "rgba(139,92,246,0.7)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "rgba(139,92,246,0.01)"; // invisible fill just for shadow
      ctx.font = `bold ${fs}px "Inter", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, W / 2, H / 2);

      // Actual crisp text — white with slight purple tint
      ctx.shadowColor = "rgba(167,139,250,0.5)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgba(237,233,254,0.95)";
      ctx.fillText(label, W / 2, H / 2);

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    /* ── Animation loop ── */

    function tick(now: number) {
      ctx.clearRect(0, 0, W, H);
      const dt = now - t0;

      drawWand();

      switch (phase) {
        case "idle":
          if (dt > FIRE_DELAY) {
            orbX = wandX - 8;
            orbY = wandY - 26;
            trail.length = 0;
            go("travel", now);
          }
          break;

        case "travel": {
          const t = Math.min(1, dt / TRAVEL_DURATION);
          const e = easeInOut4(t);
          orbX = (wandX - 8) + (hitX - (wandX - 8)) * e;
          orbY = (wandY - 26) + (hitY - (wandY - 26)) * e;
          trail.push({ x: orbX, y: orbY, a: 1 });
          if (trail.length > TRAIL_LENGTH) trail.shift();
          for (const tp of trail) tp.a *= 0.9;
          drawTrail();
          drawOrb(orbX, orbY, 1);
          if (t >= 1) {
            mkParticles(orbX, orbY);
            go("burst", now);
          }
          break;
        }

        case "burst": {
          const t = Math.min(1, dt / BURST_DURATION);
          for (const tp of trail) tp.a *= 0.82;
          drawTrail();
          for (const p of particles) {
            p.x += p.vx * (1 - t * 0.7);
            p.y += p.vy * (1 - t * 0.7);
            p.vx *= 0.93;
            p.vy *= 0.93;
          }
          // Small flash at impact
          if (t < 0.3) {
            const fa = (1 - t / 0.3) * 0.2;
            const fg = ctx.createRadialGradient(hitX, hitY, 0, hitX, hitY, 60);
            fg.addColorStop(0, `rgba(196,181,253,${fa})`);
            fg.addColorStop(1, "transparent");
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.arc(hitX, hitY, 60, 0, Math.PI * 2);
            ctx.fill();
          }
          drawParticles();
          if (t >= 1) go("form", now);
          break;
        }

        case "form": {
          const t = Math.min(1, dt / FORM_DURATION);
          const e = easeOut3(t);
          for (const p of particles) {
            p.x += (p.tx - p.x) * e * 0.18;
            p.y += (p.ty - p.y) * e * 0.18;
          }
          drawParticles();
          // Text fades in from 40% progress — arrives early so it's readable
          if (t > 0.35) {
            drawText(easeOut3((t - 0.35) / 0.65));
          }
          if (t >= 1) go("hold", now);
          break;
        }

        case "hold": {
          const t = Math.min(1, dt / HOLD_DURATION);
          // Particles gently shimmer at target positions
          for (const p of particles) {
            p.x += (p.tx - p.x) * 0.06;
            p.y += (p.ty - p.y) * 0.06;
            p.x += Math.sin(now * 0.002 + p.hue) * 0.12;
            p.y += Math.cos(now * 0.0015 + p.hue) * 0.08;
          }
          drawParticles();
          drawText(1);
          if (t >= 1) go("dissolve", now);
          break;
        }

        case "dissolve": {
          const t = Math.min(1, dt / DISSOLVE_DURATION);
          for (const p of particles) {
            p.x += (Math.random() - 0.5) * 1.5;
            p.y -= 0.4 + Math.random() * 1.2;
            p.alpha = Math.max(0, 1 - easeOut3(t));
          }
          drawParticles();
          drawText(1 - easeOut3(t));
          if (t >= 1) {
            idx = (idx + 1) % SKILLS.length;
            go("gap", now);
          }
          break;
        }

        case "gap":
          if (dt > CYCLE_GAP) go("idle", now);
          break;
      }

      raf.current = requestAnimationFrame(tick);
    }

    // Reduced motion: just show static text cycling
    if (prefersReduced.current) {
      let si = 0;
      const interval = setInterval(() => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "rgba(237,233,254,0.9)";
        ctx.font = `bold ${fs}px "Inter", system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(SKILLS[si], W / 2, H / 2);
        si = (si + 1) % SKILLS.length;
      }, 3000);
      return () => clearInterval(interval);
    }

    raf.current = requestAnimationFrame(tick);
    return undefined;
  }, []);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cleanup = run();

    const onResize = () => {
      cancelAnimationFrame(raf.current);
      run();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
      if (cleanup) cleanup();
    };
  }, [run]);

  return (
    <canvas
      ref={ref}
      aria-label="Animated tech stack visualization cycling through skills"
      role="img"
      className={cn("w-full h-[280px] sm:h-[380px]", className)}
      style={{ display: "block" }}
    />
  );
}

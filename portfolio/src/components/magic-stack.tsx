"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const SKILLS = [
  "Python", "Django", "Django REST Framework", "Next.js", "React",
  "TypeScript", "PostgreSQL", "Docker", "C#", ".NET",
  "REST APIs", "Clean Architecture", "OOP", "Git", "Tailwind CSS",
];

/* ── Timing ── */
const FIRE_INTERVAL = 550;       // new orb every 550ms
const TRAVEL_DURATION = 280;     // fast snap
const BURST_DURATION = 250;
const FORM_DURATION = 500;
const HOLD_DURATION = 4500;      // stay visible longer since many co-exist
const DISSOLVE_DURATION = 1200;

/* ── Visual ── */
const ORB_RADIUS = 5;
const TRAIL_LEN = 10;
const PARTICLES_PER_SLOT = 80;

/* ── Slot positions (relative 0-1 coordinates) ── */
const SLOT_POSITIONS = [
  { x: 0.15, y: 0.22, scale: 0.85 },
  { x: 0.50, y: 0.15, scale: 0.90 },
  { x: 0.78, y: 0.20, scale: 0.80 },
  { x: 0.25, y: 0.50, scale: 1.00 },
  { x: 0.55, y: 0.48, scale: 1.00 },
  { x: 0.12, y: 0.78, scale: 0.85 },
  { x: 0.42, y: 0.80, scale: 0.90 },
  { x: 0.72, y: 0.75, scale: 0.85 },
  { x: 0.38, y: 0.35, scale: 0.75 },
  { x: 0.68, y: 0.50, scale: 0.80 },
];

type SlotPhase = "travel" | "burst" | "form" | "hold" | "dissolve" | "done";

interface Particle {
  x: number; y: number;
  tx: number; ty: number;
  vx: number; vy: number;
  size: number; alpha: number; hue: number;
}

interface TrailPt { x: number; y: number; a: number; }

interface Slot {
  skill: string;
  phase: SlotPhase;
  t0: number;
  cx: number; cy: number;      // target center
  fontSize: number;
  particles: Particle[];
  trail: TrailPt[];
  orbX: number; orbY: number;
  wandTipX: number; wandTipY: number;
}

function easeOut2(t: number) { return 1 - (1 - t) ** 2; }
function easeOut3(t: number) { return 1 - (1 - t) ** 3; }

/** Sample pixel positions from text at a specific position */
function sampleTextAt(
  text: string, cx: number, cy: number, fontSize: number, n: number
): { x: number; y: number }[] {
  // Render text centered at origin, then offset to cx,cy
  const pad = 20;
  const w = Math.ceil(fontSize * text.length * 0.7) + pad * 2;
  const h = Math.ceil(fontSize * 1.6) + pad * 2;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = "#fff";
  x.font = `bold ${fontSize}px "Inter", system-ui, sans-serif`;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(text, w / 2, h / 2);
  const d = x.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  for (let yy = 0; yy < h; yy += 2) {
    for (let xx = 0; xx < w; xx += 2) {
      if (d[(yy * w + xx) * 4 + 3] > 128) {
        pts.push({ x: xx - w / 2 + cx, y: yy - h / 2 + cy });
      }
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

    // Wand position (right side, vertically centered)
    const wandBaseX = W * 0.92;
    const wandBaseY = H * 0.45;

    let skillIdx = 0;
    let slotIdx = 0;
    let lastFire = 0;
    const slots: Slot[] = [];

    /* ── Draw wooden wand ── */
    function drawWand(now: number) {
      ctx.save();
      ctx.translate(wandBaseX, wandBaseY);
      ctx.rotate(-0.4);

      const wandLen = 68;
      const tipW = 3.5;
      const baseW = 6;

      // Wood body — tapered shape
      ctx.beginPath();
      ctx.moveTo(-tipW / 2, -wandLen / 2);                // tip left
      ctx.lineTo(tipW / 2, -wandLen / 2);                  // tip right
      ctx.lineTo(baseW / 2, wandLen / 2);                  // base right
      ctx.lineTo(-baseW / 2, wandLen / 2);                 // base left
      ctx.closePath();

      // Wood gradient — warm browns
      const woodGrad = ctx.createLinearGradient(0, -wandLen / 2, 0, wandLen / 2);
      woodGrad.addColorStop(0, "rgba(160,120,80,0.7)");
      woodGrad.addColorStop(0.15, "rgba(130,90,55,0.75)");
      woodGrad.addColorStop(0.35, "rgba(110,75,45,0.8)");
      woodGrad.addColorStop(0.5, "rgba(95,65,40,0.7)");
      woodGrad.addColorStop(0.65, "rgba(120,85,50,0.75)");
      woodGrad.addColorStop(0.85, "rgba(80,55,35,0.7)");
      woodGrad.addColorStop(1, "rgba(65,42,28,0.65)");
      ctx.fillStyle = woodGrad;
      ctx.fill();

      // Wood grain lines
      ctx.strokeStyle = "rgba(70,45,25,0.25)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 5; i++) {
        const yOff = -wandLen / 2 + (wandLen / 5) * (i + 0.5);
        const xWiggle = (i % 2 === 0 ? 0.3 : -0.3);
        ctx.beginPath();
        ctx.moveTo(-tipW / 2 + 0.8 + xWiggle, yOff);
        ctx.quadraticCurveTo(xWiggle * 2, yOff + wandLen / 10, tipW / 2 - 0.8 + xWiggle, yOff + wandLen / 5);
        ctx.stroke();
      }

      // Wood knot
      ctx.fillStyle = "rgba(65,40,25,0.35)";
      ctx.beginPath();
      ctx.ellipse(0.5, 8, 1.8, 1.2, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Highlight edge
      ctx.strokeStyle = "rgba(200,170,130,0.15)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(-tipW / 2 - 0.2, -wandLen / 2);
      ctx.lineTo(-baseW / 2 - 0.2, wandLen / 2);
      ctx.stroke();

      // Tip glow — pulsing
      const pulse = 0.5 + Math.sin(now * 0.004) * 0.15;
      const tg = ctx.createRadialGradient(0, -wandLen / 2, 0, 0, -wandLen / 2, 14);
      tg.addColorStop(0, `rgba(167,139,250,${0.6 * pulse})`);
      tg.addColorStop(0.4, `rgba(139,92,246,${0.2 * pulse})`);
      tg.addColorStop(1, "transparent");
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.arc(0, -wandLen / 2, 14, 0, Math.PI * 2);
      ctx.fill();

      // Bright tip dot
      ctx.fillStyle = `rgba(220,200,255,${0.5 * pulse})`;
      ctx.beginPath();
      ctx.arc(0, -wandLen / 2, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Return wand tip position in world space for orb origin
      const angle = -0.4;
      const tipLocalY = -wandLen / 2;
      return {
        x: wandBaseX + Math.sin(angle) * tipLocalY * -1 + Math.cos(angle) * 0,
        y: wandBaseY + Math.cos(angle) * tipLocalY + Math.sin(angle) * 0,
      };
    }

    function drawOrb(x: number, y: number, intensity: number) {
      const bloom = ctx.createRadialGradient(x, y, 0, x, y, 30 * intensity);
      bloom.addColorStop(0, `rgba(167,139,250,${0.3 * intensity})`);
      bloom.addColorStop(0.5, `rgba(139,92,246,${0.08 * intensity})`);
      bloom.addColorStop(1, "transparent");
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(x, y, 30 * intensity, 0, Math.PI * 2);
      ctx.fill();

      const core = ctx.createRadialGradient(x, y, 0, x, y, ORB_RADIUS);
      core.addColorStop(0, "rgba(255,255,255,0.95)");
      core.addColorStop(0.35, "rgba(196,181,253,0.85)");
      core.addColorStop(0.7, "rgba(139,92,246,0.5)");
      core.addColorStop(1, "transparent");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, ORB_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawSlotTrail(slot: Slot) {
      for (let i = 0; i < slot.trail.length; i++) {
        const p = slot.trail[i];
        const a = p.a * (i / slot.trail.length) * 0.45;
        if (a < 0.003) continue;
        ctx.fillStyle = `rgba(167,139,250,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1 + (i / slot.trail.length) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawSlotParticles(slot: Slot) {
      for (const p of slot.particles) {
        if (p.alpha < 0.01) continue;
        ctx.fillStyle = `hsla(${p.hue},75%,72%,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.alpha > 0.3) {
          ctx.fillStyle = `hsla(${p.hue},85%,78%,${p.alpha * 0.1})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawSlotText(slot: Slot, alpha: number) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      // Glow halo
      ctx.shadowColor = "rgba(139,92,246,0.6)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "rgba(139,92,246,0.01)";
      ctx.font = `bold ${slot.fontSize}px "Inter", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(slot.skill, slot.cx, slot.cy);
      // Crisp text
      ctx.shadowColor = "rgba(167,139,250,0.4)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "rgba(237,233,254,0.95)";
      ctx.fillText(slot.skill, slot.cx, slot.cy);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function fireNewOrb(now: number, tipPos: { x: number; y: number }) {
      const pos = SLOT_POSITIONS[slotIdx % SLOT_POSITIONS.length];
      const cx = pos.x * W;
      const cy = pos.y * H;
      const baseFontSize = Math.max(16, Math.min(28, W * 0.032));
      const fontSize = Math.round(baseFontSize * pos.scale);

      const pts = sampleTextAt(SKILLS[skillIdx], cx, cy, fontSize, PARTICLES_PER_SLOT);
      const particles: Particle[] = pts.map(p => {
        const a = Math.random() * Math.PI * 2;
        return {
          x: cx, y: cy,
          tx: p.x, ty: p.y,
          vx: Math.cos(a) * (1 + Math.random() * 2),
          vy: Math.sin(a) * (1 + Math.random() * 2),
          size: 0.8 + Math.random() * 1, alpha: 1,
          hue: 258 + Math.random() * 35,
        };
      });

      slots.push({
        skill: SKILLS[skillIdx],
        phase: "travel",
        t0: now,
        cx, cy, fontSize, particles,
        trail: [],
        orbX: tipPos.x, orbY: tipPos.y,
        wandTipX: tipPos.x, wandTipY: tipPos.y,
      });

      skillIdx = (skillIdx + 1) % SKILLS.length;
      slotIdx = (slotIdx + 1) % SLOT_POSITIONS.length;
    }

    function updateSlot(slot: Slot, now: number) {
      const dt = now - slot.t0;

      switch (slot.phase) {
        case "travel": {
          const t = Math.min(1, dt / TRAVEL_DURATION);
          const e = easeOut2(t);
          slot.orbX = slot.wandTipX + (slot.cx - slot.wandTipX) * e;
          slot.orbY = slot.wandTipY + (slot.cy - slot.wandTipY) * e;
          slot.trail.push({ x: slot.orbX, y: slot.orbY, a: 1 });
          if (slot.trail.length > TRAIL_LEN) slot.trail.shift();
          for (const tp of slot.trail) tp.a *= 0.88;
          drawSlotTrail(slot);
          drawOrb(slot.orbX, slot.orbY, 1);
          if (t >= 1) { slot.phase = "burst"; slot.t0 = now; }
          break;
        }
        case "burst": {
          const t = Math.min(1, dt / BURST_DURATION);
          for (const tp of slot.trail) tp.a *= 0.8;
          drawSlotTrail(slot);
          for (const p of slot.particles) {
            p.x += p.vx * (1 - t * 0.6);
            p.y += p.vy * (1 - t * 0.6);
            p.vx *= 0.92;
            p.vy *= 0.92;
          }
          // Flash
          if (t < 0.35) {
            const fa = (1 - t / 0.35) * 0.15;
            const fg = ctx.createRadialGradient(slot.cx, slot.cy, 0, slot.cx, slot.cy, 40);
            fg.addColorStop(0, `rgba(196,181,253,${fa})`);
            fg.addColorStop(1, "transparent");
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.arc(slot.cx, slot.cy, 40, 0, Math.PI * 2);
            ctx.fill();
          }
          drawSlotParticles(slot);
          if (t >= 1) { slot.phase = "form"; slot.t0 = now; }
          break;
        }
        case "form": {
          const t = Math.min(1, dt / FORM_DURATION);
          const e = easeOut3(t);
          for (const p of slot.particles) {
            p.x += (p.tx - p.x) * e * 0.2;
            p.y += (p.ty - p.y) * e * 0.2;
          }
          drawSlotParticles(slot);
          if (t > 0.3) drawSlotText(slot, easeOut3((t - 0.3) / 0.7));
          if (t >= 1) { slot.phase = "hold"; slot.t0 = now; }
          break;
        }
        case "hold": {
          const t = Math.min(1, dt / HOLD_DURATION);
          for (const p of slot.particles) {
            p.x += (p.tx - p.x) * 0.05;
            p.y += (p.ty - p.y) * 0.05;
            p.x += Math.sin(now * 0.002 + p.hue) * 0.08;
            p.y += Math.cos(now * 0.0015 + p.hue) * 0.06;
          }
          drawSlotParticles(slot);
          drawSlotText(slot, 1);
          if (t >= 1) { slot.phase = "dissolve"; slot.t0 = now; }
          break;
        }
        case "dissolve": {
          const t = Math.min(1, dt / DISSOLVE_DURATION);
          for (const p of slot.particles) {
            p.x += (Math.random() - 0.5) * 1;
            p.y -= 0.3 + Math.random() * 0.8;
            p.alpha = Math.max(0, 1 - easeOut3(t));
          }
          drawSlotParticles(slot);
          drawSlotText(slot, 1 - easeOut3(t));
          if (t >= 1) slot.phase = "done";
          break;
        }
      }
    }

    /* ── Main loop ── */
    function tick(now: number) {
      ctx.clearRect(0, 0, W, H);

      const tipPos = drawWand(now);

      // Fire new orbs on interval
      if (now - lastFire > FIRE_INTERVAL) {
        fireNewOrb(now, tipPos);
        lastFire = now;
      }

      // Update all active slots
      for (const slot of slots) {
        if (slot.phase !== "done") updateSlot(slot, now);
      }

      // Cleanup finished slots
      for (let i = slots.length - 1; i >= 0; i--) {
        if (slots[i].phase === "done") slots.splice(i, 1);
      }

      raf.current = requestAnimationFrame(tick);
    }

    // Reduced motion fallback
    if (prefersReduced.current) {
      const baseFontSize = Math.max(16, Math.min(28, W * 0.032));
      SLOT_POSITIONS.forEach((pos, i) => {
        if (i >= SKILLS.length) return;
        const fs = Math.round(baseFontSize * pos.scale);
        ctx.fillStyle = "rgba(237,233,254,0.8)";
        ctx.font = `bold ${fs}px "Inter", system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(SKILLS[i], pos.x * W, pos.y * H);
      });
      return undefined;
    }

    lastFire = performance.now() - FIRE_INTERVAL; // fire immediately
    raf.current = requestAnimationFrame(tick);
    return undefined;
  }, []);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    run();
    const onResize = () => { cancelAnimationFrame(raf.current); run(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, [run]);

  return (
    <canvas
      ref={ref}
      aria-label="Animated tech stack visualization"
      role="img"
      className={cn("w-full h-[340px] sm:h-[440px]", className)}
      style={{ display: "block" }}
    />
  );
}

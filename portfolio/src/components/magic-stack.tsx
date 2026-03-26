"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const SKILLS = [
  "Python", "Django", "Django REST Framework", "Next.js", "React",
  "TypeScript", "PostgreSQL", "Docker", "C#", ".NET",
  "REST APIs", "Clean Architecture", "OOP", "Git", "Tailwind CSS",
];

/* ── Timing ── */
const FIRE_INTERVAL = 600;
const TRAVEL_DURATION = 280;
const BURST_DURATION = 250;
const FORM_DURATION = 500;
const HOLD_DURATION = 4200;
const DISSOLVE_DURATION = 1100;

/* ── Visual ── */
const ORB_RADIUS = 5;
const TRAIL_LEN = 10;
const PARTICLES_PER_SLOT = 80;
const PADDING = 28;            // min gap between skill labels
const MAX_PLACEMENT_TRIES = 40;
const MARGIN_X = 0.06;        // keep away from edges (% of W)
const MARGIN_Y = 0.08;
const WAND_ZONE = 0.15;       // keep clear of wand area on the right

type SlotPhase = "travel" | "burst" | "form" | "hold" | "dissolve" | "done";

interface Rect { l: number; t: number; r: number; b: number; }

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
  cx: number; cy: number;
  fontSize: number;
  bbox: Rect;
  particles: Particle[];
  trail: TrailPt[];
  orbX: number; orbY: number;
  wandTipX: number; wandTipY: number;
}

function easeOut2(t: number) { return 1 - (1 - t) ** 2; }
function easeOut3(t: number) { return 1 - (1 - t) ** 3; }

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
}

/** Measure text bounding box centered at cx,cy */
function measureLabel(
  ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, fontSize: number
): Rect {
  ctx.font = `bold ${fontSize}px "Inter", system-ui, sans-serif`;
  const m = ctx.measureText(text);
  const hw = m.width / 2;
  const hh = fontSize * 0.65;
  return {
    l: cx - hw - PADDING,
    t: cy - hh - PADDING,
    r: cx + hw + PADDING,
    b: cy + hh + PADDING,
  };
}

/** Sample pixel positions from text at a specific position */
function sampleTextAt(
  text: string, cx: number, cy: number, fontSize: number, n: number
): { x: number; y: number }[] {
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

    const wandBaseX = W * 0.92;
    const wandBaseY = H * 0.45;

    let skillIdx = 0;
    let lastFire = 0;
    const slots: Slot[] = [];

    // Font size range — slight random variation per shot
    const baseFontMin = Math.max(14, Math.min(22, W * 0.024));
    const baseFontMax = Math.max(20, Math.min(30, W * 0.038));

    /** Try to find a random position that doesn't collide with active slots */
    function findRandomPosition(skill: string): { cx: number; cy: number; fontSize: number; bbox: Rect } | null {
      const fontSize = Math.round(baseFontMin + Math.random() * (baseFontMax - baseFontMin));
      const minX = W * MARGIN_X;
      const maxX = W * (1 - MARGIN_X - WAND_ZONE);
      const minY = H * MARGIN_Y;
      const maxY = H * (1 - MARGIN_Y);

      for (let attempt = 0; attempt < MAX_PLACEMENT_TRIES; attempt++) {
        const cx = minX + Math.random() * (maxX - minX);
        const cy = minY + Math.random() * (maxY - minY);
        const bbox = measureLabel(ctx, skill, cx, cy, fontSize);

        // Check bbox stays within canvas
        if (bbox.l < 0 || bbox.t < 0 || bbox.r > W || bbox.b > H) continue;

        // Check no overlap with any active (non-done) slot
        let collides = false;
        for (const s of slots) {
          if (s.phase === "done") continue;
          if (rectsOverlap(bbox, s.bbox)) { collides = true; break; }
        }
        if (!collides) return { cx, cy, fontSize, bbox };
      }
      return null; // couldn't find a spot — skip this fire
    }

    /* ── Draw wooden wand ── */
    function drawWand(now: number) {
      ctx.save();
      ctx.translate(wandBaseX, wandBaseY);
      ctx.rotate(-0.4);

      const wandLen = 68;
      const tipW = 3.5;
      const baseW = 6;

      // Wood body — tapered
      ctx.beginPath();
      ctx.moveTo(-tipW / 2, -wandLen / 2);
      ctx.lineTo(tipW / 2, -wandLen / 2);
      ctx.lineTo(baseW / 2, wandLen / 2);
      ctx.lineTo(-baseW / 2, wandLen / 2);
      ctx.closePath();

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

      // Grain lines
      ctx.strokeStyle = "rgba(70,45,25,0.25)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 5; i++) {
        const yOff = -wandLen / 2 + (wandLen / 5) * (i + 0.5);
        const xW = (i % 2 === 0 ? 0.3 : -0.3);
        ctx.beginPath();
        ctx.moveTo(-tipW / 2 + 0.8 + xW, yOff);
        ctx.quadraticCurveTo(xW * 2, yOff + wandLen / 10, tipW / 2 - 0.8 + xW, yOff + wandLen / 5);
        ctx.stroke();
      }

      // Knot
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

      // Tip glow
      const pulse = 0.5 + Math.sin(now * 0.004) * 0.15;
      const tg = ctx.createRadialGradient(0, -wandLen / 2, 0, 0, -wandLen / 2, 14);
      tg.addColorStop(0, `rgba(167,139,250,${0.6 * pulse})`);
      tg.addColorStop(0.4, `rgba(139,92,246,${0.2 * pulse})`);
      tg.addColorStop(1, "transparent");
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.arc(0, -wandLen / 2, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(220,200,255,${0.5 * pulse})`;
      ctx.beginPath();
      ctx.arc(0, -wandLen / 2, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      const angle = -0.4;
      const tipLocalY = -wandLen / 2;
      return {
        x: wandBaseX + Math.sin(angle) * tipLocalY * -1,
        y: wandBaseY + Math.cos(angle) * tipLocalY,
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
      ctx.shadowColor = "rgba(139,92,246,0.6)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "rgba(139,92,246,0.01)";
      ctx.font = `bold ${slot.fontSize}px "Inter", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(slot.skill, slot.cx, slot.cy);
      ctx.shadowColor = "rgba(167,139,250,0.4)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "rgba(237,233,254,0.95)";
      ctx.fillText(slot.skill, slot.cx, slot.cy);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function fireNewOrb(now: number, tipPos: { x: number; y: number }) {
      const skill = SKILLS[skillIdx];
      const placement = findRandomPosition(skill);
      if (!placement) return; // canvas is full — wait for a slot to clear

      const { cx, cy, fontSize, bbox } = placement;
      const pts = sampleTextAt(skill, cx, cy, fontSize, PARTICLES_PER_SLOT);
      const particles: Particle[] = pts.map(p => {
        const a = Math.random() * Math.PI * 2;
        return {
          x: cx, y: cy,
          tx: p.x, ty: p.y,
          vx: Math.cos(a) * (1 + Math.random() * 2),
          vy: Math.sin(a) * (1 + Math.random() * 2),
          size: 0.8 + Math.random() * 1,
          alpha: 1,
          hue: 258 + Math.random() * 35,
        };
      });

      slots.push({
        skill, phase: "travel", t0: now,
        cx, cy, fontSize, bbox, particles,
        trail: [],
        orbX: tipPos.x, orbY: tipPos.y,
        wandTipX: tipPos.x, wandTipY: tipPos.y,
      });

      skillIdx = (skillIdx + 1) % SKILLS.length;
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

      if (now - lastFire > FIRE_INTERVAL) {
        fireNewOrb(now, tipPos);
        lastFire = now;
      }

      for (const slot of slots) {
        if (slot.phase !== "done") updateSlot(slot, now);
      }

      for (let i = slots.length - 1; i >= 0; i--) {
        if (slots[i].phase === "done") slots.splice(i, 1);
      }

      raf.current = requestAnimationFrame(tick);
    }

    // Reduced motion fallback
    if (prefersReduced.current) {
      const fs = Math.round((baseFontMin + baseFontMax) / 2);
      const cols = 3;
      const rows = Math.ceil(SKILLS.length / cols);
      SKILLS.forEach((sk, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = W * (0.2 + col * 0.3);
        const y = H * (0.15 + row * (0.7 / rows));
        ctx.fillStyle = "rgba(237,233,254,0.8)";
        ctx.font = `bold ${fs}px "Inter", system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sk, x, y);
      });
      return undefined;
    }

    lastFire = performance.now() - FIRE_INTERVAL;
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

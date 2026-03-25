"use client";

import { motion } from "framer-motion";
import { ArrowDown, FileText } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Atmospheric radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-accent/[0.06] blur-[140px]" />
        <div className="absolute top-2/3 left-1/4 h-[300px] w-[300px] rounded-full bg-accent-light/[0.03] blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 h-[200px] w-[200px] rounded-full bg-gold/[0.02] blur-[80px]" />
      </div>

      {/* Geometric ring motif */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full border border-accent/[0.04] animate-[spin_120s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border border-accent/[0.06] animate-[spin_90s_linear_infinite_reverse]" />
        <div className="absolute inset-16 rounded-full border border-accent/[0.03]" />
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[1]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          custom={0}
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/[0.15] bg-accent/[0.05] px-4 py-1.5 text-xs font-mono text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Open to opportunities
        </motion.div>

        <motion.h1
          custom={1}
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-foreground">Roy Vivante</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl md:text-2xl font-medium text-muted mb-4"
        >
          Full-Stack Developer{" "}
          <span className="text-foreground/60">with a strong backend focus</span>
        </motion.p>

        <motion.p
          custom={3}
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="text-base text-muted/70 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          I build real-world systems, APIs, and production-ready web experiences.
          <br className="hidden sm:block" />
          From database schemas to polished interfaces.
        </motion.p>

        <motion.div
          custom={4}
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(124,58,237,0.3)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            View Projects
            <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href="/Roy_Vivante_CV_final.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-accent/[0.15] bg-accent/[0.04] px-6 py-3 text-sm font-medium text-muted hover:text-foreground hover:border-accent/[0.3] transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <FileText size={16} />
            Download Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}

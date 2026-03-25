"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { TECH_STACK } from "@/data/portfolio";
import { SectionHeading } from "./section-heading";
import { TechOrbit } from "./tech-orbit";

export function TechStack() {
  return (
    <section id="stack" className="relative py-24 sm:py-32 px-6">
      <SectionHeading
        label="Tools"
        title="Tech Stack"
        description="The technologies I use to design, build, and deploy production systems."
      />

      {/* 3D Orbit visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl mb-16"
      >
        <Suspense
          fallback={
            <div className="h-[400px] sm:h-[500px] flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            </div>
          }
        >
          <TechOrbit />
        </Suspense>
      </motion.div>

      {/* Grouped badges (fallback/detailed view) */}
      <div className="mx-auto max-w-4xl space-y-8">
        {TECH_STACK.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: gi * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted/60">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-card-border bg-card px-3.5 py-2 text-sm text-muted hover:text-foreground hover:border-card-border-hover transition-all duration-200 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

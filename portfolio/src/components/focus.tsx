"use client";

import { motion } from "framer-motion";
import { Server, Shield, Rocket, Monitor, Lightbulb, Boxes } from "lucide-react";
import { FOCUS_AREAS } from "@/data/portfolio";
import { SectionHeading } from "./section-heading";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  server: Server,
  blocks: Boxes,
  shield: Shield,
  rocket: Rocket,
  monitor: Monitor,
  lightbulb: Lightbulb,
};

const reveal = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

export function Focus() {
  return (
    <section className="relative py-24 sm:py-32 px-6">
      <SectionHeading
        label="Approach"
        title="What I Focus On"
        description="The principles that guide how I think about building software."
      />
      <div className="mx-auto max-w-6xl grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FOCUS_AREAS.map((area, i) => {
          const Icon = ICON_MAP[area.icon] ?? Server;
          return (
            <motion.div
              key={area.title}
              custom={i}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative rounded-2xl border border-card-border bg-card/80 backdrop-blur-sm p-6 transition-all duration-500 hover:border-card-border-hover"
            >
              <div className="mb-4 relative flex h-10 w-10 items-center justify-center rounded-lg bg-accent/[0.08] text-accent">
                {/* Icon halo */}
                <div className="absolute inset-0 rounded-lg bg-accent/[0.04] blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icon size={20} className="relative z-10" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{area.title}</h3>
              <p className="text-sm text-muted/80 leading-relaxed">{area.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

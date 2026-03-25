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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
              className="group relative rounded-2xl border border-card-border bg-card p-6 transition-all duration-300 hover:border-card-border-hover"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon size={20} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{area.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{area.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

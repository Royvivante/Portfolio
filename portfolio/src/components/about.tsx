"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 px-6">
      <SectionHeading label="Background" title="About Me" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-2xl border border-card-border bg-card p-8 sm:p-10 space-y-4 text-sm sm:text-base text-muted leading-relaxed">
          <p>
            I&apos;m a Computer Science student at HIT (Holon Institute of Technology), graduating
            October 2026. I got into software engineering because I like building things that
            actually work — not just prototypes, but systems that run in production and solve real
            problems.
          </p>
          <p>
            My strongest interest is in backend engineering and system design — designing clean APIs,
            modeling databases, handling auth and permissions correctly, and thinking through the
            architecture before writing code. That said, I also enjoy frontend work and care about
            shipping polished, responsive interfaces.
          </p>
          <p>
            Before university, I served as a combat soldier in the IDF and worked as a computer
            technician building custom PCs and managing e-commerce operations. These experiences
            taught me discipline, ownership, and how to operate under pressure.
          </p>
          <p className="text-foreground/80">
            I&apos;m looking for backend, full-stack, or system engineering roles where I can
            contribute to meaningful products and keep growing as an engineer.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

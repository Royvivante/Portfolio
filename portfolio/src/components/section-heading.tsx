"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="mb-14 text-center"
    >
      <span className="mb-3 inline-block font-mono text-xs uppercase tracking-widest text-accent/70">
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {description && (
        <p className="mt-4 mx-auto max-w-xl text-base text-muted/80 leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}

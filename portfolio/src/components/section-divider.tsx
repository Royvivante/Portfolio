"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionDivider({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8 }}
      className={cn("flex items-center justify-center py-4", className)}
    >
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Left line */}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/20 to-accent/10" />

        {/* Center geometric mark */}
        <div className="relative flex items-center justify-center">
          <div className="h-2 w-2 rotate-45 border border-accent/30 bg-accent/[0.06]" />
          <div className="absolute h-1 w-1 rotate-45 bg-accent/40 animate-pulse" />
        </div>

        {/* Right line */}
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/20 to-accent/10" />
      </div>
    </motion.div>
  );
}

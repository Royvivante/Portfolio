"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
}

export function TiltCard({
  children,
  className,
  glareColor = "rgba(99, 102, 241, 0.08)",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (y - 0.5) * -10;
      const rotateY = (x - 0.5) * 10;

      setTransform({ rotateX, rotateY });
      setGlare({ x: x * 100, y: y * 100, opacity: 1 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={cn("relative", className)}
    >
      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${glareColor}, transparent 60%)`,
          opacity: glare.opacity,
        }}
      />

      {/* Border glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(99,102,241,0.15), transparent 50%)`,
          opacity: glare.opacity,
        }}
      />

      {children}
    </motion.div>
  );
}

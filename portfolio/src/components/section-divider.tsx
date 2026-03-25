"use client";

import { WavePath } from "./ui/wave-path";
import { cn } from "@/lib/utils";

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center text-white/[0.08]",
        className
      )}
    >
      <WavePath />
    </div>
  );
}

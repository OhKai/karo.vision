"use client";

import { cn } from "@/lib/utils";

type AudioBarAnimationProps = {
  className?: string;
  barCount?: number;
};

const AudioBarAnimation = ({
  className,
  barCount = 4,
}: AudioBarAnimationProps) => {
  return (
    <div
      className={cn(
        "flex h-8 items-center justify-center gap-[3px]",
        className,
      )}
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary animate-audio-bar h-full w-[3px] rounded-full",
          )}
          style={{
            animationFillMode: "both",
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${0.8 + i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AudioBarAnimation;

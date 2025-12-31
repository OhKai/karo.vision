"use client";

import { Heart } from "lucide-react";

type LifeCounterProps = {
  lives: number;
};

export function LifeCounter({ lives }: LifeCounterProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 animate-pulse blur-xl bg-linear-to-r from-rose-500 via-pink-500 to-red-500 opacity-20 rounded-full" />
      <div className="relative flex items-center gap-3 rounded-full bg-linear-to-br from-card via-card to-card/80 backdrop-blur-md px-8 py-4 shadow-2xl border-2 border-purple-500/30">
        <span className="text-base font-bold text-foreground tracking-wide">
          LIVES
        </span>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative">
              {i < lives && (
                <div className="absolute inset-0 blur-md">
                  <Heart className="h-8 w-8 fill-rose-500 text-rose-500 opacity-50" />
                </div>
              )}
              <Heart
                className={`relative h-8 w-8 transition-all duration-500 ${
                  i < lives
                    ? "fill-rose-500 text-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                    : "fill-muted/20 text-muted/30 scale-75 opacity-40 blur-[1px]"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

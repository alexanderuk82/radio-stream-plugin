import React from "react";

interface EqualizerProps {
  isPlaying: boolean;
  color?: string;
  size?: "sm" | "md";
}

export function Equalizer({
  isPlaying,
  color = "#8b5cf6",
  size = "md",
}: EqualizerProps) {
  const h = size === "sm" ? "h-3" : "h-4";
  const barW = size === "sm" ? "w-[2px]" : "w-[3px]";
  const gap = size === "sm" ? "gap-[2px]" : "gap-[2px]";

  return (
    <div className={`flex items-end ${gap} ${h}`}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`${barW} rounded-full transition-all duration-100 ${
            isPlaying ? `animate-eq-${i}` : ""
          }`}
          style={{
            backgroundColor: color,
            height: isPlaying ? undefined : "4px",
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
}

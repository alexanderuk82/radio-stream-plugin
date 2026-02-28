import React from "react";
import type { Station } from "../types";
import { Equalizer } from "./Equalizer";
import {
  PlayIcon,
  PauseIcon,
  SkipNextIcon,
  SkipPrevIcon,
  ExpandIcon,
  LoadingSpinner,
} from "./Icons";

interface MiniPlayerProps {
  station: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExpand: () => void;
  accentColor: string;
}

export function MiniPlayer({
  station,
  isPlaying,
  isLoading,
  onTogglePlay,
  onNext,
  onPrev,
  onExpand,
  accentColor,
}: MiniPlayerProps) {
  return (
    <div className="h-full flex flex-col bg-surface-0 select-none">
      {/* Subtle top gradient accent */}
      <div
        className="h-[2px] w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: isPlaying ? 0.8 : 0.3,
        }}
      />

      <div className="flex-1 flex items-center gap-3 px-3 min-h-0">
        {/* Station art or placeholder */}
        <div className="relative shrink-0">
          {station?.favicon ? (
            <img
              src={station.favicon}
              alt=""
              className="w-10 h-10 rounded-lg object-cover bg-surface-3"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (
                  e.target as HTMLImageElement
                ).nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br from-accent/40 to-purple-900/60 flex items-center justify-center ${station?.favicon ? "hidden" : ""}`}
          >
            {isPlaying ? (
              <Equalizer isPlaying={true} color={accentColor} size="sm" />
            ) : (
              <span className="text-base">\ud83d\udcfb</span>
            )}
          </div>
        </div>

        {/* Station info */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-white truncate leading-tight">
            {station?.name || "Pulse Radio"}
          </div>
          <div className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
            {station
              ? station.tags?.split(",")[0] || "Live Radio"
              : "Select a station"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onPrev}
            className="w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <SkipPrevIcon size={12} />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-600 text-white shadow-md shadow-accent/20 hover:shadow-accent/40 hover:scale-105 active:scale-95 transition-all"
          >
            {isLoading ? (
              <LoadingSpinner size={14} />
            ) : isPlaying ? (
              <PauseIcon size={14} />
            ) : (
              <PlayIcon size={14} />
            )}
          </button>

          <button
            onClick={onNext}
            className="w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <SkipNextIcon size={12} />
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <button
            onClick={onExpand}
            className="w-6 h-6 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all"
            title="Expand"
          >
            <ExpandIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  PlayIcon,
  PauseIcon,
  SkipNextIcon,
  SkipPrevIcon,
  LoadingSpinner,
} from "./Icons";

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  compact?: boolean;
}

export function PlayerControls({
  isPlaying,
  isLoading,
  onTogglePlay,
  onNext,
  onPrev,
  compact = false,
}: PlayerControlsProps) {
  const btnSize = compact ? "w-7 h-7" : "w-8 h-8";
  const playBtnSize = compact ? "w-9 h-9" : "w-11 h-11";

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onPrev}
        className={`${btnSize} flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all`}
        title="Previous station"
      >
        <SkipPrevIcon size={compact ? 14 : 16} />
      </button>

      <button
        onClick={onTogglePlay}
        className={`${playBtnSize} flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-600 text-white shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 active:scale-95 transition-all`}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isLoading ? (
          <LoadingSpinner size={compact ? 16 : 20} />
        ) : isPlaying ? (
          <PauseIcon size={compact ? 16 : 20} />
        ) : (
          <PlayIcon size={compact ? 16 : 20} />
        )}
      </button>

      <button
        onClick={onNext}
        className={`${btnSize} flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all`}
        title="Next station"
      >
        <SkipNextIcon size={compact ? 14 : 16} />
      </button>
    </div>
  );
}

import React from "react";
import { VolumeUpIcon, VolumeOffIcon, VolumeMuteIcon } from "./Icons";

interface VolumeSliderProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}

export function VolumeSlider({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeSliderProps) {
  const displayVolume = isMuted ? 0 : volume;
  const pct = Math.round(displayVolume * 100);

  const VIcon =
    isMuted || volume === 0
      ? VolumeOffIcon
      : volume < 0.5
        ? VolumeMuteIcon
        : VolumeUpIcon;

  return (
    <div className="flex items-center gap-2 group">
      <button
        onClick={onToggleMute}
        className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        title={isMuted ? "Unmute" : "Mute"}
      >
        <VIcon size={14} />
      </button>
      <div className="relative flex-1 h-5 flex items-center">
        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400 transition-all duration-100"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={pct}
          onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title={`Volume: ${pct}%`}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md shadow-black/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
      <span className="text-[10px] text-white/30 tabular-nums w-7 text-right">
        {pct}%
      </span>
    </div>
  );
}

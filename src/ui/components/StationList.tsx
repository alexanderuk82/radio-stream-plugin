import React from "react";
import type { Station } from "../types";
import { Equalizer } from "./Equalizer";
import { StarOutlineIcon, StarFilledIcon } from "./Icons";

interface StationListProps {
  stations: Station[];
  currentStation: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  onSelect: (station: Station) => void;
  accentColor?: string;
  favorites: Set<string>;
  onToggleFavorite: (station: Station) => void;
}

function StationFavicon({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = React.useState(false);

  if (!url || failed) {
    const colors = [
      "from-violet-600 to-purple-700",
      "from-blue-600 to-cyan-700",
      "from-pink-600 to-rose-700",
      "from-emerald-600 to-teal-700",
      "from-orange-600 to-amber-700",
      "from-indigo-600 to-blue-700",
    ];
    const idx = name.length % colors.length;

    return (
      <div
        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-xs font-bold shadow-inner shrink-0`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className="w-9 h-9 rounded-lg object-cover bg-surface-3 shrink-0"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-1 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-9 h-9 rounded-lg bg-white/5" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-white/5 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
            <div className="h-2 bg-white/5 rounded" style={{ width: `${30 + Math.random() * 20}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StationList({
  stations,
  currentStation,
  isPlaying,
  isLoading,
  onSelect,
  accentColor = "#8b5cf6",
  favorites,
  onToggleFavorite,
}: StationListProps) {
  if (isLoading) return <SkeletonList />;

  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-white/30 text-xs gap-2">
        <span className="text-3xl">{"\u2b50"}</span>
        <span className="text-center px-6 leading-relaxed">
          No favorites yet
          <br />
          <span className="text-white/20">
            Browse a genre and tap the {"\u2606"} to save stations
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {stations.map((station) => {
        const isCurrent = currentStation?.id === station.id;
        const isActive = isCurrent && isPlaying;
        const isFav = favorites.has(station.id);

        return (
          <div
            key={station.id}
            className={`group flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-lg transition-all ${
              isCurrent ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
            }`}
          >
            {/* Star - visible on hover or if favorited */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(station);
              }}
              className={`w-6 h-6 flex items-center justify-center rounded-full shrink-0 transition-all duration-150 ${
                isFav
                  ? "text-amber-400 hover:text-amber-300 hover:scale-110"
                  : "text-transparent group-hover:text-white/20 hover:!text-amber-400 hover:scale-110"
              }`}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {isFav ? <StarFilledIcon size={12} /> : <StarOutlineIcon size={12} />}
            </button>

            {/* Station - click to play */}
            <button
              onClick={() => onSelect(station)}
              className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
            >
              <div className="relative shrink-0">
                <StationFavicon url={station.favicon} name={station.name} />
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                    <Equalizer isPlaying={true} color={accentColor} size="sm" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium truncate ${isCurrent ? "text-white" : "text-white/80"}`}>
                  {station.name}
                </div>
                <div className="text-[10px] text-white/30 truncate mt-0.5">
                  {station.tags
                    ? station.tags.split(",").slice(0, 3).join(" \u00b7 ")
                    : station.country || "Radio"}
                </div>
              </div>

              {station.bitrate > 0 && (
                <span className="text-[9px] text-white/20 tabular-nums shrink-0">
                  {station.bitrate}k
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

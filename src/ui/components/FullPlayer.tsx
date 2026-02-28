import React from "react";
import type { Station, Category } from "../types";
import { Equalizer } from "./Equalizer";
import { PlayerControls } from "./PlayerControls";
import { VolumeSlider } from "./VolumeSlider";
import { CategoryPills } from "./CategoryPills";
import { CountryPills } from "./CountryPills";
import { SearchInput } from "./SearchInput";
import { StationList } from "./StationList";
import { MinimizeIcon } from "./Icons";

interface FullPlayerProps {
  station: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  error: string | null;
  stations: Station[];
  isLoadingStations: boolean;
  categories: Category[];
  activeCategory: string;
  activeCountry: string;
  searchQuery: string;
  accentColor: string;
  favorites: Set<string>;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectStation: (station: Station) => void;
  onSelectCategory: (id: string) => void;
  onCountryChange: (code: string) => void;
  onSearchChange: (query: string) => void;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
  onToggleFavorite: (station: Station) => void;
  onMinimize: () => void;
}

function NowPlayingArt({
  station,
  isPlaying,
  accentColor,
}: {
  station: Station | null;
  isPlaying: boolean;
  accentColor: string;
}) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const prevSrc = React.useRef<string>("");

  React.useEffect(() => {
    if (station?.favicon && station.favicon !== prevSrc.current) {
      setImgFailed(false);
      prevSrc.current = station.favicon;
    }
  }, [station?.favicon]);

  return (
    <div className="relative mx-auto w-[120px] h-[120px] mb-2.5">
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl blur-2xl opacity-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle, ${accentColor}66, transparent)`,
          opacity: isPlaying ? 0.5 : 0.15,
        }}
      />

      {/* Art container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-3 shadow-2xl shadow-black/50">
        {station?.favicon && !imgFailed ? (
          <img
            src={station.favicon}
            alt=""
            className={`w-full h-full object-cover transition-transform duration-[8000ms] ${
              isPlaying ? "scale-110" : "scale-100"
            }`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/30 via-surface-2 to-purple-900/40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Equalizer
                isPlaying={isPlaying}
                color={accentColor}
                size="md"
              />
              <span className="text-2xl">{"\ud83d\udcfb"}</span>
            </div>
          </div>
        )}

        {/* Playing overlay shimmer */}
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        )}
      </div>
    </div>
  );
}

export function FullPlayer({
  station,
  isPlaying,
  isLoading,
  volume,
  isMuted,
  error,
  stations,
  isLoadingStations,
  categories,
  activeCategory,
  activeCountry,
  searchQuery,
  accentColor,
  favorites,
  onTogglePlay,
  onNext,
  onPrev,
  onSelectStation,
  onSelectCategory,
  onCountryChange,
  onSearchChange,
  onVolumeChange,
  onToggleMute,
  onToggleFavorite,
  onMinimize,
}: FullPlayerProps) {
  return (
    <div className="h-full flex flex-col bg-surface-0 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse-glow"
            style={{ backgroundColor: isPlaying ? accentColor : "#555" }}
          />
          <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
            Pulse Radio
          </span>
        </div>
        <button
          onClick={onMinimize}
          className="w-6 h-6 flex items-center justify-center rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-all"
          title="Minimize"
        >
          <MinimizeIcon size={12} />
        </button>
      </div>

      {/* Now Playing Section */}
      <div className="shrink-0 px-4 pb-1.5">
        <NowPlayingArt
          station={station}
          isPlaying={isPlaying}
          accentColor={accentColor}
        />

        {/* Track info */}
        <div className="text-center mb-2">
          <div className="text-sm font-semibold text-white truncate px-2">
            {station?.name || "No station selected"}
          </div>
          <div className="text-[11px] text-white/40 truncate mt-0.5 px-2">
            {station
              ? station.tags?.split(",").slice(0, 2).join(" \u00b7 ") ||
                "Live Radio"
              : "Browse stations below"}
          </div>
          {error && (
            <div className="text-[10px] text-red-400 mt-1">{error}</div>
          )}
        </div>

        {/* Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          onTogglePlay={onTogglePlay}
          onNext={onNext}
          onPrev={onPrev}
        />

        {/* Volume */}
        <div className="mt-1.5 px-2">
          <VolumeSlider
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-4 shrink-0" />

      {/* Search + Filters */}
      <div className="shrink-0 px-3 pt-2.5 pb-1 space-y-2">
        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search stations\u2026"
        />

        {/* Genre pills */}
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelect={onSelectCategory}
        />

        {/* Country pills */}
        <CountryPills
          activeCountry={activeCountry}
          onSelect={onCountryChange}
        />
      </div>

      {/* Station list */}
      <div className="flex-1 overflow-y-auto px-1 pb-2 min-h-0 scrollbar-thin">
        <StationList
          stations={stations}
          currentStation={station}
          isPlaying={isPlaying}
          isLoading={isLoadingStations}
          onSelect={onSelectStation}
          accentColor={accentColor}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  );
}

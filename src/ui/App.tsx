import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { Station } from "./types";
import { CATEGORIES } from "./types";
import { useAudio } from "./hooks/useAudio";
import { useRadio } from "./hooks/useRadio";
import { sendResize } from "./hooks/useStorage";
import { getSomaColor } from "./api/somafm";
import { MiniPlayer } from "./components/MiniPlayer";
import { FullPlayer } from "./components/FullPlayer";

const MINI_WIDTH = 300;
const MINI_HEIGHT = 60;
const FULL_WIDTH = 320;
const FULL_HEIGHT = 640;

export default function App() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [favoriteStations, setFavoriteStations] = useState<Station[]>([]);
  const stationIndexRef = useRef(0);

  const audio = useAudio(0.7);
  const radio = useRadio();

  // Derived set of favorite IDs for quick lookup
  const favoriteIds = useMemo(
    () => new Set(favoriteStations.map((s) => s.id)),
    [favoriteStations]
  );

  // Determine which stations to display
  const displayStations =
    radio.activeCategory === "favorites" && !radio.searchQuery.trim()
      ? favoriteStations
      : radio.stations;

  // Determine accent color based on current station/category
  const accentColor = currentStation?.id.startsWith("soma-")
    ? getSomaColor(currentStation.id)
    : CATEGORIES.find((c) => c.id === radio.activeCategory)?.color || "#8b5cf6";

  // Send a toast notification to Figma
  const sendToast = useCallback((message: string) => {
    parent.postMessage({ pluginMessage: { type: "toast", message } }, "*");
  }, []);

  // Toggle favorite for a station
  const handleToggleFavorite = useCallback(
    (station: Station) => {
      setFavoriteStations((prev) => {
        const exists = prev.some((s) => s.id === station.id);
        let next: Station[];
        if (exists) {
          next = prev.filter((s) => s.id !== station.id);
          sendToast("Removed from favourites");
        } else {
          next = [...prev, station];
          sendToast("Added to favourites \u2b50");
        }
        // Persist favorites
        parent.postMessage(
          { pluginMessage: { type: "save-favorites", favorites: next } },
          "*"
        );
        return next;
      });
    },
    [sendToast]
  );

  // Restore state from plugin storage
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage;
      if (!msg) return;

      if (msg.type === "restored-state" && msg.state) {
        const s = msg.state;
        if (s.volume !== undefined) audio.setVolume(s.volume);
        if (s.isMinimized !== undefined) setIsMinimized(s.isMinimized);
        if (s.category) radio.loadStations({ category: s.category });
      }

      if (msg.type === "restored-favorites" && Array.isArray(msg.favorites)) {
        setFavoriteStations(msg.favorites);
      }
    };

    window.addEventListener("message", handler);
    parent.postMessage({ pluginMessage: { type: "get-state" } }, "*");
    return () => window.removeEventListener("message", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save state when important values change
  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "save-state",
          state: {
            volume: audio.volume,
            isMinimized,
            category: radio.activeCategory,
          },
        },
      },
      "*"
    );
  }, [audio.volume, isMinimized, radio.activeCategory]);

  const handleSelectStation = useCallback(
    (station: Station) => {
      setCurrentStation(station);
      const idx = displayStations.findIndex((s) => s.id === station.id);
      if (idx !== -1) stationIndexRef.current = idx;
      audio.play(station.url);
    },
    [audio, displayStations]
  );

  const handleNext = useCallback(() => {
    if (displayStations.length === 0) return;
    const nextIdx = (stationIndexRef.current + 1) % displayStations.length;
    stationIndexRef.current = nextIdx;
    const next = displayStations[nextIdx];
    setCurrentStation(next);
    audio.play(next.url);
  }, [displayStations, audio]);

  const handlePrev = useCallback(() => {
    if (displayStations.length === 0) return;
    const prevIdx =
      stationIndexRef.current <= 0
        ? displayStations.length - 1
        : stationIndexRef.current - 1;
    stationIndexRef.current = prevIdx;
    const prev = displayStations[prevIdx];
    setCurrentStation(prev);
    audio.play(prev.url);
  }, [displayStations, audio]);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
    sendResize(MINI_WIDTH, MINI_HEIGHT);
  }, []);

  const handleExpand = useCallback(() => {
    setIsMinimized(false);
    sendResize(FULL_WIDTH, FULL_HEIGHT);
  }, []);

  const handleSelectCategory = useCallback(
    (id: string) => {
      radio.loadStations({ category: id, search: "" });
    },
    [radio]
  );

  const handleCountryChange = useCallback(
    (code: string) => {
      radio.loadStations({ country: code });
    },
    [radio]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      radio.loadStations({ search: query });
    },
    [radio]
  );

  if (isMinimized) {
    return (
      <MiniPlayer
        station={currentStation}
        isPlaying={audio.isPlaying}
        isLoading={audio.isLoading}
        onTogglePlay={audio.togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        onExpand={handleExpand}
        accentColor={accentColor}
      />
    );
  }

  return (
    <FullPlayer
      station={currentStation}
      isPlaying={audio.isPlaying}
      isLoading={audio.isLoading}
      volume={audio.volume}
      isMuted={audio.isMuted}
      error={audio.error}
      stations={displayStations}
      isLoadingStations={radio.isLoadingStations}
      categories={radio.categories}
      activeCategory={radio.activeCategory}
      activeCountry={radio.activeCountry}
      searchQuery={radio.searchQuery}
      accentColor={accentColor}
      favorites={favoriteIds}
      onTogglePlay={audio.togglePlay}
      onNext={handleNext}
      onPrev={handlePrev}
      onSelectStation={handleSelectStation}
      onSelectCategory={handleSelectCategory}
      onCountryChange={handleCountryChange}
      onSearchChange={handleSearchChange}
      onVolumeChange={audio.setVolume}
      onToggleMute={audio.toggleMute}
      onToggleFavorite={handleToggleFavorite}
      onMinimize={handleMinimize}
    />
  );
}

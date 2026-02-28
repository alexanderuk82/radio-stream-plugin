import { useState, useCallback, useRef } from "react";
import type { Station, Category } from "../types";
import { CATEGORIES } from "../types";
import { searchByTags, searchByName } from "../api/radioBrowser";

interface UseRadioReturn {
  stations: Station[];
  isLoadingStations: boolean;
  activeCategory: string;
  activeCountry: string;
  searchQuery: string;
  loadStations: (opts?: {
    category?: string;
    country?: string;
    search?: string;
  }) => Promise<void>;
  categories: Category[];
}

export function useRadio(): UseRadioReturn {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [activeCategory, setActiveCategory] = useState("favorites");
  const [activeCountry, setActiveCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const cacheRef = useRef<Map<string, Station[]>>(new Map());

  // Keep refs so the callback stays stable
  const stateRef = useRef({
    activeCategory: "favorites",
    activeCountry: "",
    searchQuery: "",
  });
  stateRef.current = { activeCategory, activeCountry, searchQuery };

  const loadStations = useCallback(
    async (
      opts: {
        category?: string;
        country?: string;
        search?: string;
      } = {}
    ) => {
      const prev = stateRef.current;
      const cat =
        opts.category !== undefined ? opts.category : prev.activeCategory;
      const cc =
        opts.country !== undefined ? opts.country : prev.activeCountry;
      const q = opts.search !== undefined ? opts.search : prev.searchQuery;

      // Update state
      if (opts.category !== undefined) setActiveCategory(cat);
      if (opts.country !== undefined) setActiveCountry(cc);
      if (opts.search !== undefined) setSearchQuery(q);

      // Favorites (no search) — handled by App.tsx
      if (cat === "favorites" && !q.trim()) {
        setStations([]);
        return;
      }

      // Search by name
      if (q.trim()) {
        setIsLoadingStations(true);
        try {
          const results = await searchByName(q, 30, cc || undefined);
          setStations(results);
        } catch {
          setStations([]);
        } finally {
          setIsLoadingStations(false);
        }
        return;
      }

      // Load by category + country
      const cacheKey = `${cat}:${cc}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setStations(cached);
        return;
      }

      const category = CATEGORIES.find((c) => c.id === cat);
      if (!category || category.tags.length === 0) {
        setStations([]);
        return;
      }

      setIsLoadingStations(true);
      try {
        const results = await searchByTags(
          category.tags,
          30,
          cc || undefined
        );
        cacheRef.current.set(cacheKey, results);
        setStations(results);
      } catch {
        setStations([]);
      } finally {
        setIsLoadingStations(false);
      }
    },
    []
  );

  return {
    stations,
    isLoadingStations,
    activeCategory,
    activeCountry,
    searchQuery,
    loadStations,
    categories: CATEGORIES,
  };
}

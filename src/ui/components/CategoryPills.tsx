import React, { useRef, useState, useEffect, useCallback } from "react";
import type { Category } from "../types";

interface CategoryPillsProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

const DRAG_THRESHOLD = 5;

export function CategoryPills({
  categories,
  activeCategory,
  onSelect,
}: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Drag state kept in refs to avoid re-renders
  const pointerDown = useRef(false);
  const hasDragged = useRef(false);
  const originX = useRef(0);
  const originScroll = useRef(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [checkScroll, categories]);

  const scrollByAmount = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 120, behavior: "smooth" });
  };

  // --- pointer handlers on the scroll container ---
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDown.current = true;
    hasDragged.current = false;
    originX.current = e.clientX;
    originScroll.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerDown.current) return;
    const dx = e.clientX - originX.current;
    // Only start dragging after passing threshold
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      hasDragged.current = true;
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = originScroll.current - dx;
      }
    }
  };

  const handlePointerUp = () => {
    pointerDown.current = false;
    // hasDragged stays true until next pointerDown
  };

  // Pill click: only fire if we didn't drag
  const handlePillClick = (catId: string) => {
    if (hasDragged.current) {
      // Reset for the next interaction
      hasDragged.current = false;
      return;
    }
    onSelect(catId);
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount(-1)}
          className="absolute left-0 top-0 bottom-1 z-10 w-7 flex items-center justify-center bg-gradient-to-r from-surface-0 via-surface-0/90 to-transparent"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white/60 hover:text-white">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={(e) => {
          scrollRef.current?.scrollBy({ left: e.deltaY > 0 ? 80 : -80 });
        }}
        className="flex gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-hide select-none"
        style={{ cursor: "grab" }}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onPointerUp={() => handlePillClick(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "text-white shadow-lg"
                  : "bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10"
              }`}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${cat.color}cc, ${cat.color}88)`,
                      boxShadow: `0 2px 12px ${cat.color}44`,
                    }
                  : undefined
              }
            >
              <span className="text-sm leading-none">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scrollByAmount(1)}
          className="absolute right-0 top-0 bottom-1 z-10 w-7 flex items-center justify-center bg-gradient-to-l from-surface-0 via-surface-0/90 to-transparent"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white/60 hover:text-white">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      )}
    </div>
  );
}

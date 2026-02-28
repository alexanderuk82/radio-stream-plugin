import React, { useRef, useState, useEffect, useCallback } from "react";
import type { Country } from "../types";
import { COUNTRIES } from "../types";

interface CountryPillsProps {
  activeCountry: string;
  onSelect: (code: string) => void;
}

const DRAG_THRESHOLD = 5;

export function CountryPills({ activeCountry, onSelect }: CountryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  }, [checkScroll]);

  const scrollByAmount = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 100, behavior: "smooth" });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDown.current = true;
    hasDragged.current = false;
    originX.current = e.clientX;
    originScroll.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerDown.current) return;
    const dx = e.clientX - originX.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      hasDragged.current = true;
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = originScroll.current - dx;
      }
    }
  };

  const handlePointerUp = () => {
    pointerDown.current = false;
  };

  const handlePillClick = (code: string) => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    onSelect(code);
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount(-1)}
          className="absolute left-0 top-0 bottom-1 z-10 w-6 flex items-center justify-center bg-gradient-to-r from-surface-0 via-surface-0/90 to-transparent"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 hover:text-white">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
      )}

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
        className="flex gap-1 overflow-x-auto pb-0.5 px-0.5 scrollbar-hide select-none"
        style={{ cursor: "grab" }}
      >
        {COUNTRIES.map((c: Country) => {
          const isActive = c.code === activeCountry;
          return (
            <button
              key={c.code || "_all"}
              onPointerUp={() => handlePillClick(c.code)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "bg-white/[0.04] text-white/35 hover:text-white/60 hover:bg-white/[0.07]"
              }`}
            >
              <span className="text-xs leading-none">{c.flag}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scrollByAmount(1)}
          className="absolute right-0 top-0 bottom-1 z-10 w-6 flex items-center justify-center bg-gradient-to-l from-surface-0 via-surface-0/90 to-transparent"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 hover:text-white">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      )}
    </div>
  );
}

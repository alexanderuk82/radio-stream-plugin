import React, { useState, useEffect, useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search stations\u2026",
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external -> local (when search is cleared externally)
  useEffect(() => {
    if (value === "" && local !== "") setLocal("");
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocal(v);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(v);
    }, 400);
  };

  const handleClear = () => {
    setLocal("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative group">
      {/* Magnifying glass icon */}
      <svg
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 group-focus-within:text-white/50 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-8 pl-8 pr-7 rounded-lg bg-white/[0.06] text-xs text-white placeholder-white/25 outline-none border border-transparent focus:border-white/10 focus:bg-white/[0.08] transition-all"
      />

      {/* Clear button */}
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/40 hover:text-white/70 transition-all"
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

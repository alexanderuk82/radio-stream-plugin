/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/ui/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "#06060a",
          1: "#0d0d14",
          2: "#13131d",
          3: "#1a1a28",
          4: "#222233",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          dim: "#7c3aed",
          bright: "#a78bfa",
          glow: "rgba(139, 92, 246, 0.3)",
        },
        pink: {
          accent: "#ec4899",
          glow: "rgba(236, 72, 153, 0.3)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      animation: {
        "eq-1": "eq 0.8s ease-in-out infinite alternate",
        "eq-2": "eq 0.6s ease-in-out infinite alternate-reverse",
        "eq-3": "eq 1s ease-in-out infinite alternate",
        "eq-4": "eq 0.7s ease-in-out infinite alternate-reverse",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.2s ease-out",
        spin: "spin 8s linear infinite",
      },
      keyframes: {
        eq: {
          "0%": { height: "4px" },
          "100%": { height: "100%" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

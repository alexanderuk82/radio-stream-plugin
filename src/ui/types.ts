export interface Station {
  id: string;
  name: string;
  url: string;
  favicon: string;
  tags: string;
  country: string;
  codec: string;
  bitrate: number;
  votes: number;
  clickcount: number;
  homepage: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  tags: string[];
  color: string;
}

export interface Country {
  code: string;
  label: string;
  flag: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentStation: Station | null;
  volume: number;
  category: string;
  isMinimized: boolean;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}

export const COUNTRIES: Country[] = [
  { code: "", label: "All", flag: "\ud83c\udf0e" },
  { code: "US", label: "USA", flag: "\ud83c\uddfa\ud83c\uddf8" },
  { code: "GB", label: "UK", flag: "\ud83c\uddec\ud83c\udde7" },
  { code: "CO", label: "Colombia", flag: "\ud83c\udde8\ud83c\uddf4" },
  { code: "EC", label: "Ecuador", flag: "\ud83c\uddea\ud83c\udde8" },
  { code: "CL", label: "Chile", flag: "\ud83c\udde8\ud83c\uddf1" },
  { code: "ES", label: "Spain", flag: "\ud83c\uddea\ud83c\uddf8" },
  { code: "IT", label: "Italy", flag: "\ud83c\uddee\ud83c\uddf9" },
  { code: "PL", label: "Poland", flag: "\ud83c\uddf5\ud83c\uddf1" },
  { code: "SE", label: "Sweden", flag: "\ud83c\uddf8\ud83c\uddea" },
  { code: "NO", label: "Norway", flag: "\ud83c\uddf3\ud83c\uddf4" },
];

export const CATEGORIES: Category[] = [
  {
    id: "favorites",
    label: "Favorites",
    icon: "\u2764\ufe0f",
    tags: [],
    color: "#ef4444",
  },
  {
    id: "lofi",
    label: "Lo-Fi",
    icon: "\ud83c\udf1a",
    tags: ["lofi", "lo-fi", "chillhop", "lofi hip hop"],
    color: "#a78bfa",
  },
  {
    id: "chill",
    label: "Chill",
    icon: "\ud83c\udf19",
    tags: ["chillout", "ambient", "downtempo", "relaxation"],
    color: "#8b5cf6",
  },
  {
    id: "electronic",
    label: "House",
    icon: "\u26a1",
    tags: ["house", "electronic", "techno", "edm", "trance"],
    color: "#3b82f6",
  },
  {
    id: "rock",
    label: "Rock",
    icon: "\ud83c\udfb8",
    tags: ["rock", "alternative", "indie rock", "classic rock"],
    color: "#ef4444",
  },
  {
    id: "latin",
    label: "Latin",
    icon: "\ud83c\udf1e",
    tags: ["latin", "salsa", "reggaeton", "bachata", "cumbia", "tropical"],
    color: "#f97316",
  },
  {
    id: "pop",
    label: "Pop",
    icon: "\ud83c\udf08",
    tags: ["pop", "top 40", "hits", "top40"],
    color: "#ec4899",
  },
  {
    id: "jazz",
    label: "Jazz",
    icon: "\ud83c\udfb7",
    tags: ["jazz", "smooth jazz", "bossa nova", "soul jazz"],
    color: "#14b8a6",
  },
  {
    id: "hiphop",
    label: "Hip-Hop",
    icon: "\ud83c\udfa4",
    tags: ["hip-hop", "hiphop", "rap", "trap"],
    color: "#a855f7",
  },
  {
    id: "classical",
    label: "Classical",
    icon: "\ud83c\udfbb",
    tags: ["classical", "orchestra", "symphony", "piano"],
    color: "#6366f1",
  },
];

# 🎵 Pulse Radio - Figma Plugin

A live internet radio music player plugin for Figma. Stream free radio stations by genre while you design.

![Figma Plugin](https://img.shields.io/badge/Figma-Plugin-purple?logo=figma)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

## ✨ Features

- **90,000+ radio stations** via Radio Browser API (free, no API key needed)
- **10 genre categories**: Favorites, Lo-Fi, Chill, House, Rock, Latin, Pop, Jazz, Hip-Hop, Classical
- **Country filters**: USA, UK, Colombia, Ecuador, Chile, Spain, Italy, Poland, Sweden, Norway
- **Search**: Find stations by name with debounced search
- **Favorites**: Star any station to save it — persists between sessions
- **Mini/Full player**: Minimize to a compact 300×60 bar or expand to full 320×640 view
- **Volume control** with mute toggle
- **State persistence**: Volume, category, and favorites saved via Figma clientStorage
- **Dark premium UI** with animated equalizer, glow effects, and smooth transitions

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite + vite-plugin-singlefile | Bundles React app into single HTML file |
| Tailwind CSS 3 | Dark theme styling |
| esbuild | Compiles Figma main thread (code.ts) |
| Radio Browser API | Free radio station data (90k+ stations) |

## 🚀 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Figma Desktop App](https://www.figma.com/downloads/) (plugins don't work in the browser version for development)

### Step 1: Clone the repository

```bash
git clone https://github.com/alexanderuk82/radio-stream-plugin.git
cd radio-stream-plugin
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Build the plugin

```bash
npm run build
```

This will generate two files in the `dist/` folder:
- `dist/index.html` — The plugin UI (React app bundled into a single file)
- `dist/code.js` — The Figma main thread code

### Step 4: Load in Figma

1. Open **Figma Desktop**
2. Go to **Menu → Plugins → Development → Import plugin from manifest...**
3. Navigate to the cloned project folder and select `manifest.json`
4. The plugin will now appear under **Plugins → Development → Pulse Radio**
5. Click it to launch!

### Development Mode (Hot Reload)

```bash
npm run dev
```

This watches for file changes and automatically rebuilds both the UI and the plugin code. After each rebuild, close and reopen the plugin in Figma to see changes.

## 📁 Project Structure

```
radio-stream-plugin/
├── manifest.json            # Figma plugin manifest
├── package.json             # Dependencies & scripts
├── vite.config.ts           # Vite bundler config
├── tailwind.config.js       # Tailwind CSS theme
├── tsconfig.json            # TypeScript config (UI)
├── tsconfig.plugin.json     # TypeScript config (plugin thread)
├── postcss.config.js        # PostCSS config
├── src/
│   ├── code.ts              # Figma main thread (runs in QuickJS sandbox)
│   └── ui/
│       ├── index.html       # HTML entry point
│       ├── main.tsx         # React entry point
│       ├── App.tsx          # Main app component
│       ├── styles.css       # Tailwind imports + custom styles
│       ├── types.ts         # TypeScript interfaces & constants
│       ├── api/
│       │   ├── radioBrowser.ts  # Radio Browser API client
│       │   └── somafm.ts       # SomaFM color helpers
│       ├── hooks/
│       │   ├── useAudio.ts     # HTML5 Audio management
│       │   ├── useRadio.ts     # Station loading & caching
│       │   └── useStorage.ts   # Plugin ↔ Figma communication
│       └── components/
│           ├── FullPlayer.tsx   # Full-size player view
│           ├── MiniPlayer.tsx   # Minimized player bar
│           ├── PlayerControls.tsx
│           ├── VolumeSlider.tsx
│           ├── CategoryPills.tsx
│           ├── CountryPills.tsx
│           ├── SearchInput.tsx
│           ├── StationList.tsx
│           ├── Equalizer.tsx
│           └── Icons.tsx
└── dist/                    # Build output (gitignored)
    ├── index.html
    └── code.js
```

## 🎯 How It Works

1. **Plugin Architecture**: Figma plugins have two threads:
   - **Main thread** (`code.ts`): Runs in a QuickJS sandbox with access to the Figma API (resize, storage, notifications)
   - **UI thread** (`ui/`): An iframe running the React app with full browser APIs (Audio, fetch, DOM)

2. **Radio Browser API**: Free community API with 90,000+ stations. No API key required. Stations are fetched by genre tags and filtered to HTTPS-only streams (required by Figma's CSP).

3. **State Persistence**: Uses `figma.clientStorage` to save favorites, volume level, and active category between sessions.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run build` | Build both UI and plugin code for production |
| `npm run dev` | Watch mode — rebuilds on file changes |
| `npm run build:ui` | Build only the UI (React app) |
| `npm run build:code` | Build only the plugin main thread |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and build: `npm run build`
4. Test in Figma Desktop
5. Submit a Pull Request

## 📄 License

MIT

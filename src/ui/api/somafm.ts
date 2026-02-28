// SomaFM helpers - kept minimal since we no longer use curated defaults

export function getSomaColor(stationId: string): string {
  // Color map for any SomaFM stations the user may have favorited
  const colorMap: Record<string, string> = {
    "soma-groovesalad": "#2dd4bf",
    "soma-dronezone": "#6366f1",
    "soma-spacestation": "#3b82f6",
    "soma-deepspaceone": "#8b5cf6",
    "soma-lush": "#ec4899",
    "soma-secretagent": "#f97316",
    "soma-defcon": "#ef4444",
    "soma-beatblender": "#a855f7",
    "soma-seventies": "#f59e0b",
    "soma-bootliquor": "#b45309",
    "soma-thistle": "#14b8a6",
  };
  return colorMap[stationId] || "#8b5cf6";
}

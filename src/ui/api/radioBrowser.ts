import type { Station } from "../types";

const BASE_URL = "https://de1.api.radio-browser.info";

interface RawStation {
  stationuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  country: string;
  codec: string;
  bitrate: number;
  votes: number;
  clickcount: number;
  homepage: string;
}

function mapStation(raw: RawStation): Station {
  return {
    id: raw.stationuuid,
    name: raw.name.trim(),
    url: raw.url_resolved || "",
    favicon: raw.favicon?.startsWith("https://") ? raw.favicon : "",
    tags: raw.tags || "",
    country: raw.country || "",
    codec: raw.codec || "",
    bitrate: raw.bitrate || 0,
    votes: raw.votes || 0,
    clickcount: raw.clickcount || 0,
    homepage: raw.homepage || "",
  };
}

export async function searchByTags(
  tags: string[],
  limit = 30,
  countryCode?: string
): Promise<Station[]> {
  const allStations: Station[] = [];
  const seen = new Set<string>();

  const perTag = Math.ceil(limit / tags.length);

  const fetches = tags.map(async (tag) => {
    try {
      const params = new URLSearchParams({
        limit: String(perTag + 20),
        order: "clickcount",
        reverse: "true",
        hidebroken: "true",
        is_https: "true",
      });

      let url: string;

      if (countryCode) {
        // Use /search endpoint when filtering by country
        params.set("tag", tag);
        params.set("tagExact", "false");
        params.set("countrycode", countryCode);
        url = `${BASE_URL}/json/stations/search?${params}`;
      } else {
        // Use /bytag endpoint (original, proven to work)
        url = `${BASE_URL}/json/stations/bytag/${encodeURIComponent(tag)}?${params}`;
      }

      const res = await fetch(url, {
        headers: {
          "User-Agent": "PulseRadio/1.0 FigmaPlugin",
        },
      });

      if (!res.ok) return [];
      const data: RawStation[] = await res.json();
      return data
        .filter((s) => s.url_resolved && s.name && s.url_resolved.startsWith("https://"))
        .map(mapStation);
    } catch {
      return [];
    }
  });

  const results = await Promise.all(fetches);

  for (const stations of results) {
    for (const s of stations) {
      if (!seen.has(s.id) && s.url) {
        seen.add(s.id);
        allStations.push(s);
      }
    }
  }

  allStations.sort((a, b) => b.clickcount - a.clickcount);
  return allStations.slice(0, limit);
}

export async function searchByName(
  query: string,
  limit = 30,
  countryCode?: string
): Promise<Station[]> {
  try {
    const params = new URLSearchParams({
      name: query,
      nameExact: "false",
      limit: String(limit + 20),
      order: "clickcount",
      reverse: "true",
      hidebroken: "true",
      is_https: "true",
    });

    if (countryCode) params.set("countrycode", countryCode);

    const res = await fetch(`${BASE_URL}/json/stations/search?${params}`, {
      headers: { "User-Agent": "PulseRadio/1.0 FigmaPlugin" },
    });

    if (!res.ok) return [];
    const data: RawStation[] = await res.json();
    return data
      .filter((s) => s.url_resolved && s.name && s.url_resolved.startsWith("https://"))
      .map(mapStation)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getTopStations(limit = 30): Promise<Station[]> {
  try {
    const params = new URLSearchParams({
      limit: String(limit + 20),
      order: "clickcount",
      reverse: "true",
      hidebroken: "true",
      is_https: "true",
    });

    const res = await fetch(`${BASE_URL}/json/stations/topclick?${params}`, {
      headers: { "User-Agent": "PulseRadio/1.0 FigmaPlugin" },
    });

    if (!res.ok) return [];
    const data: RawStation[] = await res.json();
    return data
      .filter((s) => s.url_resolved && s.name && s.url_resolved.startsWith("https://"))
      .map(mapStation)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function registerClick(stationId: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/json/url/${stationId}`, {
      headers: { "User-Agent": "PulseRadio/1.0 FigmaPlugin" },
    });
  } catch {
    // silent
  }
}

import punjabSpots from "@/data/punjab.json";
import sindhSpots from "@/data/sindh.json";
import kpSpots from "@/data/kp.json";
import balochistanSpots from "@/data/balochistan.json";
import gilgitBaltistanSpots from "@/data/gilgit_baltistan.json";
import azadKashmirSpots from "@/data/azad_kashmir.json";
import capitalSpots from "@/data/capital.json";
import { cities, provinces } from "@/lib/data";

type SpotFeature = {
  type: string;
  properties: { _key?: string; province?: string | null };
  geometry: { type: string; coordinates: number[] };
};

const ALL_FEATURES: SpotFeature[] = [
  ...(punjabSpots as { features: SpotFeature[] }).features,
  ...(sindhSpots as { features: SpotFeature[] }).features,
  ...(kpSpots as { features: SpotFeature[] }).features,
  ...(balochistanSpots as { features: SpotFeature[] }).features,
  ...(gilgitBaltistanSpots as { features: SpotFeature[] }).features,
  ...(azadKashmirSpots as { features: SpotFeature[] }).features,
  ...(capitalSpots as { features: SpotFeature[] }).features,
];

const provinceCollections = {
  balochistan: balochistanSpots as { features: SpotFeature[] },
  sindh: sindhSpots as { features: SpotFeature[] },
  punjab: punjabSpots as { features: SpotFeature[] },
  kp: kpSpots as { features: SpotFeature[] },
  gilgit_baltistan: gilgitBaltistanSpots as { features: SpotFeature[] },
  azad_kashmir: azadKashmirSpots as { features: SpotFeature[] },
  capital: capitalSpots as { features: SpotFeature[] },
};

type ProvinceDataKey = keyof typeof provinceCollections;

const PROVINCE_SLUG_TO_DATA_KEY: Record<string, ProvinceDataKey> = {
  balochistan: "balochistan",
  sindh: "sindh",
  punjab: "punjab",
  "khyber-pakhtunkhwa": "kp",
  "gilgit-baltistan": "gilgit_baltistan",
  "azad-kashmir": "azad_kashmir",
  "islamabad-capital-territory": "capital",
};

function getSpotLatLng(spot: SpotFeature): [number, number] | null {
  const [lng, lat] = spot.geometry.coordinates;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return [lat, lng];
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return 6371 * y;
}

function haversineChainKm(points: [number, number][]): number {
  if (points.length < 2) return 0;
  return points.slice(1).reduce((sum, p, i) => sum + haversineKm(points[i], p), 0);
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Map destination (province name from form) to GeoJSON bucket key */
export function destinationToProvinceDataKey(destinationName: string): string | null {
  const p = provinces.find((x) => x.name === destinationName);
  if (!p) return null;
  return PROVINCE_SLUG_TO_DATA_KEY[p.slug] ?? null;
}

/** Representative point for a province: centroid of all spot coordinates */
export function getProvinceCentroidLatLng(dataKey: string): [number, number] | null {
  const coll = provinceCollections[dataKey as ProvinceDataKey];
  if (!coll?.features?.length) return null;
  const coords: [number, number][] = [];
  for (const f of coll.features) {
    const ll = getSpotLatLng(f);
    if (ll) coords.push(ll);
  }
  if (!coords.length) return null;
  const sum = coords.reduce(
    (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng] as [number, number],
    [0, 0]
  );
  return [sum[0] / coords.length, sum[1] / coords.length];
}

/**
 * Resolve a place label (checkbox text, free text, or spot name) to coordinates.
 */
export function resolvePlaceToLatLng(query: string): [number, number] | null {
  const q = normalize(query);
  if (!q) return null;

  for (const c of cities) {
    if (normalize(c.name) === q) return [c.lat, c.lon];
  }

  let best: [number, number] | null = null;
  let bestScore = 0;

  for (const spot of ALL_FEATURES) {
    const key = spot.properties._key;
    if (!key) continue;
    const nk = normalize(key);
    if (nk === q) return getSpotLatLng(spot);
    let score = 0;
    if (nk.includes(q) || q.includes(nk)) score = 2;
    else if (q.length >= 4 && (nk.includes(q.slice(0, 5)) || nk.includes(q.split(" ")[0] ?? "")))
      score = 1;
    if (score > bestScore) {
      const ll = getSpotLatLng(spot);
      if (ll) {
        best = ll;
        bestScore = score;
      }
    }
  }

  return best;
}

export type RouteDistanceResult = {
  waypoints: { label: string; lat: number; lng: number }[];
  roadKm: number | null;
  straightLineKm: number;
  method: "osrm" | "haversine" | "none";
};

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

async function fetchOsrmRoadKm(points: [number, number][]): Promise<number | null> {
  if (points.length < 2) return 0;
  const coordinatesParam = points.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `${OSRM_BASE}/${coordinatesParam}?overview=false`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { routes?: { distance: number }[] };
    const m = data?.routes?.[0]?.distance;
    if (typeof m !== "number" || !Number.isFinite(m)) return null;
    return m / 1000;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Build ordered waypoints: destination province centroid, then each resolved must-visit (deduped).
 */
export function buildPlannerWaypoints(
  destinationProvinceName: string,
  mustVisitLabels: string[]
): { label: string; lat: number; lng: number }[] {
  const key = destinationToProvinceDataKey(destinationProvinceName);
  let start: [number, number] | null = key ? getProvinceCentroidLatLng(key) : null;
  if (!start) {
    start = resolvePlaceToLatLng(destinationProvinceName);
  }

  const out: { label: string; lat: number; lng: number }[] = [];
  const seen = new Set<string>();

  const pushUnique = (label: string, lat: number, lng: number) => {
    const k = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ label, lat, lng });
  };

  if (start) {
    pushUnique(destinationProvinceName, start[0], start[1]);
  }

  for (const raw of mustVisitLabels) {
    const label = raw.trim();
    if (!label) continue;
    const ll = resolvePlaceToLatLng(label);
    if (!ll) continue;
    pushUnique(label, ll[0], ll[1]);
  }

  if (!out.length && mustVisitLabels.length) {
    for (const raw of mustVisitLabels) {
      const label = raw.trim();
      if (!label) continue;
      const ll = resolvePlaceToLatLng(label);
      if (ll) {
        out.push({ label, lat: ll[0], lng: ll[1] });
        break;
      }
    }
  }

  return out;
}

export async function computePlannerRouteDistance(
  destinationProvinceName: string,
  mustVisitLabels: string[]
): Promise<RouteDistanceResult> {
  const waypoints = buildPlannerWaypoints(destinationProvinceName, mustVisitLabels);
  if (waypoints.length < 2) {
    return {
      waypoints,
      roadKm: null,
      straightLineKm: 0,
      method: "none",
    };
  }

  const pts: [number, number][] = waypoints.map((w) => [w.lat, w.lng]);
  const straightLineKm = haversineChainKm(pts);

  const roadKm = await fetchOsrmRoadKm(pts);
  if (roadKm != null && roadKm > 0) {
    return { waypoints, roadKm, straightLineKm, method: "osrm" };
  }

  return {
    waypoints,
    roadKm: straightLineKm,
    straightLineKm,
    method: "haversine",
  };
}

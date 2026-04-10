/**
 * Curated “saved trips” users can browse and open in the Smart Planner with one tap.
 * Destination strings must match province names in `src/lib/data` (planner dropdown).
 */

export type SavedTripPlannerDefaults = {
  destination: string;
  duration: number;
  interests: string[];
  budget: "budget-friendly" | "mid-range" | "luxury";
  travelers: number;
  travelStyle: "solo" | "couple" | "family" | "friends";
  pace: "relaxed" | "balanced" | "packed";
  transport: "road-trip" | "public-transport" | "mixed";
  accommodation: "budget-guesthouse" | "comfortable-hotel" | "premium-resort";
  currency: string;
  mustVisit: string[];
  mustVisitOther?: string;
  dietaryNeeds?: string;
  notes?: string;
};

export type SavedTrip = {
  id: string;
  title: string;
  subtitle: string;
  durationDays: number;
  /** Short bullets for the card */
  highlights: string[];
  plannerDefaults: SavedTripPlannerDefaults;
};

export const SAVED_TRIPS: SavedTrip[] = [
  {
    id: "hunza-silk-road",
    title: "Hunza & Karimabad",
    subtitle: "Glacier views, apricot valleys, and the classic northern road trip",
    durationDays: 7,
    highlights: [
      "Rakaposhi viewpoints",
      "Altit & Baltit forts",
      "Attabad Lake drive",
    ],
    plannerDefaults: {
      destination: "Gilgit-Baltistan",
      duration: 7,
      interests: ["nature", "adventure", "food"],
      budget: "mid-range",
      travelers: 2,
      travelStyle: "couple",
      pace: "balanced",
      transport: "road-trip",
      accommodation: "comfortable-hotel",
      currency: "PKR",
      mustVisit: ["Hunza Valley", "Skardu"],
      notes: "Focus on Hunza Valley first, then optional day trip toward Khunjerab ideas if season allows.",
    },
  },
  {
    id: "swat-alpine",
    title: "Swat Valley Escape",
    subtitle: "Rivers, forests, and hill towns in Khyber Pakhtunkhwa",
    durationDays: 5,
    highlights: ["Mingora & Malam Jabba ideas", "Family-friendly pace", "Nature walks"],
    plannerDefaults: {
      destination: "Khyber Pakhtunkhwa",
      duration: 5,
      interests: ["nature", "relaxation", "food"],
      budget: "mid-range",
      travelers: 4,
      travelStyle: "family",
      pace: "relaxed",
      transport: "road-trip",
      accommodation: "comfortable-hotel",
      currency: "PKR",
      mustVisit: ["Swat Valley"],
      notes: "Swat-focused itinerary; include Kalam/Malam Jabba style stops where roads allow.",
    },
  },
  {
    id: "lahore-mughal",
    title: "Lahore Mughal Heritage",
    subtitle: "Forts, mosques, and the food capital in a long weekend",
    durationDays: 4,
    highlights: ["Old city walks", "Walled city food", "Museum day"],
    plannerDefaults: {
      destination: "Punjab",
      duration: 4,
      interests: ["history", "food", "nature"],
      budget: "mid-range",
      travelers: 2,
      travelStyle: "couple",
      pace: "packed",
      transport: "road-trip",
      accommodation: "comfortable-hotel",
      currency: "PKR",
      mustVisit: ["Badshahi Mosque"],
      mustVisitOther: "Lahore Fort, Walled City food street",
      notes: "Lahore-centric; emphasize food and Mughal architecture.",
    },
  },
  {
    id: "islamabad-capital",
    title: "Islamabad & Margalla",
    subtitle: "Capital sights, Faisal Mosque, and hill viewpoints",
    durationDays: 3,
    highlights: ["Faisal Mosque", "Daman-e-Koh style viewpoints", "Short hikes"],
    plannerDefaults: {
      destination: "Islamabad Capital Territory",
      duration: 3,
      interests: ["history", "nature", "relaxation"],
      budget: "mid-range",
      travelers: 2,
      travelStyle: "couple",
      pace: "balanced",
      transport: "road-trip",
      accommodation: "comfortable-hotel",
      currency: "PKR",
      mustVisit: ["Faisal Mosque"],
      notes: "Islamabad & Rawalpindi day trips; keep drives short.",
    },
  },
  {
    id: "skardu-highlands",
    title: "Skardu Highlands",
    subtitle: "Lakes, cold desert, and gateway treks in Baltistan",
    durationDays: 10,
    highlights: ["Shangrila / Kachura ideas", "Deosai if season fits", "Longer acclimatization"],
    plannerDefaults: {
      destination: "Gilgit-Baltistan",
      duration: 10,
      interests: ["adventure", "nature", "history"],
      budget: "mid-range",
      travelers: 2,
      travelStyle: "friends",
      pace: "balanced",
      transport: "mixed",
      accommodation: "comfortable-hotel",
      currency: "PKR",
      mustVisit: ["Skardu", "Hunza Valley"],
      notes: "Skardu-heavy; include rest days for altitude and road delays.",
    },
  },
  {
    id: "karachi-sindh",
    title: "Karachi & Sindh Heritage",
    subtitle: "Coastline, bazaars, and Indus civilization touchpoints",
    durationDays: 6,
    highlights: ["City museums", "Food streets", "Optional Mohenjo-daro arc"],
    plannerDefaults: {
      destination: "Sindh",
      duration: 6,
      interests: ["history", "food", "nature"],
      budget: "mid-range",
      travelers: 2,
      travelStyle: "couple",
      pace: "balanced",
      transport: "road-trip",
      accommodation: "comfortable-hotel",
      currency: "PKR",
      mustVisit: ["Mohenjo-daro"],
      mustVisitOther: "Karachi Clifton / food areas",
      notes: "Blend Karachi days with one longer road day for interior heritage if desired.",
    },
  },
  {
    id: "gwadar-coast",
    title: "Gwadar Coastal",
    subtitle: "Arabian Sea views and emerging coastal roads in Balochistan",
    durationDays: 5,
    highlights: ["Coastal drives", "Sunset viewpoints", "Seafood stops"],
    plannerDefaults: {
      destination: "Balochistan",
      duration: 5,
      interests: ["nature", "adventure", "food"],
      budget: "mid-range",
      travelers: 2,
      travelStyle: "couple",
      pace: "relaxed",
      transport: "road-trip",
      accommodation: "comfortable-hotel",
      currency: "PKR",
      mustVisit: ["Gwadar Coast"],
      notes: "Respect security advisories and long driving distances between stops.",
    },
  },
  {
    id: "neelum-kashmir",
    title: "Neelum Valley Road",
    subtitle: "River gorges and mountain villages in Azad Kashmir",
    durationDays: 5,
    highlights: ["Riverside stays", "Short hikes", "Photography-friendly"],
    plannerDefaults: {
      destination: "Azad Kashmir",
      duration: 5,
      interests: ["nature", "adventure", "relaxation"],
      budget: "budget-friendly",
      travelers: 3,
      travelStyle: "friends",
      pace: "balanced",
      transport: "road-trip",
      accommodation: "budget-guesthouse",
      currency: "PKR",
      mustVisit: ["Neelum Valley"],
      notes: "Neelum-centric; road conditions vary by season.",
    },
  },
];

export function getSavedTripById(id: string): SavedTrip | undefined {
  return SAVED_TRIPS.find((t) => t.id === id);
}

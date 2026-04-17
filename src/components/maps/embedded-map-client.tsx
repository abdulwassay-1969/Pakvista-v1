"use client";

import dynamic from "next/dynamic";
import { Compass } from "lucide-react";

// Dynamically import the map as Leaflet requires window/document objects
const EmbeddedMap = dynamic(() => import("./embedded-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
      <Compass className="w-8 h-8 animate-spin mb-3 text-primary/50" />
      <span className="font-semibold tracking-wide text-sm font-headline">Loading 3D Terrain...</span>
    </div>
  )
});

export default function EmbeddedMapClient({ spots }: { spots: any[] }) {
  return <EmbeddedMap spots={spots} />;
}

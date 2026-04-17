"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  GeoJSON
} from "react-leaflet";
import { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import provincialBoundary from "@/data/provincial_boundary.json";

function FitToSpots({ spots }: { spots: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (!spots || spots.length === 0) return;
    
    // Filter valid spots
    const validSpots = spots.filter(s => 
      s?.geometry?.coordinates && 
      typeof s.geometry.coordinates[0] === 'number' && 
      typeof s.geometry.coordinates[1] === 'number'
    );
    
    if (validSpots.length === 0) return;

    const bounds: LatLngBoundsExpression = validSpots.map((spot) => [
      spot.geometry.coordinates[1],
      spot.geometry.coordinates[0],
    ]);
    
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    
    // Disable dragging to make it feel like a pure embedded visual
    map.dragging.disable();
    map.scrollWheelZoom.disable();
  }, [map, spots]);
  
  return null;
}

export default function EmbeddedMap({ spots }: { spots: any[] }) {
  // If there's an issue with hydration or window, this happens automatically
  // when imported dynamically with ssr: false
  
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-xl relative ring-1 ring-slate-900/5 group">
      <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-slate-950/40 to-transparent z-[1000] pointer-events-none transition-opacity duration-300 opacity-100 group-hover:opacity-0">
         <p className="text-white text-sm font-bold tracking-wider uppercase drop-shadow-md">3D Terrain Overview</p>
      </div>

      <MapContainer
        center={[30.3753, 69.3451]}
        zoom={5}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        className="h-full w-full absolute inset-0 z-10 bg-[#e5e5e5]"
      >
        {/* OpenTopoMap gives a great 3D terrain feel */}
        <TileLayer
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Tiles: <a href="https://opentopomap.org">OpenTopoMap</a>'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        />
        
        {/* Adds Hillshading shadow effect */}
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}"
          opacity={0.4}
        />
        
        {/* Optional: Add borders */}
        <GeoJSON
          data={provincialBoundary as GeoJSON.GeoJsonObject}
          style={{ color: "#003D5B", weight: 2, opacity: 0.3, fillOpacity: 0 }}
        />
        
        {spots.map((spot, idx) => {
          const lat = spot.geometry?.coordinates?.[1];
          const lng = spot.geometry?.coordinates?.[0];
          if (!lat || !lng) return null;
          return (
            <CircleMarker
              key={idx}
              center={[lat, lng]}
              radius={7}
              pathOptions={{ fillColor: "#00798C", color: "white", fillOpacity: 1, weight: 2 }}
            >
            </CircleMarker>
          );
        })}
        <FitToSpots spots={spots} />
      </MapContainer>
    </div>
  );
}

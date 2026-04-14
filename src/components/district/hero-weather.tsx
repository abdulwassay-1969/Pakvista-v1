'use client';

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSun, Loader2 } from 'lucide-react';
import type { WeatherData } from '@/ai/flows/weather-flow';

export default function HeroWeather({ cityName }: { cityName: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWeather() {
      try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
        if (!res.ok) throw new Error('API issue');
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        console.warn('Weather fetch failed, likely rate limited or key missing.');
      } finally {
        setLoading(false);
      }
    }
    getWeather();
  }, [cityName]);

  if (loading || !weather) {
    return null; // Don't show anything until we have data
  }

  const { temp, description, icon } = weather.current;
  
  let Icon = Cloud;
  if (icon.includes('clear') || icon.includes('sun')) Icon = Sun;
  if (icon.includes('rain') || icon.includes('showers') || icon.includes('thunder')) Icon = CloudRain;
  if (icon.includes('partly')) Icon = CloudSun;

  return (
    <div className="inline-flex items-center gap-2 text-white/90 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-sm shadow-sm transition-all hover:bg-black/40 cursor-default">
      <Icon className="w-4 h-4 text-amber-300" />
      <span className="font-semibold">{temp}°C</span>
      <span className="opacity-80 border-l border-white/20 pl-2 ml-1">{description}</span>
    </div>
  );
}

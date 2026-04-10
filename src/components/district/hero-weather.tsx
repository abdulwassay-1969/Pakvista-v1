import { fetchWeatherData } from '@/lib/meteoblue';
import { Sun, Cloud, CloudRain, CloudSun } from 'lucide-react';

export default async function HeroWeather({ cityName }: { cityName: string }) {
  try {
    const weather = await fetchWeatherData({ city: cityName });
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
  } catch (e) {
    // Fail silently so the page isn't broken if the API drops
    return null;
  }
}

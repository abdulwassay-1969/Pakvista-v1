
"use client";

import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getWeather } from '@/app/actions';
import type { WeatherData } from '@/ai/flows/weather-flow';
import { Button } from '../ui/button';
import Link from 'next/link';

const iconMap: { [key: string]: React.ElementType } = {
  'clear-day': Sun,
  'clear-night': Sun, 
  'cloudy': Cloud,
  'partly-cloudy-day': CloudSun,
  'partly-cloudy-night': CloudSun,
  'rain': CloudRain,
  'showers-day': CloudRain,
  'showers-night': CloudRain,
  'snow': Cloud,
  'thunder-rain': CloudRain,
  'wind': Cloud,
  'default': Cloud,
};

const WeatherIcon = ({ iconName, ...props }: { iconName: string; [key: string]: any }) => {
  const Icon = iconMap[iconName] || iconMap['default'];
  return <Icon {...props} />;
};

export default function WeatherBar() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const data = await getWeather({ city: 'Islamabad' });
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError('Could not fetch weather data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <section className="bg-background -mt-16 relative z-20">
        <div className="w-full">
          <Card className="bg-slate-800 text-white p-4 rounded-none shadow-lg">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-4 h-[124px]">
                <Loader className="w-8 h-8 animate-spin" />
                <p className="text-lg">Loading Weather...</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (error || !weatherData) {
    return (
        <section className="bg-background -mt-16 relative z-20">
        <div className="w-full">
          <Card className="bg-destructive text-destructive-foreground p-4 rounded-none shadow-lg">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-4 h-[124px]">
                <p className="text-lg">{error || "Weather data not available."}</p>
                <Button variant="outline" onClick={fetchWeather} className="bg-transparent border-white text-white hover:bg-white hover:text-destructive">
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }
  
  const { city, current, forecast } = weatherData;

  return (
    <section className="bg-background -mt-16 relative z-20">
      <div className="w-full">
        <Card className="bg-slate-800 text-white p-4 rounded-none shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <WeatherIcon iconName={current.icon} className="w-16 h-16" />
                <div>
                  <div className="text-sm font-bold uppercase">{city} Weather</div>
                  <div className="text-4xl font-bold">{current.temp}°C</div>
                  <div className="text-sm text-slate-300">{current.description}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 text-center w-full md:w-auto">
                {forecast.map((day) => (
                  <div key={day.day} className="flex flex-col items-center">
                    <div className="font-semibold text-sm">{day.day}</div>
                    <WeatherIcon iconName={day.icon} className="w-8 h-8 my-1" />
                    <div className="text-sm">
                      <span className="text-red-400">{day.high}°</span>
                      <span className="text-blue-400 ml-1">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
               <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-800">
                <Link href="/weather">View More</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}


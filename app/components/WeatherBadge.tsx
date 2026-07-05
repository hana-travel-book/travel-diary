"use client";

import { useEffect, useState } from "react";
import { fetchDayWeather, weatherEmoji, dayNumberToISODate } from "../lib/weather";
import type { DayWeather } from "../lib/weather";
import { trip } from "../data/trip";

export default function WeatherBadge({ city, dayNumber }: { city: string; dayNumber: number }) {
  const [weather, setWeather] = useState<DayWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const isoDate = dayNumberToISODate(trip.start, dayNumber);
    fetchDayWeather(city, isoDate).then((w) => {
      if (!cancelled) {
        setWeather(w);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [city, dayNumber]);

  if (loading) {
    return <span className="text-[12px] text-[#9C9488]">天氣讀取中...</span>;
  }

  if (!weather) return null;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[16px]">
        {weather.type === "forecast" && weather.code !== undefined
          ? weatherEmoji(weather.code)
          : "🌦️"}
      </span>
      <span className="text-[13px] text-[#2B2A28]">
        {weather.high}° / {weather.low}°
      </span>
      {weather.type === "climate" && (
        <span className="text-[11px] text-[#9C9488]">（歷史均溫）</span>
      )}
    </div>
  );
}

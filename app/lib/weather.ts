export interface DayWeather {
  type: "forecast" | "climate";
  high: number;
  low: number;
  code?: number;
  note?: string;
}

interface CityCoord {
  lat: number;
  lon: number;
}

const CITY_COORDS: Record<string, CityCoord> = {
  Bangkok: { lat: 13.7563, lon: 100.5018 },
  Ayutthaya: { lat: 14.3532, lon: 100.5648 },
  "Hua Hin": { lat: 12.5684, lon: 99.9577 },
  "Chiang Mai": { lat: 18.7883, lon: 98.9853 },
  "Chiang Rai": { lat: 19.9105, lon: 99.8406 },
};

const CLIMATE_NORMALS: Record<string, { high: number; low: number; note: string }> = {
  Bangkok: { high: 33, low: 25, note: "雨季，午後常有陣雨" },
  Ayutthaya: { high: 33, low: 25, note: "雨季，午後常有陣雨" },
  "Hua Hin": { high: 31, low: 25, note: "偶有陣雨" },
  "Chiang Mai": { high: 31, low: 24, note: "雨季，山區午後易降雨" },
  "Chiang Rai": { high: 30, low: 23, note: "雨季，早晚微涼" },
};

function matchCityKey(city: string): string {
  const keys = Object.keys(CITY_COORDS);
  return keys.find((k) => city.includes(k)) ?? "Bangkok";
}

export function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌦️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 95) return "⛈️";
  return "🌈";
}

export function dayNumberToISODate(tripStart: string, dayNumber: number): string {
  const start = new Date(`${tripStart}T00:00:00`);
  const d = new Date(start);
  d.setDate(start.getDate() + (dayNumber - 1));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function fetchDayWeather(city: string, isoDate: string): Promise<DayWeather> {
  const key = matchCityKey(city);
  const coord = CITY_COORDS[key];
  const normals = CLIMATE_NORMALS[key];

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${isoDate}&end_date=${isoDate}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("no forecast");
    const data = await res.json();
    const high = data?.daily?.temperature_2m_max?.[0];
    const low = data?.daily?.temperature_2m_min?.[0];
    const code = data?.daily?.weathercode?.[0];
    if (typeof high !== "number" || typeof low !== "number") throw new Error("no data");
    return { type: "forecast", high: Math.round(high), low: Math.round(low), code };
  } catch {
    return { type: "climate", high: normals.high, low: normals.low, note: normals.note };
  }
}

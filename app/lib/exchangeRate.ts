const CACHE_KEY = "travelDiaryExchangeRate";

interface RateCache {
  rate: number;
  fetchedAt: number;
}

export async function getThbToTwdRate(): Promise<{ rate: number; isLive: boolean }> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/THB");
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    const rate = data?.rates?.TWD;
    if (typeof rate !== "number") throw new Error("no rate");
    if (typeof window !== "undefined") {
      const cache: RateCache = { rate, fetchedAt: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
    return { rate, isLive: true };
  } catch {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached: RateCache = JSON.parse(raw);
          return { rate: cached.rate, isLive: false };
        }
      } catch {}
    }
    return { rate: 0.93, isLive: false };
  }
}

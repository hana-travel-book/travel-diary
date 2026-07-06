"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { tripsList } from "../data/trips-list";
import { getCustomTrips } from "./trips";
import type { CustomTrip } from "./trips";

export interface ActiveTripInfo {
  id: string;
  title: string;
  dateRangeLabel: string;
}

const CURRENT_TRIP_KEY = "travelDiaryCurrentTripId";

interface TripContextValue {
  currentTripId: string;
  setCurrentTripId: (id: string) => void;
  allTrips: (CustomTrip & { isCurrent?: boolean })[];
  refreshTrips: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [currentTripId, setCurrentTripIdState] = useState<string>("");
  const [customTrips, setCustomTrips] = useState<CustomTrip[]>([]);

  useEffect(() => {
    setCustomTrips(getCustomTrips());
    const saved = typeof window !== "undefined" ? localStorage.getItem(CURRENT_TRIP_KEY) : null;
    const defaultId = tripsList.find((t) => t.isCurrent)?.id ?? tripsList[0]?.id ?? "";
    setCurrentTripIdState(saved ?? defaultId);
  }, []);

  function setCurrentTripId(id: string) {
    setCurrentTripIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_TRIP_KEY, id);
    }
  }

  function refreshTrips() {
    setCustomTrips(getCustomTrips());
  }

  const allTrips = [...tripsList, ...customTrips];

  return (
    <TripContext.Provider value={{ currentTripId, setCurrentTripId, allTrips, refreshTrips }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripContext must be used within TripProvider");
  return ctx;
}

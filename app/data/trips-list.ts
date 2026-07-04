import { trip } from "./trip";

export interface TripSummary {
  id: string;
  title: string;
  dateRangeLabel: string;
  isCurrent: boolean;
}

// 之後規劃新旅程時，在這個陣列裡加一筆新資料就會出現在切換器選單裡
export const tripsList: TripSummary[] = [
  {
    id: "thailand-2026",
    title: trip.title,
    dateRangeLabel: trip.dateRangeLabel,
    isCurrent: true,
  },
];

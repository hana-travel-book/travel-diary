import DayCard from "../components/DayCard";
import BottomNav from "../components/BottomNav";
import TripSwitcher from "../components/TripSwitcher";
import { trip } from "../data/trip";

export default function JourneyPage() {
  return (
    <main className="mx-auto max-w-[430px] px-5 pb-[120px] pt-8">
      <TripSwitcher />
      <h1 className="mt-4 font-serif text-[1.9rem] font-medium text-[#2B2A28]">{trip.title}</h1>
      <p className="mt-1 text-[14px] text-[#9C9488]">
        {trip.dateRangeLabel} · {trip.totalDays} Days
      </p>

      <div className="mt-6 space-y-3">
        {trip.journeyDays.map((day, i) => (
          <DayCard key={day.day} day={day} i={i} />
        ))}
      </div>

      <BottomNav />
    </main>
  );
}

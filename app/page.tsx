import HeroCard from "./components/HeroCard";
import ChecklistCard from "./components/ChecklistCard";
import BottomNav from "./components/BottomNav";

export default function Home() {
  return (
    <main className="mx-auto max-w-[430px] px-5 pb-[120px] pt-5">
      <HeroCard />
      <ChecklistCard />
      <BottomNav />
    </main>
  );
}

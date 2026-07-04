"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { trip } from "../data/trip";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function TripCalendarSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const dateToDay = useMemo(() => {
    const map: Record<string, number> = {};
    const start = new Date(`${trip.start}T00:00:00`);
    for (let i = 0; i < trip.totalDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      map[toKey(d)] = i + 1;
    }
    return map;
  }, []);

  const tripStart = new Date(`${trip.start}T00:00:00`);
  const [viewMonth, setViewMonth] = useState(
    new Date(tripStart.getFullYear(), tripStart.getMonth(), 1)
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  function goMonth(delta: number) {
    setViewMonth(new Date(year, month + delta, 1));
  }

  function handlePick(d: Date) {
    const dayNum = dateToDay[toKey(d)];
    if (!dayNum) return;
    onClose();
    router.push(`/today/${dayNum}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[101] mx-auto max-w-[430px] rounded-t-[32px] bg-white px-6 pb-10 pt-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-1.5 w-10 rounded-full bg-[#ECE6DA]" />
              <button
                onClick={onClose}
                aria-label="關閉"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F3EC]"
              >
                <X className="h-4 w-4 text-[#2B2A28]" strokeWidth={2} />
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => goMonth(-1)}
                aria-label="上個月"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F3EC]"
              >
                <ChevronLeft className="h-4 w-4 text-[#2B2A28]" />
              </button>
              <h2 className="text-[17px] font-semibold text-[#2B2A28]">
                {year} 年 {month + 1} 月
              </h2>
              <button
                onClick={() => goMonth(1)}
                aria-label="下個月"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F3EC]"
              >
                <ChevronRight className="h-4 w-4 text-[#2B2A28]" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
              {WEEKDAYS.map((w) => (
                <span key={w} className="text-[12px] text-[#9C9488]">
                  {w}
                </span>
              ))}
              {cells.map((d, i) => {
                if (!d) return <span key={`blank-${i}`} />;
                const key = toKey(d);
                const dayNum = dateToDay[key];
                const isTripDay = Boolean(dayNum);
                return (
                  <button
                    key={key}
                    onClick={() => isTripDay && handlePick(d)}
                    disabled={!isTripDay}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[14px] ${
                      isTripDay
                        ? "bg-[#A9BFA0] font-semibold text-white"
                        : "text-[#D8D2C4]"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

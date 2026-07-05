"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, Sparkles, CalendarCheck } from "lucide-react";
import { trip, flightLink } from "../data/trip";
import type { TimelineItem } from "../data/trip";
import { getCurrentDayNumber, isWithinTrip, getCurrentTimeString } from "../lib/tripDate";

const RESERVATION_KEYWORDS = ["已預約", "已訂", "已確認", "預約"];

export default function NextUpCard() {
  const [nowStr, setNowStr] = useState(getCurrentTimeString());

  useEffect(() => {
    const id = setInterval(() => setNowStr(getCurrentTimeString()), 60000);
    return () => clearInterval(id);
  }, []);

  if (!isWithinTrip()) return null;

  const dayNumber = getCurrentDayNumber();
  const detail = trip.dayDetails[dayNumber];
  if (!detail) return null;

  // 找出今天時間軸裡，時間比現在晚的第一個項目
  const upcoming: TimelineItem | undefined = detail.timeline.find(
    (item) => item.time !== "--:--" && item.time >= nowStr
  );

  if (!upcoming) return null;

  const isReserved = RESERVATION_KEYWORDS.some((kw) => upcoming.subtitle?.includes(kw));

  return (
    <Link href={`/today/${dayNumber}`}>
      <motion.section
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 rounded-[24px] bg-white p-5 shadow-[0_18px_40px_-28px_rgba(43,42,40,0.4)]"
      >
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#C9A227]" strokeWidth={2} />
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9C9488]">
            接下來
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-lg">
            {upcoming.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-semibold text-[#2B2A28]">{upcoming.title}</p>
            {upcoming.subtitle && (
              <p className="truncate text-[13px] text-[#9C9488]">{upcoming.subtitle}</p>
            )}
          </div>
          <span className="flex-shrink-0 font-mono text-[15px] font-medium text-[#2B2A28]">
            {upcoming.time}
          </span>
        </div>

        {(isReserved || upcoming.flightNumber) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {isReserved && (
              <span className="flex items-center gap-1 rounded-full bg-[#A9BFA0]/20 px-3 py-1 text-[12px] font-medium text-[#4A7A6D]">
                <CalendarCheck className="h-3 w-3" strokeWidth={2} />
                已預約，記得準時
              </span>
            )}
            {upcoming.flightNumber && (
              <a
                href={flightLink(upcoming.flightNumber)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 rounded-full bg-[#8FB0C9]/20 px-3 py-1 text-[12px] font-medium text-[#34495E]"
              >
                <Plane className="h-3 w-3" strokeWidth={2} />
                {upcoming.flightNumber} 即時動態
              </a>
            )}
          </div>
        )}
      </motion.section>
    </Link>
  );
}

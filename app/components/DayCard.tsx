"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, Camera } from "lucide-react";
import type { JourneyDay } from "../data/trip";
import { mapLink } from "../data/trip";
import { getDayCover, saveDayCover, compressImage } from "../lib/dayCover";
import { useTripContext } from "../lib/tripContext";

export default function DayCard({ day, i }: { day: JourneyDay; i: number }) {
  const { currentTripId } = useTripContext();
  const [coverImage, setCoverImage] = useState(day.image);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!currentTripId) return;
    setCoverImage(getDayCover(currentTripId, day.day, day.image));
  }, [day.day, day.image, currentTripId]);

  async function handleChangePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 600, 0.75);
      saveDayCover(currentTripId, day.day, dataUrl);
      setCoverImage(dataUrl);
    } catch {
      alert("照片上傳失敗，請再試一次");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: i * 0.04 }}
      className="flex items-center gap-2 rounded-[24px] bg-white p-3.5 shadow-[0_18px_40px_-28px_rgba(43,42,40,0.4)]"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChangePhoto}
        className="hidden"
      />

      <div className="flex flex-1 items-center gap-4 min-w-0">
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="更換照片"
          className="relative h-16 w-16 flex-shrink-0"
        >
          <img
            src={coverImage}
            alt={day.title}
            className="h-16 w-16 rounded-[16px] object-cover"
          />
          <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#34495E] text-white">
            <Camera className="h-3 w-3" strokeWidth={2} />
          </span>
        </button>

        <Link href={`/today/${day.day}`} className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-[#9C9488]">
            Day {day.day} · {day.dateLabel}
          </p>
          <p className="mt-0.5 truncate text-[17px] font-semibold text-[#2B2A28]">{day.title}</p>
          <p className="text-[13px] text-[#9C9488]">{day.city}</p>
        </Link>
      </div>

      <a
        href={mapLink(`${day.title} ${day.city}`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="在 Google 地圖開啟"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-[#34495E]"
      >
        <MapPin className="h-4 w-4" strokeWidth={1.9} />
      </a>

      <Link href={`/today/${day.day}`} aria-label="查看詳情">
        <ChevronRight className="h-5 w-5 flex-shrink-0 text-[#D8D2C2]" strokeWidth={1.75} />
      </Link>
    </motion.div>
  );
}

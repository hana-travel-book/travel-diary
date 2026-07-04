"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import BottomNav from "../components/BottomNav";
import TripSwitcher from "../components/TripSwitcher";
import { trip } from "../data/trip";
import { getAllPhotos, removePhoto } from "../lib/photos";
import type { TripPhoto } from "../lib/photos";

export default function MemoriesPage() {
  const { memories, dayDetails, journeyDays } = trip;

  const [quote, setQuote] = useState(memories.quote);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(quote);

  const [photosByDay, setPhotosByDay] = useState<Record<number, TripPhoto[]>>({});

  useEffect(() => {
    setPhotosByDay(getAllPhotos());
  }, []);

  function saveQuote() {
    setQuote(draft);
    setIsEditing(false);
  }

  function deletePhoto(day: number, id: string) {
    removePhoto(day, id);
    setPhotosByDay((prev) => ({
      ...prev,
      [day]: (prev[day] ?? []).filter((p) => p.id !== id),
    }));
  }

  // 只顯示有照片的天數，按天數排序
  const daysWithPhotos = Object.keys(photosByDay)
    .map(Number)
    .filter((day) => (photosByDay[day] ?? []).length > 0)
    .sort((a, b) => a - b);

  const totalPhotoCount = daysWithPhotos.reduce(
    (sum, day) => sum + (photosByDay[day]?.length ?? 0),
    0
  );

    return (
    <main className="mx-auto max-w-[430px] px-5 pb-[120px] pt-8">
      <TripSwitcher />
      <h1 className="mt-4 font-serif text-[1.9rem] font-medium text-[#2B2A28]">
        旅遊相簿日誌
      </h1>
      <p className="mt-1 text-[14px] text-[#9C9488]">
        {trip.title} · 共 {totalPhotoCount} 張照片
      </p>


      {/* Quote */}
      <section className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#2B2A28]">今日一句話</h2>
          <button
            onClick={() => {
              setDraft(quote);
              setIsEditing(true);
            }}
            aria-label="編輯"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        {isEditing ? (
          <div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-[16px] border border-[#ECE6DA] p-3 text-[15px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-full px-4 py-1.5 text-[13px] font-medium text-[#9C9488]"
              >
                取消
              </button>
              <button
                onClick={saveQuote}
                className="rounded-full bg-[#A9BFA0] px-4 py-1.5 text-[13px] font-medium text-white"
              >
                儲存
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[16px] leading-relaxed text-[#2B2A28]">{quote}</p>
        )}
      </section>

      {/* 相簿日誌：依天數分組 */}
      {daysWithPhotos.length === 0 ? (
        <section className="mt-4 rounded-[28px] bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
          <p className="text-[15px] text-[#9C9488]">
            還沒有照片，去 Today 頁面每個景點旁邊點 📷 開始記錄吧！
          </p>
        </section>
      ) : (
        daysWithPhotos.map((day) => {
          const detail = dayDetails[day];
          const journeyInfo = journeyDays.find((j) => j.day === day);
          const dayPhotos = photosByDay[day] ?? [];

          return (
            <motion.section
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]"
            >
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <p className="text-[13px] font-medium text-[#9C9488]">
                    Day {day} · {detail?.dateLabel ?? journeyInfo?.dateLabel}
                  </p>
                  <p className="mt-0.5 text-[17px] font-semibold text-[#2B2A28]">
                    {journeyInfo?.title ?? detail?.city}
                  </p>
                </div>
                <span className="font-mono text-[12px] text-[#9C9488]">
                  {dayPhotos.length} 張
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {dayPhotos.map((p) => (
                  <div key={p.id} className="group relative">
                    <img
                      src={p.dataUrl}
                      alt={p.itemTitle}
                      className="aspect-square w-full rounded-[14px] object-cover"
                    />
                    <button
                      onClick={() => deletePhoto(day, p.id)}
                      aria-label="刪除照片"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={2} />
                    </button>
                    <p className="mt-1 truncate text-[11px] text-[#9C9488]">
                      {p.itemTitle}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          );
        })
      )}

      <BottomNav />
    </main>
  );
}

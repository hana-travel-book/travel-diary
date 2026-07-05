"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Lightbox 狀態：記錄目前正在看哪一天、第幾張
  const [lightbox, setLightbox] = useState<{ day: number; index: number } | null>(null);

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
    setLightbox(null);
  }

  const daysWithPhotos = Object.keys(photosByDay)
    .map(Number)
    .filter((day) => (photosByDay[day] ?? []).length > 0)
    .sort((a, b) => a - b);

  const totalPhotoCount = daysWithPhotos.reduce(
    (sum, day) => sum + (photosByDay[day]?.length ?? 0),
    0
  );

  function openLightbox(day: number, index: number) {
    setLightbox({ day, index });
  }

  function closeLightbox() {
    setLightbox(null);
  }

  function showPrevPhoto() {
    if (!lightbox) return;
    const photos = photosByDay[lightbox.day] ?? [];
    setLightbox({
      day: lightbox.day,
      index: (lightbox.index - 1 + photos.length) % photos.length,
    });
  }

  function showNextPhoto() {
    if (!lightbox) return;
    const photos = photosByDay[lightbox.day] ?? [];
    setLightbox({
      day: lightbox.day,
      index: (lightbox.index + 1) % photos.length,
    });
  }

  const lightboxPhoto = lightbox ? (photosByDay[lightbox.day] ?? [])[lightbox.index] : null;
  const lightboxDetail = lightbox ? dayDetails[lightbox.day] : null;
  const lightboxJourney = lightbox
    ? journeyDays.find((j) => j.day === lightbox.day)
    : null;

  return (
    <main className="mx-auto max-w-[430px] px-5 pb-[120px] pt-8">
      <TripSwitcher />
      <h1 className="mt-4 font-serif text-[1.9rem] font-medium text-[#2B2A28]">
        回憶時間軸
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

      {/* 時間軸 */}
      {daysWithPhotos.length === 0 ? (
        <section className="mt-4 rounded-[28px] bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
          <p className="text-[15px] text-[#9C9488]">
            還沒有照片，去 Today 頁面每個景點旁邊點 📷 開始記錄吧！
          </p>
        </section>
      ) : (
        <div className="relative mt-6 pl-8">
          {/* 垂直時間軸線 */}
          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#ECE6DA]" />

          {daysWithPhotos.map((day, idx) => {
            const detail = dayDetails[day];
            const journeyInfo = journeyDays.find((j) => j.day === day);
            const dayPhotos = photosByDay[day] ?? [];

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                className="relative mb-8 last:mb-0"
              >
                {/* 時間軸節點 */}
                <span className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#A9BFA0] text-[11px] font-semibold text-white ring-4 ring-[#F7F3EC]">
                  {day}
                </span>

                <div className="mb-3 flex items-baseline justify-between">
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

                {/* 橫向捲動照片列 */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dayPhotos.map((p, photoIdx) => (
                    <button
                      key={p.id}
                      onClick={() => openLightbox(day, photoIdx)}
                      className="relative h-24 w-24 flex-shrink-0"
                    >
                      <img
                        src={p.dataUrl}
                        alt={p.itemTitle}
                        className="h-24 w-24 rounded-[14px] object-cover"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox 放大檢視 */}
      <AnimatePresence>
        {lightbox && lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-black/95"
          >
            <div className="flex items-center justify-between px-5 pt-6">
              <div>
                <p className="text-[13px] text-white/70">
                  Day {lightbox.day} ·{" "}
                  {dayDetails[lightbox.day]?.dateLabel ??
                    journeyDays.find((j) => j.day === lightbox.day)?.dateLabel}
                </p>
                <p className="text-[15px] font-medium text-white">{lightboxPhoto.itemTitle}</p>
              </div>
              <button
                onClick={closeLightbox}
                aria-label="關閉"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4">
              <img
                src={lightboxPhoto.dataUrl}
                alt={lightboxPhoto.itemTitle}
                className="max-h-full max-w-full rounded-[16px] object-contain"
              />

              {(photosByDay[lightbox.day]?.length ?? 0) > 1 && (
                <>
                  <button
                    onClick={showPrevPhoto}
                    aria-label="上一張"
                    className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <button
                    onClick={showNextPhoto}
                    aria-label="下一張"
                    className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2} />
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-center pb-8 pt-4">
              <button
                onClick={() => deletePhoto(lightbox.day, lightboxPhoto.id)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-[14px] font-medium text-[#E8927C]"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
                刪除這張照片
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  );
}

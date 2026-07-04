
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Plus, Check, MapPin, X, Pencil, Camera, Trash2 } from "lucide-react";
import BottomNav from "../../components/BottomNav";
import TripCalendarSheet from "../../components/TripCalendarSheet";
import { trip, mapLink } from "../../data/trip";
import type { TimelineItem } from "../../data/trip";
import { addPhoto, compressImage, getPhotosForDay, removePhoto } from "../../lib/photos";
import type { TripPhoto } from "../../lib/photos";

export default function TodayDetailPage() {
  const params = useParams();
  const dayNumber = Number(params.day);
  const detail = trip.dayDetails[dayNumber];

  const [tasks, setTasks] = useState(detail?.tasks ?? []);
  const [timeline, setTimeline] = useState<TimelineItem[]>(detail?.timeline ?? []);
  const [isAdding, setIsAdding] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const [photos, setPhotos] = useState<TripPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadItem, setActiveUploadItem] = useState<string | null>(null);

  useEffect(() => {
    if (dayNumber) setPhotos(getPhotosForDay(dayNumber));
  }, [dayNumber]);

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function addTimelineItem() {
    if (!newTitle.trim()) return;
    const item: TimelineItem = {
      time: newTime.trim() || "--:--",
      title: newTitle.trim(),
      subtitle: "",
      emoji: "📌",
    };
    const updated = [...timeline, item].sort((a, b) => a.time.localeCompare(b.time));
    setTimeline(updated);
    setNewTime("");
    setNewTitle("");
    setIsAdding(false);
  }

  function startEdit(i: number) {
    const item = timeline[i];
    setEditingIndex(i);
    setEditTime(item.time);
    setEditTitle(item.title);
    setEditSubtitle(item.subtitle);
    setEditAddress(item.address ?? "");
  }

  function saveEdit() {
    if (editingIndex === null) return;
    const updated = [...timeline];
    updated[editingIndex] = {
      ...updated[editingIndex],
      time: editTime.trim() || "--:--",
      title: editTitle.trim(),
      subtitle: editSubtitle.trim(),
      address: editAddress.trim() || undefined,
    };
    updated.sort((a, b) => a.time.localeCompare(b.time));
    setTimeline(updated);
    setEditingIndex(null);
  }

  function triggerUpload(itemTitle: string) {
    setActiveUploadItem(itemTitle);
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeUploadItem) return;
    try {
      const dataUrl = await compressImage(file);
      const photo: TripPhoto = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        day: dayNumber,
        itemTitle: activeUploadItem,
        dataUrl,
        addedAt: Date.now(),
      };
      addPhoto(photo);
      setPhotos((prev) => [...prev, photo]);
    } catch {
      alert("照片上傳失敗，請再試一次");
    } finally {
      e.target.value = "";
      setActiveUploadItem(null);
    }
  }

  function deletePhoto(id: string) {
    removePhoto(dayNumber, id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  if (!detail) {
    return (
      <main className="mx-auto max-w-[430px] px-5 pb-[120px] pt-8">
        <p className="text-[16px] text-[#9C9488]">找不到 Day {dayNumber} 的資料</p>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[430px] px-5 pb-[120px] pt-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[1.9rem] font-medium text-[#2B2A28]">
            Day {detail.day} · {detail.dateLabel}
          </h1>
          <p className="mt-1 text-[14px] text-[#9C9488]">{detail.city}</p>
        </div>
        <button onClick={() => setCalendarOpen(true)} aria-label="開啟月曆">
          <CalendarDays className="h-6 w-6 text-[#9C9488]" strokeWidth={1.75} />
        </button>
      </div>

      <section className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#2B2A28]">時間軸</h2>
          <button
            onClick={() => {
              setIsAdding((v) => !v);
              setEditingIndex(null);
            }}
            aria-label="新增行程"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
          >
            {isAdding ? (
              <X className="h-4 w-4" strokeWidth={2} />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {isAdding && (
          <div className="mb-4 rounded-[16px] border border-[#ECE6DA] p-3">
            <div className="flex gap-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-[110px] rounded-[10px] border border-[#ECE6DA] px-2 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
              />
              <input
                type="text"
                placeholder="行程名稱"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
              />
            </div>
            <button
              onClick={addTimelineItem}
              className="mt-2 w-full rounded-[10px] bg-[#A9BFA0] py-2 text-[14px] font-medium text-white"
            >
              加入時間軸
            </button>
          </div>
        )}

        <div className="space-y-1">
          {timeline.map((item, i) => {
            const itemPhotos = photos.filter((p) => p.itemTitle === item.title);
            return editingIndex === i ? (
              <div key={`edit-${i}`} className="border-t border-[#ECE6DA] py-3 first:border-t-0">
                <div className="mb-2 flex gap-2">
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-[110px] rounded-[10px] border border-[#ECE6DA] px-2 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
                  />
                  <input
                    type="text"
                    placeholder="行程名稱"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="備註（選填）"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="mb-2 w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
                />
                <input
                  type="text"
                  placeholder="正確地址（貼給 Google 地圖用，選填）"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="mb-2 w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="flex-1 rounded-[10px] py-2 text-[14px] font-medium text-[#9C9488]"
                  >
                    取消
                  </button>
                  <button
                    onClick={saveEdit}
                    className="flex-1 rounded-[10px] bg-[#A9BFA0] py-2 text-[14px] font-medium text-white"
                  >
                    儲存
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                key={`${item.time}-${item.title}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border-t border-[#ECE6DA] py-3 first:border-t-0"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-lg">
                    {item.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-medium text-[#2B2A28]">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-[13px] text-[#9C9488]">{item.subtitle}</p>
                    )}
                  </div>
                  <span className="flex-shrink-0 font-mono text-[13px] text-[#9C9488]">{item.time}</span>
                 
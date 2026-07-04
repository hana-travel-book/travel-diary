"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Plus,
  Check,
  MapPin,
  X,
  Pencil,
  Camera,
  Trash2,
  CreditCard,
  Banknote,
} from "lucide-react";
import BottomNav from "../../components/BottomNav";
import { trip, mapLink } from "../../data/trip";
import type { TimelineItem } from "../../data/trip";
import { addPhoto, compressImage, getPhotosForDay, removePhoto } from "../../lib/photos";
import type { TripPhoto } from "../../lib/photos";
import { addExpense, getExpensesForDay, removeExpense } from "../../lib/expenses";
import type { ExpenseItem, PaymentMethod } from "../../lib/expenses";

export default function TodayDetailPage() {
  const params = useParams();
  const dayNumber = Number(params.day);
  const detail = trip.dayDetails[dayNumber];

  const [tasks, setTasks] = useState(detail?.tasks ?? []);
  const [timeline, setTimeline] = useState<TimelineItem[]>(detail?.timeline ?? []);
  const [isAdding, setIsAdding] = useState(false);
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

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newMethod, setNewMethod] = useState<PaymentMethod>("cash");

  useEffect(() => {
    if (dayNumber) {
      setPhotos(getPhotosForDay(dayNumber));
      setExpenses(getExpensesForDay(dayNumber));
    }
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

  function addExpenseItem() {
    const amount = Number(newAmount);
    if (!amount || amount <= 0) return;
    const expense: ExpenseItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      day: dayNumber,
      amount,
      note: newNote.trim() || "未命名",
      method: newMethod,
      addedAt: Date.now(),
    };
    addExpense(expense);
    setExpenses((prev) => [...prev, expense]);
    setNewAmount("");
    setNewNote("");
    setNewMethod("cash");
    setIsAddingExpense(false);
  }

  function deleteExpense(id: string) {
    removeExpense(dayNumber, id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  const dayTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

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
        capture="environment"
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
        <CalendarDays className="h-6 w-6 text-[#9C9488]" strokeWidth={1.75} />
      </div>

      {/* Timeline */}
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
                  <button
                    onClick={() => triggerUpload(item.title)}
                    aria-label="新增照片"
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-[#C9A227]"
                  >
                    <Camera className="h-3.5 w-3.5" strokeWidth={1.9} />
                  </button>
                  <button
                    onClick={() => startEdit(i)}
                    aria-label="編輯"
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
                  </button>
                  <a
                    href={mapLink(item.address || `${item.title} ${detail.city}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="在 Google 地圖開啟"
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-[#34495E]"
                  >
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.9} />
                  </a>
                </div>

                {itemPhotos.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto pl-12">
                    {itemPhotos.map((p) => (
                      <div key={p.id} className="relative flex-shrink-0">
                        <img
                          src={p.dataUrl}
                          alt={item.title}
                          className="h-16 w-16 rounded-[10px] object-cover"
                        />
                        <button
                          onClick={() => deletePhoto(p.id)}
                          aria-label="刪除照片"
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#2B2A28] shadow"
                        >
                          <Trash2 className="h-3 w-3" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tasks */}
      <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        <h2 className="mb-3 text-[17px] font-semibold text-[#2B2A28]">任務清單</h2>
        {tasks.map((t, i) => (
          <motion.button
            key={t.id}
            onClick={() => toggle(t.id)}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="flex w-full items-center gap-3 border-t border-[#ECE6DA] py-3 text-left first:border-t-0"
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                t.done ? "bg-[#A9BFA0]" : "border-2 border-[#E3DDD0]"
              }`}
            >
              {t.done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </span>
            <span className={`text-[16px] ${t.done ? "text-[#9C9488] line-through" : "text-[#2B2A28]"}`}>
              {t.label}
            </span>
          </motion.button>
        ))}
      </section>

      {/* Expense */}
      <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-[#9C9488]">今日花費</p>
            <p className="mt-0.5 text-[19px] font-semibold text-[#2B2A28]">
              THB {dayTotal.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setIsAddingExpense((v) => !v)}
            aria-label="新增花費"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#34495E] text-white"
          >
            {isAddingExpense ? (
              <X className="h-5 w-5" strokeWidth={2.25} />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.25} />
            )}
          </button>
        </div>

        {isAddingExpense && (
          <div className="mt-4 rounded-[16px] border border-[#ECE6DA] p-3">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="金額 (THB)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-[110px] rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
              />
              <input
                type="text"
                placeholder="備註（例如：午餐）"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
              />
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setNewMethod("cash")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border py-2 text-[13px] font-medium ${
                  newMethod === "cash"
                    ? "border-[#A9BFA0] bg-[#A9BFA0]/15 text-[#4A7A6D]"
                    : "border-[#ECE6DA] text-[#9C9488]"
                }`}
              >
                <Banknote className="h-4 w-4" strokeWidth={1.9} />
                現金
              </button>
              <button
                onClick={() => setNewMethod("card")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border py-2 text-[13px] font-medium ${
                  newMethod === "card"
                    ? "border-[#8FB0C9] bg-[#8FB0C9]/15 text-[#34495E]"
                    : "border-[#ECE6DA] text-[#9C9488]"
                }`}
              >
                <CreditCard className="h-4 w-4" strokeWidth={1.9} />
                信用卡
              </button>
            </div>

            <button
              onClick={addExpenseItem}
              className="mt-2 w-full rounded-[10px] bg-[#A9BFA0] py-2 text-[14px] font-medium text-white"
            >
              加入花費
            </button>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="mt-4 space-y-1">
            {expenses.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between border-t border-[#ECE6DA] py-2.5 first:border-t-0"
              >
                <div className="flex items-center gap-2">
                  {e.method === "cash" ? (
                    <Banknote className="h-4 w-4 text-[#4A7A6D]" strokeWidth={1.9} />
                  ) : (
                    <CreditCard className="h-4 w-4 text-[#34495E]" strokeWidth={1.9} />
                  )}
                  <span className="text-[15px] text-[#2B2A28]">{e.note}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[14px] text-[#2B2A28]">
                    THB {e.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => deleteExpense(e.id)}
                    aria-label="刪除"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F7F3EC] text-[#9C9488]"
                  >
                    <Trash2 className="h-3 w-3" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

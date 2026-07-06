"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Plus, Check, MapPin, X, Pencil, Camera, Trash2, Banknote, CreditCard } from "lucide-react";
import BottomNav from "../../components/BottomNav";
import TripCalendarSheet from "../../components/TripCalendarSheet";
import WeatherBadge from "../../components/WeatherBadge";
import { trip, mapLink } from "../../data/trip";
import type { TimelineItem, TaskItem } from "../../data/trip";
import { addPhoto, compressImage, getPhotosForDay, removePhoto } from "../../lib/photos";
import type { TripPhoto } from "../../lib/photos";
import { getTasksForDay, saveTasksForDay } from "../../lib/dayData";
import { getExpensesForDay, addExpense, updateExpense, removeExpense } from "../../lib/expenses";
import type { ExpenseItem, PaymentMethod } from "../../lib/expenses";
import { useTripContext } from "../../lib/tripContext";

export default function TodayDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentTripId } = useTripContext();
  const dayNumber = Number(params.day);
  const detail = trip.dayDetails[dayNumber];

  const [tasks, setTasks] = useState<TaskItem[]>(detail?.tasks ?? []);
  const [timeline, setTimeline] = useState<TimelineItem[]>(detail?.timeline ?? []);
  const [isAdding, setIsAdding] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [expenseMethod, setExpenseMethod] = useState<PaymentMethod>("cash");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const [photos, setPhotos] = useState<TripPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadItem, setActiveUploadItem] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  useEffect(() => {
    if (!dayNumber || !detail || !currentTripId) return;
    setPhotos(getPhotosForDay(currentTripId, dayNumber));
    setTasks(getTasksForDay(currentTripId, dayNumber, detail.tasks ?? []));
    setExpenses(getExpensesForDay(currentTripId, dayNumber));
  }, [dayNumber, currentTripId]);

  useEffect(() => {
    if (searchParams.get("addTask") === "1") {
      setIsAddingTask(true);
    }
    if (searchParams.get("addExpense") === "1") {
      openAddExpense();
    }
  }, [searchParams]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0 && trip.dayDetails[dayNumber + 1]) {
      router.push(`/today/${dayNumber + 1}`);
    } else if (deltaX > 0 && trip.dayDetails[dayNumber - 1]) {
      router.push(`/today/${dayNumber - 1}`);
    }
  }

  function toggle(id: string) {
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(updated);
    saveTasksForDay(currentTripId, dayNumber, updated);
  }

  function addTask() {
    if (!newTaskLabel.trim()) return;
    const item: TaskItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: newTaskLabel.trim(),
      done: false,
    };
    const updated = [...tasks, item];
    setTasks(updated);
    saveTasksForDay(currentTripId, dayNumber, updated);
    setNewTaskLabel("");
    setIsAddingTask(false);
  }

  function deleteTask(id: string) {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasksForDay(currentTripId, dayNumber, updated);
  }

  function openAddExpense() {
    setEditingExpenseId(null);
    setExpenseAmount("");
    setExpenseNote("");
    setExpenseMethod("cash");
    setIsAddingExpense(true);
  }

  function openEditExpense(e: ExpenseItem) {
    setEditingExpenseId(e.id);
    setExpenseAmount(String(e.amount));
    setExpenseNote(e.note);
    setExpenseMethod(e.method);
    setIsAddingExpense(true);
  }

  function closeExpenseForm() {
    setIsAddingExpense(false);
    setEditingExpenseId(null);
    setExpenseAmount("");
    setExpenseNote("");
    setExpenseMethod("cash");
  }

  function submitExpense() {
    const amount = Number(expenseAmount);
    if (!amount || amount <= 0) return;

    if (editingExpenseId) {
      updateExpense(currentTripId, dayNumber, editingExpenseId, {
        amount,
        note: expenseNote.trim(),
        method: expenseMethod,
      });
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editingExpenseId
            ? { ...e, amount, note: expenseNote.trim(), method: expenseMethod }
            : e
        )
      );
    } else {
      const expense: ExpenseItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        day: dayNumber,
        amount,
        note: expenseNote.trim(),
        method: expenseMethod,
        addedAt: Date.now(),
      };
      addExpense(currentTripId, expense);
      setExpenses((prev) => [...prev, expense]);
    }
    closeExpenseForm();
  }

  function deleteExpense(id: string) {
    removeExpense(currentTripId, dayNumber, id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (editingExpenseId === id) closeExpenseForm();
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
    addPhoto(currentTripId, photo);
    setPhotos((prev) => [...prev, photo]);
  } catch (err) {
    console.error("照片上傳失敗詳細原因:", err);
    if (file.type === "image/heic" || file.type === "image/heif" || /\.heic$|\.heif$/i.test(file.name)) {
      alert("這張照片是 HEIC 格式，手機瀏覽器可能無法處理。請到「設定 > 相機 > 格式」改成「最相容」，或改用截圖/其他 App 轉檔後再上傳。");
    } else {
      alert("照片上傳失敗，請再試一次");
    }
  } finally {
    e.target.value = "";
  }
}


  function deletePhoto(id: string) {
    removePhoto(currentTripId, dayNumber, id);
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
    <main
      className="mx-auto max-w-[430px] px-5 pb-[120px] pt-8"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
          <div className="mt-1">
            <WeatherBadge city={detail.city} dayNumber={dayNumber} />
          </div>
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

      <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#2B2A28]">任務清單</h2>
          <button
            onClick={() => setIsAddingTask((v) => !v)}
            aria-label="新增任務"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
          >
            {isAddingTask ? (
              <X className="h-4 w-4" strokeWidth={2} />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {isAddingTask && (
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              placeholder="任務內容"
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
            />
            <button
              onClick={addTask}
              className="rounded-[10px] bg-[#A9BFA0] px-4 py-2 text-[14px] font-medium text-white"
            >
              新增
            </button>
          </div>
        )}

        {tasks.length === 0 && !isAddingTask && (
          <p className="py-2 text-[14px] text-[#9C9488]">尚無任務，點右上角「+」新增</p>
        )}

        {tasks.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="flex w-full items-center gap-3 border-t border-[#ECE6DA] py-3 first:border-t-0"
          >
            <button
              onClick={() => toggle(t.id)}
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                t.done ? "bg-[#A9BFA0]" : "border-2 border-[#E3DDD0]"
              }`}
            >
              {t.done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </button>
            <button
              onClick={() => toggle(t.id)}
              className={`flex-1 text-left text-[16px] ${
                t.done ? "text-[#9C9488] line-through" : "text-[#2B2A28]"
              }`}
            >
              {t.label}
            </button>
            <button
              onClick={() => deleteTask(t.id)}
              aria-label="刪除任務"
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-[#9C9488]"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
            </button>
          </motion.div>
        ))}
      </section>

      <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-[#9C9488]">今日花費</p>
            <p className="mt-0.5 text-[19px] font-semibold text-[#2B2A28]">
              THB {expenseTotal.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => (isAddingExpense ? closeExpenseForm() : openAddExpense())}
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
            <div className="mb-2 flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="金額 (THB)"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-[120px] rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
              />
              <input
                type="text"
                placeholder="備註（選填）"
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitExpense()}
                className="flex-1 rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
              />
            </div>
            <div className="mb-2 flex gap-2">
              <button
                onClick={() => setExpenseMethod("cash")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2 text-[14px] font-medium ${
                  expenseMethod === "cash"
                    ? "bg-[#A9BFA0] text-white"
                    : "bg-[#F7F3EC] text-[#9C9488]"
                }`}
              >
                <Banknote className="h-4 w-4" strokeWidth={1.9} />
                現金
              </button>
              <button
                onClick={() => setExpenseMethod("card")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2 text-[14px] font-medium ${
                  expenseMethod === "card"
                    ? "bg-[#34495E] text-white"
                    : "bg-[#F7F3EC] text-[#9C9488]"
                }`}
              >
                <CreditCard className="h-4 w-4" strokeWidth={1.9} />
                信用卡
              </button>
            </div>
            <button
              onClick={submitExpense}
              className="w-full rounded-[10px] bg-[#A9BFA0] py-2 text-[14px] font-medium text-white"
            >
              {editingExpenseId ? "儲存修改" : "加入花費"}
            </button>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="mt-3 space-y-1">
            {expenses.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-3 border-t border-[#ECE6DA] py-2 first:border-t-0"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC]">
                  {e.method === "cash" ? (
                    <Banknote className="h-3.5 w-3.5 text-[#4A7A6D]" strokeWidth={1.9} />
                  ) : (
                    <CreditCard className="h-3.5 w-3.5 text-[#34495E]" strokeWidth={1.9} />
                  )}
                </span>
                <span className="flex-1 text-[14px] text-[#2B2A28]">
                  {e.note || (e.method === "cash" ? "現金支出" : "信用卡支出")}
                </span>
                <span className="font-mono text-[14px] text-[#2B2A28]">
                  THB {e.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => openEditExpense(e)}
                  aria-label="編輯花費"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
                </button>
                <button
                  onClick={() => deleteExpense(e.id)}
                  aria-label="刪除花費"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[#9C9488]"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <TripCalendarSheet open={calendarOpen} onClose={() => setCalendarOpen(false)} />

      <BottomNav />
    </main>
  );
}

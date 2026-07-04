"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Check, MapPin, Plus, X, Trash2 } from "lucide-react";
import { tripsList } from "../data/trips-list";
import { getCustomTrips, addCustomTrip, removeCustomTrip } from "../lib/trips";
import type { CustomTrip } from "../lib/trips";

export default function TripSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [customTrips, setCustomTrips] = useState<CustomTrip[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDateRange, setNewDateRange] = useState("");

  const allTrips = [...tripsList, ...customTrips];
  const [selectedId, setSelectedId] = useState(
    tripsList.find((t) => t.isCurrent)?.id ?? tripsList[0]?.id
  );

  useEffect(() => {
    setCustomTrips(getCustomTrips());
  }, []);

  const selected = allTrips.find((t) => t.id === selectedId) ?? allTrips[0];

  function handleAdd() {
    if (!newTitle.trim()) return;
    const created = addCustomTrip({
      title: newTitle.trim(),
      dateRangeLabel: newDateRange.trim() || "日期未定",
    });
    setCustomTrips((prev) => [...prev, created]);
    setNewTitle("");
    setNewDateRange("");
    setIsAdding(false);
  }

  function handleRemove(id: string) {
    removeCustomTrip(id);
    setCustomTrips((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) {
      setSelectedId(tripsList.find((t) => t.isCurrent)?.id ?? tripsList[0]?.id);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 shadow-[0_8px_20px_-12px_rgba(43,42,40,0.4)]"
      >
        <MapPin className="h-3.5 w-3.5 text-[#C9A227]" strokeWidth={2} />
        <span className="text-[13px] font-medium text-[#2B2A28]">{selected?.title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#9C9488] transition-transform ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-[260px] rounded-[16px] bg-white p-1.5 shadow-[0_20px_50px_-15px_rgba(43,42,40,0.3)]">
            {allTrips.map((t) => {
              const isCustom = customTrips.some((c) => c.id === t.id);
              return (
                <div key={t.id} className="flex items-center">
                  <button
                    onClick={() => {
                      setSelectedId(t.id);
                      setIsOpen(false);
                    }}
                    className="flex flex-1 items-center justify-between rounded-[12px] px-3 py-2.5 text-left hover:bg-[#F7F3EC]"
                  >
                    <div>
                      <p className="text-[14px] font-medium text-[#2B2A28]">{t.title}</p>
                      <p className="text-[11px] text-[#9C9488]">{t.dateRangeLabel}</p>
                    </div>
                    {t.id === selectedId && (
                      <Check className="h-4 w-4 text-[#A9BFA0]" strokeWidth={2.5} />
                    )}
                  </button>
                  {isCustom && (
                    <button
                      onClick={() => handleRemove(t.id)}
                      aria-label="刪除旅程"
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[#D8D2C2]"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  )}
                </div>
              );
            })}

            <div className="mt-1 border-t border-[#ECE6DA] pt-1">
              {isAdding ? (
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="旅程名稱（例如 Japan 2027）"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mb-1.5 w-full rounded-[8px] border border-[#ECE6DA] px-2.5 py-1.5 text-[13px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
                  />
                  <input
                    type="text"
                    placeholder="日期範圍（例如 1 Apr – 10 Apr）"
                    value={newDateRange}
                    onChange={(e) => setNewDateRange(e.target.value)}
                    className="mb-1.5 w-full rounded-[8px] border border-[#ECE6DA] px-2.5 py-1.5 text-[13px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setIsAdding(false)}
                      className="flex-1 rounded-[8px] py-1.5 text-[12px] font-medium text-[#9C9488]"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleAdd}
                      className="flex-1 rounded-[8px] bg-[#A9BFA0] py-1.5 text-[12px] font-medium text-white"
                    >
                      新增
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2.5 text-left text-[#4A7A6D] hover:bg-[#F7F3EC]"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                  <span className="text-[14px] font-medium">新增旅程</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

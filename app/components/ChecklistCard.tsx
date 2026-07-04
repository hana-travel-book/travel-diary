"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Plus, X, Trash2 } from "lucide-react";
import { trip } from "../data/trip";
import {
  getChecklist,
  toggleChecklistItem,
  addChecklistItem,
  removeChecklistItem,
} from "../lib/checklist";
import type { ChecklistItem } from "../data/trip";

export default function ChecklistCard() {
  const [items, setItems] = useState<ChecklistItem[]>(trip.checklist);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    setItems(getChecklist());
  }, []);

  const doneCount = items.filter((i) => i.done).length;

  function toggle(id: string) {
    setItems(toggleChecklistItem(id));
  }

  function handleAdd() {
    if (!newLabel.trim()) return;
    setItems(addChecklistItem(newLabel.trim()));
    setNewLabel("");
    setIsAdding(false);
  }

  function handleRemove(id: string) {
    setItems(removeChecklistItem(id));
  }

  return (
    <section className="-mt-6 rounded-[30px] bg-white p-6 shadow-[0_25px_60px_-30px_rgba(43,42,40,0.35)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-[22px] font-medium tracking-tight text-[#2B2A28]">Checklist</h2>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-[#9C9488]">
            {doneCount}/{items.length}
          </span>
          <button
            onClick={() => setIsAdding((v) => !v)}
            aria-label="新增項目"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
          >
            {isAdding ? (
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            placeholder="新增項目（例如：曬衣夾）"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
          />
          <button
            onClick={handleAdd}
            className="rounded-[10px] bg-[#A9BFA0] px-4 py-2 text-[14px] font-medium text-white"
          >
            新增
          </button>
        </div>
      )}

      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          className="flex w-full items-center gap-3.5 border-t border-[#ECE6DA] py-3.5 first:border-t-0"
        >
          <button
            onClick={() => toggle(item.id)}
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
              item.done ? "bg-[#A9BFA0]" : "border-2 border-[#E3DDD0] bg-transparent"
            }`}
          >
            {item.done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
          </button>
          <button
            onClick={() => toggle(item.id)}
            className={`flex-1 text-left text-[17px] ${
              item.done ? "text-[#9C9488] line-through" : "text-[#2B2A28]"
            }`}
          >
            {item.label}
          </button>
          <button
            onClick={() => handleRemove(item.id)}
            aria-label="刪除"
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[#D8D2C2]"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </motion.div>
      ))}
    </section>
  );
}

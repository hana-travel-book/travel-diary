"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Wallet, CheckSquare, X } from "lucide-react";
import { trip } from "../data/trip";
import { addPhoto, compressImage } from "../lib/photos";

function getCurrentDayNumber(): number {
  const start = new Date(`${trip.start}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  return Math.min(Math.max(diff, 1), trip.totalDays);
}

export default function AddSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentDay = getCurrentDayNumber();

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      addPhoto({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        day: currentDay,
        itemTitle: "快速新增",
        dataUrl,
        addedAt: Date.now(),
      });
      onClose();
      router.push(`/today/${currentDay}`);
    } catch {
      alert("照片上傳失敗，請再試一次");
    } finally {
      e.target.value = "";
    }
  }

  const options = [
    {
      label: "新增照片",
      Icon: Camera,
      color: "#8FB0C9",
      onClick: () => fileInputRef.current?.click(),
    },
    {
      label: "新增花費",
      Icon: Wallet,
      color: "#A9BFA0",
      onClick: () => {
        onClose();
        router.push(`/today/${currentDay}`);
      },
    },
    {
      label: "新增任務",
      Icon: CheckSquare,
      color: "#E8927C",
      onClick: () => {
        onClose();
        router.push(`/today/${currentDay}?addTask=1`);
      },
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
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

            <h2 className="mb-5 text-[19px] font-semibold text-[#2B2A28]">新增</h2>

            <div className="space-y-2">
              {options.map(({ label, Icon, color, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex w-full items-center gap-4 rounded-[20px] bg-[#F7F3EC] px-4 py-3.5 text-left"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}30` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.9} />
                  </span>
                  <span className="text-[16px] font-medium text-[#2B2A28]">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Settings,
  Bell,
  Globe,
  Download,
  Info,
  LogOut,
  Banknote,
  CreditCard,
  Wallet,
  Pencil,
  Camera,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import CurrencyConverter from "../components/CurrencyConverter";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { user, trip } from "../data/trip";
import { getTripTotal, getTripTotalByMethod } from "../lib/expenses";
import { compressImage, getProfile, saveProfile } from "../lib/photos";
import type { ProfileData } from "../lib/photos";
import { useTripContext } from "../lib/tripContext";

const menuItems = [
  { icon: Download, label: "匯出資料" },
  { icon: Info, label: "關於 TravelDiary" },
];

export default function MePage() {
  const { currentTripId } = useTripContext();
  const [tripTotal, setTripTotal] = useState(0);
  const [byMethod, setByMethod] = useState({ cash: 0, card: 0 });

  const defaultProfile: ProfileData = { name: user.name, role: user.role, avatar: user.avatar };
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState("");
  const [draftAvatar, setDraftAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!currentTripId) return;
    setTripTotal(getTripTotal(currentTripId));
    setByMethod(getTripTotalByMethod(currentTripId));
    setProfile(getProfile(defaultProfile));
  }, [currentTripId]);

  function startEdit() {
    setDraftName(profile.name);
    setDraftRole(profile.role);
    setDraftAvatar(profile.avatar);
    setIsEditing(true);
  }

  function saveEdit() {
    const updated: ProfileData = {
      name: draftName.trim() || profile.name,
      role: draftRole.trim() || profile.role,
      avatar: draftAvatar || profile.avatar,
    };
    setProfile(updated);
    saveProfile(updated);
    setIsEditing(false);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 400, 0.8);
      setDraftAvatar(dataUrl);
    } catch {
      alert("照片上傳失敗，請再試一次");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <main className="mx-auto max-w-[430px] px-5 pb-[120px] pt-8">
      <h1 className="font-serif text-[1.9rem] font-medium text-[#2B2A28]">Me</h1>

      {/* Profile */}
      <section className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        {isEditing ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative h-16 w-16 flex-shrink-0"
                aria-label="更換頭像"
              >
                <img
                  src={draftAvatar}
                  alt="頭像預覽"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#34495E] text-white">
                  <Camera className="h-3 w-3" strokeWidth={2} />
                </span>
              </button>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="暱稱"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
                />
                <input
                  type="text"
                  placeholder="介紹文字"
                  value={draftRole}
                  onChange={(e) => setDraftRole(e.target.value)}
                  className="w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
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
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-[19px] font-semibold text-[#2B2A28]">{profile.name}</p>
              <p className="text-[13px] text-[#9C9488]">{profile.role}</p>
            </div>
            <button
              onClick={startEdit}
              aria-label="編輯個人資料"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.9} />
            </button>
          </div>
        )}
      </section>

      {/* Current trip + expenses */}
      <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        <p className="text-[13px] text-[#9C9488]">目前旅程</p>
        <p className="mt-1 text-[17px] font-semibold text-[#2B2A28]">{trip.title}</p>
        <p className="text-[13px] text-[#9C9488]">{trip.dateRangeLabel}</p>

        <div className="mt-4 border-t border-[#ECE6DA] pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#C9A227]" strokeWidth={1.9} />
            <p className="text-[13px] font-medium text-[#9C9488]">總花費</p>
          </div>
          <p className="text-[24px] font-semibold text-[#2B2A28]">
            THB {tripTotal.toLocaleString()}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A9BFA0]/15">
                <Banknote className="h-4 w-4 text-[#4A7A6D]" strokeWidth={1.9} />
              </span>
              <div>
                <p className="text-[11px] text-[#9C9488]">現金</p>
                <p className="font-mono text-[14px] font-medium text-[#2B2A28]">
                  {byMethod.cash.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8FB0C9]/15">
                <CreditCard className="h-4 w-4 text-[#34495E]" strokeWidth={1.9} />
              </span>
              <div>
                <p className="text-[11px] text-[#9C9488]">信用卡</p>
                <p className="font-mono text-[14px] font-medium text-[#2B2A28]">
                  {byMethod.card.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CurrencyConverter />

      <Link
        href="/emergency"
        className="mt-4 flex items-center gap-3.5 rounded-[28px] bg-white px-6 py-4 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]"
      >
        <ShieldAlert className="h-5 w-5 flex-shrink-0 text-[#E8927C]" strokeWidth={1.75} />
        <span className="flex-1 text-[16px] font-medium text-[#2B2A28]">緊急聯絡卡</span>
        <ChevronRight className="h-4 w-4 text-[#D8D2C2]" strokeWidth={1.75} />
      </Link>

      {/* Menu */}
      <section className="mt-4 rounded-[28px] bg-white shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        {menuItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex w-full items-center gap-3.5 border-t border-[#ECE6DA] px-6 py-4 text-left first:border-t-0"
          >
            <Icon className="h-5 w-5 flex-shrink-0 text-[#9C9488]" strokeWidth={1.75} />
            <span className="flex-1 text-[16px] text-[#2B2A28]">{label}</span>
            <ChevronRight className="h-4 w-4 text-[#D8D2C2]" strokeWidth={1.75} />
          </button>
        ))}
      </section>

      {/* Sign out */}
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-[28px] bg-white py-4 text-[16px] font-medium text-[#E8927C] shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        <LogOut className="h-4 w-4" strokeWidth={1.75} />
        登出
      </button>

      <BottomNav />
    </main>
  );
}

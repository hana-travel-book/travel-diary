"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Check, MapPin } from "lucide-react";
import { useTripContext } from "../lib/tripContext";
import {
  isUnlockedThisSession,
  markUnlocked,
  getTripAccessInfo,
  setTripPassword,
} from "../lib/tripAuth";

type Status = "loading" | "setup" | "locked" | "unlocked";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const { currentTripId, setCurrentTripId, allTrips } = useTripContext();
  const [status, setStatus] = useState<Status>("loading");
  const [existingPassword, setExistingPassword] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [confirmInput, setConfirmInput] = useState("");
  const [error, setError] = useState("");
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const currentTrip = allTrips.find((t) => t.id === currentTripId);

  useEffect(() => {
    if (!currentTripId) return;
    setInput("");
    setConfirmInput("");
    setError("");
    setSwitcherOpen(false);

    if (isUnlockedThisSession(currentTripId)) {
      setStatus("unlocked");
      return;
    }
    checkPassword();
  }, [currentTripId]);

  async function checkPassword() {
    setStatus("loading");
    try {
      const info = await getTripAccessInfo(currentTripId);
      if (info.password) {
        setExistingPassword(info.password);
        setStatus("locked");
      } else {
        setStatus("setup");
      }
    } catch {
      setError("無法連線，請檢查網路後重新整理");
      setStatus("locked");
    }
  }

  async function handleSetup() {
    if (!input.trim()) {
      setError("請輸入密碼");
      return;
    }
    if (input !== confirmInput) {
      setError("兩次輸入的密碼不一致");
      return;
    }
    try {
      await setTripPassword(currentTripId, input.trim());
      markUnlocked(currentTripId);
      setStatus("unlocked");
    } catch {
      setError("設定失敗，請再試一次");
    }
  }

  function handleUnlock() {
    if (input === existingPassword) {
      markUnlocked(currentTripId);
      setStatus("unlocked");
    } else {
      setError("密碼不正確");
    }
  }

  if (!currentTripId || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC]">
        <p className="text-[14px] text-[#9C9488]">載入中...</p>
      </div>
    );
  }

  if (status === "unlocked") {
    return <>{children}</>;
  }

  const tripSwitcherBlock = (
    <div className="relative mb-5">
      <button
        onClick={() => setSwitcherOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-[10px] border border-[#ECE6DA] px-3 py-2.5"
      >
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#C9A227]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-[#2B2A28]">{currentTrip?.title}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#9C9488] transition-transform ${
            switcherOpen ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </button>

      {switcherOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-[12px] border border-[#ECE6DA] bg-white p-1.5 shadow-[0_20px_50px_-15px_rgba(43,42,40,0.3)]">
          {allTrips.map((t) => (
            <button
              key={t.id}
              onClick={() => setCurrentTripId(t.id)}
              className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left hover:bg-[#F7F3EC]"
            >
              <div>
                <p className="text-[13px] font-medium text-[#2B2A28]">{t.title}</p>
                <p className="text-[11px] text-[#9C9488]">{t.dateRangeLabel}</p>
              </div>
              {t.id === currentTripId && (
                <Check className="h-4 w-4 text-[#A9BFA0]" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (status === "setup") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-6">
        <div className="w-full max-w-[360px] rounded-[28px] bg-white p-8 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
          {tripSwitcherBlock}
          <h1 className="mb-1 font-serif text-[1.5rem] font-medium text-[#2B2A28]">
            設定「{currentTrip?.title}」的密碼
          </h1>
          <p className="mb-5 text-[13px] text-[#9C9488]">
            這趟旅程第一次使用，請設定一組密碼，之後同行的人也要用這組密碼才能進入
          </p>
          <input
            type="password"
            placeholder="設定密碼"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-3 w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2.5 text-[15px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
          />
          <input
            type="password"
            placeholder="再輸入一次確認"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSetup()}
            className="mb-3 w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2.5 text-[15px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
          />
          {error && <p className="mb-3 text-[13px] text-[#E8927C]">{error}</p>}
          <button
            onClick={handleSetup}
            className="w-full rounded-[10px] bg-[#A9BFA0] py-2.5 text-[14px] font-medium text-white"
          >
            設定並進入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-6">
      <div className="w-full max-w-[360px] rounded-[28px] bg-white p-8 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
        {tripSwitcherBlock}
        <h1 className="mb-1 font-serif text-[1.5rem] font-medium text-[#2B2A28]">
          輸入「{currentTrip?.title}」的密碼
        </h1>
        <p className="mb-5 text-[13px] text-[#9C9488]">請向規劃這趟旅程的人索取密碼</p>
        <input
          type="password"
          placeholder="密碼"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          className="mb-3 w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2.5 text-[15px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
        />
        {error && <p className="mb-3 text-[13px] text-[#E8927C]">{error}</p>}
        <button
          onClick={handleUnlock}
          className="w-full rounded-[10px] bg-[#A9BFA0] py-2.5 text-[14px] font-medium text-white"
        >
          進入
        </button>
      </div>
    </div>
  );
}

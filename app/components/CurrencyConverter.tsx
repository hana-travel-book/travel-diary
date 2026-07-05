"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { getThbToTwdRate } from "../lib/exchangeRate";

export default function CurrencyConverter() {
  const [rate, setRate] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [amount, setAmount] = useState("100");
  const [direction, setDirection] = useState<"thbToTwd" | "twdToThb">("thbToTwd");

  useEffect(() => {
    getThbToTwdRate().then(({ rate, isLive }) => {
      setRate(rate);
      setIsLive(isLive);
    });
  }, []);

  const numericAmount = Number(amount) || 0;
  const result =
    rate === null ? null : direction === "thbToTwd" ? numericAmount * rate : numericAmount / rate;

  return (
    <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[#2B2A28]">匯率換算</h2>
        {rate !== null && (
          <span className="text-[11px] text-[#9C9488]">
            1 THB ≈ {rate.toFixed(3)} TWD{!isLive && "（快取匯率）"}
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <p className="mb-1 text-[12px] text-[#9C9488]">
            {direction === "thbToTwd" ? "泰銖 (THB)" : "台幣 (TWD)"}
          </p>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[16px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
          />
        </div>

        <button
          onClick={() => setDirection((d) => (d === "thbToTwd" ? "twdToThb" : "thbToTwd"))}
          aria-label="切換換算方向"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
        >
          <ArrowLeftRight className="h-4 w-4" strokeWidth={1.9} />
        </button>

        <div className="flex-1">
          <p className="mb-1 text-[12px] text-[#9C9488]">
            {direction === "thbToTwd" ? "台幣 (TWD)" : "泰銖 (THB)"}
          </p>
          <div className="w-full rounded-[10px] border border-[#ECE6DA] bg-[#F7F3EC] px-3 py-2 text-[16px] font-medium text-[#2B2A28]">
            {result === null ? "..." : result.toFixed(2)}
          </div>
        </div>
      </div>
    </section>
  );
}

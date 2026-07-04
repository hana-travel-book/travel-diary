"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Plus, Camera, User } from "lucide-react";
import AddSheet from "./AddSheet";

const items = [
  { key: "home", label: "Home", href: "/", Icon: Home },
  { key: "journey", label: "Journey", href: "/journey", Icon: Map },
  { key: "add", label: "Add", href: "#", Icon: Plus },
  { key: "memories", label: "Memories", href: "/memories", Icon: Camera },
  { key: "me", label: "Me", href: "/me", Icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-[18px] left-1/2 z-[99] flex h-[74px] w-[390px] max-w-[calc(100%-32px)] -translate-x-1/2 items-center justify-around rounded-[28px] bg-white/90 shadow-[0_25px_60px_-15px_rgba(43,42,40,0.25)] backdrop-blur-xl">
        {items.map(({ key, label, href, Icon }) => {
          const isActive = pathname === href;
          const isAdd = key === "add";

          if (isAdd) {
            return (
              <button
                key={key}
                onClick={() => setSheetOpen(true)}
                aria-label={label}
                className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#34495E] text-white shadow-[0_12px_26px_-8px_rgba(52,73,94,0.6)]"
              >
                <Icon className="h-6 w-6" strokeWidth={2.25} />
              </button>
            );
          }

          return (
            <Link
              key={key}
              href={href}
              aria-label={label}
              className="flex flex-col items-center gap-1 text-[11px] font-semibold"
              style={{ color: isActive ? "#E8927C" : "#A8A196" }}
            >
              <Icon className="h-[21px] w-[21px]" strokeWidth={1.9} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <AddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

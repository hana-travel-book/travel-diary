"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Wallet, CheckSquare, X } from "lucide-react";

const options = [
  { label: "新增照片", href: "/memories", Icon: Camera, color: "#8FB0C9" },
  { label: "新增花費", href: "/today/6", Icon: Wallet, color: "#A9BFA0" },
  { label: "新增任務", href: "/today/6", Icon: CheckSquare, color: "#E8927C" },
];

export default function AddSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40"
          />

          {/* Sheet */}
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
              {options.map(({ label, href, Icon, color }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-[20px] bg-[#F7F3EC] px-4 py-3.5"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}30` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.9} />
                  </span>
                  <span className="text-[16px] font-medium text-[#2B2A28]">{label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

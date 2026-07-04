"use client";

import { motion } from "framer-motion";
import { trip, getDaysLeft } from "../data/trip";

export default function HeroCard() {
  const daysLeft = getDaysLeft(trip.start);

  return (
    <section className="relative h-[62vh] min-h-[440px] w-full overflow-hidden rounded-[38px] shadow-[0_30px_70px_-25px_rgba(43,42,40,0.4)]">
      <img
        src={trip.heroImage}
        alt={trip.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/35" />

      <div className="absolute inset-x-0 top-9 px-7 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-[2.15rem] font-medium tracking-tight"
        >
          {trip.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-1.5 text-[15px] font-medium text-white/80"
        >
          {trip.dateRangeLabel}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="absolute inset-x-0 top-[44%] flex flex-col items-center text-white"
      >
        <span className="font-sans text-[6rem] font-bold leading-none tracking-tighter">
          {daysLeft}
        </span>
        <span className="mt-2 text-[13px] font-semibold tracking-[0.4em] text-white/85">
          DAYS LEFT
        </span>
      </motion.div>
    </section>
  );
}

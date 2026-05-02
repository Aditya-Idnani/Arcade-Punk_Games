"use client";

import { motion } from "framer-motion";
import type { CategoryFilter } from "@/types";

const filters: CategoryFilter[] = ["ALL", "PUZZLE", "ARCADE", "LOGIC", "STRATEGY", "REFLEX"];

export function GameFilters({
  active,
  onChange,
}: {
  active: CategoryFilter;
  onChange: (f: CategoryFilter) => void;
}) {
  return (
    <div className="mb-8 rounded-3xl border border-violet-300/20 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-pink-500/10 p-3 sm:p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">Filter by category</p>
      <div className="flex flex-wrap gap-2.5">
      {filters.map((filter) => (
        <motion.button
          key={filter}
          onClick={() => onChange(filter)}
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`relative overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition ${
            active === filter
              ? "border-cyan-300/80 bg-gradient-to-r from-cyan-400/30 to-violet-400/30 text-cyan-100 shadow-[0_0_24px_rgba(52,245,255,0.35)]"
              : "border-white/15 bg-white/5 text-zinc-300 hover:border-cyan-300/60 hover:bg-cyan-400/10"
          }`}
        >
          {active === filter && (
            <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-cyan-400/10 to-violet-400/10" />
          )}
          <span className="relative">{filter}</span>
        </motion.button>
      ))}
      </div>
    </div>
  );
}

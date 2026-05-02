"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Game } from "@/types";

export function GameCard({
  game,
  bestScore,
}: {
  game: Game;
  bestScore?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl border border-violet-300/25 bg-gradient-to-br from-[#191539]/90 via-[#111029]/90 to-[#0d1d33]/90 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl" />
      </div>

      <div className="relative mb-4 flex items-center justify-between">
        <span className="rounded-2xl border border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-3xl shadow-[0_0_20px_rgba(52,245,255,0.25)]">
          {game.icon}
        </span>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-100">
          Best: {bestScore ?? 0}
        </span>
      </div>
      <h3 className="relative text-2xl font-extrabold tracking-tight text-white">{game.name}</h3>
      <p className="mt-2 line-clamp-2 text-base text-zinc-300">{game.description}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {game.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-transparent bg-gradient-to-r from-fuchsia-500/30 via-violet-500/30 to-cyan-500/30 px-3 py-1 text-xs font-semibold text-violet-100 shadow-[0_0_18px_rgba(168,85,247,0.25)]"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/games/${game.slug}`}
        className="relative mt-6 inline-flex rounded-full border border-cyan-300/70 bg-gradient-to-r from-cyan-400/20 to-violet-500/20 px-5 py-2.5 text-sm font-bold text-cyan-100 transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(52,245,255,0.45)]"
      >
        Play
      </Link>
    </motion.article>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { fallbackGames } from "@/lib/fallback-games";
import { useAppStore } from "@/store/use-app-store";
import { GameCard } from "@/components/games/card";
import { GameFilters } from "@/components/games/filters";
import type { CategoryFilter } from "@/types";

export default function GamesPage() {
  const router = useRouter();
  const games = useAppStore((s) => s.games);
  const setGames = useAppStore((s) => s.setGames);
  const [filter, setFilter] = useState<CategoryFilter>("ALL");
  const [bestBySlug, setBestBySlug] = useState<Record<string, number>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getGames()
      .then((serverGames) => {
        if (!serverGames.length) {
          setGames(fallbackGames);
          setLoadError("API returned no games. Showing built-in game catalog.");
          return;
        }
        setGames(serverGames);
        setLoadError(null);
      })
      .catch((error) => {
        setGames(fallbackGames);
        setLoadError(
          error instanceof Error
            ? `Backend unavailable: ${error.message}. Showing built-in game catalog.`
            : "Could not reach backend. Showing built-in game catalog.",
        );
      });
  }, [setGames]);

  useEffect(() => {
    if (!games.length) return;
    const quick = new URLSearchParams(window.location.search).get("quick");
    if (quick === "1") {
      const random = games[Math.floor(Math.random() * games.length)];
      if (random) router.push(`/games/${random.slug}`);
    }
  }, [games, router]);

  useEffect(() => {
    const token = localStorage.getItem("arcade_token");
    if (!token || !games.length) return;
    Promise.allSettled(games.map((g) => api.getScores(g.id))).then((results) => {
      const next: Record<string, number> = {};
      results.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          const top = result.value[0]?.score ?? 0;
          next[games[idx].slug] = top;
        }
      });
      setBestBySlug(next);
    });
  }, [games]);

  const filtered = useMemo(
    () => games.filter((g) => filter === "ALL" || g.category === filter),
    [games, filter],
  );

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl border border-violet-300/20 bg-gradient-to-r from-[#161233]/80 via-[#0f1632]/80 to-[#1a1034]/80 p-6 sm:p-8"
      >
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl neon-text">Game Library</h1>
        <p className="mt-2 text-sm text-zinc-300 sm:text-base">
          Choose your mode, launch instantly, and dominate the neon arena.
        </p>
      </motion.div>
      {loadError && (
        <p className="mb-3 rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {loadError}
        </p>
      )}
      <GameFilters active={filter} onChange={setFilter} />
      {filtered.length === 0 && (
        <p className="mb-4 text-sm text-zinc-300">No games found for this filter.</p>
      )}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((game) => (
          <GameCard key={game.id} game={game} bestScore={bestBySlug[game.slug] ?? 0} />
        ))}
      </div>
    </section>
  );
}

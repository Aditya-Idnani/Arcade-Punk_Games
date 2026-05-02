"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { GameFrame } from "@/components/game-shell/game-frame";
import { registry } from "@/components/games/game-registry";
import { api } from "@/lib/api";
import { fallbackGames } from "@/lib/fallback-games";
import type { Game } from "@/types";

export default function GamePlayPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [game, setGame] = useState<Game | null>(null);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [restartToken, setRestartToken] = useState(0);

  useEffect(() => {
    api
      .getGame(slug)
      .then(setGame)
      .catch(() => {
        const fallback = fallbackGames.find((g) => g.slug === slug) ?? null;
        setGame(fallback);
      });
  }, [slug]);

  const gameNode = useMemo(() => {
    if (!game) return null;
    const render = registry[game.slug];
    if (!render) return <p className="text-zinc-400">Game unavailable.</p>;
    return <div key={restartToken}>{render({ paused, onScoreChange: setScore })}</div>;
  }, [game, paused, restartToken]);

  if (!game) return <div className="glass rounded-2xl p-6 skeleton h-64" />;

  return (
    <div className="space-y-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-violet-300/20 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-pink-500/10 px-4 py-3 sm:px-6">
        <p className="text-sm text-zinc-300">
          <span className="font-semibold text-cyan-200">Now Playing:</span> {game.name}
        </p>
        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-violet-100">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <GameFrame
        gameId={game.id}
        title={game.name}
        score={score}
        paused={paused}
        onPauseToggle={() => setPaused((p) => !p)}
        onRestart={() => {
          setPaused(false);
          setScore(0);
          setRestartToken((t) => t + 1);
        }}
      >
        {gameNode}
      </GameFrame>
    </div>
  );
}

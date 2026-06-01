"use client";

import { useEffect, useMemo, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";
import { GameOverlay } from "./GameOverlay";

const icons = ["🎮", "🚀", "🕹️", "💎", "⚡", "👾", "🎯", "🧠"];

type Card = {
  id: number;
  value: string;
  open: boolean;
  matched: boolean;
};

function shuffledCards() {
  const values = [...icons, ...icons]
    .map((value, i) => ({ id: i + 1, value, open: false, matched: false }))
    .sort(() => Math.random() - 0.5);
  return values;
}

export function MemoryMatchGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [cards, setCards] = useState<Card[]>(() => shuffledCards());
  const [pick, setPick] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const matchedCount = useMemo(() => cards.filter((c) => c.matched).length, [cards]);
  const won = matchedCount === cards.length;
  const currentScore = useMemo(() => Math.max(matchedCount * 10 - moves, 0), [matchedCount, moves]);

  useEffect(() => {
    onScoreChange(currentScore);
  }, [currentScore, onScoreChange]);

  const flip = (idx: number) => {
    if (paused || won || pick.length === 2) return;
    const card = cards[idx];
    if (card.open || card.matched) return;
    const next = cards.map((c, i) => (i === idx ? { ...c, open: true } : c));
    const nextPick = [...pick, idx];
    setCards(next);
    setPick(nextPick);
    if (nextPick.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextPick;
      if (next[a].value === next[b].value) {
        setTimeout(() => {
          setCards((current) =>
            current.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)),
          );
          setPick([]);
        }, 220);
      } else {
        setTimeout(() => {
          setCards((current) =>
            current.map((c, i) => (i === a || i === b ? { ...c, open: false } : c)),
          );
          setPick([]);
        }, 550);
      }
    }
  };

  const handleRetry = () => {
    setCards(shuffledCards());
    setPick([]);
    setMoves(0);
    onScoreChange(0);
  };

  return (
    <div className="relative space-y-3 p-4">
      <div className="mx-auto grid w-fit grid-cols-4 gap-2 rounded-xl bg-[#110f22] p-2">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => flip(i)}
            disabled={won}
            className="flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-[#1a1733] text-xl"
          >
            {card.open || card.matched ? card.value : "?"}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-zinc-400">Moves: {moves}</p>

      {won && <GameOverlay status="won" score={currentScore} onRetry={handleRetry} />}
    </div>
  );
}

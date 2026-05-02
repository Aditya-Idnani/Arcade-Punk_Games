"use client";

import { useEffect, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";

const WORDS = ["ARCADE", "CYBER", "NEON", "PUZZLE", "LOGIC", "TETRIS", "SNAKE", "SCORE", "PONG"];

export function WordGuessGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [word] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);

  const solved = word.split("").every((ch) => guessed.includes(ch));
  useEffect(() => {
    onScoreChange(solved ? Math.max(0, 50 - wrong * 5) : 0);
  }, [solved, wrong, onScoreChange]);

  const guess = (ch: string) => {
    if (paused || guessed.includes(ch) || solved) return;
    setGuessed((g) => [...g, ch]);
    if (!word.includes(ch)) setWrong((w) => w + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2 text-2xl font-bold tracking-widest">
        {word.split("").map((ch, i) => (
          <span key={i} className="w-8 border-b border-cyan-300/60 text-center text-cyan-200">
            {guessed.includes(ch) ? ch : "_"}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch) => (
          <button
            key={ch}
            onClick={() => guess(ch)}
            className="h-8 w-8 rounded bg-[#1a1733] text-xs text-zinc-100 disabled:opacity-40"
            disabled={guessed.includes(ch) || wrong >= 7}
          >
            {ch}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-zinc-400">{solved ? "Solved!" : `Wrong guesses: ${wrong}/7`}</p>
    </div>
  );
}

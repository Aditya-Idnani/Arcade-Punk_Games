"use client";

import { useEffect, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";
import { GameOverlay } from "./GameOverlay";

const WORDS = ["ARCADE", "CYBER", "NEON", "PUZZLE", "LOGIC", "TETRIS", "SNAKE", "SCORE", "PONG"];

export function WordGuessGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);

  const solved = word.split("").every((ch) => guessed.includes(ch));
  const lost = wrong >= 7;
  const currentScore = solved ? Math.max(0, 50 - wrong * 5) : 0;

  useEffect(() => {
    onScoreChange(currentScore);
  }, [solved, wrong, currentScore, onScoreChange]);

  const guess = (ch: string) => {
    if (paused || guessed.includes(ch) || solved || lost) return;
    setGuessed((g) => [...g, ch]);
    if (!word.includes(ch)) setWrong((w) => w + 1);
  };

  const handleRetry = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuessed([]);
    setWrong(0);
    onScoreChange(0);
  };

  return (
    <div className="relative space-y-4 p-4 min-w-[280px]">
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
            disabled={guessed.includes(ch) || lost || solved}
          >
            {ch}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-zinc-400">
        {solved ? "Solved!" : lost ? `Game Over! The word was ${word}` : `Wrong guesses: ${wrong}/7`}
      </p>

      {solved && <GameOverlay status="won" score={currentScore} onRetry={handleRetry} />}
      {!solved && lost && <GameOverlay status="lost" score={0} onRetry={handleRetry} />}
    </div>
  );
}

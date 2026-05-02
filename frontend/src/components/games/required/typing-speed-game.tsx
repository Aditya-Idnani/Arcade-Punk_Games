"use client";

import { useEffect, useRef, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";

const words = [
  "neon","arcade","cyber","quantum","velocity","pixel","fusion","vortex","circuit","dominate",
  "strategy","reflex","leaderboard","spectrum","glow","matrix","combo","score","battle","ultra",
  "vibrant","rainbow","laser","plasma","stellar","galaxy","energy","phantom","glitch","hyper",
];

function sentence() {
  return Array.from({ length: 150 })
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(" ");
}

export function TypingSpeedGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [target, setTarget] = useState("");
  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  
  const wpmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTarget(sentence());
  }, []);

  useEffect(() => {
    if (!startedAt || gameOver) return;
    
    wpmTimerRef.current = setInterval(() => {
      const mins = (Date.now() - startedAt) / 60000;
      if (mins <= 0) return;
      const next = Math.round(input.trim().split(/\s+/).filter(Boolean).length / mins);
      setWpm(next);
      onScoreChange(next);
    }, 250);
    
    return () => {
      if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    };
  }, [startedAt, input, onScoreChange, gameOver]);

  useEffect(() => {
    if (!startedAt || gameOver) return;

    countdownRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = (timeLimit || 0) - elapsed;
      if (remaining <= 0) {
        setTimeLeft(0);
        setGameOver(true);
        if (countdownRef.current) clearInterval(countdownRef.current);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [startedAt, timeLimit, gameOver]);

  const handleStartTimer = (seconds: number) => {
    setTimeLimit(seconds);
    setTimeLeft(seconds);
    setInput("");
    setWpm(0);
    setStartedAt(null);
    setGameOver(false);
    onScoreChange(0);
    setTarget(sentence());
  };

  const handleReplay = () => {
    setTimeLimit(null);
    setTimeLeft(0);
    setInput("");
    setWpm(0);
    setStartedAt(null);
    setGameOver(false);
    onScoreChange(0);
  };

  if (!timeLimit) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-8 min-h-[40vh]">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
          Select Time Limit
        </h2>
        <div className="flex gap-6">
          <button
            onClick={() => handleStartTimer(30)}
            className="rounded-xl bg-gradient-to-r from-[#ff007f] to-[#8a2be2] px-8 py-4 text-xl font-bold text-white shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:shadow-[0_0_30px_rgba(255,0,127,0.6)] hover:opacity-90 transition"
          >
            30 Seconds
          </button>
          <button
            onClick={() => handleStartTimer(60)}
            className="rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#39ff14] px-8 py-4 text-xl font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:opacity-90 transition"
          >
            1 Minute
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-6 min-h-[40vh] rounded-3xl bg-black/50 p-8 border border-[#ff007f]/50 shadow-[0_0_30px_rgba(255,0,127,0.2)]">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#ffea00] drop-shadow-[0_0_15px_rgba(255,0,127,0.6)]">
          Time's Up!
        </h2>
        <p className="text-2xl text-zinc-300">
          Your Typing Speed: <span className="font-bold text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">{wpm} WPM</span>
        </p>
        <button
          onClick={handleReplay}
          className="rounded-full mt-4 bg-gradient-to-r from-[#8a2be2] to-[#00f0ff] px-10 py-4 text-xl text-white font-bold hover:shadow-[0_0_25px_rgba(138,43,226,0.6)] transition"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col space-y-6">
      <div className="flex justify-between items-center bg-[#15122c]/80 p-4 rounded-xl border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <p className="text-lg font-bold text-zinc-300">Time Left: <span className="text-[#ff007f]">{startedAt ? timeLeft : timeLimit}s</span></p>
        <p className="text-lg font-bold text-zinc-300">WPM: <span className="text-[#39ff14]">{wpm}</span></p>
      </div>
      <div className="relative flex-1 min-h-[200px]">
        <p className="absolute inset-0 overflow-y-auto rounded-xl bg-[#0a0a1a] p-6 text-xl leading-relaxed text-zinc-400 shadow-inner border border-[#8a2be2]/40">
          {target}
        </p>
      </div>
      <textarea
        disabled={paused || gameOver}
        value={input}
        onChange={(e) => {
          if (!startedAt) setStartedAt(Date.now());
          setInput(e.target.value);
        }}
        className="h-48 w-full rounded-xl border border-[#39ff14]/30 bg-[#121027]/90 p-6 text-xl text-zinc-100 outline-none focus:border-[#39ff14] focus:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition"
        placeholder="Start typing to begin..."
      />
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";
import { GameOverlay } from "./GameOverlay";

type Status = "idle" | "waiting" | "ready";

export function ReactionTimeGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Click start to test your reflexes.");
  const [result, setResult] = useState<number | null>(null);
  const startRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    if (paused) return;
    setResult(null);
    setStatus("waiting");
    setMessage("Wait for green...");
    const delay = 1000 + Math.random() * 2500;
    timeoutRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setStatus("ready");
      setMessage("NOW! Click!");
    }, delay);
  };

  const clickArea = () => {
    if (paused || result !== null) return;
    if (status === "waiting") {
      setMessage("Too soon! Try again.");
      setStatus("idle");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    if (status === "ready") {
      const ms = Math.max(1, Math.round(performance.now() - startRef.current));
      setResult(ms);
      setMessage(`${ms} ms`);
      setStatus("idle");
      onScoreChange(Math.max(0, 1000 - ms));
    }
  };

  const handleRetry = () => {
    setResult(null);
    setStatus("idle");
    setMessage("Click start to test your reflexes.");
    onScoreChange(0);
  };

  return (
    <div className="relative space-y-4 p-4 min-w-[280px]">
      <button onClick={start} className="rounded-full border border-cyan-300/50 px-4 py-2 text-sm text-cyan-200">
        Start
      </button>
      <button
        onClick={clickArea}
        className={`mx-auto flex h-52 w-full max-w-lg items-center justify-center rounded-2xl text-xl font-bold ${
          status === "ready" ? "bg-emerald-500/40 text-white" : "bg-[#1a1732] text-zinc-200"
        }`}
      >
        {message}
      </button>

      {result !== null && (
        <GameOverlay
          status="completed"
          message={`Your reaction speed: ${result} ms`}
          score={Math.max(0, 1000 - (result || 0))}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}

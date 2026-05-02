"use client";

import { useRef, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";

type Status = "idle" | "waiting" | "ready";

export function ReactionTimeGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Click start to test your reflexes.");
  const startRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    if (paused) return;
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
    if (paused) return;
    if (status === "waiting") {
      setMessage("Too soon! Try again.");
      setStatus("idle");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    if (status === "ready") {
      const ms = Math.max(1, Math.round(performance.now() - startRef.current));
      setMessage(`${ms} ms`);
      setStatus("idle");
      onScoreChange(Math.max(0, 1000 - ms));
    }
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Pause, Play, RotateCcw } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { api } from "@/lib/api";
import { GlowButton } from "@/components/ui/glow-button";

export function GameFrame({
  gameId,
  title,
  children,
  score,
  onRestart,
  onPauseToggle,
  paused,
}: {
  gameId: string;
  title: string;
  children: React.ReactNode;
  score: number;
  onRestart: () => void;
  onPauseToggle: () => void;
  paused: boolean;
}) {
  const token = useAppStore((s) => s.token);
  const notify = useAppStore((s) => s.notify);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => !!token && score > 0, [token, score]);

  const submitScore = async () => {
    if (!token || !score) return;
    setSubmitting(true);
    try {
      const response = await api.postScore(token, { gameId, score });
      notify(response.notification);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Failed to submit score");
    } finally {
      setSubmitting(false);
    }
  };

  const goFullscreen = () => {
    const root = document.getElementById("game-root");
    root?.requestFullscreen();
  };

  return (
    <section
      id="game-root"
      className="mx-auto flex w-full max-w-6xl flex-col rounded-[2rem] border border-[#ff007f]/50 bg-gradient-to-br from-[#171331]/95 via-[#0b0a1a]/95 to-[#0c1a30]/95 p-4 shadow-[0_0_40px_rgba(255,0,127,0.15)] sm:p-8"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold neon-text">{title}</h1>
          <p className="text-base text-zinc-300 font-medium">Score: {score}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onPauseToggle}
            className="rounded-full border border-white/20 p-2 text-zinc-100 transition hover:border-[#00f0ff]/70 hover:text-[#00f0ff] hover:shadow-[0_0_10px_rgba(0,240,255,0.5)]"
            aria-label={paused ? "Resume game" : "Pause game"}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={onRestart}
            className="rounded-full border border-white/20 p-2 text-zinc-100 transition hover:border-[#39ff14]/70 hover:text-[#39ff14] hover:shadow-[0_0_10px_rgba(57,255,20,0.5)]"
            aria-label="Restart game"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={goFullscreen}
            className="rounded-full border border-white/20 p-2 text-zinc-100 transition hover:border-[#8a2be2]/70 hover:text-[#8a2be2] hover:shadow-[0_0_10px_rgba(138,43,226,0.5)]"
            aria-label="Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
          <GlowButton
            disabled={!canSubmit || submitting}
            onClick={submitScore}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            {token ? (submitting ? "Submitting..." : "Submit Score") : "Login to Submit"}
          </GlowButton>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex min-h-[60vh] flex-1 items-center justify-center rounded-3xl border border-white/10 bg-black/40 p-4 shadow-inner sm:p-6"
      >
        {children}
      </motion.div>
    </section>
  );
}

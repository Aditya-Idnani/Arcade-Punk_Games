"use client";

import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/glow-button";

type GameOverlayProps = {
  status: "won" | "lost" | "draw" | "completed";
  score?: number;
  message?: string;
  onRetry: () => void;
};

export function GameOverlay({ status, score, message, onRetry }: GameOverlayProps) {
  const isWon = status === "won";
  const isDraw = status === "draw";
  const isCompleted = status === "completed";

  let title = "Game Over";
  let titleClass = "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#00f0ff] drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]";

  if (isWon) {
    title = "Victory!";
    titleClass = "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[#00f0ff] drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]";
  } else if (isDraw) {
    title = "Draw!";
    titleClass = "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffea00] to-[#00f0ff] drop-shadow-[0_0_10px_rgba(255,234,0,0.5)]";
  } else if (isCompleted) {
    title = "Completed!";
    titleClass = "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md rounded-xl z-20 p-6 text-center"
    >
      <h2 className={`${titleClass} mb-2`}>
        {title}
      </h2>
      
      {score !== undefined && (
        <p className="text-xl text-zinc-300 mb-2 font-medium">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </p>
      )}

      {message && (
        <p className="text-base text-zinc-400 mb-6 max-w-xs">
          {message}
        </p>
      )}

      <GlowButton
        onClick={onRetry}
        className="mt-2 rounded-full px-8 py-3 font-bold transition-all hover:scale-105"
      >
        Play Again
      </GlowButton>
    </motion.div>
  );
}

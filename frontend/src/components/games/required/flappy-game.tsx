"use client";

import { useEffect, useRef, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";
import { GameOverlay } from "./GameOverlay";

type Pipe = { x: number; gapY: number };

const W = 480;
const H = 560;
const BIRD_X = 100;
const PIPE_W = 52;
const GAP = 160;
const SPEED = 2.2;

export function FlappyGame({ paused, onScoreChange }: ArcadeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdY = useRef(220);
  const vel = useRef(0);
  const pipes = useRef<Pipe[]>([{ x: 520, gapY: 200 }, { x: 760, gapY: 280 }]);
  const score = useRef(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const flap = (e: KeyboardEvent) => {
      if (e.code === "Space" && !gameOver) vel.current = -6.5;
    };
    const click = () => {
      if (!gameOver) vel.current = -6.5;
    };
    window.addEventListener("keydown", flap);
    window.addEventListener("click", click);
    return () => {
      window.removeEventListener("keydown", flap);
      window.removeEventListener("click", click);
    };
  }, [gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      if (!paused && !gameOver) {
        vel.current += 0.35;
        birdY.current += vel.current;
        for (const pipe of pipes.current) {
          pipe.x -= SPEED;
          if (pipe.x + PIPE_W < 0) {
            pipe.x = W + Math.random() * 140;
            pipe.gapY = 130 + Math.random() * 270;
            score.current += 1;
            onScoreChange(score.current);
          }
          const hitX = BIRD_X + 14 > pipe.x && BIRD_X - 14 < pipe.x + PIPE_W;
          const hitY = birdY.current - 14 < pipe.gapY - GAP / 2 || birdY.current + 14 > pipe.gapY + GAP / 2;
          if (hitX && hitY) {
            setGameOver(true);
          }
        }
        if (birdY.current < 0 || birdY.current > H) {
          setGameOver(true);
        }
      }

      ctx.fillStyle = "#070517";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#22d3ee";
      for (const pipe of pipes.current) {
        ctx.fillRect(pipe.x, 0, PIPE_W, pipe.gapY - GAP / 2);
        ctx.fillRect(pipe.x, pipe.gapY + GAP / 2, PIPE_W, H);
      }
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(BIRD_X, birdY.current, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`Score: ${score.current}`, 14, 28);
    };

    const interval = setInterval(loop, 16);
    return () => clearInterval(interval);
  }, [paused, gameOver, onScoreChange]);

  const handleRetry = () => {
    birdY.current = 220;
    vel.current = 0;
    pipes.current = [{ x: 520, gapY: 200 }, { x: 760, gapY: 280 }];
    score.current = 0;
    onScoreChange(0);
    setGameOver(false);
  };

  return (
    <div className="relative mx-auto">
      <canvas ref={canvasRef} width={W} height={H} className="mx-auto rounded-xl border border-cyan-400/30" />
      {gameOver && <GameOverlay status="lost" score={score.current} onRetry={handleRetry} />}
    </div>
  );
}

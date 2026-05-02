"use client";

import { useEffect, useRef, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";

const SIZE = 20;
const CELL = 20;

type Point = { x: number; y: number };

export function SnakeGame({ paused, onScoreChange }: ArcadeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const snakeRef = useRef<Point[]>([{ x: 8, y: 8 }]);
  const foodRef = useRef<Point>({ x: 12, y: 12 });
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "ArrowUp" && dirRef.current.y !== 1) dirRef.current = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && dirRef.current.y !== -1) dirRef.current = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && dirRef.current.x !== 1) dirRef.current = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && dirRef.current.x !== -1) dirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      if (paused || gameOver) return;

      const snake = snakeRef.current.slice();
      const head = { ...snake[0] };
      head.x += dirRef.current.x;
      head.y += dirRef.current.y;

      if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE) {
        setGameOver(true);
        return;
      }
      if (snake.some((p) => p.x === head.x && p.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);
      const food = foodRef.current;
      if (head.x === food.x && head.y === food.y) {
        scoreRef.current += 10;
        onScoreChange(scoreRef.current);
        foodRef.current = {
          x: Math.floor(Math.random() * SIZE),
          y: Math.floor(Math.random() * SIZE),
        };
      } else {
        snake.pop();
      }
      snakeRef.current = snake;
    };

    const draw = () => {
      ctx.fillStyle = "#0a0a1a"; // Dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00f0ff"; // Neon cyan
      for (const s of snakeRef.current) {
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      }
      ctx.fillStyle = "#ff007f"; // Neon pink
      ctx.fillRect(foodRef.current.x * CELL + 2, foodRef.current.y * CELL + 2, CELL - 4, CELL - 4);
    };

    const interval = setInterval(() => {
      tick();
      draw();
    }, 95);

    draw();
    return () => clearInterval(interval);
  }, [paused, gameOver, onScoreChange]);

  const handleReplay = () => {
    snakeRef.current = [{ x: 8, y: 8 }];
    dirRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    onScoreChange(0);
    foodRef.current = { x: 12, y: 12 };
    setGameOver(false);
  };

  return (
    <div className="relative flex w-full max-w-[80vh] aspect-square items-center justify-center">
      <canvas
        ref={canvasRef}
        width={SIZE * CELL}
        height={SIZE * CELL}
        className="h-full w-full object-contain rounded-xl border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] bg-[#0a0a1a]"
      />
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#00f0ff] mb-2 drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">
            Game Over
          </h2>
          <p className="text-xl text-zinc-300 mb-6 font-medium">Score: {scoreRef.current}</p>
          <button
            onClick={handleReplay}
            className="rounded-full bg-gradient-to-r from-[#8a2be2] to-[#ff007f] px-8 py-3 text-white font-bold transition hover:opacity-90 hover:shadow-[0_0_15px_rgba(255,0,127,0.5)]"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

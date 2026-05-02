"use client";

import { useEffect, useRef } from "react";
import type { ArcadeGameProps } from "@/types/game";

const W = 620;
const H = 420;

export function BreakoutGame({ paused, onScoreChange }: ArcadeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paddleX = useRef(260);
  const ball = useRef({ x: 300, y: 320, vx: 3, vy: -3 });
  const bricks = useRef<number[][]>(Array.from({ length: 5 }, () => Array(10).fill(1)));
  const score = useRef(0);
  const key = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => (key.current[e.key] = true);
    const up = (e: KeyboardEvent) => (key.current[e.key] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reset = () => {
      ball.current = { x: 300, y: 320, vx: 3, vy: -3 };
      paddleX.current = 260;
    };

    const loop = () => {
      if (!paused) {
        if (key.current.ArrowLeft) paddleX.current -= 6;
        if (key.current.ArrowRight) paddleX.current += 6;
        paddleX.current = Math.max(0, Math.min(W - 100, paddleX.current));

        const b = ball.current;
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 8 || b.x > W - 8) b.vx *= -1;
        if (b.y < 8) b.vy *= -1;
        if (b.y > H + 30) reset();

        if (b.y > H - 26 && b.x > paddleX.current && b.x < paddleX.current + 100) b.vy = -Math.abs(b.vy);

        for (let r = 0; r < bricks.current.length; r += 1) {
          for (let c = 0; c < bricks.current[r].length; c += 1) {
            if (!bricks.current[r][c]) continue;
            const x = 12 + c * 60;
            const y = 20 + r * 22;
            if (b.x > x && b.x < x + 56 && b.y > y && b.y < y + 16) {
              bricks.current[r][c] = 0;
              b.vy *= -1;
              score.current += 10;
              onScoreChange(score.current);
            }
          }
        }
      }

      ctx.fillStyle = "#080617";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#1fe3ff";
      for (let r = 0; r < bricks.current.length; r += 1) {
        for (let c = 0; c < bricks.current[r].length; c += 1) {
          if (bricks.current[r][c]) ctx.fillRect(12 + c * 60, 20 + r * 22, 56, 16);
        }
      }
      ctx.fillStyle = "#fff";
      ctx.fillRect(paddleX.current, H - 16, 100, 8);
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, 7, 0, Math.PI * 2);
      ctx.fill();
    };

    const interval = setInterval(loop, 16);
    return () => clearInterval(interval);
  }, [paused, onScoreChange]);

  return <canvas ref={canvasRef} width={W} height={H} className="mx-auto rounded-xl border border-cyan-400/30" />;
}

"use client";

import { useEffect, useRef } from "react";
import type { ArcadeGameProps } from "@/types/game";

const W = 640;
const H = 380;

export function PongGame({ paused, onScoreChange }: ArcadeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ball = useRef({ x: W / 2, y: H / 2, vx: 3, vy: 2.4 });
  const p1 = useRef(H / 2 - 38);
  const p2 = useRef(H / 2 - 38);
  const score = useRef(0);
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.key] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.key] = false);
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

    const resetBall = () => {
      ball.current = { x: W / 2, y: H / 2, vx: 3 * (Math.random() > 0.5 ? 1 : -1), vy: 2.4 };
    };

    const loop = () => {
      if (!paused) {
        if (keys.current.w) p1.current -= 4;
        if (keys.current.s) p1.current += 4;
        if (keys.current.ArrowUp) p2.current -= 4;
        if (keys.current.ArrowDown) p2.current += 4;
        p1.current = Math.max(0, Math.min(H - 76, p1.current));
        p2.current = Math.max(0, Math.min(H - 76, p2.current));

        const b = ball.current;
        b.x += b.vx;
        b.y += b.vy;
        if (b.y < 0 || b.y > H) b.vy *= -1;

        const hitLeft = b.x < 24 && b.y > p1.current && b.y < p1.current + 76;
        const hitRight = b.x > W - 24 && b.y > p2.current && b.y < p2.current + 76;
        if (hitLeft || hitRight) {
          b.vx *= -1;
          score.current += 1;
          onScoreChange(score.current);
        }

        if (b.x < -40 || b.x > W + 40) resetBall();
      }

      ctx.fillStyle = "#080616";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.fillRect(10, p1.current, 10, 76);
      ctx.fillRect(W - 20, p2.current, 10, 76);
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`Rallies: ${score.current}`, 12, 20);
    };

    const interval = setInterval(loop, 16);
    return () => clearInterval(interval);
  }, [paused, onScoreChange]);

  return <canvas ref={canvasRef} width={W} height={H} className="mx-auto rounded-xl border border-cyan-400/30" />;
}

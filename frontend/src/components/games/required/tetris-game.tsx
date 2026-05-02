"use client";

import { useEffect, useRef } from "react";
import type { ArcadeGameProps } from "@/types/game";

const W = 10;
const H = 20;
const CELL = 24;

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
];

type Piece = { x: number; y: number; shape: number[][] };

function rotate(shape: number[][]) {
  return shape[0].map((_, i) => shape.map((row) => row[i]).reverse());
}

export function TetrisGame({ paused, onScoreChange }: ArcadeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<number[][]>(Array.from({ length: H }, () => Array(W).fill(0)));
  const pieceRef = useRef<Piece>({ x: 3, y: 0, shape: SHAPES[0] });
  const scoreRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === "ArrowUp") pieceRef.current.shape = rotate(pieceRef.current.shape);
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
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

    const collides = (piece: Piece) => {
      for (let y = 0; y < piece.shape.length; y += 1) {
        for (let x = 0; x < piece.shape[y].length; x += 1) {
          if (!piece.shape[y][x]) continue;
          const px = piece.x + x;
          const py = piece.y + y;
          if (px < 0 || px >= W || py >= H) return true;
          if (py >= 0 && boardRef.current[py][px]) return true;
        }
      }
      return false;
    };

    const spawn = () => {
      pieceRef.current = { x: 3, y: 0, shape: SHAPES[Math.floor(Math.random() * SHAPES.length)] };
      if (collides(pieceRef.current)) {
        boardRef.current = Array.from({ length: H }, () => Array(W).fill(0));
        scoreRef.current = 0;
        onScoreChange(0);
      }
    };

    const lock = () => {
      const piece = pieceRef.current;
      for (let y = 0; y < piece.shape.length; y += 1) {
        for (let x = 0; x < piece.shape[y].length; x += 1) {
          if (piece.shape[y][x]) {
            const py = piece.y + y;
            const px = piece.x + x;
            if (py >= 0 && py < H && px >= 0 && px < W) boardRef.current[py][px] = 1;
          }
        }
      }
      let cleared = 0;
      for (let y = H - 1; y >= 0; y -= 1) {
        if (boardRef.current[y].every(Boolean)) {
          boardRef.current.splice(y, 1);
          boardRef.current.unshift(Array(W).fill(0));
          cleared += 1;
          y += 1;
        }
      }
      if (cleared) {
        scoreRef.current += cleared * 100;
        onScoreChange(scoreRef.current);
      }
      spawn();
    };

    const tick = () => {
      if (!paused) {
        const piece = pieceRef.current;
        if (keysRef.current.ArrowLeft) {
          piece.x -= 1;
          if (collides(piece)) piece.x += 1;
        }
        if (keysRef.current.ArrowRight) {
          piece.x += 1;
          if (collides(piece)) piece.x -= 1;
        }
        if (keysRef.current.ArrowDown) {
          piece.y += 1;
          if (collides(piece)) {
            piece.y -= 1;
            lock();
          }
        }
        piece.y += 1;
        if (collides(piece)) {
          piece.y -= 1;
          lock();
        }
      }

      ctx.fillStyle = "#09081a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1ec8ff";
      for (let y = 0; y < H; y += 1) {
        for (let x = 0; x < W; x += 1) {
          if (boardRef.current[y][x]) ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        }
      }
      const piece = pieceRef.current;
      ctx.fillStyle = "#ff4ab8";
      for (let y = 0; y < piece.shape.length; y += 1) {
        for (let x = 0; x < piece.shape[y].length; x += 1) {
          if (piece.shape[y][x]) ctx.fillRect((piece.x + x) * CELL + 1, (piece.y + y) * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    };

    const interval = setInterval(tick, 180);
    return () => clearInterval(interval);
  }, [paused, onScoreChange]);

  return (
    <canvas
      ref={canvasRef}
      width={W * CELL}
      height={H * CELL}
      className="mx-auto rounded-xl border border-cyan-400/30"
    />
  );
}

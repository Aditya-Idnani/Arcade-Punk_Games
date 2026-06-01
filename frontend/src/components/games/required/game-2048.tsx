"use client";

import { useEffect, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";
import { GameOverlay } from "./GameOverlay";

const SIZE = 4;

function randomTile(board: number[][]) {
  const empty: [number, number][] = [];
  board.forEach((row, y) =>
    row.forEach((v, x) => {
      if (v === 0) empty.push([y, x]);
    }),
  );
  if (!empty.length) return board;
  const [y, x] = empty[Math.floor(Math.random() * empty.length)];
  board[y][x] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function initBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  randomTile(board);
  randomTile(board);
  return board;
}

function slide(row: number[]) {
  const vals = row.filter(Boolean);
  let score = 0;
  for (let i = 0; i < vals.length - 1; i += 1) {
    if (vals[i] === vals[i + 1]) {
      vals[i] *= 2;
      score += vals[i];
      vals.splice(i + 1, 1);
    }
  }
  while (vals.length < SIZE) vals.push(0);
  return { row: vals, score };
}

function moveLeft(board: number[][]) {
  let gained = 0;
  const next = board.map((r) => {
    const result = slide(r);
    gained += result.score;
    return result.row;
  });
  return { board: next, gained };
}

function rotate(board: number[][]) {
  return board[0].map((_, i) => board.map((r) => r[i]).reverse());
}

function sameBoard(a: number[][], b: number[][]) {
  return a.every((row, y) => row.every((v, x) => v === b[y][x]));
}

function hasPossibleMoves(board: number[][]) {
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (board[y][x] === 0) return true;
      if (x < SIZE - 1 && board[y][x] === board[y][x + 1]) return true;
      if (y < SIZE - 1 && board[y][x] === board[y + 1][x]) return true;
    }
  }
  return false;
}

export function Game2048({ paused, onScoreChange }: ArcadeGameProps) {
  const [board, setBoard] = useState<number[][]>(initBoard());
  const [score, setScore] = useState(0);

  const won = board.flat().includes(2048);
  const lost = !hasPossibleMoves(board);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (paused || won || lost) return;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      let working = board.map((r) => [...r]);
      let rotates = 0;
      if (e.key === "ArrowUp") rotates = 1;
      if (e.key === "ArrowRight") rotates = 2;
      if (e.key === "ArrowDown") rotates = 3;
      for (let i = 0; i < rotates; i += 1) working = rotate(working);
      const { board: moved, gained } = moveLeft(working);
      let restored = moved;
      for (let i = 0; i < (4 - rotates) % 4; i += 1) restored = rotate(restored);
      if (!sameBoard(board, restored)) {
        const withNew = randomTile(restored.map((r) => [...r]));
        const nextScore = score + gained;
        setBoard(withNew);
        setScore(nextScore);
        onScoreChange(nextScore);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, score, paused, won, lost, onScoreChange]);

  const handleRetry = () => {
    setBoard(initBoard());
    setScore(0);
    onScoreChange(0);
  };

  return (
    <div className="relative mx-auto w-full max-w-sm space-y-2">
      <div className="grid grid-cols-4 gap-2 rounded-xl bg-[#100e22] p-2">
        {board.flat().map((value, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-lg border border-white/5 bg-[#1a1730] text-xl font-extrabold text-cyan-200 animate-fade-in"
          >
            {value || ""}
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-400">Use arrow keys to move and merge tiles.</p>

      {won && <GameOverlay status="won" score={score} onRetry={handleRetry} />}
      {!won && lost && <GameOverlay status="lost" score={score} onRetry={handleRetry} />}
    </div>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import type { ArcadeGameProps } from "@/types/game";
import { GameOverlay } from "./GameOverlay";

const SIZE = 9;

function pattern(r: number, c: number) {
  return (Math.floor(r / 3) * 3 + r * 3 + c) % 9;
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeSudoku() {
  const rows = shuffle([0, 1, 2]).flatMap((g) => shuffle([0, 1, 2]).map((r) => g * 3 + r));
  const cols = shuffle([0, 1, 2]).flatMap((g) => shuffle([0, 1, 2]).map((c) => g * 3 + c));
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const solved = rows.map((r) => cols.map((c) => nums[pattern(r, c)]));
  const puzzle = solved.map((row) => [...row]);
  let empties = 42;
  while (empties > 0) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      empties -= 1;
    }
  }
  return { puzzle, solved };
}

export function SudokuGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [puzzle, setPuzzle] = useState<number[][]>(() => makeSudoku().puzzle);
  const [solved, setSolved] = useState<number[][]>(() => makeSudoku().solved);
  const [grid, setGrid] = useState<number[][]>(() => puzzle.map((r) => [...r]));

  const correct = useMemo(() => {
    if (!grid.length || !solved.length) return 0;
    return grid.flat().filter((v, i) => v === solved.flat()[i]).length;
  }, [grid, solved]);

  const won = correct === 81;

  useEffect(() => {
    onScoreChange(correct * 10);
  }, [correct, onScoreChange]);

  const setVal = (r: number, c: number, value: string) => {
    if (paused || won || puzzle[r][c] !== 0) return;
    const n = Number(value);
    const val = Number.isInteger(n) && n >= 1 && n <= 9 ? n : 0;
    setGrid((prev) => prev.map((row, y) => row.map((cell, x) => (y === r && x === c ? val : cell))));
  };

  const handleRetry = () => {
    const nextSeed = makeSudoku();
    setPuzzle(nextSeed.puzzle);
    setSolved(nextSeed.solved);
    setGrid(nextSeed.puzzle.map((r) => [...r]));
    onScoreChange(0);
  };

  return (
    <div className="relative space-y-2 p-4">
      <div className="mx-auto grid w-fit grid-cols-9 gap-[2px] rounded-xl bg-[#100f20] p-2">
        {grid.map((row, r) =>
          row.map((value, c) => (
            <input
              key={`${r}-${c}`}
              value={value === 0 ? "" : value}
              onChange={(e) => setVal(r, c, e.target.value.slice(-1))}
              disabled={won || puzzle[r]?.[c] !== 0}
              className={`h-9 w-9 rounded text-center text-sm font-bold outline-none ${
                puzzle[r]?.[c] !== 0 ? "bg-[#2b2747] text-cyan-200" : "bg-[#17142e] text-zinc-100"
              }`}
            />
          )),
        )}
      </div>
      <p className="text-center text-xs text-zinc-400">
        {won ? "Puzzle Solved! Great job." : "Fill 1-9 so every row, column, and 3x3 box has unique digits."}
      </p>

      {won && <GameOverlay status="won" score={correct * 10} onRetry={handleRetry} />}
    </div>
  );
}

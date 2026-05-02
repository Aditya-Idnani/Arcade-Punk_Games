"use client";

import { useState } from "react";
import type { ArcadeGameProps } from "@/types/game";

const ROWS = 6;
const COLS = 7;

type Cell = 0 | 1 | 2;

function win(board: Cell[][], p: Cell) {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const dirs = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];
      for (const [dr, dc] of dirs) {
        let count = 0;
        for (let i = 0; i < 4; i += 1) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === p) count += 1;
        }
        if (count === 4) return true;
      }
    }
  }
  return false;
}

export function Connect4Game({ paused, onScoreChange }: ArcadeGameProps) {
  const [board, setBoard] = useState<Cell[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]));
  const [turn, setTurn] = useState<Cell>(1);
  const [winner, setWinner] = useState<Cell>(0);

  const drop = (col: number) => {
    if (paused || winner) return;
    const next = board.map((r) => [...r]) as Cell[][];
    for (let r = ROWS - 1; r >= 0; r -= 1) {
      if (next[r][col] === 0) {
        next[r][col] = turn;
        setBoard(next);
        if (win(next, turn)) {
          setWinner(turn);
          onScoreChange(turn === 1 ? 25 : 10);
        } else {
          setTurn(turn === 1 ? 2 : 1);
        }
        return;
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="mx-auto grid w-fit grid-cols-7 gap-1 rounded-xl bg-[#100f21] p-2">
        {board.flatMap((row, r) =>
          row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => drop(c)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1935]">
              <span className={`h-7 w-7 rounded-full ${cell === 1 ? "bg-cyan-300" : cell === 2 ? "bg-pink-300" : "bg-zinc-700"}`} />
            </button>
          )),
        )}
      </div>
      <p className="text-xs text-zinc-400">{winner ? `Player ${winner} wins` : `Player ${turn}'s turn`}</p>
    </div>
  );
}

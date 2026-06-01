"use client";

import { useEffect, useMemo, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";
import { GameOverlay } from "./GameOverlay";

const SIZE = 8;
const MINES = 10;

type Cell = {
  mine: boolean;
  open: boolean;
  flagged: boolean;
  count: number;
};

function makeBoard() {
  const board: Cell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({ mine: false, open: false, flagged: false, count: 0 })),
  );
  let planted = 0;
  while (planted < MINES) {
    const y = Math.floor(Math.random() * SIZE);
    const x = Math.floor(Math.random() * SIZE);
    if (!board[y][x].mine) {
      board[y][x].mine = true;
      planted += 1;
    }
  }
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (board[y][x].mine) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dy === 0 && dx === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE && board[ny][nx].mine) count += 1;
        }
      }
      board[y][x].count = count;
    }
  }
  return board;
}

function flood(board: Cell[][], sy: number, sx: number) {
  const stack: [number, number][] = [[sy, sx]];
  while (stack.length) {
    const [y, x] = stack.pop()!;
    if (board[y][x].open || board[y][x].flagged) continue;
    board[y][x].open = true;
    if (board[y][x].count !== 0) continue;
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE && !board[ny][nx].open) stack.push([ny, nx]);
      }
    }
  }
}

export function MinesweeperGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [board, setBoard] = useState<Cell[][]>(() => makeBoard());
  const [lost, setLost] = useState(false);

  const opened = useMemo(() => board.flat().filter((c) => c.open).length, [board]);
  const won = useMemo(() => opened === SIZE * SIZE - MINES, [opened]);

  useEffect(() => {
    onScoreChange(opened * 10);
  }, [opened, onScoreChange]);

  const reveal = (y: number, x: number) => {
    if (paused || lost || won) return;
    const next = board.map((r) => r.map((c) => ({ ...c })));
    const cell = next[y][x];
    if (cell.flagged || cell.open) return;
    if (cell.mine) {
      cell.open = true;
      setLost(true);
      setBoard(next);
      return;
    }
    flood(next, y, x);
    setBoard(next);
  };

  const toggleFlag = (e: React.MouseEvent, y: number, x: number) => {
    e.preventDefault();
    if (paused || lost || won) return;
    const next = board.map((r) => r.map((c) => ({ ...c })));
    const cell = next[y][x];
    if (!cell.open) cell.flagged = !cell.flagged;
    setBoard(next);
  };

  const handleRetry = () => {
    setBoard(makeBoard());
    setLost(false);
    onScoreChange(0);
  };

  return (
    <div className="relative space-y-3 p-4">
      <div className="mx-auto grid w-fit grid-cols-8 gap-1 rounded-xl bg-[#110f22] p-2">
        {board.flatMap((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${y}-${x}`}
              onClick={() => reveal(y, x)}
              onContextMenu={(e) => toggleFlag(e, y, x)}
              className="flex h-8 w-8 items-center justify-center rounded border border-white/5 bg-[#1a1731] text-xs font-bold text-cyan-200"
            >
              {cell.open ? (cell.mine ? "💣" : cell.count || "") : cell.flagged ? "🚩" : ""}
            </button>
          )),
        )}
      </div>
      <p className="text-center text-xs text-zinc-400">
        {lost ? "Boom! Game Over." : won ? "All mines cleared!" : "Left click open, right click flag."}
      </p>

      {won && <GameOverlay status="won" score={opened * 10} onRetry={handleRetry} />}
      {!won && lost && <GameOverlay status="lost" score={opened * 10} onRetry={handleRetry} />}
    </div>
  );
}

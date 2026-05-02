"use client";

import { useEffect, useState } from "react";
import type { ArcadeGameProps } from "@/types/game";

type Cell = "X" | "O" | null;
type Mode = "AI" | "LOCAL";

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(board: Cell[]) {
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function bestAiMove(board: Cell[]) {
  const copy = [...board];
  for (let i = 0; i < 9; i += 1) {
    if (!copy[i]) {
      copy[i] = "O";
      if (winner(copy) === "O") return i;
      copy[i] = null;
    }
  }
  for (let i = 0; i < 9; i += 1) {
    if (!copy[i]) {
      copy[i] = "X";
      if (winner(copy) === "X") return i;
      copy[i] = null;
    }
  }
  return [4, 0, 2, 6, 8, 1, 3, 5, 7].find((i) => !board[i]) ?? -1;
}

export function TicTacToeGame({ paused, onScoreChange }: ArcadeGameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [mode, setMode] = useState<Mode>("AI");
  const won = winner(board);

  useEffect(() => {
    if (paused || mode !== "AI" || turn !== "O" || won) return;
    const id = setTimeout(() => {
      const move = bestAiMove(board);
      if (move >= 0) {
        const next = [...board];
        next[move] = "O";
        setBoard(next);
        setTurn("X");
      }
    }, 260);
    return () => clearTimeout(id);
  }, [board, turn, mode, paused, won]);

  useEffect(() => {
    if (won === "X") onScoreChange(10);
  }, [won, onScoreChange]);

  const play = (i: number) => {
    if (paused || board[i] || won) return;
    if (mode === "AI" && turn !== "X") return;
    const next = [...board];
    next[i] = turn;
    setBoard(next);
    setTurn(turn === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    onScoreChange(0);
  };

  return (
    <div className="mx-auto flex w-full max-w-[60vh] flex-col items-center space-y-6">
      <div className="flex gap-3">
        <button
          className={`rounded-full px-6 py-2 text-sm font-bold transition shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
            mode === "AI" ? "bg-gradient-to-r from-[#8a2be2] to-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.5)]" : "bg-[#110f24] text-zinc-400 border border-[#8a2be2]/30 hover:border-[#8a2be2]"
          }`}
          onClick={() => { setMode("AI"); resetGame(); }}
        >
          vs AI
        </button>
        <button
          className={`rounded-full px-6 py-2 text-sm font-bold transition shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
            mode === "LOCAL" ? "bg-gradient-to-r from-[#8a2be2] to-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.5)]" : "bg-[#110f24] text-zinc-400 border border-[#8a2be2]/30 hover:border-[#8a2be2]"
          }`}
          onClick={() => { setMode("LOCAL"); resetGame(); }}
        >
          Local 2P
        </button>
      </div>
      <div className="grid w-full grid-cols-3 gap-3 rounded-2xl bg-[#0a0a1a]/80 p-4 shadow-[0_0_20px_rgba(0,240,255,0.1)] border border-[#00f0ff]/30">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="aspect-square rounded-xl border border-[#8a2be2]/40 bg-[#121027] text-6xl font-extrabold shadow-inner transition hover:bg-[#1a173d] sm:text-8xl hover:border-[#ff007f]/60 hover:shadow-[0_0_15px_rgba(255,0,127,0.3)]"
          >
            {cell === "O" ? <span className="text-[#ff007f] drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]">{cell}</span> : <span className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">{cell}</span>}
          </button>
        ))}
      </div>
      
      {won || board.every(Boolean) ? (
        <div className="flex w-full flex-col items-center space-y-4 rounded-xl border border-[#39ff14]/40 bg-[#0a0a1a]/90 p-6 shadow-[0_0_30px_rgba(57,255,20,0.2)] backdrop-blur-md">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[#00f0ff] drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
            {won ? `${won} Wins!` : "It's a Draw!"}
          </h2>
          <button
            onClick={resetGame}
            className="rounded-full mt-2 bg-gradient-to-r from-[#00f0ff] to-[#39ff14] px-8 py-3 font-bold text-black transition hover:opacity-90 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            Play Again
          </button>
        </div>
      ) : (
        <p className="text-xl font-medium text-zinc-300 bg-[#110f24] border border-[#8a2be2]/30 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(138,43,226,0.2)]">
          <span className={turn === "X" ? "text-[#00f0ff] font-bold drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" : "text-[#ff007f] font-bold drop-shadow-[0_0_5px_rgba(255,0,127,0.8)]"}>{turn}</span>'s turn
        </p>
      )}
    </div>
  );
}

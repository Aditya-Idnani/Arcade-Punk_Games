import type { Game } from "@/types";

export const fallbackGames: Game[] = [
  { id: "fallback-2048", slug: "2048", name: "2048", category: "PUZZLE", description: "Merge tiles and hit 2048.", icon: "🧩", tags: ["Puzzle", "Logic"] },
  { id: "fallback-snake", slug: "snake", name: "Snake", category: "REFLEX", description: "Classic snake with speed scaling.", icon: "🐍", tags: ["Arcade", "Reflex"] },
  { id: "fallback-ttt", slug: "tic-tac-toe", name: "Tic Tac Toe", category: "LOGIC", description: "Play vs AI or local multiplayer.", icon: "⭕", tags: ["Logic", "Strategy"] },
  { id: "fallback-minesweeper", slug: "minesweeper", name: "Minesweeper", category: "PUZZLE", description: "Clear the board, avoid mines.", icon: "💣", tags: ["Puzzle", "Logic"] },
  { id: "fallback-sudoku", slug: "sudoku", name: "Sudoku", category: "LOGIC", description: "Fill the grid with a valid solution.", icon: "🔢", tags: ["Logic", "Puzzle"] },
  { id: "fallback-memory", slug: "memory-match", name: "Memory Match", category: "PUZZLE", description: "Find all matching pairs.", icon: "🃏", tags: ["Puzzle", "Reflex"] },
  { id: "fallback-tetris", slug: "tetris", name: "Tetris", category: "ARCADE", description: "Stack blocks and clear lines.", icon: "🧱", tags: ["Arcade", "Reflex"] },
  { id: "fallback-breakout", slug: "breakout", name: "Breakout", category: "ARCADE", description: "Break all bricks with your paddle.", icon: "🧱", tags: ["Arcade", "Reflex"] },
  { id: "fallback-pong", slug: "pong", name: "Pong", category: "ARCADE", description: "Retro paddle battle.", icon: "🏓", tags: ["Arcade", "Reflex"] },
  { id: "fallback-flappy", slug: "flappy-bird", name: "Flappy Bird", category: "REFLEX", description: "Fly through endless pipes.", icon: "🐤", tags: ["Arcade", "Reflex"] },
  { id: "fallback-connect4", slug: "connect-4", name: "Connect 4", category: "STRATEGY", description: "Drop discs and connect four.", icon: "🔴", tags: ["Strategy", "Logic"] },
  { id: "fallback-reaction", slug: "reaction-time", name: "Reaction Time Test", category: "REFLEX", description: "Measure your reflex speed.", icon: "⚡", tags: ["Reflex", "Arcade"] },
  { id: "fallback-typing", slug: "typing-speed", name: "Typing Speed Game", category: "REFLEX", description: "Type fast and accurately.", icon: "⌨️", tags: ["Reflex", "Logic"] },
  { id: "fallback-word", slug: "word-guess", name: "Word Guess", category: "LOGIC", description: "Guess the hidden word.", icon: "🔤", tags: ["Logic", "Puzzle"] },
  { id: "fallback-simon", slug: "simon-says", name: "Simon Says", category: "PUZZLE", description: "Repeat the color sequence.", icon: "🎛️", tags: ["Memory", "Reflex"] },
];

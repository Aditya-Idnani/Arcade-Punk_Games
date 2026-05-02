"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import type { ArcadeGameProps } from "@/types/game";

const Game2048 = dynamic(() => import("./required/game-2048").then((m) => m.Game2048));
const SnakeGame = dynamic(() => import("./required/snake-game").then((m) => m.SnakeGame));
const TicTacToeGame = dynamic(() => import("./required/tic-tac-toe-game").then((m) => m.TicTacToeGame));
const MinesweeperGame = dynamic(() => import("./required/minesweeper-game").then((m) => m.MinesweeperGame));
const SudokuGame = dynamic(() => import("./required/sudoku-game").then((m) => m.SudokuGame));
const MemoryMatchGame = dynamic(() => import("./required/memory-match-game").then((m) => m.MemoryMatchGame));
const TetrisGame = dynamic(() => import("./required/tetris-game").then((m) => m.TetrisGame));
const BreakoutGame = dynamic(() => import("./required/breakout-game").then((m) => m.BreakoutGame));
const PongGame = dynamic(() => import("./required/pong-game").then((m) => m.PongGame));
const FlappyGame = dynamic(() => import("./required/flappy-game").then((m) => m.FlappyGame));
const Connect4Game = dynamic(() => import("./required/connect4-game").then((m) => m.Connect4Game));
const ReactionTimeGame = dynamic(() => import("./required/reaction-time-game").then((m) => m.ReactionTimeGame));
const TypingSpeedGame = dynamic(() => import("./required/typing-speed-game").then((m) => m.TypingSpeedGame));
const WordGuessGame = dynamic(() => import("./required/word-guess-game").then((m) => m.WordGuessGame));

export const registry: Record<string, (props: ArcadeGameProps) => ReactNode> = {
  "2048": (props) => <Game2048 {...props} />,
  snake: (props) => <SnakeGame {...props} />,
  "tic-tac-toe": (props) => <TicTacToeGame {...props} />,
  minesweeper: (props) => <MinesweeperGame {...props} />,
  sudoku: (props) => <SudokuGame {...props} />,
  "memory-match": (props) => <MemoryMatchGame {...props} />,
  tetris: (props) => <TetrisGame {...props} />,
  breakout: (props) => <BreakoutGame {...props} />,
  pong: (props) => <PongGame {...props} />,
  "flappy-bird": (props) => <FlappyGame {...props} />,
  "connect-4": (props) => <Connect4Game {...props} />,
  "reaction-time": (props) => <ReactionTimeGame {...props} />,
  "typing-speed": (props) => <TypingSpeedGame {...props} />,
  "word-guess": (props) => <WordGuessGame {...props} />,
  "simon-says": (props) => <MemoryMatchGame {...props} />,
};

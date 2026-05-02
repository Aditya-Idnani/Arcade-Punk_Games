"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const games = [
    { slug: "2048", name: "2048", category: client_1.GameCategory.PUZZLE, description: "Merge tiles and hit 2048.", icon: "🧩", tags: ["Puzzle", "Logic"] },
    { slug: "snake", name: "Snake", category: client_1.GameCategory.REFLEX, description: "Classic snake with speed scaling.", icon: "🐍", tags: ["Arcade", "Reflex"] },
    { slug: "tic-tac-toe", name: "Tic Tac Toe", category: client_1.GameCategory.LOGIC, description: "Play vs AI or local multiplayer.", icon: "⭕", tags: ["Logic", "Strategy"] },
    { slug: "minesweeper", name: "Minesweeper", category: client_1.GameCategory.PUZZLE, description: "Clear the board, avoid mines.", icon: "💣", tags: ["Puzzle", "Logic"] },
    { slug: "sudoku", name: "Sudoku", category: client_1.GameCategory.LOGIC, description: "Fill the grid with a valid solution.", icon: "🔢", tags: ["Logic", "Puzzle"] },
    { slug: "memory-match", name: "Memory Match", category: client_1.GameCategory.PUZZLE, description: "Find all matching pairs.", icon: "🃏", tags: ["Puzzle", "Reflex"] },
    { slug: "tetris", name: "Tetris", category: client_1.GameCategory.ARCADE, description: "Stack blocks and clear lines.", icon: "🧱", tags: ["Arcade", "Reflex"] },
    { slug: "breakout", name: "Breakout", category: client_1.GameCategory.ARCADE, description: "Break all bricks with your paddle.", icon: "🧱", tags: ["Arcade", "Reflex"] },
    { slug: "pong", name: "Pong", category: client_1.GameCategory.ARCADE, description: "Retro paddle battle.", icon: "🏓", tags: ["Arcade", "Reflex"] },
    { slug: "flappy-bird", name: "Flappy Bird", category: client_1.GameCategory.REFLEX, description: "Fly through endless pipes.", icon: "🐤", tags: ["Arcade", "Reflex"] },
    { slug: "connect-4", name: "Connect 4", category: client_1.GameCategory.STRATEGY, description: "Drop discs and connect four.", icon: "🔴", tags: ["Strategy", "Logic"] },
    { slug: "reaction-time", name: "Reaction Time Test", category: client_1.GameCategory.REFLEX, description: "Measure your reflex speed.", icon: "⚡", tags: ["Reflex", "Arcade"] },
    { slug: "typing-speed", name: "Typing Speed Game", category: client_1.GameCategory.REFLEX, description: "Type fast and accurately.", icon: "⌨️", tags: ["Reflex", "Logic"] },
    { slug: "word-guess", name: "Word Guess", category: client_1.GameCategory.LOGIC, description: "Guess the hidden word.", icon: "🔤", tags: ["Logic", "Puzzle"] },
    { slug: "simon-says", name: "Simon Says", category: client_1.GameCategory.PUZZLE, description: "Repeat the color sequence.", icon: "🎛️", tags: ["Memory", "Reflex"] },
];
async function main() {
    for (const game of games) {
        await prisma.game.upsert({
            where: { slug: game.slug },
            update: {
                name: game.name,
                category: game.category,
                description: game.description,
                icon: game.icon,
                tags: game.tags,
            },
            create: game,
        });
    }
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});

import { Router } from "express";
import { fallbackGames } from "../lib/fallback-games";
import { prisma } from "../lib/prisma";

export const gamesRouter = Router();

gamesRouter.get("/", async (_req, res) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { name: "asc" },
    });
    return res.json(games);
  } catch {
    return res.json(fallbackGames);
  }
});

gamesRouter.get("/:id", async (req, res) => {
  const idOrSlug = req.params.id;
  let game = null;
  try {
    game = await prisma.game.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });
  } catch {
    game = fallbackGames.find((g) => g.id === idOrSlug || g.slug === idOrSlug) ?? null;
  }
  if (!game) return res.status(404).json({ message: "Game not found" });
  return res.json(game);
});

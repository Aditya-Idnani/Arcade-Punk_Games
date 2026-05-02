import { GameCategory } from "@prisma/client";
import NodeCache from "node-cache";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { type AuthedRequest, requireAuth } from "../middleware/auth";

const cache = new NodeCache({ stdTTL: 15 });

const scoreSchema = z.object({
  gameId: z.string().uuid(),
  score: z.number().int().nonnegative(),
});

function maybeAwardAchievements(totalScores: number, bestScore: number) {
  const achievements: { title: string; description: string }[] = [];
  if (totalScores === 1) {
    achievements.push({
      title: "First Blood",
      description: "Submitted your first score.",
    });
  }
  if (totalScores >= 25) {
    achievements.push({
      title: "Arcade Grinder",
      description: "Logged 25 game sessions.",
    });
  }
  if (bestScore >= 1000) {
    achievements.push({
      title: "Neon Legend",
      description: "Reached a score of 1000+ in a game.",
    });
  }
  return achievements;
}

export const scoresRouter = Router();

scoresRouter.post("/scores", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = scoreSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { gameId, score } = parsed.data;
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) return res.status(404).json({ message: "Game not found" });

  const created = await prisma.score.create({
    data: {
      gameId,
      score,
      userId: req.user.userId,
    },
  });

  const [totalScores, best] = await Promise.all([
    prisma.score.count({ where: { userId: req.user.userId } }),
    prisma.score.findFirst({
      where: { userId: req.user.userId },
      orderBy: { score: "desc" },
      select: { score: true },
    }),
  ]);

  const toAward = maybeAwardAchievements(totalScores, best?.score ?? 0);
  if (toAward.length > 0) {
    for (const a of toAward) {
      const exists = await prisma.achievement.findFirst({
        where: { userId: req.user.userId, title: a.title },
      });
      if (!exists) {
        await prisma.achievement.create({
          data: { userId: req.user.userId, title: a.title, description: a.description },
        });
      }
    }
  }

  cache.flushAll();

  return res.status(201).json({
    score: created,
    notification: `Score ${score} submitted for ${game.name}.`,
  });
});

scoresRouter.get("/leaderboard", async (_req, res) => {
  const cacheKey = "leaderboard_global";
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      scores: {
        select: { score: true },
      },
    },
  });

  const leaderboard = users
    .map((u: { id: string; username: string; scores: { score: number }[] }) => ({
      userId: u.id,
      username: u.username,
      totalScore: u.scores.reduce((sum: number, s: { score: number }) => sum + s.score, 0),
      sessions: u.scores.length,
    }))
    .sort((a: { totalScore: number }, b: { totalScore: number }) => b.totalScore - a.totalScore)
    .slice(0, 100);

  cache.set(cacheKey, leaderboard);
  return res.json(leaderboard);
});

scoresRouter.get("/leaderboard/by-category/:category", async (req, res) => {
  const category = req.params.category.toUpperCase();
  const validCategories = Object.values(GameCategory) as string[];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  const games = await prisma.game.findMany({
    where: { category: category as GameCategory },
    select: { id: true },
  });
  const gameIds = games.map((g: { id: string }) => g.id);

  const scores = await prisma.score.findMany({
    where: { gameId: { in: gameIds } },
    include: { user: { select: { id: true, username: true } } },
  });

  const map = new Map<string, { username: string; totalScore: number }>();
  for (const s of scores) {
    const entry = map.get(s.user.id) ?? { username: s.user.username, totalScore: 0 };
    entry.totalScore += s.score;
    map.set(s.user.id, entry);
  }

  const leaderboard = [...map.entries()]
    .map(([userId, v]) => ({ userId, ...v }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 100);

  return res.json(leaderboard);
});

scoresRouter.get("/scores/:gameId", async (req, res) => {
  const game = await prisma.game.findFirst({
    where: { OR: [{ id: req.params.gameId }, { slug: req.params.gameId }] },
  });
  if (!game) return res.status(404).json({ message: "Game not found" });

  const scores = await prisma.score.findMany({
    where: { gameId: game.id },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    take: 50,
    include: {
      user: { select: { username: true } },
    },
  });
  return res.json(scores);
});

scoresRouter.get("/scores", (_req, res) => {
  return res.status(400).json({ message: "Use /scores/:gameId to fetch a game's leaderboard" });
});

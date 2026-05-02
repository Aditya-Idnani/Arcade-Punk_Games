import { Router } from "express";
import { prisma } from "../lib/prisma";
import { type AuthedRequest, requireAuth } from "../middleware/auth";

export const userRouter = Router();

userRouter.get("/profile", requireAuth, async (req: AuthedRequest, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      achievements: {
        orderBy: { unlockedAt: "desc" },
      },
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
});

userRouter.get("/history", requireAuth, async (req: AuthedRequest, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const history = await prisma.score.findMany({
    where: { userId: req.user.userId },
    include: {
      game: { select: { id: true, name: true, slug: true, category: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return res.json(history);
});

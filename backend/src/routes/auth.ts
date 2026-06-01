import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword, signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/auth";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { config } from "../config";

const registerSchema = z.object({
  username: z.string().min(3).max(24).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export const authRouter = Router();

const setRefreshTokenCookie = (res: any, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearRefreshTokenCookie = (res: any) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "none",
  });
};

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  let { username } = parsed.data;
  
  if (!username) {
    username = email.split("@")[0] + Math.floor(Math.random() * 10000);
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  if (existing) {
    return res.status(409).json({ message: "Username or email already in use" });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username, email, passwordHash },
  });

  const payload = { userId: user.id, username: user.username, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  setRefreshTokenCookie(res, refreshToken);

  return res.status(201).json({
    message: "User registered successfully",
    token: accessToken,
    user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt },
  });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid credentials", errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const payload = { userId: user.id, username: user.username, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  setRefreshTokenCookie(res, refreshToken);

  return res.json({
    accessToken,
    token: accessToken,
    user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt },
  });
});

authRouter.post("/refresh", (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const newPayload = { userId: payload.userId, username: payload.username, email: payload.email };
    const accessToken = signAccessToken(newPayload);
    
    // Token rotation
    const newRefreshToken = signRefreshToken(newPayload);
    setRefreshTokenCookie(res, newRefreshToken);

    return res.json({ accessToken });
  } catch (error) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

authRouter.post("/logout", (req, res) => {
  clearRefreshTokenCookie(res);
  return res.json({ message: "Logged out successfully" });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({
    user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt }
  });
});

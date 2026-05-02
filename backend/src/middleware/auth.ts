import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth";
import { TokenExpiredError } from "jsonwebtoken";

export type AuthedRequest = Request & {
  user?: {
    userId: string;
    username: string;
    email: string;
  };
};

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing bearer token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";

export type AuthTokenPayload = {
  userId: string;
  username: string;
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "15m" });
}

export function signRefreshToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, config.refreshTokenSecret, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.refreshTokenSecret) as AuthTokenPayload;
}

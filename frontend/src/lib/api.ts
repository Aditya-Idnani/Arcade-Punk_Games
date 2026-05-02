import type { Game, LeaderboardRow, ScoreItem, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type RequestOptions = {
  method?: "GET" | "POST";
  token?: string;
  body?: unknown;
  cache?: RequestCache;
};

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const parsed = JSON.parse(errorText) as { message?: string };
      throw new Error(parsed.message || "API request failed");
    } catch {
      throw new Error(errorText || "API request failed");
    }
  }

  return (await response.json()) as T;
}

export const api = {
  register: (payload: { username: string; email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/register", { method: "POST", body: payload }),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", { method: "POST", body: payload }),
  getGames: () => request<Game[]>("/games", { cache: "force-cache" }),
  getGame: (idOrSlug: string) => request<Game>(`/games/${idOrSlug}`),
  postScore: (token: string, payload: { gameId: string; score: number }) =>
    request<{ notification: string; score: ScoreItem }>("/scores", {
      method: "POST",
      token,
      body: payload,
    }),
  getScores: (gameId: string) => request<ScoreItem[]>(`/scores/${gameId}`),
  getLeaderboard: () => request<LeaderboardRow[]>("/leaderboard"),
  getProfile: (token: string) => request<User & { achievements: { title: string; description: string; unlockedAt: string }[] }>("/profile", { token }),
  getHistory: (token: string) =>
    request<
      (ScoreItem & { game: { id: string; name: string; slug: string; category: string } })[]
    >("/history", { token }),
};

export type CategoryFilter = "ALL" | "PUZZLE" | "ARCADE" | "LOGIC" | "STRATEGY" | "REFLEX";

export type GameCategory = Exclude<CategoryFilter, "ALL">;

export type Game = {
  id: string;
  slug: string;
  name: string;
  category: GameCategory;
  description: string;
  icon: string;
  tags: string[];
};

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type ScoreItem = {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  createdAt: string;
  user?: {
    username: string;
  };
};

export type LeaderboardRow = {
  userId: string;
  username: string;
  totalScore: number;
  sessions: number;
};

export type ApiError = {
  message: string;
};

"use client";

import { create } from "zustand";
import type { Game, User } from "@/types";

type AppState = {
  token: string | null;
  user: User | null;
  games: Game[];
  soundEnabled: boolean;
  notifications: string[];
  setAuth: (token: string | null, user: User | null) => void;
  logout: () => void;
  setGames: (games: Game[]) => void;
  toggleSound: () => void;
  notify: (message: string) => void;
  clearNotifications: () => void;
  hydrateAuth: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  token: null,
  user: null,
  games: [],
  soundEnabled: true,
  notifications: [],
  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("arcade_token", token);
      else localStorage.removeItem("arcade_token");
      if (user) localStorage.setItem("arcade_user", JSON.stringify(user));
      else localStorage.removeItem("arcade_user");
    }
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("arcade_token");
      localStorage.removeItem("arcade_user");
    }
    set({ token: null, user: null });
  },
  setGames: (games) => set({ games }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  notify: (message) => set((s) => ({ notifications: [message, ...s.notifications].slice(0, 5) })),
  clearNotifications: () => set({ notifications: [] }),
  hydrateAuth: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("arcade_token");
    const rawUser = localStorage.getItem("arcade_user");
    set({ token, user: rawUser ? (JSON.parse(rawUser) as User) : null });
  },
}));

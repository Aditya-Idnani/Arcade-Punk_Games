"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAppStore } from "@/store/use-app-store";

type Achievement = { title: string; description: string; unlockedAt: string };
type History = { id: string; score: number; createdAt: string; game: { name: string } };

export default function ProfilePage() {
  const token = useAppStore((s) => s.token);
  const user = useAppStore((s) => s.user);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    if (!token) return;
    api.getProfile(token).then((p) => setAchievements(p.achievements)).catch(() => setAchievements([]));
    api.getHistory(token).then((h) => setHistory(h)).catch(() => setHistory([]));
  }, [token]);

  if (!user) {
    return (
      <section className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold text-white">Guest Mode</h1>
        <p className="mt-2 text-sm text-zinc-300">Login or register to save scores, unlock achievements, and view history.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold text-white">{user.username}</h1>
        <p className="text-sm text-zinc-300">{user.email}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h2 className="text-lg font-bold text-white">Achievements</h2>
          <div className="mt-3 space-y-2">
            {achievements.length === 0 && <p className="text-sm text-zinc-400">No achievements yet.</p>}
            {achievements.map((a, i) => (
              <div key={i} className="rounded-xl bg-white/5 p-3">
                <p className="font-semibold text-cyan-200">{a.title}</p>
                <p className="text-xs text-zinc-300">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <h2 className="text-lg font-bold text-white">Game History</h2>
          <div className="mt-3 space-y-2">
            {history.slice(0, 10).map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm">
                <span className="text-zinc-200">{h.game.name}</span>
                <span className="text-cyan-200">{h.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

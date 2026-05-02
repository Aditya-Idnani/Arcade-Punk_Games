"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { LeaderboardRow } from "@/types";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    api.getLeaderboard().then(setRows).catch(() => setRows([]));
  }, []);

  return (
    <section className="glass rounded-3xl p-6">
      <h1 className="text-3xl font-extrabold text-white">Global Leaderboard</h1>
      <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-zinc-300">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Total Score</th>
              <th className="px-4 py-3">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.userId} className="border-t border-white/5 text-zinc-200">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{row.username}</td>
                <td className="px-4 py-3">{row.totalScore}</td>
                <td className="px-4 py-3">{row.sessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

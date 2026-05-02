"use client";

import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";

export function Navbar() {
  const user = useAppStore((s) => s.user);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const logout = useAppStore((s) => s.logout);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#060510]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-wide neon-text">
          Arcade Zone
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-zinc-200 transition hover:text-cyan-300" href="/">
            Home
          </Link>
          <Link className="text-zinc-200 transition hover:text-cyan-300" href="/games">
            Games
          </Link>
          <Link className="text-zinc-200 transition hover:text-cyan-300" href="/leaderboard">
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link className="text-zinc-200 transition hover:text-cyan-300" href="/profile">
                {user.username}
              </Link>
              <button className="text-zinc-200 transition hover:text-pink-300" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="text-zinc-200 transition hover:text-cyan-300" href="/auth">
              Login
            </Link>
          )}
          <button
            onClick={toggleSound}
            className="rounded-full border border-cyan-300/40 p-2 text-cyan-200 transition hover:bg-cyan-400/10"
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAppStore } from "@/store/use-app-store";
import { GlowButton } from "@/components/ui/glow-button";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res =
        mode === "login"
          ? await api.login({ email, password })
          : await api.register({ username, email, password });
      setAuth(res.token, res.user);
      router.push("/games");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return (
    <section className="mx-auto max-w-md glass rounded-3xl p-6">
      <h1 className="text-2xl font-bold text-white">{mode === "login" ? "Welcome back" : "Create account"}</h1>
      <p className="mt-1 text-sm text-zinc-300">Guest mode is always available for instant play.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => setMode("login")} className={`rounded-full px-3 py-1 text-xs ${mode === "login" ? "bg-cyan-500/20 text-cyan-200" : "bg-white/5 text-zinc-300"}`}>
          Login
        </button>
        <button onClick={() => setMode("register")} className={`rounded-full px-3 py-1 text-xs ${mode === "register" ? "bg-cyan-500/20 text-cyan-200" : "bg-white/5 text-zinc-300"}`}>
          Register
        </button>
      </div>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {mode === "register" && (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#130f29] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-300/50"
            placeholder="Username"
            required
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#130f29] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-300/50"
          placeholder="Email"
          type="email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#130f29] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-300/50"
          placeholder="Password"
          type="password"
          required
        />
        {error && <p className="text-xs text-pink-300">{error}</p>}
        <GlowButton type="submit" className="w-full">
          {mode === "login" ? "Login" : "Sign up"}
        </GlowButton>
      </form>
    </section>
  );
}

import { Hero } from "@/components/sections/hero";
import { StatsStrip } from "@/components/sections/stats";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Hero />
      <StatsStrip />
      <section className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white">Cyberpunk Neon Arcade</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-300 sm:text-base">
          Dive into a premium browser arcade with smooth animations, instant loads, and highly replayable mini-games.
          Compete on the global leaderboard, unlock achievements, and sharpen your reflexes across puzzle, logic, strategy,
          and arcade classics.
        </p>
      </section>
    </div>
  );
}

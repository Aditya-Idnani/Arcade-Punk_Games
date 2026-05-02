"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlowButton } from "@/components/ui/glow-button";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl glass p-8 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="max-w-2xl space-y-6"
      >
        <p className="inline-flex rounded-full border border-violet-300/50 bg-violet-500/10 px-4 py-1 text-xs font-semibold tracking-wide text-violet-200">
          PREMIUM BROWSER ARCADE
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-6xl neon-text">
          Play. Compete. Dominate.
        </h1>
        <p className="text-base text-zinc-300 sm:text-lg">
          Play premium arcade games instantly — no installs, no ads.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/games">
            <GlowButton>Browse Games</GlowButton>
          </Link>
          <Link href="/games?quick=1">
            <GlowButton variant="secondary">Quick Play</GlowButton>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 29) % 100}%`,
  delay: (i % 10) * 0.2,
  duration: 3 + (i % 5),
}));

export function ParticleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/70"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 1, 0.2], scale: [0.6, 1.2, 0.6] }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

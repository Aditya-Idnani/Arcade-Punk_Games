const stats = [
  { label: "Total Games", value: "15" },
  { label: "Replayability", value: "∞" },
  { label: "Ads", value: "0" },
  { label: "Load Time", value: "<1s" },
];

export function StatsStrip() {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label} className="glass rounded-2xl p-5">
          <p className="text-2xl font-extrabold text-cyan-300">{item.value}</p>
          <p className="mt-1 text-sm text-zinc-300">{item.label}</p>
        </div>
      ))}
    </section>
  );
}

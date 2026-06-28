"use client";

import type { Application, Filters } from "@/lib/types";

export default function FilterBar({
  apps,
  filters,
  onChange,
}: {
  apps: Application[];
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  // Build the type dropdown from what's actually present, most common first.
  const counts = new Map<string, number>();
  for (const a of apps) counts.set(a.type, (counts.get(a.type) ?? 0) + 1);
  const types = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const active = filters.type !== "all" || filters.openOnly;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2.5 shadow-sm">
      <span className="flex items-center gap-1.5 pl-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
        <span className="text-brand-500">⛃</span> Filter
      </span>

      <select
        value={filters.type}
        onChange={(e) => set({ type: e.target.value })}
        className="min-w-[140px] flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500"
      >
        <option value="all">All types ({apps.length})</option>
        {types.map(([t, n]) => (
          <option key={t} value={t}>
            {t} ({n})
          </option>
        ))}
      </select>

      <button
        onClick={() => set({ openOnly: !filters.openOnly })}
        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
          filters.openOnly
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : "border-stone-200 bg-white text-stone-600 hover:border-brand-300"
        }`}
      >
        {filters.openOnly ? "✓ " : ""}Open to object
      </button>

      {active && (
        <button
          onClick={() => onChange({ query: "", type: "all", openOnly: false })}
          className="rounded-xl px-3 py-2 text-sm text-stone-400 hover:text-stone-700"
        >
          Clear
        </button>
      )}
    </div>
  );
}

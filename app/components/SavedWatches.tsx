"use client";

import type { SavedWatch } from "@/lib/types";
import { filterSummary } from "@/lib/watches";

export default function SavedWatches({
  watches,
  onApply,
  onRemove,
}: {
  watches: SavedWatch[];
  onApply: (w: SavedWatch) => void;
  onRemove: (id: string) => void;
}) {
  if (watches.length === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-stone-400">🔔 Your watches:</span>
      {watches.map((w) => (
        <span
          key={w.id}
          className="group inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white py-1 pl-3 pr-1 text-xs shadow-sm"
        >
          <button onClick={() => onApply(w)} className="font-medium text-stone-700 hover:text-brand-600">
            {w.postcode}
            <span className="ml-1 text-stone-400">· {filterSummary(w.filters)}</span>
          </button>
          <button
            onClick={() => onRemove(w.id)}
            className="rounded-full px-1 text-stone-300 hover:bg-stone-100 hover:text-stone-600"
            aria-label="Remove watch"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}

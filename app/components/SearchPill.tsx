"use client";

import { useEffect, useState } from "react";

export default function SearchPill({
  value,
  loading,
  onSearch,
}: {
  value: string;
  loading: boolean;
  onSearch: (pc: string) => void;
}) {
  const [pc, setPc] = useState(value);
  useEffect(() => setPc(value), [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(pc);
      }}
      className="flex items-center gap-1 rounded-full border border-stone-200 bg-white/95 p-1 pl-3 shadow-lg ring-1 ring-black/5 backdrop-blur"
    >
      <span className="text-brand-500">📍</span>
      <input
        value={pc}
        onChange={(e) => setPc(e.target.value)}
        aria-label="Postcode"
        className="w-28 bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:font-normal placeholder:text-stone-400 sm:w-36"
        placeholder="Postcode"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {loading ? "…" : "Search"}
      </button>
    </form>
  );
}

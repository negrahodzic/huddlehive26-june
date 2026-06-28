"use client";

import { useState } from "react";
import type { SavedWatch } from "@/lib/types";
import SavedWatches from "./SavedWatches";
import PoweredBy from "./PoweredBy";

export default function Landing({
  examples,
  loading,
  error,
  watches,
  onSearch,
  onApplyWatch,
  onRemoveWatch,
}: {
  examples: { label: string; postcode: string }[];
  loading: boolean;
  error: string | null;
  watches: SavedWatch[];
  onSearch: (pc: string) => void;
  onApplyWatch: (w: SavedWatch) => void;
  onRemoveWatch: (id: string) => void;
}) {
  const [pc, setPc] = useState("");

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
      {/* Hero */}
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            🏗️ UK planning, made readable
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-stone-800 sm:text-5xl">
            The lamp post notice that actually reaches you.
          </h1>
          <p className="mt-4 max-w-xl text-base text-stone-600">
            When something gets built near you, the only official warning is a paper notice on a
            lamp post — and a 21-day window to object. Notice finds what&apos;s planned around your
            postcode, explains what it means for you in plain English, and shows the deadline while
            you can still act.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(pc);
            }}
            className="mt-7 flex w-full max-w-md gap-2"
          >
            <input
              value={pc}
              onChange={(e) => setPc(e.target.value)}
              autoFocus
              placeholder="Enter your postcode, e.g. EC2A 3AY"
              className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Searching…" : "Show me"}
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400">Try:</span>
            {examples.map((e) => (
              <button
                key={e.postcode}
                onClick={() => onSearch(e.postcode)}
                className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-600 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
              >
                {e.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {watches.length > 0 && (
            <div className="mt-6">
              <SavedWatches watches={watches} onApply={onApplyWatch} onRemove={onRemoveWatch} />
            </div>
          )}
        </div>

        {/* Hero illustration */}
        <div className="relative hidden overflow-hidden rounded-3xl lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-lamppost.jpg"
            alt="A planning notice pinned to a Victorian lamp post on a quiet residential street"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* The problem */}
      <div className="mt-16 grid items-center gap-8 rounded-3xl border border-stone-200 bg-white/60 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 overflow-hidden rounded-2xl lg:order-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-hoarding.jpg"
            alt="A resident reading a planning application notice on a construction hoarding"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-600">The problem</div>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-stone-800 sm:text-3xl">
            You find out after the fact.
          </h2>
          <ul className="mt-4 space-y-2 text-stone-600">
            <li>A development appears next door.</li>
            <li>Your light is gone. Your parking is gone.</li>
            <li>The 21-day objection window closed weeks ago.</li>
          </ul>
          <p className="mt-4 inline-block rounded-xl bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-800">
            The information was public the whole time.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          ["1", "Enter your postcode", "See every live application around you on one map."],
          ["2", "Understand it", "Plain-English summary of what's proposed and how it could affect you."],
          ["3", "Act in time", "See the objection deadline, draft your comment, and set an alert."],
        ].map(([n, t, d]) => (
          <div key={n} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {n}
            </span>
            <h3 className="mt-3 font-display font-bold text-stone-800">{t}</h3>
            <p className="mt-1 text-sm text-stone-600">{d}</p>
          </div>
        ))}
      </div>

      {/* Provenance */}
      <div className="mt-12 border-t border-stone-200 pt-5 text-center">
        <PoweredBy className="mx-auto" />
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-stone-400">
          We aggregate public planning data and use AI only to explain each application — grounded in
          the published documents, never inventing facts. Notice informs you; it never tells you what to do.
        </p>
      </div>
    </div>
  );
}

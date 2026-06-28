"use client";

import { useState } from "react";
import type { Application } from "@/lib/types";

export default function DraftModal({
  app,
  grounds,
  commentUrl,
  onClose,
}: {
  app: Application;
  grounds: string[];
  commentUrl: string | null;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(grounds);
  const [concern, setConcern] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function toggle(g: string) {
    setSelected((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));
  }

  async function generate() {
    setLoading(true);
    setLetter(null);
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app, grounds: selected, concern }),
      });
      const json = await res.json();
      setLetter(json.letter);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!letter) return;
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-stone-800">Draft your objection</h3>
            <p className="text-xs text-stone-500">{app.reference} · {app.address}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100">✕</button>
        </div>

        {!letter && (
          <>
            <div className="mt-4">
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">
                Grounds to rely on
              </div>
              <div className="flex flex-wrap gap-1.5">
                {grounds.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggle(g)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      selected.includes(g)
                        ? "bg-brand-500 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Your own concern (optional)
              </label>
              <textarea
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                rows={3}
                placeholder="e.g. The extension would block all afternoon light to my kitchen."
                className="w-full rounded-xl border border-stone-200 p-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Drafting…" : "Generate objection letter"}
            </button>
          </>
        )}

        {letter && (
          <>
            <pre className="mt-4 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-800 ring-1 ring-stone-200">
              {letter}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={copy}
                className="rounded-xl bg-stone-800 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
              >
                {copied ? "Copied ✓" : "Copy letter"}
              </button>
              {commentUrl && (
                <a
                  href={commentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
                >
                  Submit on council portal →
                </a>
              )}
              <button
                onClick={() => setLetter(null)}
                className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                Edit
              </button>
            </div>
            <p className="mt-3 text-[11px] text-stone-400">
              A starting draft — please review and personalise before submitting. Notice doesn&apos;t submit it for you.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

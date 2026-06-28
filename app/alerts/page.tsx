"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SavedWatch } from "@/lib/types";
import { loadWatches, persistWatches, filterSummary, getEmail, setEmail as persistEmail } from "@/lib/watches";
import { alertsHref } from "@/lib/url";
import TopBar from "../components/TopBar";
import AlertEmailPreview from "../components/AlertEmailPreview";

export default function AlertsPage() {
  const [watches, setWatches] = useState<SavedWatch[]>([]);
  const [email, setEmailState] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setWatches(loadWatches());
    const e = getEmail();
    setEmailState(e);
    setEmailInput(e);
  }, []);

  function remove(id: string) {
    const next = watches.filter((w) => w.id !== id);
    setWatches(next);
    persistWatches(next);
  }

  function saveEmail() {
    persistEmail(emailInput);
    setEmailState(emailInput);
  }

  const date = (n: number) => new Date(n).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-stone-800">My alerts</h1>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
            {watches.length}
          </span>
        </div>
        <p className="mt-2 text-sm text-stone-600">
          Standing watches on the areas you care about. When a new matching application appears, we&apos;ll
          email you a summary so you never miss the objection window.
        </p>

        {/* Email = your identity */}
        <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">Summaries are sent to</div>
          <div className="mt-2 flex gap-2">
            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <button
              onClick={saveEmail}
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Save
            </button>
          </div>
          {email && <p className="mt-2 text-xs text-emerald-700">✓ Saved — {email}</p>}
        </div>

        {/* Alerts list */}
        {watches.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-200 bg-white/50 p-10 text-center text-sm text-stone-400">
            No alerts yet. Search a postcode and tap{" "}
            <span className="font-medium text-stone-500">Create alert for this area</span>.
            <div className="mt-4">
              <Link href="/" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                Find your area →
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {watches.map((w) => (
              <div key={w.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display font-bold text-stone-800">{w.postcode}</div>
                    <div className="mt-0.5 text-xs text-stone-500">
                      {filterSummary(w.filters)} · created {date(w.createdAt)}
                      {w.email ? ` · ${w.email}` : ""}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Link
                      href={alertsHref(w.postcode)}
                      className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-brand-300 hover:text-brand-600"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => setPreview(preview === w.id ? null : w.id)}
                      className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-brand-300 hover:text-brand-600"
                    >
                      {preview === w.id ? "Hide email" : "Preview email"}
                    </button>
                    <button
                      onClick={() => remove(w.id)}
                      className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-400 transition hover:border-rose-300 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {preview === w.id && (
                  <div className="mt-3">
                    <AlertEmailPreview postcode={w.postcode} email={w.email || email} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

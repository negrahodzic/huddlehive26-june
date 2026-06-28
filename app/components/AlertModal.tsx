"use client";

import { useState } from "react";
import type { Application, Filters } from "@/lib/types";
import { filterSummary, getEmail, setEmail as persistEmail } from "@/lib/watches";
import AlertEmailPreview from "./AlertEmailPreview";

export default function AlertModal({
  postcode,
  area,
  filters,
  nearby,
  onCreate,
  onClose,
}: {
  postcode: string;
  area: string;
  filters: Filters;
  nearby: Application[];
  onCreate: (email: string) => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState(getEmail());
  const [done, setDone] = useState(false);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const rows = nearby
    .filter((a) => a.objectionDeadline)
    .slice(0, 3)
    .map((a) => ({ address: a.address, type: a.type, deadline: a.objectionDeadline }));

  function create() {
    if (!valid) return;
    persistEmail(email);
    onCreate(email);
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg font-bold text-stone-800">
            {done ? "Alert created ✓" : "🔔 Create an alert"}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100" aria-label="Close">
            ✕
          </button>
        </div>

        {!done ? (
          <>
            <p className="mt-1 text-sm text-stone-500">
              We&apos;ll watch <span className="font-semibold text-stone-700">{postcode}</span>
              {area ? ` (${area})` : ""} and email you when new matching applications appear.
            </p>

            <div className="mt-4 rounded-xl bg-stone-50 p-3 text-sm ring-1 ring-stone-200">
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">You&apos;ll be alerted about</div>
              <div className="mt-1 text-stone-700">
                {postcode} · <span className="text-stone-500">{filterSummary(filters)}</span>
              </div>
            </div>

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-stone-400">
              Your email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

            <button
              onClick={create}
              disabled={!valid}
              className="mt-4 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
            >
              Create alert
            </button>
            <p className="mt-2 text-[11px] text-stone-400">
              No account needed. Your email is only used for these summaries. (Demo: emails aren&apos;t sent yet.)
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-stone-600">
              You&apos;re watching <span className="font-semibold">{postcode}</span>. Summaries will go to{" "}
              <span className="font-semibold">{email}</span>. Here&apos;s what they&apos;ll look like:
            </p>
            <div className="mt-4">
              <AlertEmailPreview postcode={postcode} email={email} rows={rows} />
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-xl border border-stone-200 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

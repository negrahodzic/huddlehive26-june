"use client";

import { useEffect, useState } from "react";
import type { Application, DeveloperResponse } from "@/lib/types";

export default function DeveloperPanel({
  name,
  otherApps,
}: {
  name: string;
  otherApps: Application[];
}) {
  const [data, setData] = useState<DeveloperResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);
    fetch(`/api/developer?q=${encodeURIComponent(name)}`)
      .then((r) => r.json())
      .then((d) => live && setData(d))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [name]);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-base">🔎</span>
        <h3 className="font-display text-sm font-bold text-stone-800">Who&apos;s behind it</h3>
      </div>
      <p className="mt-0.5 text-xs text-stone-500">
        Public record — Companies House + nearby planning data. No AI, no guesswork.
      </p>

      <div className="mt-3 text-sm font-medium text-stone-800">{name}</div>

      {/* Track record across the area (from live planning data) */}
      {otherApps.length > 0 && (
        <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
          ⚠️ {otherApps.length} other application{otherApps.length > 1 ? "s" : ""} nearby from the
          same applicant/agent.
        </div>
      )}

      {/* Companies House */}
      <div className="mt-3">
        {loading && <div className="text-xs text-stone-400">Checking Companies House…</div>}
        {data && (
          <>
            <div className="mb-2 flex gap-2 text-xs">
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-emerald-200">
                {data.activeCount} active
              </span>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 font-medium text-rose-700 ring-1 ring-rose-200">
                {data.dissolvedCount} dissolved
              </span>
            </div>
            <ul className="space-y-1.5">
              {data.companies.map((c) => (
                <li key={c.number} className="flex items-center justify-between gap-2 text-xs">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-stone-700 underline-offset-2 hover:underline"
                  >
                    {c.name}
                  </a>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 font-medium ring-1 ${
                      /active/i.test(c.status)
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-rose-50 text-rose-700 ring-rose-200"
                    }`}
                  >
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
            {data.note && <p className="mt-2 text-[11px] text-stone-400">{data.note}</p>}
          </>
        )}
      </div>
    </div>
  );
}

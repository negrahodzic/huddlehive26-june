"use client";

import { useEffect, useState } from "react";
import type { Application, Explanation } from "@/lib/types";
import { statusColor } from "@/lib/planit";
import DeadlineCountdown from "./DeadlineCountdown";
import DeveloperPanel from "./DeveloperPanel";
import DraftModal from "./DraftModal";
import ShareButton from "./ShareButton";

export default function DetailPanel({
  app,
  allApps,
  onClose,
}: {
  app: Application;
  allApps: Application[];
  onClose?: () => void;
}) {
  const [exp, setExp] = useState<(Explanation & { _demo?: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);
  const c = statusColor(app.state);

  useEffect(() => {
    let live = true;
    setExp(null);
    setLoading(true);
    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(app),
    })
      .then((r) => r.json())
      .then((d) => live && setExp(d))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [app]);

  const developerName = app.applicant || app.agentCompany || app.agent || "";
  const otherApps = developerName
    ? allApps.filter(
        (a) =>
          a.id !== app.id &&
          (a.applicant === developerName ||
            a.agentCompany === developerName ||
            a.agent === developerName),
      )
    : [];

  const linkBtn =
    "inline-flex items-center gap-1.5 rounded-xl border border-brand-300 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 shadow-sm transition hover:bg-brand-500 hover:text-white hover:border-brand-500";

  return (
    <div className="rounded-2xl border-2 border-brand-200 bg-white p-5 shadow-md sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.badge}`}>
            {app.type} · {app.state}
          </span>
          <h2 className="mt-2 font-display text-xl font-bold leading-tight text-stone-800">{app.address}</h2>
          <p className="mt-0.5 text-xs text-stone-400">Ref {app.reference}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <ShareButton
              label="Share"
              title={app.address}
              text={`Planning application near ${app.address} — see what it means and the objection deadline on Notice.`}
            />
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-500 shadow-sm transition hover:bg-stone-100 hover:text-stone-800"
              >
                ✕
              </button>
            )}
          </div>
          <DeadlineCountdown deadline={app.objectionDeadline} size="lg" />
        </div>
      </div>

      {/* Body */}
      <div className="mt-5 grid gap-6 lg:grid-cols-3">
        {/* What this means for you */}
        <div className="space-y-4 lg:col-span-2">
          <div>
            <h3 className="font-display text-base font-bold text-stone-800">What this means for you</h3>
            <p className="text-xs text-stone-400">
              Plain-language summary, written from the published application
              {exp?._demo ? " · demo" : ""}.
            </p>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-stone-100" />
              <div className="h-3 w-full animate-pulse rounded bg-stone-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-stone-100" />
            </div>
          )}

          {exp && (
            <>
              <div className="rounded-xl bg-brand-50/60 p-4 ring-1 ring-brand-100">
                <p className="font-semibold text-stone-900">{exp.summary}</p>
                <p className="mt-2 text-sm text-stone-600">{exp.whatItIs}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">
                    How it could affect you
                  </div>
                  <ul className="space-y-1.5">
                    {exp.potentialImpacts.map((i, n) => (
                      <li key={n} className="flex gap-2 text-sm text-stone-700">
                        <span className="mt-0.5 text-brand-500">›</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>

                {exp.validGrounds.length > 0 && (
                  <div>
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">
                      Grounds you can object on
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.validGrounds.map((g, n) => (
                        <span
                          key={n}
                          title={g}
                          className="max-w-[150px] truncate rounded-full bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-white"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-brand-50 p-3 text-sm text-brand-800 ring-1 ring-brand-100">
                <span className="font-semibold">Have your say: </span>
                {exp.howToObject}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {app.objectionDeadline && (
                  <button
                    onClick={() => setDrafting(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
                  >
                    ✍️ Draft my objection
                  </button>
                )}
                {app.commentUrl && (
                  <a href={app.commentUrl} target="_blank" rel="noopener noreferrer" className={linkBtn}>
                    Comment on portal ↗
                  </a>
                )}
                {app.docsUrl && (
                  <a href={app.docsUrl} target="_blank" rel="noopener noreferrer" className={linkBtn}>
                    Documents ↗
                  </a>
                )}
                <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkBtn}>
                  View source record ↗
                </a>
              </div>
            </>
          )}
        </div>

        {/* Who's behind it */}
        <div className="lg:col-span-1">
          {developerName ? (
            <DeveloperPanel name={developerName} otherApps={otherApps} />
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">🔎</span>
                <h3 className="font-display text-sm font-bold text-stone-800">Who&apos;s behind it</h3>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                The council hasn&apos;t published the applicant or agent for this application in the open
                data — so even this is hidden.
              </p>
              <a
                href={app.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 ${linkBtn}`}
              >
                Check the original record ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {drafting && (
        <DraftModal
          app={app}
          grounds={exp?.validGrounds ?? []}
          commentUrl={app.commentUrl}
          onClose={() => setDrafting(false)}
        />
      )}
    </div>
  );
}

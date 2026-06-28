"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Application, Filters, PlanningResponse, SavedWatch, SortKey } from "@/lib/types";
import { loadWatches, persistWatches, filterSummary } from "@/lib/watches";
import { sortApplications } from "@/lib/planit";
import { readUrlState, writeUrlState } from "@/lib/url";
import ApplicationCard from "./components/ApplicationCard";
import DetailPanel from "./components/DetailPanel";
import FilterBar from "./components/FilterBar";
import WatchStreet from "./components/WatchStreet";
import TopBar from "./components/TopBar";
import Landing from "./components/Landing";
import SearchPill from "./components/SearchPill";

const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-stone-100" />,
});

const EXAMPLES = [
  { label: "Westminster", postcode: "SW1A 1AA" },
  { label: "Shoreditch", postcode: "EC2A 3AY" },
  { label: "Manchester", postcode: "M1 1AE" },
  { label: "Bristol", postcode: "BS1 4DJ" },
];

const PAGE_SIZE = 5;
const DEFAULT_FILTERS: Filters = { query: "", type: "all", openOnly: false };

export default function Home() {
  const [data, setData] = useState<PlanningResponse | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("deadline");
  const [page, setPage] = useState(1);
  const [watches, setWatches] = useState<SavedWatch[]>([]);
  const pendingSel = useRef<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => setWatches(loadWatches()), []);

  // Restore shareable state from the URL on first load.
  useEffect(() => {
    const { pc, sel } = readUrlState();
    if (pc) {
      pendingSel.current = sel;
      search(pc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function search(pc: string, withFilters?: Filters) {
    const q = pc.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setSelected(null);
    setFilters(withFilters ?? DEFAULT_FILTERS);
    try {
      const res = await fetch(`/api/planning?postcode=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.");
        return;
      }
      setData(json);
      if (pendingSel.current) {
        const match = json.applications.find((a: Application) => a.id === pendingSel.current);
        if (match) setSelected(match);
        pendingSel.current = null;
      }
    } catch {
      setError("Couldn't reach the planning data source.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = filters.query.trim().toLowerCase();
    const matched = data.applications.filter(
      (a) =>
        (filters.type === "all" || a.type === filters.type) &&
        (!filters.openOnly || a.objectionDeadline) &&
        (!q || `${a.address} ${a.description} ${a.type}`.toLowerCase().includes(q)),
    );
    return sortApplications(matched, sort);
  }, [data, filters, sort]);

  useEffect(() => setPage(1), [filters, sort]);

  // Keep the URL in sync so the view is shareable.
  useEffect(() => {
    if (data) writeUrlState({ pc: data.postcode, sel: selected?.id ?? null });
  }, [data, selected]);

  // Smooth-scroll to the detail when something is selected.
  useEffect(() => {
    if (selected) detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const openCount = filtered.filter((a) => a.objectionDeadline).length;

  function addWatch(pc: string, area: string, f: Filters, email: string) {
    const w: SavedWatch = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      postcode: pc,
      area,
      filters: f,
      email,
      createdAt: Date.now(),
    };
    const next = [
      w,
      ...watches.filter((x) => !(x.postcode === pc && filterSummary(x.filters) === filterSummary(f))),
    ].slice(0, 12);
    setWatches(next);
    persistWatches(next);
  }

  // Pre-search: landing hero.
  if (!data) {
    return (
      <>
        <TopBar />
        <Landing
          examples={EXAMPLES}
          loading={loading}
          error={error}
          watches={watches}
          onSearch={(pc) => search(pc)}
          onApplyWatch={(w) => search(w.postcode, w.filters)}
          onRemoveWatch={(id) => {
            const next = watches.filter((w) => w.id !== id);
            setWatches(next);
            persistWatches(next);
          }}
        />
      </>
    );
  }

  // Post-search: workspace.
  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5">
        {data.source === "demo" && (
          <div className="mb-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-xs text-brand-800">
            <span className="font-semibold">Showing sample data.</span> The live planning source
            (PlanIt) is unavailable right now, so these are representative example applications for
            this area.
          </div>
        )}
        {/* Top zone: filters+map (left) | list (right), equal height */}
        <div className="lg:grid lg:h-[72vh] lg:grid-cols-2 lg:gap-5">
          {/* LEFT — filters + map */}
          <div className="flex min-h-0 flex-col gap-3">
            <FilterBar apps={data.applications} filters={filters} onChange={setFilters} />
            <div className="relative h-[300px] overflow-hidden rounded-2xl border border-stone-200 shadow-sm lg:h-auto lg:min-h-0 lg:flex-1">
              <MapView
                center={data.center}
                applications={filtered}
                selectedId={selected?.id ?? null}
                onSelect={(a) => setSelected(a)}
              />
              <div className="pointer-events-none absolute inset-0 z-[1000]">
                <div className="pointer-events-auto absolute left-3 top-3">
                  <SearchPill value={data.postcode} loading={loading} onSearch={(pc) => search(pc)} />
                </div>
                <div className="pointer-events-auto absolute bottom-3 left-3">
                  <WatchStreet
                    postcode={data.postcode}
                    area={data.area}
                    filters={filters}
                    nearby={filtered}
                    onSave={addWatch}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — results list (internally scrolls) */}
          <div className="mt-5 flex min-h-0 flex-col lg:mt-0">
            {error && (
              <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-display font-bold text-stone-800">
                {filtered.length} near {data.postcode}
                <span className="ml-2 text-sm font-medium text-emerald-700">{openCount} open to object</span>
              </h2>
              <label className="flex items-center gap-1.5 text-xs text-stone-500">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-brand-500"
                >
                  <option value="deadline">Deadline (soonest)</option>
                  <option value="distance">Nearest</option>
                  <option value="recent">Most recent</option>
                </select>
              </label>
            </div>

            <div className="space-y-2.5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
              {filtered.length === 0 && (
                <p className="rounded-2xl border border-dashed border-stone-200 p-6 text-center text-sm text-stone-400">
                  No applications match these filters.
                </p>
              )}
              {pageItems.map((a) => (
                <ApplicationCard
                  key={a.id}
                  app={a}
                  selected={selected?.id === a.id}
                  onClick={() => setSelected(selected?.id === a.id ? null : a)}
                />
              ))}
            </div>

            {pageCount > 1 && (
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 transition hover:border-brand-300 disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="text-xs text-stone-500">
                  Page {page} of {pageCount}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 transition hover:border-brand-300 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom zone: selected application, full width */}
        <div ref={detailRef} className="mt-6 scroll-mt-20">
          {selected ? (
            <DetailPanel app={selected} allApps={data.applications} onClose={() => setSelected(null)} />
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-white/50 p-8 text-center text-sm text-stone-400">
              Select an application above to see what it means for you, the deadline, and who&apos;s behind it.
            </div>
          )}
        </div>

        <footer className="mt-10 border-t border-stone-200 pt-4 text-xs text-stone-400">
          Data: PlanIt · postcodes.io · Companies House · OpenStreetMap. Plain-language summaries are
          generated from the published application — Notice informs, it never tells you what to do.
        </footer>
      </main>
    </>
  );
}

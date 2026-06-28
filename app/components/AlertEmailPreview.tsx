import { daysLeft } from "@/lib/planit";
import Logo from "./Logo";

type Row = { address: string; type: string; deadline: string | null };

const PLACEHOLDER: Row[] = [
  { address: "12 Hartley Road", type: "Full Planning", deadline: isoInDays(9) },
  { address: "3 Elm Street", type: "Change of use", deadline: isoInDays(16) },
  { address: "7 Oak Lane", type: "Householder", deadline: isoInDays(20) },
];

function isoInDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function AlertEmailPreview({
  postcode,
  email,
  rows,
}: {
  postcode: string;
  email: string;
  rows?: Row[];
}) {
  const items = (rows && rows.length ? rows : PLACEHOLDER).slice(0, 3);

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50 shadow-inner">
      {/* email meta */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-2 text-[11px] text-stone-400">
        <span>To: {email || "you@example.com"}</span>
        <span>Notice · weekly summary</span>
      </div>

      {/* email body */}
      <div className="bg-white px-5 py-5">
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <span className="font-display text-sm font-extrabold text-stone-800">Notice</span>
        </div>

        <h4 className="mt-4 font-display text-lg font-bold text-stone-800">
          {items.length} new application{items.length !== 1 ? "s" : ""} near {postcode}
        </h4>
        <p className="mt-1 text-xs text-stone-500">
          Here&apos;s what&apos;s changed since we last checked your area. Don&apos;t miss the objection window.
        </p>

        <div className="mt-4 space-y-2">
          {items.map((r, i) => {
            const d = daysLeft(r.deadline);
            return (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-stone-800">{r.address}</div>
                  <div className="text-xs text-stone-500">{r.type}</div>
                </div>
                <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-200">
                  {d === null ? "—" : d <= 0 ? "Closes today" : `${d} days left`}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <span className="inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
            View all on Notice →
          </span>
        </div>

        <p className="mt-5 border-t border-stone-100 pt-3 text-[11px] text-stone-400">
          You&apos;re getting this because you created an alert for {postcode}. Manage or unsubscribe in My alerts.
        </p>
      </div>
    </div>
  );
}

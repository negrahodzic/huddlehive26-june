import type { Application } from "@/lib/types";
import { statusColor } from "@/lib/planit";
import DeadlineCountdown from "./DeadlineCountdown";

export default function ApplicationCard({
  app,
  selected,
  onClick,
}: {
  app: Application;
  selected: boolean;
  onClick: () => void;
}) {
  const c = statusColor(app.state);
  const distance =
    app.distanceKm < 1
      ? `${Math.round(app.distanceKm * 1000)}m away`
      : `${app.distanceKm.toFixed(1)}km away`;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-brand-400 bg-brand-50 shadow-md ring-1 ring-brand-200"
          : "border-stone-200 bg-white hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
      }`}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-stone-800">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.dot }} />
          {app.type}
        </span>
        <DeadlineCountdown deadline={app.objectionDeadline} />
      </div>
      <div className="text-sm font-medium text-stone-700">{app.address}</div>
      <p className="mt-1 line-clamp-2 text-sm text-stone-500">{app.description}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-stone-400">
        <span className={`rounded-full px-2 py-0.5 font-medium ${c.badge}`}>{app.state}</span>
        <span>{distance}</span>
      </div>
    </button>
  );
}

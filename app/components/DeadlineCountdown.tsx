import { daysLeft } from "@/lib/planit";

export default function DeadlineCountdown({
  deadline,
  size = "sm",
}: {
  deadline: string | null;
  size?: "sm" | "lg";
}) {
  const d = daysLeft(deadline);

  // Closed window — muted, consistent padding.
  if (d === null) {
    if (size === "lg") {
      return (
        <div className="rounded-xl bg-stone-100 px-4 py-2.5 text-center ring-1 ring-stone-200">
          <div className="text-sm font-semibold text-stone-500">Objection</div>
          <div className="text-xs text-stone-400">window closed</div>
        </div>
      );
    }
    return (
      <span className="inline-flex items-center whitespace-nowrap rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500 ring-1 ring-stone-200">
        Window closed
      </span>
    );
  }

  const tone =
    d <= 7
      ? { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" }
      : d <= 14
        ? { bg: "bg-brand-50", text: "text-brand-700", ring: "ring-brand-200" }
        : { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" };

  const pillText = d <= 0 ? "Closes today" : d === 1 ? "1 day left" : `${d} days left`;

  if (size === "lg") {
    return (
      <div className={`rounded-xl px-4 py-2.5 text-center ring-1 ${tone.bg} ${tone.ring}`}>
        <div className={`text-2xl font-extrabold leading-none ${tone.text}`}>{d <= 0 ? "Today" : d}</div>
        <div className={`mt-1 text-[11px] font-medium leading-tight ${tone.text}`}>
          {d <= 0 ? "last day to object" : d === 1 ? "day left to object" : "days left to object"}
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}
    >
      ⏳ {pillText}
    </span>
  );
}

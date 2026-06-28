import type { Application, SortKey } from "./types";

const CONSULTATION_DAYS = 21;

function cleanField(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s || /^see source$/i.test(s) || /confidential/i.test(s)) return null;
  return s;
}

function objectionDeadline(
  consulted: string | null,
  validated: string | null,
  decided: string | null,
): string | null {
  if (decided) return null; // already decided — window closed
  const base = consulted || validated;
  if (!base) return null;
  const d = new Date(base);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + CONSULTATION_DAYS);
  return d.toISOString().slice(0, 10);
}

// Normalise a raw PlanIt /api/applics record into our Application shape.
export function normaliseApplics(records: unknown[]): Application[] {
  const out: Application[] = [];
  for (const r of records as Record<string, unknown>[]) {
    const other = (r.other_fields ?? {}) as Record<string, unknown>;
    const lat = Number(r.location_y);
    const lng = Number(r.location_x);
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

    const consultedDate = cleanField(r.consulted_date) ?? cleanField(other.date_validated);
    const validatedDate = cleanField(other.date_validated) ?? cleanField(other.date_received);
    const decidedDate = cleanField(r.decided_date);

    out.push({
      id: String(r.name ?? r.uid ?? `${lat},${lng}`),
      reference: String(r.name ?? "").split("/").slice(1).join("/") || String(r.name ?? ""),
      address: cleanField(r.address) ?? "Address not listed",
      type: cleanField(r.app_type) ?? "Application",
      state: cleanField(r.app_state) ?? "Unknown",
      size: cleanField(r.app_size) ?? "",
      description: cleanField(r.description) ?? "No description provided.",
      applicant: cleanField(other.applicant_name),
      agent: cleanField(other.agent_name),
      agentCompany: cleanField(other.agent_company),
      commentUrl: cleanField(other.comment_url),
      docsUrl: cleanField(other.docs_url),
      sourceUrl: cleanField(r.link) ?? "https://www.planit.org.uk",
      validatedDate,
      consultedDate,
      decidedDate,
      objectionDeadline: objectionDeadline(consultedDate, validatedDate, decidedDate),
      lat,
      lng,
      distanceKm: typeof r.distance === "number" ? r.distance : 0,
    });
  }

  // Open-for-objection first, then most recently validated.
  return out.sort((a, b) => {
    const aOpen = a.objectionDeadline ? 1 : 0;
    const bOpen = b.objectionDeadline ? 1 : 0;
    if (aOpen !== bOpen) return bOpen - aOpen;
    return (b.validatedDate ?? "").localeCompare(a.validatedDate ?? "");
  });
}

// Cohesive, on-brand status palette (warm) instead of generic green/blue/red/gray.
export function statusColor(state: string): { dot: string; badge: string; label: string } {
  const s = state.toLowerCase();
  if (/(refus|reject|withdraw|dismiss)/.test(s))
    return { dot: "#c0563f", badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", label: state };
  if (/(approv|grant|permit|condition|consent)/.test(s))
    return { dot: "#3f9e6b", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", label: state };
  if (/(undecided|pending|registered|consult|received|valid)/.test(s))
    return { dot: "#c8862e", badge: "bg-brand-50 text-brand-700 ring-1 ring-brand-200", label: state };
  return { dot: "#a8a29e", badge: "bg-stone-100 text-stone-600 ring-1 ring-stone-200", label: state };
}

export function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const end = new Date(deadline + "T23:59:59").getTime();
  return Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
}

// Sort the (already-filtered) list. Default "deadline" keeps open-to-object first.
export function sortApplications(apps: Application[], key: SortKey): Application[] {
  const copy = [...apps];
  if (key === "distance") return copy.sort((a, b) => a.distanceKm - b.distanceKm);
  if (key === "recent")
    return copy.sort((a, b) => (b.validatedDate ?? "").localeCompare(a.validatedDate ?? ""));
  return copy.sort((a, b) => {
    if (a.objectionDeadline && b.objectionDeadline)
      return a.objectionDeadline.localeCompare(b.objectionDeadline);
    if (a.objectionDeadline) return -1;
    if (b.objectionDeadline) return 1;
    return (b.validatedDate ?? "").localeCompare(a.validatedDate ?? "");
  });
}

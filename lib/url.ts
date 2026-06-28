// Lightweight URL state (no router/Suspense needed) so workspace views are shareable.

export type UrlState = { pc: string; sel: string | null };

export function readUrlState(): UrlState {
  if (typeof window === "undefined") return { pc: "", sel: null };
  const p = new URLSearchParams(window.location.search);
  return { pc: p.get("pc")?.trim() ?? "", sel: p.get("sel") };
}

export function writeUrlState(state: UrlState) {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams();
  if (state.pc) p.set("pc", state.pc);
  if (state.sel) p.set("sel", state.sel);
  const qs = p.toString();
  const url = qs ? `/?${qs}` : "/";
  window.history.replaceState(null, "", url);
}

export function alertsHref(pc: string): string {
  return `/?pc=${encodeURIComponent(pc)}`;
}

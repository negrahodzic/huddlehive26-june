import type { SavedWatch } from "./types";

const KEY = "notice:watches";
const EMAIL_KEY = "notice:email";

export function getEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(EMAIL_KEY) || "";
}

export function setEmail(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMAIL_KEY, email);
}

export function loadWatches(): SavedWatch[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as SavedWatch[];
  } catch {
    return [];
  }
}

export function persistWatches(watches: SavedWatch[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(watches));
}

export function filterSummary(f: SavedWatch["filters"]): string {
  const parts: string[] = [];
  if (f.openOnly) parts.push("open to object");
  if (f.type !== "all") parts.push(f.type);
  if (f.query) parts.push(`“${f.query}”`);
  return parts.length ? parts.join(" · ") : "all applications";
}

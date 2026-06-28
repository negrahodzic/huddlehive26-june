import { NextRequest } from "next/server";
import { normaliseApplics } from "@/lib/planit";
import { buildDemoApplications } from "@/lib/demoData";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const postcode = req.nextUrl.searchParams.get("postcode")?.trim();
  if (!postcode) {
    return Response.json({ error: "Enter a postcode." }, { status: 400 });
  }

  // 1. Geocode the postcode (free, no key).
  const geoRes = await fetch(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`,
    { cache: "no-store" },
  );
  if (!geoRes.ok) {
    return Response.json(
      { error: "Couldn't find that postcode — check it and try again." },
      { status: 404 },
    );
  }
  const geo = await geoRes.json();
  const { latitude, longitude, admin_district } = geo.result;

  // 2. Pull live planning applications nearby from PlanIt (free, no key).
  const url =
    `https://www.planit.org.uk/api/applics/json` +
    `?lat=${latitude}&lng=${longitude}&krad=1&pg_sz=80&recent=400`;

  let records: unknown[] = [];
  try {
    // Cap the wait — PlanIt can be slow or time out; we don't want to hang.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const res = await fetch(url, {
      headers: { "User-Agent": "Notice/0.1 (hackathon civic-transparency tool)" },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      records = Array.isArray(data.records) ? data.records : [];
    }
  } catch {
    // fall through to the sample fallback below
  }

  const center = { lat: latitude, lng: longitude };
  let applications = normaliseApplics(records);
  let source: "planit" | "demo" = "planit";

  // If the live source is unavailable (timeout, outage) or returns nothing,
  // fall back to representative sample data so the map is never empty.
  if (applications.length === 0) {
    applications = buildDemoApplications(center);
    source = "demo";
  }

  return Response.json({
    postcode: geo.result.postcode,
    area: admin_district,
    center,
    applications,
    source,
  });
}

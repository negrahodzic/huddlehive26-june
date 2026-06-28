import { NextRequest } from "next/server";
import type { DeveloperCompany, DeveloperResponse } from "@/lib/types";

export const runtime = "nodejs";

const CH_SEARCH = "https://api.company-information.service.gov.uk/search/companies";
const CH_PUBLIC = "https://find-and-update.company-information.service.gov.uk/company";

function summarise(query: string, companies: DeveloperCompany[], source: DeveloperResponse["source"], note?: string): DeveloperResponse {
  const activeCount = companies.filter((c) => /active/i.test(c.status)).length;
  const dissolvedCount = companies.filter((c) => /dissolv|liquidat/i.test(c.status)).length;
  return { query, source, companies, activeCount, dissolvedCount, note };
}

// Curated fallback so the demo works without a Companies House key.
function demo(query: string): DeveloperResponse {
  const companies: DeveloperCompany[] = [
    {
      name: `${query.toUpperCase()} DEVELOPMENTS LTD`,
      number: "DEMO0001",
      status: "active",
      incorporated: "2019-03-12",
      address: "Sample House, London",
      url: CH_PUBLIC,
    },
    {
      name: `${query.toUpperCase()} PROPERTY HOLDINGS LTD`,
      number: "DEMO0002",
      status: "dissolved",
      incorporated: "2014-07-01",
      address: "Sample House, London",
      url: CH_PUBLIC,
    },
  ];
  return summarise(query, companies, "demo", "Demo data — add COMPANIES_HOUSE_KEY for live results.");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return Response.json({ error: "Missing applicant/agent name" }, { status: 400 });

  const key = process.env.COMPANIES_HOUSE_KEY;
  if (!key) return Response.json(demo(q));

  try {
    const auth = Buffer.from(`${key}:`).toString("base64");
    const res = await fetch(`${CH_SEARCH}?q=${encodeURIComponent(q)}&items_per_page=6`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
    if (!res.ok) return Response.json(demo(q));
    const data = await res.json();
    const companies: DeveloperCompany[] = (data.items ?? []).map(
      (it: Record<string, unknown>) => ({
        name: String(it.title ?? ""),
        number: String(it.company_number ?? ""),
        status: String(it.company_status ?? "unknown"),
        incorporated: (it.date_of_creation as string) ?? null,
        address: (it.address_snippet as string) ?? null,
        url: `${CH_PUBLIC}/${it.company_number}`,
      }),
    );
    return Response.json(summarise(q, companies, "companies_house"));
  } catch (err) {
    console.error("developer error", err);
    return Response.json(demo(q));
  }
}

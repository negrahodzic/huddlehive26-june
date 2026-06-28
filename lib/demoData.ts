import type { Application } from "./types";

const CONSULTATION_DAYS = 21;

function iso(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function deadlineFrom(validated: string): string {
  const d = new Date(validated);
  d.setDate(d.getDate() + CONSULTATION_DAYS);
  return d.toISOString().slice(0, 10);
}

type Seed = {
  ref: string;
  address: string;
  type: string;
  state: string;
  size: string;
  description: string;
  applicant: string | null;
  agent: string | null;
  agentCompany: string | null;
  validatedAgo: number; // days ago the application was validated
  decided?: boolean;
  dx: number; // lng offset (deg)
  dy: number; // lat offset (deg)
};

// Representative sample applications, used when the live PlanIt API is
// unavailable so the app — and the demo — never shows an empty map.
const SEEDS: Seed[] = [
  {
    ref: "2026/0461/FUL",
    address: "Flat 42, Laleham House, Sclater Street",
    type: "Full Planning",
    state: "Undecided",
    size: "Medium",
    description:
      "Erection of a part three, part four storey building to provide 9 residential units with associated cycle parking and refuse storage.",
    applicant: "Sclater Developments Ltd",
    agent: "James Carlisle",
    agentCompany: "Carlisle Architects",
    validatedAgo: 14,
    dx: 0.0016,
    dy: 0.0012,
  },
  {
    ref: "2026/0455/HH",
    address: "23 Redchurch Street",
    type: "Householder",
    state: "Undecided",
    size: "Small",
    description:
      "Single storey rear extension and replacement of front windows at ground floor level.",
    applicant: null,
    agent: null,
    agentCompany: null,
    validatedAgo: 18,
    dx: -0.0021,
    dy: 0.0008,
  },
  {
    ref: "2026/0448/COU",
    address: "Unit 5, Ebor Street",
    type: "Change of Use",
    state: "Undecided",
    size: "Medium",
    description:
      "Change of use of ground floor from light industrial (Use Class E(g)) to a restaurant (Use Class E(b)) with extraction flue to rear.",
    applicant: "Ebor Street Hospitality Ltd",
    agent: null,
    agentCompany: null,
    validatedAgo: 8,
    dx: 0.0009,
    dy: -0.0018,
  },
  {
    ref: "2026/0431/ADV",
    address: "Shoreditch High Street (junction with Bethnal Green Road)",
    type: "Advertisement",
    state: "Undecided",
    size: "Small",
    description:
      "Display of one internally illuminated digital advertisement panel at first floor level.",
    applicant: null,
    agent: null,
    agentCompany: null,
    validatedAgo: 3,
    dx: -0.0006,
    dy: 0.0022,
  },
  {
    ref: "2026/0402/LBC",
    address: "The Old Truman Brewery, Hanbury Street",
    type: "Listed Building Consent",
    state: "Undecided",
    size: "Large",
    description:
      "Internal and external alterations to facilitate conversion of upper floors to office use, including roof-level plant enclosure.",
    applicant: "Truman Estates LLP",
    agent: "Priya Anand",
    agentCompany: "Anand Heritage Consultants",
    validatedAgo: 20,
    dx: 0.0028,
    dy: -0.0009,
  },
  {
    ref: "2026/0377/FUL",
    address: "Land rear of 110 Bethnal Green Road",
    type: "Full Planning",
    state: "Conditions",
    size: "Medium",
    description:
      "Erection of a two storey mews house with green roof following demolition of existing single storey workshop.",
    applicant: "Sclater Developments Ltd",
    agent: "James Carlisle",
    agentCompany: "Carlisle Architects",
    validatedAgo: 95,
    decided: true,
    dx: -0.0031,
    dy: -0.0014,
  },
  {
    ref: "2026/0310/HH",
    address: "8 Calvert Avenue",
    type: "Householder",
    state: "Refused",
    size: "Small",
    description:
      "Erection of a roof extension including front and rear dormer windows.",
    applicant: null,
    agent: null,
    agentCompany: null,
    validatedAgo: 120,
    decided: true,
    dx: 0.0013,
    dy: 0.0026,
  },
  {
    ref: "2026/0288/FUL",
    address: "44–46 Rivington Street",
    type: "Full Planning",
    state: "Approved",
    size: "Large",
    description:
      "Demolition of existing buildings and erection of a six storey building comprising office floorspace and a ground floor café.",
    applicant: "Rivington Regeneration Ltd",
    agent: "Priya Anand",
    agentCompany: "Anand Heritage Consultants",
    validatedAgo: 160,
    decided: true,
    dx: -0.0024,
    dy: 0.0017,
  },
];

export function buildDemoApplications(center: { lat: number; lng: number }): Application[] {
  return SEEDS.map((s) => {
    const validatedDate = iso(-s.validatedAgo);
    const decidedDate = s.decided ? iso(-Math.max(0, s.validatedAgo - 35)) : null;
    const objectionDeadline = s.decided ? null : deadlineFrom(validatedDate);
    const lat = center.lat + s.dy;
    const lng = center.lng + s.dx;
    const distanceKm = Math.round(Math.hypot(s.dy * 111, s.dx * 70) * 100) / 100;
    return {
      id: s.ref,
      reference: s.ref,
      address: s.address,
      type: s.type,
      state: s.state,
      size: s.size,
      description: s.description,
      applicant: s.applicant,
      agent: s.agent,
      agentCompany: s.agentCompany,
      commentUrl: null,
      docsUrl: null,
      sourceUrl: "https://www.planit.org.uk",
      validatedDate,
      consultedDate: validatedDate,
      decidedDate,
      objectionDeadline,
      lat,
      lng,
      distanceKm,
    };
  }).sort((a, b) => {
    const aOpen = a.objectionDeadline ? 1 : 0;
    const bOpen = b.objectionDeadline ? 1 : 0;
    if (aOpen !== bOpen) return bOpen - aOpen;
    return (b.validatedDate ?? "").localeCompare(a.validatedDate ?? "");
  });
}

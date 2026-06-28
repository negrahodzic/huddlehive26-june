export type Application = {
  id: string;
  reference: string;
  address: string;
  type: string;
  state: string;
  size: string;
  description: string;
  applicant: string | null;
  agent: string | null;
  agentCompany: string | null;
  commentUrl: string | null;
  docsUrl: string | null;
  sourceUrl: string;
  validatedDate: string | null;
  consultedDate: string | null;
  decidedDate: string | null;
  objectionDeadline: string | null;
  lat: number;
  lng: number;
  distanceKm: number;
};

export type PlanningResponse = {
  postcode: string;
  area: string;
  center: { lat: number; lng: number };
  applications: Application[];
  source?: "planit" | "demo";
};

export type Explanation = {
  summary: string;
  whatItIs: string;
  potentialImpacts: string[];
  howToObject: string;
  validGrounds: string[];
};

export type DeveloperCompany = {
  name: string;
  number: string;
  status: string;
  incorporated: string | null;
  address: string | null;
  url: string;
};

export type DeveloperResponse = {
  query: string;
  source: "companies_house" | "demo";
  companies: DeveloperCompany[];
  activeCount: number;
  dissolvedCount: number;
  note?: string;
};

export type Filters = {
  query: string;
  type: string; // "all" or a specific app type
  openOnly: boolean;
};

export type SavedWatch = {
  id: string;
  postcode: string;
  area: string;
  filters: Filters;
  email: string;
  createdAt: number;
};

export type SortKey = "deadline" | "distance" | "recent";

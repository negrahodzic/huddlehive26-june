# Notice

**The digital lamp-post notice that actually reaches you.**

UK planning data is legally public, but practically invisible. When a major building or housing development is proposed next door, the only legally required "public notice" is a piece of paper stapled to a lamp-post — and a strict 21-day countdown to object. Miss the sign, and you're left navigating dozens of confusing council portals written in dense legal jargon. Most residents only find out once the concrete mixers arrive and the deadline has long closed.

Notice takes that buried data and brings it straight to your screen in plain English — so everyday residents, renters, and community groups can see what's being built, understand it, and have their say *in time*.

---

## The problem

It's deceptive openness — the same tactic a bank uses when it hides a fee inside an inflated exchange rate. The information is "technically public," but so inaccessible that civic participation is effectively blocked, skewing the system in favour of deep-pocketed developers with the time and resources to dig through the noise.

## What it does

- **Enter a postcode** — instantly see a live map and list of every active planning application around you, sorted by distance or urgency.
- **Plain-English summaries** — click any project for a clear, AI-generated breakdown of what's being built, how it might affect you (noise, parking, light), and valid grounds for objection.
- **Objection countdown** — a clear visual timer of exactly how many days you have left to comment before the window closes permanently.
- **Who's behind it** — cross-references the application against Companies House so you can see the developer's corporate history and other local projects.
- **Draft an objection** — one click generates a solid starting draft for your letter, grounded strictly in valid planning rules.
- **Smart alerts** — follow an area by email and get updates when a new project pops up nearby.

## How it works

```
Postcode
  → frontend (Next.js / React)
    → /api/planning   → postcodes.io (geocode) + PlanIt (council applications)
    → /api/explain    → Claude (plain-English summary, grounded in the document)
    → /api/developer  → Companies House (corporate background)
    → /api/draft      → objection draft
```

The frontend never talks to third-party APIs or holds keys directly — it calls our own backend API routes, which securely fetch and normalise the data.

## Tech

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Maps:** Leaflet + OpenStreetMap
- **AI layer:** Claude (`claude-opus-4-8`) reads heavy legal documents and formats them into friendly bullet points, with strict instructions so it never invents facts and stays neutral (it informs, it never tells you what to do)
- **Data sources (all free):** PlanIt, postcodes.io, Companies House

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Runs with **no keys** out of the box (uses sample fallbacks for the AI summary and developer panel, so the map is never empty even if the live source is down). For the full experience, add a `.env.local`:

```
ANTHROPIC_API_KEY=...      # plain-English AI summaries        (console.anthropic.com)
COMPANIES_HOUSE_KEY=...    # live developer track record       (developer.company-information.service.gov.uk)
```

API keys are read server-side only and are never exposed to the browser.

### Try these postcodes

`EC2A 3AY` (Shoreditch) · `SW1A 1AA` · `M1 1AE` · `BS1 4DJ`

## Project structure

```
app/
  page.tsx              # postcode search, map, list, detail
  alerts/page.tsx       # saved alerts (email = identity)
  api/planning          # geocode → PlanIt → normalised applications + objection deadlines
  api/explain           # Claude: application → plain English + impact + how to object
  api/developer         # Companies House cross-reference
  api/draft             # objection draft
  components/           # map, cards, detail panel, developer panel, alerts, etc.
lib/
  planit.ts             # normalisation, status colours, deadline + sort helpers
  anthropic.ts          # AI client, system prompt, structured output schema
  demoData.ts           # representative fallback data when the live source is unavailable
  types.ts              # shared types
```

## Monetization

The platform stays **free for residents** checking their own streets, sustained by a freemium model:

- **Free (citizens):** unlimited browsing, live map, core AI summaries, one active email alert.
- **Premium (multi-property):** monthly subscription for multiple location alerts — landlords, community leads, home-buyers tracking several areas.
- **Pro (professionals):** unlimited watch zones, deeper AI analysis, and portfolio management tools.

## Next steps

- **Live triggers** — a nightly automated check that emails users when a local deadline changes or a new project is submitted.
- **Visual timelines** — interactive charts showing where a project stands in the council approval process.
- **Pro dashboard** — historical-trend analysis and multi-area portfolio tools for property professionals, keeping the core app free for residents.

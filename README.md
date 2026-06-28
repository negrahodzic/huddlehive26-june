# Notice

**The planning notice that actually reaches you.**

Planning applications are public — but buried across council portals in legalese, with an objection deadline nobody tells you. Notice takes that scattered public data and makes it usable: enter a postcode → see what's being built near you, what it means in plain English, how long you've got to object, and who's behind it.

Built for the Wise "transparency" hackathon (the FOI/government-data category: *make data that's technically public actually usable*).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

Works with **no keys** (uses demo fallbacks for the AI summary and developer panel). For the full experience add to `.env.local`:

```
ANTHROPIC_API_KEY=...      # plain-English AI summaries (console.anthropic.com)
COMPANIES_HOUSE_KEY=...    # live developer track record (free, developer.company-information.service.gov.uk)
```

## Demo postcodes

`SW1A 1AA` · `EC2A 3AY` (Shoreditch, busy) · `M1 1AE` · `BS1 4DJ`

## Demo flow (~90s)

1. Enter a postcode → map + feed of **real live applications** populate.
2. Open a card → **plain-English summary + how it could affect you + a live deadline countdown**.
3. Scroll the detail → **"Who's behind it"**: Companies House cross-ref + other nearby applications by the same applicant/agent.
4. **"Watch this street"** → alerts so you never miss the objection window again.

## The moat (why it isn't just ChatGPT)

- **Live, scattered data aggregated** — PlanIt + postcodes.io, unified. ChatGPT can't query these.
- **Cross-referencing official registers** — Companies House developer track record.
- **Monitoring over time** — watch a street, get alerted (the retention loop).
- AI only does the *translation* (dense docs → "what this does to you"), grounded strictly in the published application — it never invents facts or tells you how to act.

## Stack

Next.js 16 (App Router) · Tailwind v4 · Leaflet/OpenStreetMap · Claude (`claude-opus-4-8`).
Data: PlanIt, postcodes.io, Companies House — all free.

## Files

- `app/api/planning` — postcode → geocode → PlanIt → normalised applications + estimated objection deadlines (`lib/planit.ts`)
- `app/api/explain` — Claude turns an application into plain English + impact + how-to-object (`lib/anthropic.ts`)
- `app/api/developer` — Companies House cross-ref
- `app/page.tsx` + `app/components/*` — map, feed, detail panel, developer panel, watch-street

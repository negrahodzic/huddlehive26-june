import { NextRequest } from "next/server";
import {
  anthropic,
  hasAnthropicKey,
  MODEL,
  EXPLAIN_SYSTEM,
  EXPLAIN_SCHEMA,
} from "@/lib/anthropic";
import type { Application, Explanation } from "@/lib/types";

export const runtime = "nodejs";

// Cache identical applications for the session so repeated clicks are instant
// and we don't re-bill the model. In production this would be a shared store.
const cache = new Map<string, Explanation>();

function fallback(app: Application): Explanation {
  return {
    summary: `${app.type} at ${app.address}.`,
    whatItIs: app.description,
    potentialImpacts: [
      "Effects depend on how close you live and your line of sight.",
      "Possible changes to light, outlook, parking, noise or local character during and after works.",
    ],
    howToObject: app.commentUrl
      ? "You can comment via the council's planning portal — use the 'comment on this application' link."
      : "Search this reference on your council's planning portal to comment.",
    validGrounds: [
      "Overshadowing / loss of light",
      "Overlooking / loss of privacy",
      "Parking and highway safety",
      "Scale, design and character",
    ],
  };
}

export async function POST(req: NextRequest) {
  const app = (await req.json()) as Application;
  if (!app?.id) return Response.json({ error: "Invalid application" }, { status: 400 });

  if (cache.has(app.id)) return Response.json(cache.get(app.id));

  if (!hasAnthropicKey()) {
    const fb = fallback(app);
    return Response.json({ ...fb, _demo: true });
  }

  const userText = `Explain this UK planning application to a resident.

Reference: ${app.reference}
Type: ${app.type}
Status: ${app.state}
Address: ${app.address}
Validated: ${app.validatedDate ?? "unknown"}
Objection deadline (estimated): ${app.objectionDeadline ?? "window may be closed"}
Applicant: ${app.applicant ?? app.agentCompany ?? "not listed"}

Description:
${app.description}`;

  try {
    const res = await anthropic().messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: EXPLAIN_SYSTEM,
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: EXPLAIN_SCHEMA },
      },
      messages: [{ role: "user", content: userText }],
    });
    const text = res.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") throw new Error("no text block");
    const data = JSON.parse(text.text) as Explanation;
    cache.set(app.id, data);
    return Response.json(data);
  } catch (err) {
    console.error("explain error", err);
    return Response.json({ ...fallback(app), _demo: true });
  }
}

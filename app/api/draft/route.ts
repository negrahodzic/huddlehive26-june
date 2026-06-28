import { NextRequest } from "next/server";
import { anthropic, hasAnthropicKey, MODEL } from "@/lib/anthropic";
import type { Application } from "@/lib/types";

export const runtime = "nodejs";

const SYSTEM = `You help a UK resident write a planning objection letter.

Rules:
- Write a concise, polite, formal objection (~150-220 words).
- Use ONLY valid material planning considerations (e.g. overshadowing / loss of light, overlooking / loss of privacy, parking and highway safety, noise and disturbance, scale / design / character, loss of trees or green space). Ignore non-material points (e.g. property value, who the applicant is).
- Ground it strictly in the proposal details and the resident's stated concern. Do NOT invent facts about the proposal.
- Address it "Dear Planning Officer", reference the application by its reference and address, and use placeholders [Your name] and [Your address].
- Be firm but respectful. No legal threats. Plain text only — no markdown.`;

function template(app: Application, grounds: string[], concern: string): string {
  const groundsLine = grounds.length
    ? grounds.join(", ").toLowerCase()
    : "overshadowing, loss of privacy, parking and noise";
  return `Dear Planning Officer,

Re: Objection to application ${app.reference} — ${app.address}

I am writing as a local resident to object to the above application (${app.type}).

${concern ? concern.trim() + "\n\n" : ""}My objection is based on the following material planning considerations: ${groundsLine}. The proposal would, in my view, have an adverse impact on neighbouring amenity and the character of the area, and I do not consider these effects to have been adequately addressed.

I would be grateful if these concerns were taken into account in the determination of this application.

Yours faithfully,
[Your name]
[Your address]`;
}

export async function POST(req: NextRequest) {
  const { app, grounds = [], concern = "" } = (await req.json()) as {
    app: Application;
    grounds: string[];
    concern: string;
  };
  if (!app?.id) return Response.json({ error: "Invalid application" }, { status: 400 });

  if (!hasAnthropicKey()) {
    return Response.json({ letter: template(app, grounds, concern), _demo: true });
  }

  const userText = `Draft a planning objection.

Application reference: ${app.reference}
Type: ${app.type}
Address: ${app.address}
Proposal: ${app.description}

Grounds the resident wants to rely on: ${grounds.join(", ") || "(none specified — choose the relevant ones)"}
Resident's own concern (optional, in their words): ${concern || "(none provided)"}`;

  try {
    const res = await anthropic().messages.create({
      model: MODEL,
      max_tokens: 900,
      system: SYSTEM,
      output_config: { effort: "low" },
      messages: [{ role: "user", content: userText }],
    });
    const text = res.content.find((b) => b.type === "text");
    const letter = text && text.type === "text" ? text.text : template(app, grounds, concern);
    return Response.json({ letter });
  } catch (err) {
    console.error("draft error", err);
    return Response.json({ letter: template(app, grounds, concern), _demo: true });
  }
}

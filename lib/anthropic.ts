import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-4-8";

export const hasAnthropicKey = () => Boolean(process.env.ANTHROPIC_API_KEY);

export const anthropic = () =>
  new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const EXPLAIN_SYSTEM = `You are a neutral civic assistant that explains UK planning applications to ordinary residents.

Rules:
- Use ONLY the details supplied in the application. Never invent facts, figures, or addresses.
- Plain English. No jargon. A busy resident should understand it in seconds.
- Be strictly neutral and informative. Describe what is proposed and how it COULD affect a neighbour. Never tell the user whether to support or object.
- Frame all neighbour effects as "potential", because impact depends on the resident's exact location.
- "validGrounds" must list only material planning considerations that are genuinely relevant to THIS proposal (e.g. overshadowing/loss of light, overlooking/privacy, parking and traffic, noise, scale and design, loss of trees/green space). Omit anything not relevant.
- If the description is too sparse to judge, say so honestly rather than guessing.`;

export const EXPLAIN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", description: "One plain-English sentence: what is being proposed." },
    whatItIs: { type: "string", description: "2-3 sentences expanding on what the application actually involves." },
    potentialImpacts: {
      type: "array",
      items: { type: "string" },
      description: "Short bullet points of how this could potentially affect a nearby resident.",
    },
    howToObject: { type: "string", description: "One or two sentences on how and by when a resident can comment, in plain English." },
    validGrounds: {
      type: "array",
      items: { type: "string" },
      description: "Material planning considerations relevant to this proposal.",
    },
  },
  required: ["summary", "whatItIs", "potentialImpacts", "howToObject", "validGrounds"],
} as const;

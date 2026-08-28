export type AiMode = "deepseek" | "fallback";
export type FallbackReason = "MISSING_API_KEY" | "UPSTREAM_TIMEOUT" | "UPSTREAM_ERROR" | "INVALID_MODEL_OUTPUT";

export interface BreakdownInput {
  version: { id: string; label: string };
  scene: { id: string; heading: string; text: string };
  existingEntities: Array<{ id: string; taxonomy: string; canonicalName: string; aliases: string[] }>;
}

export interface BreakdownResult {
  mode: AiMode;
  reason?: FallbackReason;
  requestId: string;
  suggestions: unknown[];
}

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export class AiClientError extends Error {
  readonly code: "ABORTED" | "NETWORK_ERROR" | "HTTP_ERROR" | "INVALID_RESPONSE";
  readonly status?: number;

  constructor(code: "ABORTED" | "NETWORK_ERROR" | "HTTP_ERROR" | "INVALID_RESPONSE", status?: number) {
    super(code);
    this.name = "AiClientError";
    this.code = code;
    this.status = status;
  }
}

const reasons = new Set<FallbackReason>(["MISSING_API_KEY", "UPSTREAM_TIMEOUT", "UPSTREAM_ERROR", "INVALID_MODEL_OUTPUT"]);

function valid(value: unknown): value is BreakdownResult {
  if (!value || typeof value !== "object") return false;
  const response = value as Partial<BreakdownResult>;
  return (response.mode === "deepseek" || response.mode === "fallback")
    && typeof response.requestId === "string" && response.requestId.length > 0
    && Array.isArray(response.suggestions)
    && (response.mode !== "fallback" || reasons.has(response.reason as FallbackReason));
}

export async function requestBreakdown(input: BreakdownInput, fetchImpl: FetchLike = fetch): Promise<BreakdownResult> {
  let response: Response;
  try {
    response = await fetchImpl("/api/ai/breakdown", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch (error) {
    throw new AiClientError(error instanceof DOMException && error.name === "AbortError" ? "ABORTED" : "NETWORK_ERROR");
  }
  if (!response.ok) throw new AiClientError("HTTP_ERROR", response.status);
  let payload: unknown;
  try { payload = await response.json(); } catch { throw new AiClientError("INVALID_RESPONSE"); }
  if (!valid(payload)) throw new AiClientError("INVALID_RESPONSE");
  return payload;
}

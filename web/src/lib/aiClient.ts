export type AiMode = "deepseek" | "fallback";
export type FallbackReason = "MISSING_API_KEY" | "UPSTREAM_TIMEOUT" | "UPSTREAM_ERROR" | "INVALID_MODEL_OUTPUT";
export type ProductionTaxonomy = "character" | "cast" | "location" | "set" | "prop" | "costume" | "makeup_hair" | "vehicle" | "animal" | "vfx" | "sfx" | "stunt" | "sound" | "wardrobe" | "art" | "camera" | "lighting" | "other";
export type EvidenceKind = "explicit" | "inferred";
export type Confidence = "high" | "medium" | "low";

export interface BreakdownInput {
  version: { id: string; label: string };
  scene: { id: string; heading: string; text: string };
  existingEntities: Array<{ id: string; taxonomy: ProductionTaxonomy; canonicalName: string; aliases: string[] }>;
}

export interface BreakdownEvidence {
  quote: string;
  kind: EvidenceKind;
  range: { start: number; end: number };
  rationale?: string;
}

export interface BreakdownSuggestion {
  taxonomy: ProductionTaxonomy;
  taxonomyNote?: string;
  label: string;
  description?: string;
  evidenceKind: EvidenceKind;
  confidence: Confidence;
  proposedEntityId?: string;
  evidence: BreakdownEvidence[];
}

export interface BreakdownResult {
  mode: AiMode;
  reason?: FallbackReason;
  requestId: string;
  suggestions: BreakdownSuggestion[];
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
const taxonomies = new Set<ProductionTaxonomy>(["character", "cast", "location", "set", "prop", "costume", "makeup_hair", "vehicle", "animal", "vfx", "sfx", "stunt", "sound", "wardrobe", "art", "camera", "lighting", "other"]);
const kinds = new Set<EvidenceKind>(["explicit", "inferred"]);
const confidence = new Set<Confidence>(["high", "medium", "low"]);
const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

function validSuggestion(value: unknown, sceneText: string): value is BreakdownSuggestion {
  if (!value || typeof value !== "object") return false;
  const suggestion = value as Partial<BreakdownSuggestion>;
  if (!taxonomies.has(suggestion.taxonomy as ProductionTaxonomy) || !text(suggestion.label) || !kinds.has(suggestion.evidenceKind as EvidenceKind) || !confidence.has(suggestion.confidence as Confidence) || !Array.isArray(suggestion.evidence) || !suggestion.evidence.length) return false;
  if (suggestion.taxonomy === "other" && !text(suggestion.taxonomyNote)) return false;
  if (suggestion.description !== undefined && !text(suggestion.description)) return false;
  if (suggestion.proposedEntityId !== undefined && !text(suggestion.proposedEntityId)) return false;
  return suggestion.evidence.every((item) => {
    if (!item || typeof item !== "object") return false;
    const evidence = item as Partial<BreakdownEvidence>;
    if (!text(evidence.quote) || evidence.kind !== suggestion.evidenceKind) return false;
    const start = sceneText.indexOf(evidence.quote);
    if (!evidence.range || start < 0 || !Number.isInteger(evidence.range.start) || !Number.isInteger(evidence.range.end) || evidence.range.start !== start || evidence.range.end !== start + evidence.quote.length) return false;
    return suggestion.evidenceKind !== "inferred" || text(evidence.rationale);
  });
}

function valid(value: unknown, sceneText: string): value is BreakdownResult {
  if (!value || typeof value !== "object") return false;
  const response = value as Partial<BreakdownResult>;
  return (response.mode === "deepseek" || response.mode === "fallback")
    && typeof response.requestId === "string" && response.requestId.length > 0
    && Array.isArray(response.suggestions) && response.suggestions.every((suggestion) => validSuggestion(suggestion, sceneText))
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
  if (!valid(payload, input.scene.text)) throw new AiClientError("INVALID_RESPONSE");
  return payload;
}

export type SceneWorkflowState = "queued" | "preparing" | "requesting" | "review_ready" | "fallback_ready" | "failed" | "cancelled";
export type WorkflowSummary = "completed" | "partial_fallback" | "failed" | "cancelled";

export interface SceneWorkflowProgress {
  versionId: string;
  sceneId: string;
  state: SceneWorkflowState;
}

export interface SceneWorkflowRecord {
  versionId: string;
  sceneId: string;
  state: "review_ready" | "fallback_ready" | "failed";
  mode: AiMode | null;
  reason: FallbackReason | null;
  requestId: string | null;
  suggestionCount: number;
  suggestions: BreakdownSuggestion[];
  error?: AiClientError["code"];
}

export interface SceneWorkflowOptions {
  fetchImpl?: FetchLike;
  onProgress?: (progress: SceneWorkflowProgress) => void;
  isCancelled?: () => boolean;
}

export interface SceneWorkflowResult {
  summary: WorkflowSummary;
  records: SceneWorkflowRecord[];
}

export async function processVersionScenes(
  version: BreakdownInput["version"],
  scenes: BreakdownInput["scene"][],
  existingEntities: BreakdownInput["existingEntities"],
  { fetchImpl, onProgress, isCancelled }: SceneWorkflowOptions = {},
): Promise<SceneWorkflowResult> {
  const records: SceneWorkflowRecord[] = [];
  const progress = (sceneId: string, state: SceneWorkflowState) => onProgress?.({ versionId: version.id, sceneId, state });
  let cancelled = false;
  for (const scene of scenes) {
    if (isCancelled?.()) { progress(scene.id, "cancelled"); cancelled = true; break; }
    progress(scene.id, "queued");
    progress(scene.id, "preparing");
    progress(scene.id, "requesting");
    try {
      const result = await requestBreakdown({ version, scene, existingEntities }, fetchImpl);
      const state = result.mode === "fallback" ? "fallback_ready" : "review_ready";
      progress(scene.id, state);
      records.push({ versionId: version.id, sceneId: scene.id, state, mode: result.mode, reason: result.reason ?? null, requestId: result.requestId, suggestionCount: result.suggestions.length, suggestions: result.suggestions });
    } catch (error) {
      progress(scene.id, "failed");
      records.push({ versionId: version.id, sceneId: scene.id, state: "failed", mode: null, reason: null, requestId: null, suggestionCount: 0, suggestions: [], error: error instanceof AiClientError ? error.code : "NETWORK_ERROR" });
    }
  }
  if (cancelled) return { summary: "cancelled", records };
  if (records.some((record) => record.state === "failed")) return { summary: "failed", records };
  if (records.some((record) => record.mode === "fallback")) return { summary: "partial_fallback", records };
  return { summary: "completed", records };
}

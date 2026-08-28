import type { AiMode, FallbackReason } from "./aiClient";

type ReviewRecord = { mode: AiMode | null; reason: FallbackReason | null };

/**
 * The fixture is the deterministic review baseline for its own units when the
 * upstream endpoint falls back. Local imports have no such baseline.
 */
export function fallbackFixtureSuggestions<T>(record: ReviewRecord, isFormalFixtureScene: boolean, suggestions: T[]): Array<T & { mode: "fallback"; reason?: FallbackReason }> | null {
  if (record.mode !== "fallback" || !isFormalFixtureScene) return null;
  return suggestions.map((suggestion) => ({ ...suggestion, mode: "fallback", ...(record.reason ? { reason: record.reason } : {}) }));
}

export function reviewSuggestionCount<T>(record: ReviewRecord, isFormalFixtureScene: boolean, suggestions: T[], apiSuggestionCount: number) {
  return fallbackFixtureSuggestions(record, isFormalFixtureScene, suggestions)?.length ?? apiSuggestionCount;
}

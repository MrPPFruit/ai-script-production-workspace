export type SuggestionStatus = "pending" | "created" | "merged" | "deferred" | "adopted";
export type EntityRelation = "stable" | "needs-review" | "split" | "kept";

export interface Scene { id: string; versionId: string; sampleIndex: number; title: string; sourceAct?: string; sourceScene?: string; sourceUrl?: string; sourceLocator?: string; text: string; fullTextRange?: { start: number; end: number }; isDemoAdaptation: boolean; }
export type ProcessingState = "waiting" | "queued" | "preparing" | "requesting" | "review_ready" | "fallback_ready" | "failed" | "cancelled";
export interface SceneProcessing { state: ProcessingState; mode: "deepseek" | "fallback" | null; reason: string | null; suggestionCount: number; }
export interface Suggestion { id: string; type: string; taxonomy: string; source: string; sourceRange: { start: number; end: number }; value: string; detail: string; sourceSceneId: string; mergeTargetId?: string; status: SuggestionStatus; mode: "deepseek" | "fallback" | "fixture"; reason?: string; }
export interface ProductionEntity { id: string; name: string; kind: string; taxonomy: string; metadata: string; sourceSceneIds: string[]; relation: EntityRelation; taskMaterialReady: boolean; }
export interface TaskRow { id: string; entityId: string; department: string; task: string; sourceSceneIds: string[]; content: string; priority: "高" | "中"; done: boolean; versionLabel: string; }
export interface VersionOption { id: string; label: string; isDemoAdaptation: boolean; }
export interface VersionImpact { id: string; sceneId: string; entityId: string; taskDraftIds: string[]; summary: string; status: "pending" | "kept" | "merged" | "created_new" | "dismissed"; }
export interface ImportedScene { id: string; sampleIndex: number; title: string; text: string; }

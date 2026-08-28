export type SuggestionStatus = "pending" | "created" | "merged" | "deferred";
export type EntityKind = "场景" | "道具" | "视觉特效";

export interface Scene { id: number; sampleIndex: number; title: string; productionLabel: string; version: string; updated: boolean; }
export interface Suggestion {
  id: number;
  type: EntityKind;
  source: string;
  value: string;
  detail: string;
  sourceSampleIndex: number;
  mergeTargetId: string;
  status: SuggestionStatus;
}
export interface ProductionEntity {
  id: string;
  name: string;
  kind: EntityKind;
  metadata: string;
  sourceSampleIndices: number[];
  relation: "stable" | "needs-review" | "split" | "kept";
  taskMaterialReady: boolean;
}
export interface TaskRow {
  id: string;
  entityId: string;
  department: string;
  task: string;
  sourceSampleIndices: number[];
  content: string;
  priority: "高" | "中";
  done: boolean;
}

import fixture from "../../fixtures/default-script.json";
import v1Markdown from "../../fixtures/default-script-v1.md?raw";
import type { ProductionEntity, Scene, Suggestion, TaskRow, VersionImpact, VersionOption } from "./types";

type RawScene = { id: string; versionId: string; ordinal: number; heading: string; text: string };
type RawEvidence = { id: string; sceneId: string; quote: string; kind: "explicit" | "inferred"; rationale?: string };
type RawSuggestion = { id: string; sceneId: string; taxonomy: string; label: string; evidenceIds: string[]; status: string; description?: string; proposedEntityId?: string };
type RawEntity = { id: string; taxonomy: string; canonicalName: string; aliases: string[]; sceneRefs: Array<{ sceneId: string }> };
type RawTask = { id: string; entityId: string; department: string; title: string; instructions: string; createdFrom: { sceneId: string }; contextSnapshot: { versionLabel: string } };
type RawVersion = { id: string; label: string; scenes: RawScene[] };
type RawFixture = { versions: RawVersion[]; sceneMetadata: Record<string, { sampleNumber: number; sourceAct?: string; sourceScene?: string; sourceUrl?: string; sourceLocator?: string; authority?: string }>; sourceEvidence: RawEvidence[]; suggestions: RawSuggestion[]; entities: RawEntity[]; taskDrafts: RawTask[]; versionImpacts: Array<Omit<VersionImpact, "status"> & { status: string }> };

export const formalFixture = fixture as RawFixture;
const evidenceById = new Map(formalFixture.sourceEvidence.map((item) => [item.id, item]));
const englishBlocks = [...v1Markdown.matchAll(/## \d+\. ACT[^\n]*\n\n### English source excerpt \(public domain\)\n\n([\s\S]*?)\n\n### 简体中文对照/g)].map((match) => match[1].trim());
export const versionOptions: VersionOption[] = formalFixture.versions.map((version) => ({ id: version.id, label: version.label, isDemoAdaptation: version.id === "version-v2" }));

export function scenesForVersion(versionId: string): Scene[] {
  const version = formalFixture.versions.find((item) => item.id === versionId);
  if (!version) return [];
  return version.scenes.map((scene, index) => {
    const metadata = formalFixture.sceneMetadata[scene.id] ?? { sampleNumber: index + 1 };
    return { id: scene.id, versionId, sampleIndex: metadata.sampleNumber, title: scene.heading, sourceAct: metadata.sourceAct, sourceScene: metadata.sourceScene, sourceUrl: metadata.sourceUrl, sourceLocator: metadata.sourceLocator, text: scene.text, englishExcerpt: versionId === "version-v1" ? englishBlocks[index] : undefined, isDemoAdaptation: metadata.authority === "demo-production-adaptation" };
  });
}

export function suggestionsForScene(sceneId: string): Suggestion[] {
  return formalFixture.suggestions.filter((item) => item.sceneId === sceneId).map((item) => {
    const evidence = evidenceById.get(item.evidenceIds[0]);
    return { id: item.id, type: taxonomyLabel(item.taxonomy), taxonomy: item.taxonomy, source: evidence?.quote ?? "来源证据待核对", value: item.label, detail: evidence?.rationale ?? item.description ?? (evidence?.kind === "explicit" ? "原文直接支持，仍需人工决定是否采用。" : "需要人工补充制作判断。"), sourceSceneId: item.sceneId, mergeTargetId: item.proposedEntityId, status: item.status === "accepted" ? "adopted" : "pending" };
  });
}

export const taxonomyLabel = (value: string) => ({ character: "角色", vehicle: "载具", prop: "道具", costume: "服化", vfx: "视觉特效", sfx: "特技效果", sound: "声音", lighting: "灯光", set: "场景", location: "场地" }[value] ?? value);

export const seedEntities: ProductionEntity[] = formalFixture.entities.map((item) => ({ id: item.id, name: item.canonicalName, kind: taxonomyLabel(item.taxonomy), metadata: `规范类型：${item.taxonomy}${item.aliases.length ? ` · 别名：${item.aliases.join("、")}` : ""}`, sourceSceneIds: item.sceneRefs.map((ref) => ref.sceneId), relation: formalFixture.versionImpacts.some((impact) => impact.entityId === item.id && impact.status === "pending") ? "needs-review" : "stable", taskMaterialReady: formalFixture.taskDrafts.some((task) => task.entityId === item.id) }));
export const seedTasks: TaskRow[] = formalFixture.taskDrafts.map((item) => ({ id: item.id, entityId: item.entityId, department: item.department, task: item.title, sourceSceneIds: [item.createdFrom.sceneId], content: item.instructions, priority: item.department === "vfx" ? "高" : "中", done: false, versionLabel: item.contextSnapshot.versionLabel }));
export const seedImpacts: VersionImpact[] = formalFixture.versionImpacts.map((item) => ({ ...item, status: item.status as VersionImpact["status"] }));

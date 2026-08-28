import type { ProductionEntity, Scene, Suggestion, TaskRow } from "./types";

export const scenes: Scene[] = [
  { id: 12, sampleIndex: 1, title: "外景 · 码头 · 夜", productionLabel: "样本第 1 项", version: "V2 · 已更新", updated: true },
  { id: 13, sampleIndex: 2, title: "内景 · 旧仓库 · 夜", productionLabel: "样本第 2 项", version: "V2 · 已更新", updated: true },
  { id: 14, sampleIndex: 4, title: "外景 · 防波堤 · 黎明", productionLabel: "样本第 4 项", version: "V2 · 已更新", updated: true },
];

export const seedSuggestions: Suggestion[] = [
  { id: 1, type: "场景", source: "仓库内部昏暗。高大的空间里回荡着水滴落下的声音。", value: "旧仓库 · 夜 · 内部", detail: "可创建为稳定场景实体，或并入已有“旧仓库内部”。", sourceSampleIndex: 2, mergeTargetId: "warehouse", status: "pending" },
  { id: 2, type: "道具", source: "右侧是一扇锈蚀的卷帘门，门缝下透出一线冷风。", value: "锈蚀的卷帘门（右侧）", detail: "把关键道具与空间方位交给置景主管。", sourceSampleIndex: 2, mergeTargetId: "door", status: "pending" },
  { id: 3, type: "视觉特效", source: "远处，隐约传来货轮汽笛的声音，由远及近，又被风声带走。", value: "货轮汽笛（远处，环境音效）", detail: "保留距离与运动方向，供声音部门评估。", sourceSampleIndex: 2, mergeTargetId: "sound", status: "pending" },
];

export const seedEntities: ProductionEntity[] = [
  { id: "warehouse", name: "旧仓库内部", kind: "场景", metadata: "内景 · 夜 · 置景", sourceSampleIndices: [2], relation: "stable", taskMaterialReady: true },
  { id: "door", name: "锈蚀的卷帘门", kind: "道具", metadata: "右侧 · 实体道具", sourceSampleIndices: [2], relation: "stable", taskMaterialReady: true },
  { id: "sound", name: "货轮汽笛", kind: "视觉特效", metadata: "远处 · 环境音", sourceSampleIndices: [2, 4], relation: "needs-review", taskMaterialReady: false },
];

export const seedTasks: TaskRow[] = [
  { id: "warehouse-task", entityId: "warehouse", department: "美术组", task: "场景搭建", sourceSampleIndices: [2], content: "旧仓库内部，场景搭建材料", priority: "高", done: false },
  { id: "door-task", entityId: "door", department: "美术组", task: "道具准备", sourceSampleIndices: [2], content: "锈蚀的卷帘门，制作/布置材料", priority: "中", done: false },
];

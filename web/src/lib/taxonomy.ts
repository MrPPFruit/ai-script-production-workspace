const labels: Record<string, string> = {
  character: "角色", cast: "人物关系", location: "场地", set: "场景", prop: "道具",
  costume: "服装", wardrobe: "服装", makeup_hair: "妆发", vehicle: "载具", animal: "动物",
  vfx: "视觉特效", sfx: "现场特效", stunt: "动作特技", sound: "声音", art: "美术",
  camera: "摄影", lighting: "灯光", other: "待分类",
};

export const taxonomyLabel = (taxonomy: string) => labels[taxonomy] ?? "待分类";
export const taxonomyDescription = (taxonomy: string) => taxonomy === "other" ? "尚未归入标准制作分类，需人工调整。" : undefined;

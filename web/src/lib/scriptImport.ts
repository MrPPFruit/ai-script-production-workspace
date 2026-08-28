import type { ImportedScene } from "../types";
export const TEXT_LIMIT = 12_000;
export type ImportResult = { ok: true; scenes: ImportedScene[] } | { ok: false; error: string };
export function parseLocalScript(raw: string): ImportResult {
  const text = raw.replace(/^\uFEFF/, "").trim();
  if (!text) return { ok: false, error: "请输入或选择包含文本的 UTF-8 .txt 文件。" };
  if (text.length > TEXT_LIMIT) return { ok: false, error: `文本超过 ${TEXT_LIMIT.toLocaleString()} 字符上限，请先缩短后导入。` };
  const chunks = [...text.matchAll(/^(\d+\.\s*(?:ACT|第).*?)$/gm)];
  const scenes = chunks.length ? chunks.map((match, index) => ({ id: `local-${index + 1}`, sampleIndex: index + 1, title: match[1].trim(), text: text.slice(match.index! + match[0].length, chunks[index + 1]?.index ?? text.length).trim() })).filter((scene) => scene.text) : [{ id: "local-1", sampleIndex: 1, title: "本地导入文本", text }];
  return scenes.length ? { ok: true, scenes } : { ok: false, error: "未识别到可导入的场次正文。" };
}

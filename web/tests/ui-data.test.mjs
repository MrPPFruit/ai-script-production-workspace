import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const fixture = JSON.parse(readFileSync(new URL("../../fixtures/default-script.json", import.meta.url), "utf8"));

test("建议证据保留 fixture 中的精确字符范围，供阅读区逐字定位", () => {
  const scenes = new Map(fixture.versions.flatMap((version) => version.scenes).map((scene) => [scene.id, scene]));
  const evidence = new Map(fixture.sourceEvidence.map((item) => [item.id, item]));
  for (const suggestion of fixture.suggestions) {
    const scene = scenes.get(suggestion.sceneId);
    assert.ok(scene, `${suggestion.id} 应关联一个场次`);
    for (const evidenceId of suggestion.evidenceIds) {
      const source = evidence.get(evidenceId);
      assert.ok(source, `${suggestion.id} 应关联一条证据`);
      const { start, end } = source.range;
      assert.ok(start >= 0 && end > start, `${suggestion.id} 应有有效字符范围`);
      assert.equal(scene.text.slice(start, end), source.quote, `${suggestion.id} 的证据范围必须精确匹配原文`);
    }
  }
});

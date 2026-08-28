import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const fixtureUrl = new URL("../../fixtures/default-script.json", import.meta.url);
const textUrl = new URL("../../fixtures/default-script.txt", import.meta.url);

test("TXT 导入样本与雷雨 V1 全文、处理单元和证据范围一致", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const text = await readFile(textUrl, "utf8");
  const versions = new Map(fixture.versions.map((version) => [version.id, version]));
  const v1 = versions.get("version-v1");
  const v2 = versions.get("version-v2");

  assert.ok(v1);
  assert.ok(v2);
  assert.equal(fixture.metadata.work.contentScope, "来源页标为“第四幕4”的终局连续片段");
  assert.equal(text.includes("\r"), false, "TXT 必须使用 UTF-8/LF 文本");
  assert.equal(text, `${v1.fullText}\n`, "TXT 只能比 fullText 多一个标准文件结尾换行");
  assert.equal(v1.scenes.length, 3);
  assert.equal(v2.scenes.length, 4);
  assert.equal(v2.fullText, v1.fullText, "V2 只允许改变处理单元边界");

  const sceneById = new Map();
  for (const version of fixture.versions) {
    const ordered = [...version.scenes].sort((a, b) => a.ordinal - b.ordinal);
    assert.equal(ordered.map((scene) => scene.text).join(""), version.fullText);
    assert.equal(ordered[0].fullTextRange.start, 0);
    assert.equal(ordered.at(-1).fullTextRange.end, version.fullText.length);

    ordered.forEach((scene, index) => {
      sceneById.set(scene.id, scene);
      assert.equal(scene.text, version.fullText.slice(scene.fullTextRange.start, scene.fullTextRange.end));
      assert.deepEqual(scene.sourceRange, scene.fullTextRange);
      assert.ok(scene.text.length <= 12_000);
      if (index > 0) {
        assert.equal(ordered[index - 1].fullTextRange.end, scene.fullTextRange.start);
      }
    });
  }

  for (const evidence of fixture.sourceEvidence) {
    const scene = sceneById.get(evidence.sceneId);
    const version = versions.get(evidence.versionId);
    assert.ok(scene, `缺少处理单元：${evidence.sceneId}`);
    assert.ok(version, `缺少版本：${evidence.versionId}`);
    assert.equal(scene.text.slice(evidence.range.start, evidence.range.end), evidence.quote);
    assert.equal(version.fullText.slice(evidence.fullTextRange.start, evidence.fullTextRange.end), evidence.quote);
    assert.equal(evidence.fullTextRange.start, scene.fullTextRange.start + evidence.range.start);
  }
});


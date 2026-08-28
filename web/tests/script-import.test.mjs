import assert from "node:assert/strict";
import test from "node:test";
import { parseLocalScript, TEXT_LIMIT } from "../src/lib/scriptImport.ts";

test("按场次标题切分本地纯文本，不改变文本内容", () => {
  const result = parseLocalScript("\uFEFF1. ACT I, SCENE I — 船上\n风暴。\n\n2. ACT I, SCENE II — 岛上\n米兰达在场。\n");
  assert.equal(result.ok, true);
  assert.equal(result.scenes.length, 2);
  assert.equal(result.scenes[0].title, "1. ACT I, SCENE I — 船上");
  assert.equal(result.scenes[1].text, "米兰达在场。");
});

test("空文本与超限文本在本地明确失败", () => {
  const empty = parseLocalScript("   \n");
  assert.equal(empty.ok, false);
  if (!empty.ok) assert.match(empty.error, /请输入/);

  const tooLong = parseLocalScript("a".repeat(TEXT_LIMIT + 1));
  assert.equal(tooLong.ok, false);
  if (!tooLong.ok) assert.match(tooLong.error, /上限/);
});

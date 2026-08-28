import assert from "node:assert/strict";
import test from "node:test";
import { processVersionScenes } from "../src/lib/aiClient.ts";

const version = { id: "v2", label: "V2" };
const scenes = [
  { id: "s1", heading: "外景", text: "暴风雨掠过码头。" },
  { id: "s2", heading: "内景", text: "仓库卷帘门锈蚀。" },
];
const deepseek = (requestId) => Response.json({ mode: "deepseek", requestId, suggestions: [{ taxonomy: "location", label: "码头", evidenceKind: "explicit", confidence: "high", evidence: [{ quote: "码头", kind: "explicit" }] }] });
const fallback = (requestId) => Response.json({ mode: "fallback", reason: "MISSING_API_KEY", requestId, suggestions: [{ taxonomy: "other", taxonomyNote: "演示", label: "人工审阅", evidenceKind: "explicit", confidence: "low", evidence: [{ quote: "暴风雨", kind: "explicit" }] }] });

test("严格按场次顺序请求，并记录部分 fallback", async () => {
  const calls = [];
  const states = [];
  const result = await processVersionScenes(version, scenes, [], {
    fetchImpl: async (_url, init) => {
      calls.push(JSON.parse(init.body).scene.id);
      return calls.length === 1 ? deepseek("r1") : fallback("r2");
    },
    onProgress: (event) => states.push(`${event.sceneId}:${event.state}`),
  });
  assert.deepEqual(calls, ["s1", "s2"]);
  assert.deepEqual(states, ["s1:queued", "s1:preparing", "s1:requesting", "s1:review_ready", "s2:queued", "s2:preparing", "s2:requesting", "s2:fallback_ready"]);
  assert.equal(result.summary, "partial_fallback");
  assert.deepEqual(result.records.map(({ sceneId, mode, reason, requestId, suggestionCount }) => ({ sceneId, mode, reason, requestId, suggestionCount })), [{ sceneId: "s1", mode: "deepseek", reason: null, requestId: "r1", suggestionCount: 1 }, { sceneId: "s2", mode: "fallback", reason: "MISSING_API_KEY", requestId: "r2", suggestionCount: 1 }]);
});

test("单场失败后继续，取消只阻止下一场", async () => {
  const calls = [];
  const failed = await processVersionScenes(version, scenes, [], {
    fetchImpl: async (_url, init) => {
      const sceneId = JSON.parse(init.body).scene.id;
      calls.push(sceneId);
      return sceneId === "s1" ? new Response(null, { status: 503 }) : deepseek("r2");
    },
  });
  assert.deepEqual(calls, ["s1", "s2"]);
  assert.equal(failed.summary, "failed");
  assert.equal(failed.records[0].state, "failed");
  assert.equal(failed.records[1].requestId, "r2");

  let startNext = false;
  const states = [];
  const cancelled = await processVersionScenes(version, scenes, [], {
    fetchImpl: async () => { startNext = true; return deepseek("r1"); },
    onProgress: (event) => states.push(`${event.sceneId}:${event.state}`),
    isCancelled: () => startNext,
  });
  assert.equal(cancelled.summary, "cancelled");
  assert.equal(cancelled.records.length, 1);
  assert.deepEqual(states.slice(-1), ["s2:cancelled"]);
});

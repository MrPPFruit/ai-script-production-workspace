import assert from "node:assert/strict";
import test from "node:test";
import { AiClientError, requestBreakdown } from "../src/lib/aiClient.ts";
const input = { version: { id: "v1", label: "V1" }, scene: { id: "s1", heading: "外景", text: "暴风雨掠过码头。" }, existingEntities: [] };

test("向同源 API 发送契约输入并透传 DeepSeek 结果", async () => {
  let call;
  const result = await requestBreakdown(input, async (url, init) => {
    call = { url, init };
    return Response.json({ mode: "deepseek", requestId: "req-1", suggestions: [{ taxonomy: "location", label: "码头", evidenceKind: "explicit", confidence: "high", evidence: [{ quote: "码头", kind: "explicit", range: { start: 5, end: 7 } }] }] });
  });
  assert.equal(call.url, "/api/ai/breakdown");
  assert.equal(call.init.method, "POST");
  assert.deepEqual(JSON.parse(call.init.body), input);
  assert.equal(result.mode, "deepseek");
  assert.equal(result.requestId, "req-1");
});

test("透传明确 fallback，并拒绝不合格响应", async () => {
  const fallback = await requestBreakdown(input, async () => Response.json({ mode: "fallback", reason: "MISSING_API_KEY", requestId: "req-2", suggestions: [{ taxonomy: "other", taxonomyNote: "演示", label: "人工审阅", evidenceKind: "explicit", confidence: "low", evidence: [{ quote: "暴风雨", kind: "explicit", range: { start: 0, end: 3 } }] }] }));
  assert.equal(fallback.reason, "MISSING_API_KEY");
  await assert.rejects(() => requestBreakdown(input, async () => Response.json({ mode: "fallback", requestId: "req-3", suggestions: [] })), (error) => error instanceof AiClientError && error.code === "INVALID_RESPONSE");
  await assert.rejects(() => requestBreakdown(input, async () => Response.json({ mode: "deepseek", requestId: "req-4", suggestions: [{ taxonomy: "not-a-taxonomy", label: "错误", evidenceKind: "explicit", confidence: "high", evidence: [] }] })), (error) => error instanceof AiClientError && error.code === "INVALID_RESPONSE");
  await assert.rejects(() => requestBreakdown(input, async () => Response.json({ mode: "deepseek", requestId: "req-5", suggestions: [{ taxonomy: "location", label: "码头", evidenceKind: "explicit", confidence: "high", evidence: [{ quote: "码头", kind: "explicit" }] }] })), (error) => error instanceof AiClientError && error.code === "INVALID_RESPONSE");
  await assert.rejects(() => requestBreakdown(input, async () => Response.json({ mode: "deepseek", requestId: "req-6", suggestions: [{ taxonomy: "location", label: "码头", evidenceKind: "explicit", confidence: "high", evidence: [{ quote: "码头", kind: "explicit", range: { start: 0, end: 2 } }] }] })), (error) => error instanceof AiClientError && error.code === "INVALID_RESPONSE");
});

test("区分 HTTP、网络和取消错误", async () => {
  await assert.rejects(() => requestBreakdown(input, async () => new Response(null, { status: 503 })), (error) => error instanceof AiClientError && error.code === "HTTP_ERROR" && error.status === 503);
  await assert.rejects(() => requestBreakdown(input, async () => { throw new Error("offline"); }), (error) => error instanceof AiClientError && error.code === "NETWORK_ERROR");
  await assert.rejects(() => requestBreakdown(input, async () => { throw new DOMException("cancelled", "AbortError"); }), (error) => error instanceof AiClientError && error.code === "ABORTED");
});

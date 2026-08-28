import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import handler from "../api/ai/breakdown.js";

const request = { method: "POST", body: { version: { id: "v1", label: "V1" }, scene: { id: "s1", heading: "内景", text: "小王拿起一盏红灯。" }, existingEntities: [] } };
const invoke = async (req) => {
  const response = { statusCode: 0, headers: {}, status(code) { this.statusCode = code; return this; }, setHeader(key, value) { this.headers[key] = value; return this; }, send(value) { this.body = JSON.parse(value); return this; } };
  await handler(req, response);
  return response;
};
const filesUnder = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map((entry) => entry.isDirectory() ? filesUnder(new URL(`${entry.name}/`, directory)) : [new URL(entry.name, directory)]))).flat();
const validSuggestion = { taxonomy: "prop", label: "红灯", evidenceKind: "explicit", confidence: "high", evidence: [{ quote: "红灯", kind: "explicit" }] };
const withUpstream = async (fetchImpl, run) => {
  const previousKey = process.env.DEEPSEEK_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.DEEPSEEK_API_KEY = "server-only-test-key";
  globalThis.fetch = fetchImpl;
  try { return await run(); } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = previousKey;
  }
};

test("无密钥时返回确定性 fallback，且响应不含密钥", async () => {
  const before = process.env.DEEPSEEK_API_KEY;
  delete process.env.DEEPSEEK_API_KEY;
  const response = await invoke(request);
  if (before !== undefined) process.env.DEEPSEEK_API_KEY = before;
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.mode, "fallback");
  assert.equal(response.body.reason, "MISSING_API_KEY");
  assert.deepEqual(response.body.suggestions[0].evidence[0].range, { start: 0, end: "小王拿起一盏红灯。".length });
  assert.equal(JSON.stringify(response.body).includes("DEEPSEEK_API_KEY"), false);
});

test("拒绝超限或不完整输入，且不访问上游", async () => {
  const beforeKey = process.env.DEEPSEEK_API_KEY;
  const beforeFetch = globalThis.fetch;
  let calls = 0;
  process.env.DEEPSEEK_API_KEY = "server-only-test-key";
  globalThis.fetch = async () => { calls += 1; return new Response(); };
  const response = await invoke({ ...request, body: { ...request.body, scene: { ...request.body.scene, text: "x".repeat(12_001) } } });
  globalThis.fetch = beforeFetch;
  if (beforeKey === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = beforeKey;
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error, "INVALID_REQUEST");
  assert.equal(calls, 0);
});

test("上游失败时不回显密钥，且构建可见文件没有密钥变量", async () => {
  const beforeKey = process.env.DEEPSEEK_API_KEY;
  const beforeFetch = globalThis.fetch;
  process.env.DEEPSEEK_API_KEY = "server-only-test-key";
  globalThis.fetch = async () => new Response("upstream failure", { status: 500 });
  const response = await invoke(request);
  globalThis.fetch = beforeFetch;
  if (beforeKey === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = beforeKey;
  assert.equal(response.body.mode, "fallback");
  assert.equal(JSON.stringify(response.body).includes("server-only-test-key"), false);
  assert.equal(await readFile(new URL("../.env.example", import.meta.url), "utf8"), "DEEPSEEK_API_KEY=\n");
  for (const file of await filesUnder(new URL("../dist/client/", import.meta.url))) {
    const client = await readFile(file, "utf8");
    assert.equal(client.includes("DEEPSEEK_API_KEY"), false);
    assert.equal(client.includes("server-only-test-key"), false);
  }
  const source = await readFile(new URL("../api/ai/breakdown.js", import.meta.url), "utf8");
  assert.equal(source.includes("process.env.DEEPSEEK_API_KEY"), true);
});

test("关闭 thinking 并接受完整的 JSON 响应", async () => {
  let upstreamBody;
  const response = await withUpstream(async (_url, init) => {
    upstreamBody = JSON.parse(init.body);
    return Response.json({ choices: [{ finish_reason: "stop", message: { content: JSON.stringify({ suggestions: [validSuggestion] }) } }] });
  }, () => invoke(request));
  assert.equal(upstreamBody.model, "deepseek-v4-flash");
  assert.deepEqual(upstreamBody.thinking, { type: "disabled" });
  assert.equal(response.body.mode, "deepseek");
  assert.deepEqual(response.body.suggestions[0].evidence[0].range, { start: 6, end: 8 });
});

test("截断响应不会被当作模型成功", async () => {
  const response = await withUpstream(async () => Response.json({ choices: [{ finish_reason: "length", message: { content: JSON.stringify({ suggestions: [validSuggestion] }) } }] }), () => invoke(request));
  assert.equal(response.body.mode, "fallback");
  assert.equal(response.body.reason, "INVALID_MODEL_OUTPUT");
});

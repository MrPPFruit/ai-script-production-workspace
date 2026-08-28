import { handleBreakdown } from "./breakdown-core.js";

const json = (res, status, body) => res.status(status).setHeader("content-type", "application/json; charset=utf-8").send(JSON.stringify(body));

export default async function handler(req, res) {
  const result = await handleBreakdown({ method: req.method, body: req.body, apiKey: process.env.DEEPSEEK_API_KEY, fetchImpl: fetch, requestId: () => crypto.randomUUID() });
  return json(res, result.status, result.body);
}

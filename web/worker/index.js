import { handleBreakdown } from "./breakdown-core.js";

const breakdownPath = "/api/ai/breakdown";
const json = (result) => new Response(JSON.stringify(result.body), { status: result.status, headers: { "content-type": "application/json; charset=utf-8" } });

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    if (request.method === "POST" && requestUrl.pathname === breakdownPath) {
      const result = await handleBreakdown({ method: request.method, body: await request.text(), apiKey: env.DEEPSEEK_API_KEY, fetchImpl: fetch, requestId: () => crypto.randomUUID() });
      return json(result);
    }
    if (["GET", "HEAD"].includes(request.method) && requestUrl.pathname === "/product-guide") {
      requestUrl.pathname = "/product-guide.html";
      return env.ASSETS.fetch(new Request(requestUrl, request));
    }
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};

const MODEL = "deepseek-v4-flash";
const TAXONOMY = new Set(["character", "cast", "location", "set", "prop", "costume", "makeup_hair", "vehicle", "animal", "vfx", "sfx", "stunt", "sound", "wardrobe", "art", "camera", "lighting", "other"]);
const CONFIDENCE = new Set(["high", "medium", "low"]);
const KIND = new Set(["explicit", "inferred"]);
const LIMITS = { body: 24_000, id: 80, label: 80, heading: 240, text: 12_000, entities: 30, aliases: 8, field: 500, suggestions: 20 };
const text = (value, max) => typeof value === "string" && value.trim() && value.length <= max;

function validRequest(body) {
  const { version, scene, existingEntities = [] } = body || {};
  if (!text(version?.id, LIMITS.id) || !text(version?.label, LIMITS.label) || !text(scene?.id, LIMITS.id) || !text(scene?.heading, LIMITS.heading) || !text(scene?.text, LIMITS.text) || !Array.isArray(existingEntities) || existingEntities.length > LIMITS.entities) return false;
  return existingEntities.every((entity) => text(entity?.id, LIMITS.id) && TAXONOMY.has(entity.taxonomy) && text(entity.canonicalName, LIMITS.field) && Array.isArray(entity.aliases) && entity.aliases.length <= LIMITS.aliases && entity.aliases.every((alias) => text(alias, LIMITS.field)));
}

function fallback(body, id, reason) {
  const quote = body.scene.text.trim().slice(0, 120);
  const start = body.scene.text.indexOf(quote);
  return { mode: "fallback", reason, requestId: id, suggestions: [{ taxonomy: "other", taxonomyNote: "演示建议", label: "人工审阅场次要素", description: "请依据原文确认是否需要建立生产实体。", evidenceKind: "explicit", confidence: "low", evidence: [{ quote, kind: "explicit", range: { start, end: start + quote.length } }] }] };
}

function normalize(payload, body) {
  if (!payload || !Array.isArray(payload.suggestions) || !payload.suggestions.length || payload.suggestions.length > LIMITS.suggestions) return null;
  const entityIds = new Set(body.existingEntities.map((entity) => entity.id));
  const suggestions = payload.suggestions.map((item) => {
    if (!TAXONOMY.has(item?.taxonomy) || !text(item.label, LIMITS.field) || !KIND.has(item.evidenceKind) || !CONFIDENCE.has(item.confidence) || !Array.isArray(item.evidence) || !item.evidence.length || item.evidence.length > 3) return null;
    if (item.taxonomy === "other" && !text(item.taxonomyNote, LIMITS.field)) return null;
    if (item.description != null && item.description !== "" && !text(item.description, LIMITS.field)) return null;
    if (item.proposedEntityId != null && item.proposedEntityId !== "" && !entityIds.has(item.proposedEntityId)) return null;
    if (item.evidenceKind === "inferred" && !text(item.rationale, 240)) return null;
    const evidence = item.evidence.map((source) => {
      if (!text(source?.quote, LIMITS.field) || source.kind !== item.evidenceKind) return null;
      const start = body.scene.text.indexOf(source.quote);
      return start < 0 ? null : { quote: source.quote, kind: source.kind, range: { start, end: start + source.quote.length }, ...(item.evidenceKind === "inferred" ? { rationale: item.rationale } : {}) };
    });
    return evidence.some((source) => !source) ? null : { taxonomy: item.taxonomy, ...(item.taxonomyNote ? { taxonomyNote: item.taxonomyNote } : {}), label: item.label, ...(item.description ? { description: item.description } : {}), evidenceKind: item.evidenceKind, confidence: item.confidence, ...(item.proposedEntityId ? { proposedEntityId: item.proposedEntityId } : {}), evidence };
  }).filter(Boolean);
  return suggestions.length ? suggestions : null;
}

function prompt(body) {
  return `只返回 JSON 对象，不要 Markdown：{"suggestions":[{"taxonomy":"prop","label":"红灯","description":"制作部门需确认的要素","evidenceKind":"explicit","confidence":"high","evidence":[{"quote":"红灯","kind":"explicit"}]}]}。每条只可含 taxonomy,taxonomyNote,label,description,evidenceKind,confidence,rationale,proposedEntityId,evidence；可选字段没有值时必须省略，不得返回 null 或空字符串。taxonomy 必须是 ${[...TAXONOMY].join(",")}；taxonomy=other 时必须给 taxonomyNote；proposedEntityId 只有精确命中可关联实体 ID 时才可返回。evidence 为 [{"quote":"原文中连续且逐字一致的片段","kind":"explicit|inferred"}]；kind 必须与 evidenceKind 相同；inferred 必须给 rationale。不得创建实体或任务。\n版本：${body.version.label}\n场次：${body.scene.heading}\n原文：${body.scene.text}\n可关联实体：${JSON.stringify(body.existingEntities)}`;
}

export async function handleBreakdown({ method, body: rawBody, apiKey, fetchImpl, requestId }) {
  const id = requestId();
  if (method !== "POST") return { status: 405, body: { error: "METHOD_NOT_ALLOWED", requestId: id } };
  const raw = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody ?? {});
  let body;
  try { body = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody; } catch { return { status: 400, body: { error: "INVALID_REQUEST", requestId: id } }; }
  if (raw.length > LIMITS.body || !validRequest(body)) return { status: 400, body: { error: "INVALID_REQUEST", requestId: id } };
  if (!apiKey) return { status: 200, body: fallback(body, id, "MISSING_API_KEY") };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const upstream = await fetchImpl("https://api.deepseek.com/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, temperature: 0, thinking: { type: "disabled" }, max_tokens: 1800, response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt(body) }] }),
    });
    if (!upstream.ok) return { status: 200, body: fallback(body, id, "UPSTREAM_ERROR") };
    const choice = (await upstream.json())?.choices?.[0];
    if (choice?.finish_reason === "length") return { status: 200, body: fallback(body, id, "INVALID_MODEL_OUTPUT") };
    const payload = JSON.parse(choice?.message?.content || "");
    const suggestions = normalize(payload, body);
    return suggestions ? { status: 200, body: { mode: "deepseek", requestId: id, suggestions } } : { status: 200, body: fallback(body, id, "INVALID_MODEL_OUTPUT") };
  } catch (error) {
    return { status: 200, body: fallback(body, id, error?.name === "AbortError" ? "UPSTREAM_TIMEOUT" : "UPSTREAM_ERROR") };
  } finally {
    clearTimeout(timer);
  }
}

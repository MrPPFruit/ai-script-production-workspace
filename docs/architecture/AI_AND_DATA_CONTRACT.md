# AI 与数据契约（公开 Demo 最小版）

## 1. 目标与边界

本契约服务于公开部署的 React/Vite 面试 Demo：制片统筹可从剧本场次中的原文证据审阅 AI 建议，确认后沉淀为跨场次复用的生产实体，并生成带版本与上下文快照的任务草稿。

范围只覆盖确定性 Demo 数据和可选的 DeepSeek 代理调用。不实现账户、多人协作、完整持久化、自动通知、完整差异算法或模型效果评测。任何 AI 输出均为**待人工审阅的建议**，不得自动覆盖已确认实体或已创建任务。

## 2. 统一状态、置信度与分类法

```ts
export type EvidenceKind = "explicit" | "inferred";
export type Confidence = "high" | "medium" | "low";

export type ReviewStatus =
  | "pending"      // 等待人工审阅
  | "accepted"     // 已确认，可转为实体
  | "edited"       // 人工编辑后确认
  | "rejected"     // 明确不采用，保留审计记录
  | "superseded";  // 被后续建议或版本影响决策取代

export type EntityStatus = "active" | "archived" | "needs_review";
export type TaskStatus = "draft" | "ready" | "superseded";
export type ImpactStatus = "pending" | "kept" | "merged" | "created_new" | "dismissed";

export type ProductionTaxonomy =
  | "character" | "cast" | "location" | "set" | "prop"
  | "costume" | "makeup_hair" | "vehicle" | "animal"
  | "vfx" | "sfx" | "stunt" | "sound" | "wardrobe"
  | "art" | "camera" | "lighting" | "other";

export type Department =
  | "production" | "art" | "camera" | "lighting" | "sound"
  | "costume" | "makeup_hair" | "locations" | "vfx" | "sfx" | "stunts";
```

`explicit` 仅表示可由 `SourceEvidence` 的原文片段直接支持；`inferred` 表示为生产执行作出的推断，必须附带推断理由。`confidence` 表示模型或规则对建议的把握，不能替代人工确认。`other` 只在标准分类无法表达时使用，且必须填写 `taxonomyNote`。

## 3. 核心对象

```ts
export interface ScriptVersion {
  id: string;
  projectId: string;
  label: string;                 // 如 "V1"、"V2 (demo)"
  parentVersionId?: string;
  createdAt: string;             // ISO 8601
  sourceDigest: string;          // 输入剧本文本的 SHA-256；不作为秘密
  scenes: Scene[];
}

export interface Scene {
  id: string;                    // 在同一 ScriptVersion 内稳定
  versionId: string;
  ordinal: number;
  heading: string;
  text: string;
  sourceRange: { start: number; end: number }; // 版本全文中的字符偏移，左闭右开
}

export interface SourceEvidence {
  id: string;
  versionId: string;
  sceneId: string;
  quote: string;                 // 必须是 Scene.text 的逐字子串
  range: { start: number; end: number }; // 相对 Scene.text，左闭右开
  kind: EvidenceKind;
  rationale?: string;            // inferred 必填；explicit 不应伪造理由
}

export interface Suggestion {
  id: string;
  versionId: string;
  sceneId: string;
  taxonomy: ProductionTaxonomy;
  taxonomyNote?: string;
  label: string;
  description?: string;
  evidenceIds: string[];         // 至少一个；不得跨 ScriptVersion
  evidenceKind: EvidenceKind;
  confidence: Confidence;
  status: ReviewStatus;
  proposedEntityId?: string;     // 命中已有实体时可提出，不等于自动关联
  createdBy: "mock" | "deepseek" | "human";
  createdAt: string;
  reviewedAt?: string;
}

export interface ProductionEntity {
  id: string;
  projectId: string;             // 实体是项目级资产，可跨场次／版本复用
  taxonomy: ProductionTaxonomy;
  taxonomyNote?: string;
  canonicalName: string;
  aliases: string[];
  status: EntityStatus;
  sourceSuggestionIds: string[]; // 只追加，不因新版本静默替换
  sceneRefs: Array<{ versionId: string; sceneId: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDraft {
  id: string;
  entityId: string;
  department: Department;
  title: string;
  instructions: string;
  dueHint?: string;              // 演示用自然语言要求，不承诺排期能力
  status: TaskStatus;
  createdFrom: {
    versionId: string;
    sceneId: string;
    suggestionId: string;
    createdAt: string;
  };
  contextSnapshot: {             // 创建时冻结，之后不得被当前版本改写
    versionLabel: string;
    sceneHeading: string;
    sceneText: string;
    evidence: SourceEvidence[];
    entityName: string;
  };
}

export interface VersionImpact {
  id: string;
  fromVersionId: string;
  toVersionId: string;
  sceneId?: string;
  entityId?: string;
  taskDraftIds: string[];
  reason: "scene_changed" | "scene_removed" | "evidence_changed" | "entity_match_changed";
  summary: string;
  status: ImpactStatus;
  decidedAt?: string;
}
```

不变量：`Suggestion.versionId === Scene.versionId === SourceEvidence.versionId`；`SourceEvidence.quote`、偏移和场次正文必须相互校验；只有 `accepted` 或 `edited` 的建议可新建或关联 `ProductionEntity`；`TaskDraft` 必须由已确认建议与实体创建，并持有完整创建快照。

## 4. AI 请求、响应与结构化输出

浏览器只调用同源 `POST /api/ai/breakdown`，不得直接调用 DeepSeek。请求中只传当前版本／场次的必要文本，不传环境变量、令牌或未授权项目数据。

```ts
export interface BreakdownRequest {
  version: Pick<ScriptVersion, "id" | "label">;
  scene: Pick<Scene, "id" | "heading" | "text">;
  existingEntities: Array<Pick<ProductionEntity, "id" | "taxonomy" | "canonicalName" | "aliases">>;
}

export interface BreakdownResponse {
  mode: "deepseek" | "fallback";
  reason?: "MISSING_API_KEY" | "UPSTREAM_TIMEOUT" | "UPSTREAM_ERROR" | "INVALID_MODEL_OUTPUT"; // fallback 必填
  suggestions: Array<{
    taxonomy: ProductionTaxonomy;
    taxonomyNote?: string;
    label: string;
    description?: string;
    evidenceKind: EvidenceKind;
    confidence: Confidence;
    proposedEntityId?: string;
    evidence: Array<{
      quote: string;
      kind: EvidenceKind;
      range: { start: number; end: number }; // 服务端从 Scene.text 重算
      rationale?: string;
    }>;
  }>;
  notice?: string; // UI 可展示的安全提示；降级原因以 reason 提供
  requestId: string;
}
```

服务端给模型的输出合同必须要求**仅返回 JSON**，顶层为 `{ "suggestions": [...] }`，字段只允许 `taxonomy`、`taxonomyNote`、`label`、`description`、`evidence`、`evidenceKind`、`confidence`、`rationale`、`proposedEntityId`。服务端在返回前执行 schema 校验与以下约束：

- `taxonomy`、`confidence` 必须在上述枚举内；`other` 必须有非空 `taxonomyNote`。
- 每条建议至少一个证据；每段 `evidence.quote` 必须精确出现在 `scene.text`，偏移由服务端重算，不能信任模型提供的数字。
- `explicit` 的全部证据为原文摘录；`inferred` 必须有不超过 240 字符的 `rationale`，且仍须引用触发该推断的原文。
- `proposedEntityId` 只能是请求中的实体 ID；模型不得创建实体、任务、版本影响或任意自由字段。
- 校验失败、空数组或超出大小限制（建议最多 20 条、单字段最多 500 字符）均视为 AI 响应不可用，走失败策略而非把不可信 JSON 交给 UI。

## 5. 调用、降级与错误处理

`/api/ai/breakdown` 仅在服务端读取 `DEEPSEEK_API_KEY`。有值时，以服务端 `fetch` 调用 DeepSeek；模型固定为当前官方 Flash 名称 `deepseek-v4-flash`。使用 8 秒超时（`AbortController`），最多一次调用，不做浏览器重试或隐藏式多次计费。请求日志只记录 `requestId`、模式、耗时、HTTP 分类与校验结果；不得记录 Authorization、环境变量、完整剧本文本或模型原始输出。

无密钥、超时、网络失败、非 2xx、输出解析／schema 校验失败时，端点返回 HTTP `200` 的确定性 fallback `BreakdownResponse`（按版本 ID + 场次 ID 固定排序和内容），并显式提供 `mode: "fallback"` 与原因码。UI 必须在建议区持续显示不可忽略的 `DeepSeek` 或 `演示数据` 模式标记；不得把 fallback 结果标为模型产出。

仅当请求本身无效（JSON 不合法、必填字段缺失、场次不属于版本、请求超过服务端限制）时返回 `400`；内部未能构造安全 mock 时返回 `500`，并展示“暂不能生成建议，请稍后重试”，不得回显上游错误正文。`requestId` 可用于排错，但不得编码用户、剧本正文或秘密。

## 6. 版本继承与影响决策

新版本通过 `parentVersionId` 指向来源版本，场次、建议和证据均为新版本记录，不原地改写旧版本。Demo 采用保守继承：只复制用户确认的 `ProductionEntity` 项目级引用；不自动复制 `Suggestion` 审阅结论、不覆盖实体资料、不重写既有 `TaskDraft.contextSnapshot`。

对于模拟 V2，服务端或确定性数据生成 `VersionImpact[]`：按场次 ID／标题与证据变化识别候选影响；证据不足时也应产生 `pending`，而非推断“无影响”。每条影响必须展示关联实体和任务，并由用户明确选择：

- `kept`：保留实体与任务，记录已审阅；
- `merged`：把新建议人工合并到既有实体，追加来源；
- `created_new`：创建新的实体，原实体与任务保留；
- `dismissed`：确认该影响不适用，保留决定记录。

以上决策只改变目标影响项及显式选择的关联，绝不静默修改其他版本、实体或任务。完整自动差异／继承算法属于明确不做范围。

## 7. Vercel 部署与秘密边界

- React/Vite 静态资源仅可包含 UI、类型兼容的数据和公开 Demo 文本；不得使用 `VITE_DEEPSEEK_API_KEY` 或任何把密钥编进浏览器包的变量名。
- `/api/ai/breakdown` 部署为 Vercel Serverless Function（或等价同源服务端路由）。`DEEPSEEK_API_KEY` 只在 Vercel Project Environment Variables 中配置，且只授予所需环境。
- 不提交 `.env`、真实请求／响应日志、导出的 Vercel 环境配置或含密钥的截图；仓库只提交 `.env.example`，其中变量值为空且无真实格式片段。
- CORS 默认同源；若后续拆分域名，采用明确 allowlist，不能使用 `*`。不将 DeepSeek URL、模型名或错误细节作为安全边界；真正边界是服务器不向客户端返回密钥。

## 8. 秘密检查与最小验证

上线前必须执行并记录以下最小检查：

1. 在构建产物中搜索 `DEEPSEEK_API_KEY`、`sk-` 及实际密钥片段；任一命中阻断发布。
2. 对 Git 工作树及历史执行秘密扫描；发现真实凭证时立即撤销／轮换，再清理历史后发布。
3. 未设置 `DEEPSEEK_API_KEY`：调用端点应返回稳定 `mode: "fallback"` 及 `MISSING_API_KEY`，UI 显示“演示数据”。
4. 设置测试密钥且上游可用：端点返回已通过 schema 校验的 `mode: "deepseek"`，UI 显示“DeepSeek”。不在测试输出中打印密钥或完整上游载荷。
5. 模拟上游超时、5xx 与非法 JSON：均在约 8 秒内降级为 `fallback`，无未处理异常、无敏感日志。
6. 走一条最小用户链：接受建议 → 创建／关联跨场次实体 → 创建任务草稿 → 核对任务的版本、场次、证据和上下文快照 → 审阅一条 V2 `VersionImpact`。

这些验证证明的是 Demo 的安全边界与可审阅链路，不代表模型准确率、生产级可靠性或完整版本继承能力。

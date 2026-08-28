# AI 与数据契约：《雷雨》第四幕进入人工审阅

## 1. 唯一目标

正式 Demo 必须让制片统筹通过真实 DeepSeek API，顺序处理《雷雨》第四幕导入版本的 3–4 个幕内处理单元，并把通过服务端结构和精确原文证据校验的结果送入人工审阅。

阅读区显示本次导入的第四幕全部文本，不代表整部《雷雨》。处理单元不是原作场次；每条建议以精确 quote/range 为来源证据。

## 2. 当前实现状态

| 能力 | 当前事实 |
| --- | --- |
| POST /api/ai/breakdown | 已实现单次 DeepSeek 调用、服务端校验和 fallback |
| requestBreakdown | 已实现客户端单次请求和响应校验 |
| processVersionScenes | 已实现顺序处理、进度、失败继续和取消下一次的库函数 |
| 《雷雨》第四幕导入数据/处理单元 | 未实现 |
| 第四幕全文/处理单元锚点 | 未实现 |
| App 接线 | 未实现 |
| 完整建议进入审阅 | 未实现；当前只保留 suggestionCount |
| 精确 evidence 全文定位 | 未实现 |
| 正式 fallback | 未实现；当前仅通用单条建议 |
| AiRun/SuggestionBatch 历史 | 未实现 |

API 与库函数已存在，但用户主链尚未完成。

## 3. 最小来源合同

SourceSection 固定为第四幕导入全文；AnalysisUnit 是 3–4 个系统处理单元；EvidenceSpan 保存逐字 quote、单元内 range 和第四幕全文 range；ProductionEntity 是人工确认后的稳定对象，并通过 SourceRelation 引用第四幕、处理单元和一个或多个 EvidenceSpan。文本片段不会直接变成实体。

处理单元按人物进退场和关键舞台指示预先配置，只服务 API 限长、进度和失败隔离。本次不实现自动拆分或镜头级拆分。

## 4. 现有 API 兼容

不大规模重构现有单次 API。客户端适配关系：

| 产品语义 | 现有字段 |
| --- | --- |
| analysisUnitId | scene.id |
| analysisUnitTitle | scene.heading |
| analysisUnitText | scene.text |
| sourceVersionId | version.id |
| sourceSection=第四幕 | 客户端导入上下文与 SuggestionBatch 持有 |

内部字段名不得进入用户文案或被解释为原作场次。

## 5. 处理与状态

> 准备处理单元队列 → 请求当前单元 DeepSeek → 服务端结构/evidence 校验 → mode=deepseek 或 fallback → 新待审批次 → 下一单元

现有 orchestrator 状态只可映射为等待/准备、请求中、DeepSeek 已校验待审、fallback 待审、失败和取消下一次。不得伪造模型内部阶段。

完成摘要：

- completed：全部处理单元 mode=deepseek；
- partial_fallback：至少一个 fallback 且无客户端失败；
- failed：至少一个客户端失败；
- cancelled：只阻止下一单元开始。

## 6. 结构化建议与 evidence

服务端在返回前必须校验 taxonomy、confidence、evidenceKind、数量、字段长度、候选实体 ID 和 inferred 理由。

每条 evidence.quote 必须是当前 analysisUnitText 的逐字子串。服务端重算单元内范围；客户端基于该单元在第四幕导入全文中的位置生成全文范围。点击建议时切换正确版本、滚动并高亮 quote，不触发新 AI 或业务写入。

mode=deepseek 只表示结构和证据校验通过，不表示制作判断必然正确。

## 7. DeepSeek 与 fallback

- 凭证只从服务端环境变量读取，客户端不可访问。
- 每个处理单元最多一次上游调用，不做隐藏重试。
- 上游失败或无效输出返回带 reason 的 fallback。
- 日志不得输出 Authorization、环境变量、完整正文或模型原始输出。
- 正式 fallback 必须按 analysisUnitId 使用本单元确定性建议；当前通用单条建议不满足目标。

## 8. AiRun、SuggestionBatch 与 HITL

| 对象 | 最小字段 |
| --- | --- |
| AiRun | runId、versionId、sourceSection、unitOrder、startedAt、completedAt、summary |
| UnitRun | runId、analysisUnitId、order、state、mode、reason、requestId |
| SuggestionBatch | batchId、runId、analysisUnitId、mode、reason、suggestions、createdAt |

不变量：

- 一次全部处理的请求数等于导入配置中的单元数；
- 每次分析创建新 run；每个合格响应创建新 batch；
- SuggestionBatch 保留完整 suggestions；
- 旧 run/batch 和人工决定不被覆盖。

人工可以编辑、采用为新实体、关联既有实体或忽略。AI 不得自动修改实体、来源关系、任务草稿、版本或影响项。

TaskMaterialDraft 保存人工确认实体、版本、第四幕、处理单元、精确证据和制作要求快照，状态仅为未下发/需复核。

## 9. 重新分析与版本影响

- 重新分析当前单元或全部单元只创建新 run/batch。
- 版本案例只做一次处理单元插入/切分引起的来源关系人工复核。
- 旧实体和任务草稿保持不变，用户决定重连或保留来源。
- 不宣称通用自动继承、通用 diff 或原作场次重建。

## 10. 内容、仓库与 UI 边界

- 产品显示名称为《雷雨》·面试 Demo 导入版本（第四幕）。
- 本 Demo 仅供面试官查看；记录文本来源与使用边界，版权不阻塞选剧本。
- 正文当前通过私有部署数据或本地导入加载，公开仓库不提交；最终交付可单独调整。
- 主 UI 只提供可闭环操作；镜头级拆分、自动拆分、真实任务派发等只静态说明。

## 11. 最小验证

已有基础验证：API 失败矩阵、客户端响应校验、顺序调用、partial fallback、失败继续和取消下一次。

仍需验证：

- 第四幕导入全文、3–4 个单元和私有/本地加载；
- App 发出与单元数一致的有序请求；
- 完整 suggestions 进入 SuggestionBatch；
- fallback 按单元复用确定性建议；
- 全文常驻、处理单元锚点和精确 evidence 高亮；
- 人审写入稳定实体与未下发草稿；
- 单元插入/切分只产生人工复核；
- 重新分析不覆盖历史；
- 主 UI 无死按钮；正文加载不依赖公开仓库，最终入库策略可单独验证。

## 12. Acceptance

AIWF-01 至 AIWF-10 的 Owner、Observable、Counterexample 和 Evidence 以 OpenSpec Delivery Contract 与 Comet design 为准。API、构建或测试单点通过均不能替代官网端到端产品链。

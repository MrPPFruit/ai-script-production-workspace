## Why

面试官网需要证明一条完整的制片工作流：阅读《雷雨》第四幕导入全文，真实 DeepSeek 顺序处理，精确 evidence，人工审阅，稳定实体，未下发部门任务草稿，以及一次版本关系复核。

当前单次 API、客户端适配器和顺序 orchestrator 已存在，但 App 未接线、完整建议载荷未保留，第四幕导入全文/evidence 联动和新版本案例也未实现。

## Current User-Visible Goal

制片统筹在《雷雨》·面试 Demo 导入版本（第四幕）中发起一次真实 DeepSeek 分析，看到实际 3–4 个处理单元的诚实进度，并把合格建议送入人工审阅；点击建议能回到第四幕全文的精确证据，人工结果再形成稳定实体和未下发任务草稿。

## What Changes

- 固定产品标题和第四幕导入全文范围，不冒充整部原作。
- 3–4 个处理单元只作为 API 限长、进度和失败隔离边界，不称为原作场次。
- DeepSeek 是正式主链；fallback 只做明确保障。
- 每条建议必须锚定精确 quote/range；点击建议滚动并高亮全文证据。
- 现有 scene API 字段保持内部兼容，不进行大规模接口重命名。
- 人工编辑、采用新实体、关联既有或忽略是唯一生产写入入口。
- 实体是稳定对象，通过关系保留第四幕、处理单元和 evidence 来源；文本片段不直接实体化。
- 任务只生成未下发部门草稿。
- 版本只演示一次处理单元插入/切分后的来源关系人工复核。
- 不实现镜头级拆分、通用自动继承或死按钮。
- 本 Demo 仅供面试官查看；正文当前由私有部署数据或本地导入加载，公开仓库不提交正文。

## Capabilities

### New Capabilities

- script-breakdown-review：第四幕全文、DeepSeek 顺序处理、精确 evidence 和 HITL。
- production-entity-tasking：稳定实体、精确来源关系和未下发部门草稿。
- script-version-impact：一次处理单元插入/切分的关系人工复核。
- safe-ai-demo-delivery：DeepSeek/fallback、内容使用边界、仓库正文边界和无死按钮。

### Modified Capabilities

无。

## Impact

- 服务端 API、requestBreakdown 和 processVersionScenes 已存在；导入数据、App 接线、完整建议载荷、全文/evidence 联动、SuggestionBatch 和正式 fallback 仍待实现。
- 不新增全本端点、自动拆分算法、镜头级模型、数据库或消息基础设施。
- 新增控件的具体文案和位置仍待 UI 阶段确认。
- 本轮只更新 docs/OpenSpec，不修改 web 或正文数据。

## Delivery Contract

- Parent outcome: docs/product/roadmap.md#面试-demo-交付
- Parent acceptance: independent
- [AIWF-01] Outcome: 一次 run 顺序处理实际 3–4 个处理单元；Negative: App 未调用或漏单元称全部；Evidence: 请求数与导入配置一致。
- [AIWF-02] Outcome: 当前处理单元和最终 deepseek/fallback 可见；Negative: 原作场次误称或假模型阶段；Evidence: 浏览器状态与文案检查。
- [AIWF-03] Outcome: 每条待审建议有精确 quote/range；Negative: 只有单元级来源或 quote 不在正文；Evidence: API 正反例和范围映射。
- [AIWF-04] Outcome: fallback 使用本单元确定性建议并显示原因；Negative: 通用占位或冒充 DeepSeek；Evidence: 失败矩阵和 UI 模式检查。
- [AIWF-05] Outcome: 用户编辑后采用新实体、关联既有或忽略；Negative: AI 自动写实体或文本片段直接实体化；Evidence: 浏览器人审链。
- [AIWF-06] Outcome: 第四幕全文常驻，单元/建议点击定位精确高亮；Negative: 单元替换全文、跳错版本或无联动；Evidence: 锚点和滚动高亮检查。
- [AIWF-07] Outcome: 稳定实体保留精确来源并生成未下发部门草稿；Negative: 粗粒度来源或虚假送达；Evidence: 关系和任务快照。
- [AIWF-08] Outcome: 一次单元插入/切分等待人工关系复核；Negative: 静默覆盖或宣称通用继承；Evidence: 旧新关系对照。
- [AIWF-09] Outcome: 重新分析只新增 run/batch；Negative: 覆盖人工决定或下游；Evidence: 两次 run 前后对照。
- [AIWF-10] Outcome: 标题、全文范围、处理单元和使用边界诚实，主 UI 无死按钮；Negative: 冒充整部原作/原作场次或出现死按钮；Evidence: 内容、仓库正文和控件盘点。

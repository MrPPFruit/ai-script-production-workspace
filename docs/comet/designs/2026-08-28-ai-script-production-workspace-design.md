---
comet_change: build-ai-script-production-workspace
role: technical-design
canonical_spec: openspec
---

# AI 剧本生产工作台技术设计

## 实现决策

- 官网默认显示《雷雨》·面试 Demo 导入版本（第四幕）；中间区连续显示第四幕本次导入全文，不代表整部原作。
- 3–4 个处理单元只用于 API 限长、进度和失败隔离，不表示原作场次；sceneId/title/text 保持内部兼容，不重构服务端接口。
- DeepSeek 是正式主链；处理单元严格顺序请求，fallback 必须按单元披露原因和确定性建议。
- 每条建议带精确 quote/range；点击建议滚动并高亮第四幕全文证据。
- 人工编辑、采用新实体、关联既有或忽略是唯一写入入口；文本片段不直接实体化。
- 稳定实体通过来源关系保留第四幕、处理单元和精确 evidence；任务只生成未下发部门草稿。
- 版本只实现一次处理单元插入/切分的来源关系复核，不实现通用继承。
- 正文从私有部署数据或本地导入加载，公开仓库不提交。

## 依赖与边界

- 单次 API、requestBreakdown 和顺序 orchestrator 已存在；App 接线、完整建议载荷、导入数据、全文 evidence、正式 fallback 和版本新案例仍未实现。
- 凭证只存在服务端；mode=deepseek 只表示结构和证据通过校验。
- 不新增自动拆分算法、镜头级模型、数据库、消息系统或真实任务派发。

## 主要风险

- 处理单元冒充原作场次：UI/canonical 只称“处理单元”，原作来源只显示第四幕。
- evidence 只有粗粒度来源：每条建议强制精确 quote/range。
- API 已有被误报为产品完成：验收官网端到端链，不以库函数或测试替代。
- 文本片段直接实体化：实体只由人工决定产生，来源通过关系保留。
- 版本能力夸大：只验收一次插入/切分关系复核。
- fallback 冒充模型：mode/reason 持续可见。

## 测试 Seam

- 内容：标题、第四幕范围、处理单元文案、正文加载与仓库策略分离。
- AI：顺序请求数、mode/reason、完整 suggestions、失败继续。
- 证据：quote 校验、全文范围映射、点击滚动和高亮。
- HITL：编辑、采用/关联/忽略、稳定实体和任务草稿。
- 版本：插入/切分只产生人工复核，V1 和旧草稿不变。
- 交付：测试、typecheck、build、秘密扫描和浏览器三分钟真链。

## 回滚与非目标

- App 接线回滚不得删除 run/batch、实体或任务草稿。
- DeepSeek 不可用时进入明确 fallback，不能宣称主链通过。
- 非目标：自动处理单元拆分、镜头级拆分、通用 diff/继承、真实任务派发、模型质量评测和完整项目管理。

## Acceptance Design

- [AIWF-01] Owner: AiRun；Observable: 顺序处理实际全部单元；Counterexample: 漏单元称全部；Evidence: 请求数与导入配置一致。
- [AIWF-02] Owner: 单元状态/模式；Observable: 当前单元和最终模式可见；Counterexample: 原作场次误称或假阶段；Evidence: 浏览器状态与文案。
- [AIWF-03] Owner: evidence 校验；Observable: 每条建议有精确 quote/range；Counterexample: 只有粗粒度来源；Evidence: API 正反例和映射测试。
- [AIWF-04] Owner: fallback 适配；Observable: 本单元建议与原因进入审阅；Counterexample: 通用占位或冒充成功；Evidence: 失败矩阵和 UI 检查。
- [AIWF-05] Owner: SuggestionBatch 人审；Observable: 编辑后采用/关联/忽略；Counterexample: AI 自动写实体；Evidence: 浏览器人审链。
- [AIWF-06] Owner: 全文/evidence 导航；Observable: 第四幕全文常驻并精确高亮；Counterexample: 单元替换全文或无联动；Evidence: 锚点和滚动高亮。
- [AIWF-07] Owner: Entity/TaskDraft；Observable: 稳定实体生成未下发草稿；Counterexample: 粗来源或虚假送达；Evidence: 关系与任务快照。
- [AIWF-08] Owner: VersionImpact；Observable: 一次单元插入/切分等待人工复核；Counterexample: 静默覆盖或通用继承；Evidence: 旧新关系对照。
- [AIWF-09] Owner: run/batch 历史；Observable: 重新分析只新增；Counterexample: 覆盖人工结果；Evidence: 两次 run 对照。
- [AIWF-10] Owner: 内容/UI 诚实性；Observable: 标题、范围、使用边界正确且无死按钮；Counterexample: 冒充整部原作/原作场次；Evidence: 内容、仓库和控件盘点。

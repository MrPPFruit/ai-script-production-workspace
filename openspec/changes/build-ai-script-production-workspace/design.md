## Context

当前唯一用户可见目标是：制片统筹在《雷雨》第四幕导入全文中导航证据，发起真实 DeepSeek 顺序处理，并将合格建议经过 HITL 转为稳定实体和未下发部门任务草稿。

3–4 个处理单元是系统执行边界，不是原作场次。现有单次 API、requestBreakdown 和 processVersionScenes 已实现；App 接线、完整建议载荷、第四幕全文/evidence 联动、正式 fallback 与新版本案例仍未实现。

## Goals / Non-Goals

**Goals:**

- 官网完成第四幕全文 → DeepSeek → evidence → HITL → 实体 → 任务草稿 → 一次版本复核。
- 只展示可证明状态，并披露 deepseek/fallback。
- 每条建议精确锚定全文 quote/range。
- 人工决定是唯一生产写入入口。
- 重新分析和处理单元插入/切分不覆盖历史。

**Non-Goals:**

- 不实现自动处理单元拆分、镜头级拆分、通用 diff 或自动继承。
- 不实现任意剧本生产级批处理、真实任务派发或模型质量评测。
- 不重命名现有 API scene 字段；只在产品适配层映射。
- 正文加载不依赖公开仓库；是否入库由最终交付阶段单独决定。

## Decisions

1. **内容边界。** 标题固定为《雷雨》·面试 Demo 导入版本（第四幕）；全文只表示本次导入第四幕，不代表整部原作。
2. **最小来源层。** SourceSection=第四幕；AnalysisUnit=3–4 个系统处理单元；EvidenceSpan=精确 quote/range；实体通过关系引用这些来源，不直接由文本片段生成。
3. **兼容现有 API。** analysisUnitId/title/text 映射到 scene.id/heading/text；sourceSection 由客户端导入上下文和 SuggestionBatch 持有。
4. **顺序 DeepSeek。** 请求数等于实际处理单元数；前一单元返回后才请求下一单元。
5. **诚实状态。** 只显示等待、请求中、DeepSeek 已校验待审、fallback 待审或失败，不伪造模型内部阶段。
6. **精确 evidence。** 服务端验证单元内 quote/range，客户端映射到第四幕全文范围；点击建议只导航和高亮。
7. **HITL。** 人工编辑、采用新实体、关联既有或忽略；AI 不自动写实体、关系或任务。
8. **任务草稿。** 保存实体、版本、来源证据和制作要求快照，始终未下发。
9. **版本案例。** 只实现一次处理单元插入/切分的来源关系人工复核，不声称通用继承。
10. **内容加载。** Demo 仅供面试官查看；正文支持私有部署数据或本地导入，公开仓库入库策略留给最终交付。

## Risks / Trade-offs

- [处理单元冒充原作结构] → UI/canonical 统一使用“处理单元”，原作来源只显示第四幕。
- [粗粒度来源无法核验] → 每条建议必须有精确 quote/range。
- [API 已有被误报为产品完成] → 验收观察官网端到端链，不以库函数或测试代替。
- [文本片段直接实体化] → 实体只由人工采用/关联产生，来源通过关系保存。
- [版本能力夸大] → 只验收一次插入/切分关系复核。
- [fallback 冒充模型] → mode/reason 持续可见并使用本单元确定性建议。

## Migration / Rollback

- 旧默认内容不是兼容性资产；最终官网改为私有/本地加载第四幕。
- 先让 orchestrator 保留完整 suggestions，再接 App、全文证据和 HITL。
- 回滚 AI 状态面不得删除 run/batch、实体或任务草稿。

## Open Questions

- 实际采用 3 个还是 4 个处理单元及边界由导入数据实现确定。
- 控件文案、位置和布局在 UI 阶段确认。
- 公开仓库正文策略在最终交付阶段可单独调整。

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

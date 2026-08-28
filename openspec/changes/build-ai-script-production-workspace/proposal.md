## Why

孤立的 AI 剧本拆解只产生标签，无法证明这些信息如何进入制片统筹的真实生产组织。录音高置信方向要求产品从剧本/场次来源出发，建立受规范、带 Metadata 的生产实体，再形成面向部门的任务材料；模型效果不是本次考核。

本 change 用《暴风雨》的可核验公版英文短场次和确定性数据，证明这条最小闭环。真实任务下发及其后的更新/撤回明确不在本题范围。

## What Changes

- 默认剧本固定为《暴风雨》，正式 Demo 从样本第 1 项 ACT I, SCENE I 开始，并使用真实 Act/Scene 标识、公版英文来源和项目自译记录。
- 制片统筹可从场次原文锚点查看受项目 taxonomy 约束的 AI/模拟建议，并人工校订。
- 人审结果收敛为采用新实体、关联既有实体或忽略；不把完整确认/拒绝/合并状态机当作录音要求。
- 生产实体保留稳定 ID、Metadata、来源锚点和版本化的场次关系。
- 实体可生成按部门组织、明确标为未下发的任务材料草稿；草稿保留版本和来源摘要。
- 项目内演示改编版 V2 显式展示场次—实体关系变化，并对相关草稿提示“来源已变化，发布前复核”。
- 确定性数据是唯一必需 AI 路径；不接入或验收 DeepSeek/其他实时模型。
- 新增 canonical 范围决策，明确录音事实、用户确认、MVP 产品选择与 DEFERRED。

## Capabilities

### New Capabilities

- script-breakdown-review：制片统筹可从《暴风雨》真实 Act/Scene 与来源锚点校订受规范建议，并显式创建或关联实体。
- production-entity-tasking：稳定实体保存 Metadata 与跨场次关系，并生成未下发的部门任务材料草稿。
- script-version-impact：项目内演示改编版的变化以场次—实体关系影响呈现，不静默覆盖 V1。
- safe-ai-demo-delivery：Demo 使用确定性数据，清楚披露来源、模拟边界与未下发边界，并可公开演示。

### Modified Capabilities

无。

## Impact

- 产品与 OpenSpec 以 PRODUCT_SPEC.md、SCOPE_DECISIONS.md 和本 change 为 canonical。
- 后续实现需替换旧视觉占位与任意场次编号，使用《暴风雨》真实 Act/Scene 数据。
- React/Vite 前端、确定性数据与浏览器状态可继续作为实现路径；本 change 不要求新增模型服务端。
- 公开部署是项目交付约束，不是录音中的产品要求；本轮不执行 Git 或部署。

## Delivery Contract

- Parent outcome: docs/product/roadmap.md#面试-demo-交付
- Parent acceptance: independent
- [AIR-01] Outcome: 制片统筹能从《暴风雨》具体 Act/Scene 与来源锚点查看受控建议，校订后显式选择采用为新实体或关联既有实体；Negative: 只有 AI 卡片、无法回到来源，或 AI 直接写入实体；Evidence: 浏览器完成来源—建议—实体链。
- [AIR-02] Outcome: 生产实体保留 Metadata 与跨场次来源关系，并生成含部门、制作要求、版本与来源摘要且明确未下发的任务材料；Negative: 只有实体名/部门标签，或伪造真实收件人、通知、送达与回执；Evidence: 浏览器从实体生成并检查一条部门材料草稿。
- [AIR-03] Outcome: 项目内演示改编版 V2 显式展示场次—实体关系变化，等待一次人工关系决策；相关草稿只显示复核提示；Negative: 只换版本号、静默覆盖 V1，或声称更新/撤回已下发任务；Evidence: 浏览器完成一次关系复核并确认 V1 保留。
- [AIR-04] Outcome: 用户可从样本第 1 项 ACT I, SCENE I 开始稳定运行确定性 Demo，并理解公版英文来源、项目自译、模拟 AI 和未下发边界；Negative: 仍出现旧原创占位/任意场次编号，把模拟冒充实时模型，或把草稿称为已送达；Evidence: 无模型凭证运行核心链、核对来源披露与公开页面。

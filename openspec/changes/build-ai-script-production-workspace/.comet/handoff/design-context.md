# Comet Design Handoff

- Change: build-ai-script-production-workspace
- Phase: design
- Mode: compact
- Context hash: 4d23ea89ecdf1305d7ace6a1d442762962129a7e4892ac256b89d4304f908dec

Generated-by: comet-handoff.sh

OpenSpec remains the canonical capability spec. This handoff is a deterministic, source-traceable context pack, not an agent-authored summary.

## openspec/changes/build-ai-script-production-workspace/proposal.md

- Source: openspec/changes/build-ai-script-production-workspace/proposal.md
- Lines: 1-40
- SHA256: 2382f853e1b2d25e5aa05f2e65555a6c33e70c796bea72dab993be1b97b6a5d6

```md
## Why

现有的 AI 剧本拆解 Demo 容易停留在“上传文本、输出标签”，无法证明拆解结果如何进入制片统筹的真实生产管理链路。本次需要用一个可公开演示的网页，在有限范围内证明 AI 建议能够被人工校订、固化为标准化生产实体，并继续生成部门任务草稿。

## What Changes

- 新增一个面向制片统筹的桌面优先 Web 工作台，串联剧本场次、原文证据与 AI 拆解建议。
- 新增 AI 建议的编辑、合并、确认、拒绝交互，并区分原文明确元素与 AI 生产推断。
- 新增稳定生产实体与部门任务草稿的转换链路，保留场次、剧本版本和来源证据。
- 新增一条模拟的剧本 V2 变更影响审阅状态，避免静默覆盖已确认实体或已生成任务。
- 新增 DeepSeek 兼容的服务端调用边界；密钥仅通过服务端环境变量提供，缺少密钥时使用确定性 Demo 数据。
- 新增产品说明文档、演示说明、公开 GitHub 仓库与可分享的网页部署。

## Capabilities

### New Capabilities

- `script-breakdown-review`: 制片统筹可以按场次审阅与校订有原文证据的 AI 拆解建议。
- `production-entity-tasking`: 已确认建议可创建稳定生产实体，并按部门生成任务草稿。
- `script-version-impact`: 剧本版本变化以待审阅影响集呈现，不静默破坏既有实体与任务关系。
- `safe-ai-demo-delivery`: Demo 可在安全服务端边界调用 DeepSeek，并以无密钥模拟模式公开部署。

### Modified Capabilities

无。

## Impact

- 新建 React/Vite 前端、轻量服务端 API 边界、确定性演示数据和浏览器端状态管理。
- 新增产品、技术设计、运行和部署文档。
- 新增公开 GitHub 仓库与托管部署；不提交或暴露任何模型密钥。

## Delivery Contract

- Parent outcome: docs/product/roadmap.md#面试-demo-交付
- Parent acceptance: independent
- [AIR-01] Outcome: 制片统筹能在同一工作台中从场次和原文定位 AI 建议，并完成编辑、合并、确认或拒绝；Negative: 页面显示了拆解卡片但无法追溯到原文或操作不改变状态；Evidence: 浏览器真实点击核心审阅链并检查状态变化。
- [AIR-02] Outcome: 已确认建议能成为跨场次复用的稳定实体，并生成包含部门、截止要求和剧本上下文的任务草稿；Negative: 只有视觉列表或重复卡片，没有实体关系和任务转换；Evidence: 浏览器从确认建议走到实体及任务草稿的最小真链。
- [AIR-03] Outcome: 模拟 V2 剧本变化会显式列出受影响实体与已生成任务，并等待制片决策；Negative: 版本号变化但既有关系被静默覆盖，或只有无动作的提示文案；Evidence: 浏览器进入版本影响状态并完成一次保留、合并或新建选择。
- [AIR-04] Outcome: 用户可通过公开网址使用完整 Demo，阅读产品说明，并在配置服务端密钥后调用 DeepSeek；Negative: 本地构建通过但公网不可访问，或密钥进入前端包、Git 历史、日志；Evidence: 公网访问与核心链验证、仓库秘密扫描、构建产物检查及服务端环境变量验证。
```
## openspec/changes/build-ai-script-production-workspace/design.md

- Source: openspec/changes/build-ai-script-production-workspace/design.md
- Lines: 1-51
- SHA256: f2b46ac71ad0f0ca0d6c82dae624be95371666c6bb2547fa85262cbac70f9c60

```md
## Context

这是一个从零创建、公开部署的面试 Demo。核心风险不是吞吐量，而是短时间内仍需证明真实产品闭环：AI 输出有证据、可被人校订、能成为稳定生产对象，并且不会因剧本版本变化而静默破坏下游工作。公开仓库和公网部署同时意味着任何模型凭证都不能进入浏览器包或 Git 历史。

## Goals / Non-Goals

**Goals:**

- 用一个桌面优先工作台完成拆解审阅、实体创建、任务草稿和版本影响审阅。
- 使用确定性种子数据保证演示稳定，同时保留 DeepSeek 服务端真实调用入口。
- 以少量、清晰的 React 组件和 TypeScript 领域模型支持可验证交互。
- 交付公开仓库、产品文档与可访问部署。

**Non-Goals:**

- 不实现登录、多租户、实时协作、数据库持久化或生产通知。
- 不评估剧本拆解质量，不实现完整排期、预算或版本匹配算法。
- 不允许 Agent 自动发布任务或静默更改已确认数据。

## Decisions

1. **React + Vite + TypeScript 的单页工作台。** 复杂多栏编辑器使用组件化 React，状态由前端内存管理；相比引入完整应用框架，更适合本次单主链 Demo。主要区域拆为项目顶栏、场次导航、剧本证据面板、建议审阅面板、实体/任务视图与版本影响抽屉。
2. **确定性种子数据是演示主路径。** 默认数据覆盖重复实体、明确元素、隐含 VFX 和一条 V2 影响。相比把演示成败绑定到实时模型，固定数据更能稳定证明产品交互；真实模型入口是增强路径。
3. **固定 taxonomy 与来源证据优先。** 模型只能输出项目已定义类型；每条建议必须携带 source evidence、explicit/inferred 和审阅状态。相比自由标签，这能保证下游部门和任务消费。
4. **稳定实体与任务快照分离。** 建议确认后映射到具有稳定 ID 的实体；同一实体可关联多个场次。任务草稿引用实体，同时保存创建时剧本版本和需求快照，避免源数据变化导致任务内容无声漂移。
5. **DeepSeek 仅经服务端边界调用。** `/api/ai/breakdown` 从 `DEEPSEEK_API_KEY` 读取凭证，校验结构化响应并返回领域对象；客户端永远不接触凭证。无密钥、超时或结构错误时返回显式 `mock` 模式，而不是伪装成实时成功。
6. **版本变化使用影响集，不做自动迁移。** V2 Demo 生成新增、变更、删除与待匹配项；用户必须选择保留关联、合并或新建。已生成任务只标记需要复核，不自动改写。
7. **视觉先行后实现。** 先生成并选择完整主屏概念，再提取 token、组件与可见文案，前端实现以选定概念为视觉规格；未选方向前不搭建 UI。

## Risks / Trade-offs

- [固定数据可能被误解为真实模型结果] → 顶栏持续显示“演示数据”或“DeepSeek 实时”模式，并在产品文档说明边界。
- [多栏工作台在小屏拥挤] → 本次以 1280px 以上桌面为验收主表面，小屏提供不裁切的纵向只读/简化布局。
- [真实模型返回不稳定结构] → 服务端 schema 校验、超时和确定性回退；不把未校验数据写入领域状态。
- [公开部署泄露密钥] → 仅使用服务端环境变量，提交前扫描仓库与前端构建产物，不在日志打印请求头或环境值。
- [版本影响仅为模拟逻辑] → UI 和文档明确这是产品状态验证，不宣称已完成生产级 diff 或继承算法。

## Migration Plan

从空仓库创建，无数据迁移。先以 mock 模式部署；配置服务端环境变量后启用实时分析。若实时接口异常，可移除部署环境变量即时回到确定性 Demo，不影响核心交互。

## Open Questions

- 三套视觉方向由用户选择后锁定；选择只影响视觉系统，不改变上述信息架构与领域契约。

## Acceptance Design

- [AIR-01] Owner: 建议审阅状态；Observable: 原文与建议联动且操作真实改变状态；Counterexample: 只有静态卡片或无法定位证据；Evidence: 浏览器核心审阅链。
- [AIR-02] Owner: 实体与任务领域状态；Observable: 确认建议生成跨场次实体与部门任务草稿；Counterexample: 列表存在但无引用关系或快照；Evidence: 浏览器端到端状态检查。
- [AIR-03] Owner: 版本影响状态；Observable: V2 影响必须等待人工决策；Counterexample: 只换版本号或静默覆盖；Evidence: 浏览器完成一条影响决策。
- [AIR-04] Owner: 部署与 AI 服务端边界；Observable: 公网 Demo 可用且模式真实披露；Counterexample: 仅本地可用或凭证进入客户端；Evidence: 公网检查、秘密扫描和构建产物检查。
```

## openspec/changes/build-ai-script-production-workspace/tasks.md

- Source: openspec/changes/build-ai-script-production-workspace/tasks.md
- Lines: 1-34
- SHA256: dea5c830a808cf7aec7793fec71ffd6ea9207914e45e502aef2015ad89bc9715

```md
## 1. 产品与视觉规格

- [x] 1.1 [AIR-04] 完成可独立阅读的产品说明、MVP 边界与三分钟演示脚本
- [x] 1.2 [AIR-01][AIR-02][AIR-03][AIR-04] 完成领域数据、DeepSeek 服务端边界、回退与秘密检查契约
- [ ] 1.3 [AIR-01][AIR-02][AIR-03] 生成三套完整工作台概念并由用户选择唯一视觉规格

## 2. 项目与领域基础

- [ ] 2.1 [AIR-01][AIR-02] 基于已选概念建立 React/Vite/TypeScript 项目、设计 token 与组件骨架
- [ ] 2.2 [AIR-01][AIR-02][AIR-03] 实现 ScriptVersion、Scene、SourceEvidence、Suggestion、ProductionEntity、TaskDraft 与 VersionImpact 类型和确定性种子数据
- [ ] 2.3 [AIR-01][AIR-02][AIR-03] 实现建议审阅、实体合并/创建、任务草稿与版本影响决策的领域状态转换

## 3. 核心工作台

- [ ] 3.1 [AIR-01] 实现场次导航、剧本原文、来源高亮和建议审阅三栏主屏
- [ ] 3.2 [AIR-01] 实现编辑、合并、确认、拒绝以及 explicit/inferred 状态反馈
- [ ] 3.3 [AIR-02] 实现跨场次实体视图和按部门分组的任务草稿生成链
- [ ] 3.4 [AIR-03] 实现模拟 V2 影响提示、影响详情与至少一种人工决策闭环
- [ ] 3.5 [AIR-01][AIR-02][AIR-03] 实现桌面主视口、移动窄屏和减少动态效果的可用样式

## 4. AI 服务端边界

- [ ] 4.1 [AIR-04] 实现只从服务端环境变量读取凭证的 `/api/ai/breakdown` DeepSeek 代理与结构校验
- [ ] 4.2 [AIR-04] 实现无密钥、超时、供应商错误和结构错误时的确定性回退与模式披露
- [ ] 4.3 [AIR-04] 增加服务端契约、领域转换和密钥不可达前端的最小自动化测试

## 5. 验证与公开交付

- [ ] 5.1 [AIR-01][AIR-02][AIR-03] 在内置浏览器完成核心点击链、刷新初始态、窄屏和相邻状态验证
- [ ] 5.2 [AIR-01][AIR-02][AIR-03] 将已选概念与最终截图并排检查，修复层级、间距、字体、裁切、重叠和状态完整性差异
- [ ] 5.3 [AIR-04] 运行 lint、类型、测试、构建、秘密扫描和前端构建产物凭证检查
- [ ] 5.4 [AIR-04] 完成 README、运行配置、部署说明与公开仓库元数据
- [ ] 5.5 [AIR-04] 在确认 GitHub 主账号后创建公开仓库、提交并推送已验证版本
- [ ] 5.6 [AIR-04] 部署公网 Demo，复跑公网核心链并记录最终仓库、部署 URL 与验证证据
```

## openspec/changes/build-ai-script-production-workspace/specs/production-entity-tasking/spec.md

- Source: openspec/changes/build-ai-script-production-workspace/specs/production-entity-tasking/spec.md
- Lines: 1-17
- SHA256: 26d52295ed61542fcdb49597a382c2efe200bd2ec782918d35da48eec45c1aa2

```md
## ADDED Requirements

<!-- comet-acceptance: AIR-02 -->
### Requirement: 稳定生产实体
系统 SHALL 将已确认建议创建为具有稳定 ID、标准类型、Metadata、来源证据和场次关系的生产实体；同一实体 SHALL 能关联多个场次。

#### Scenario: 合并跨场次重复实体
- **WHEN** 用户将两个场次中的同一道具建议合并并确认
- **THEN** 系统创建一个生产实体并保留两个场次关联

<!-- comet-acceptance: AIR-02 -->
### Requirement: 部门任务草稿
系统 SHALL 从已确认实体生成按部门分组的任务草稿，并包含实体引用、负责部门、截止要求、关联场次、来源剧本版本与需求快照。

#### Scenario: 生成特效部门任务
- **WHEN** 用户选择已确认的 VFX 实体并生成任务草稿
- **THEN** 系统在特效部门下创建包含上下文与版本快照的待下发任务
```

## openspec/changes/build-ai-script-production-workspace/specs/safe-ai-demo-delivery/spec.md

- Source: openspec/changes/build-ai-script-production-workspace/specs/safe-ai-demo-delivery/spec.md
- Lines: 1-29
- SHA256: 025d6711a7588715a203ba2af8c53570b84775a1f4bcdd620f6cc5ab8ca5ede1

```md
## ADDED Requirements

<!-- comet-acceptance: AIR-04 -->
### Requirement: AI 运行模式真实披露
系统 SHALL 明确显示当前使用确定性演示数据还是 DeepSeek 实时分析，并在实时分析不可用时安全回退到演示数据。

#### Scenario: 未配置服务端密钥
- **WHEN** 部署环境未配置 `DEEPSEEK_API_KEY`
- **THEN** 系统保持核心链路可用并明确显示演示数据模式

#### Scenario: 实时分析成功
- **WHEN** 服务端配置有效凭证且返回通过结构校验的结果
- **THEN** 系统显示 DeepSeek 实时模式并载入可审阅建议

<!-- comet-acceptance: AIR-04 -->
### Requirement: 公开交付不暴露凭证
系统 MUST 只在服务端读取模型凭证；公开仓库、浏览器请求、前端源代码、前端构建产物和日志 MUST NOT 包含凭证。

#### Scenario: 发布前秘密检查
- **WHEN** 系统准备推送公开仓库和部署
- **THEN** 秘密扫描与前端构建产物检查均未发现模型凭证，且公网地址可完成核心演示链

<!-- comet-acceptance: AIR-04 -->
### Requirement: 产品说明可独立阅读
公开仓库 SHALL 包含产品说明和演示文档，解释目标用户、AI 边界、实体任务链、版本策略、MVP 非目标与运行方式。

#### Scenario: 面试官从仓库理解产品
- **WHEN** 读者只阅读公开产品说明与演示文档
- **THEN** 读者可以理解用户、问题、核心链、AI/HITL 设计和当前 Demo 边界
```

## openspec/changes/build-ai-script-production-workspace/specs/script-breakdown-review/spec.md

- Source: openspec/changes/build-ai-script-production-workspace/specs/script-breakdown-review/spec.md
- Lines: 1-21
- SHA256: d81781db617d530d97309ee661fc94f6abc13c9c269a61578060b972787cdfd9

```md
## ADDED Requirements

<!-- comet-acceptance: AIR-01 -->
### Requirement: 场次化拆解审阅
系统 SHALL 在同一工作台中展示场次列表、剧本原文与对应 AI 建议，并使每条建议可追溯到具体原文证据。

#### Scenario: 定位建议来源
- **WHEN** 用户选择一个场次或建议
- **THEN** 系统显示对应原文并高亮该建议的来源证据

<!-- comet-acceptance: AIR-01 -->
### Requirement: 受控建议状态
系统 SHALL 使用预定义 taxonomy 展示建议，并 SHALL 支持编辑、合并、确认和拒绝；每条建议 MUST 标注为原文明确或生产推断。

#### Scenario: 校订 AI 生产推断
- **WHEN** 用户编辑一条推断型 VFX 建议并确认
- **THEN** 系统保留修订内容、来源证据、类型与已确认状态

#### Scenario: 拒绝错误建议
- **WHEN** 用户拒绝一条待审建议
- **THEN** 系统将其从待确认集合移除并保留拒绝状态
```

## openspec/changes/build-ai-script-production-workspace/specs/script-version-impact/spec.md

- Source: openspec/changes/build-ai-script-production-workspace/specs/script-version-impact/spec.md
- Lines: 1-13
- SHA256: 97e03462bcf1c2eef3ebe865d812a7daff292ae41f41c3b48c4cad7d663fdd52

```md
## ADDED Requirements

<!-- comet-acceptance: AIR-03 -->
### Requirement: 版本影响显式审阅
系统 SHALL 在剧本新版本改变场次或来源文本时生成影响集，显示受影响实体与任务，并 SHALL NOT 静默覆盖已确认关系或任务快照。

#### Scenario: 新场次拆分已有内容
- **WHEN** V2 在两个已有场次之间插入新场次并复用原有内容
- **THEN** 系统列出待重新绑定的实体和已生成任务，等待用户选择保留、合并或新建

#### Scenario: 处理已下发工作影响
- **WHEN** 受影响实体已有任务草稿或已标记下发
- **THEN** 系统将任务标记为需要复核且不自动改写任务内容
```

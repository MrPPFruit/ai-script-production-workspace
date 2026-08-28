## ADDED Requirements

<!-- comet-acceptance: AIR-03 -->
### Requirement: 项目内演示改编版
系统 SHALL 将 V1 标识为来源可核验的《暴风雨》英文公版片段，并 SHALL 将 V2 标识为项目内演示改编版。V2 MUST 包含真实文本或场次结构变化，而不是只把制作方案变化伪装成剧本改版。

#### Scenario: 拆分 ACT III, SCENE III
- **WHEN** 用户切换到项目内演示改编版 V2
- **THEN** 系统显示 V1 的 ACT III, SCENE III 与 V2 的 III-A/III-B 之间的文本、场次和实体关系差异

<!-- comet-acceptance: AIR-03 -->
### Requirement: 场次—实体关系显式复核
系统 SHALL 显示 V2 影响的来源锚点、场次—实体关系和相关未下发草稿，并 SHALL 等待用户完成一次关系决策。系统 MUST NOT 静默覆盖 V1、自动重建实体或声称处理已下发任务。

#### Scenario: 人工处理关系变化
- **WHEN** V2 的文本/场次变化影响既有实体关系
- **THEN** 系统显示变更前后来源，并允许用户更新场次关联或保留原关系

#### Scenario: 相关草稿需要复核
- **WHEN** 受影响实体存在未下发任务材料草稿
- **THEN** 原草稿内容保持不变，并显示“来源已变化，发布前复核”

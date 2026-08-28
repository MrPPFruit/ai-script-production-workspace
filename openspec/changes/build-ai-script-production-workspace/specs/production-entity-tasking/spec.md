## ADDED Requirements

<!-- comet-acceptance: AIR-02 -->
### Requirement: 稳定生产实体与版本化关系
系统 SHALL 以稳定 ID 保存生产实体及其规范类型和 Metadata，并 SHALL 以独立的版本化关系记录关联 Act/Scene、剧本版本和来源锚点。同一实体 SHALL 能关联多个场次。

#### Scenario: 同一角色关联多个场次
- **WHEN** 用户将 ACT I, SCENE II 的 Ariel 建议关联到已存在的 Ariel 实体
- **THEN** 系统保留实体 ID，并显示全部关联场次与可返回的来源锚点

<!-- comet-acceptance: AIR-02 -->
### Requirement: 轻量 Metadata 缺口提示
系统 SHALL 对 Demo taxonomy 预置的关键 Metadata 做非阻断式缺口提示，并 SHALL 只列出缺失字段，不计算置信度或复杂完成度分数。

#### Scenario: 任务材料缺少制作要求
- **WHEN** 实体缺少生成部门材料所需的制作要求
- **THEN** 系统显示缺失字段并允许用户继续查看来源和补充内容

<!-- comet-acceptance: AIR-02 -->
### Requirement: 未下发的部门任务材料
系统 SHALL 从实体生成按目标部门组织的任务材料草稿，并包含实体引用、制作要求、关联 Act/Scene、来源版本/摘要及可选准备窗口。草稿 MUST 明确标为未下发，且 MUST NOT 声称已建立真实收件人、通知、送达或回执。

#### Scenario: 生成 VFX 部门材料
- **WHEN** 用户从已采用的 VFX 实体生成部门任务材料
- **THEN** 系统创建一条可追溯到来源场次和实体、明确未下发的 VFX 部门草稿

#### Scenario: 按部门查看材料
- **WHEN** 用户查看任务材料区域
- **THEN** 系统按部门分组并显示内联数量，不展示虚假的工作量或排期看板

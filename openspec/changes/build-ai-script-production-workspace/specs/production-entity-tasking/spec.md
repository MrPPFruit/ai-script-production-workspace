## ADDED Requirements

<!-- comet-acceptance: AIWF-07 -->
### Requirement: 稳定实体与精确来源关系
系统 SHALL 只从人工采用或关联后的建议建立 ProductionEntity。实体 SHALL 使用稳定 ID；来源关系 MAY 指向第四幕、处理单元和一个或多个精确 evidence，并 SHALL 允许同一实体关联多个来源。

#### Scenario: 同一实体关联多个证据
- **WHEN** 用户把另一条建议关联到既有实体
- **THEN** 系统保留实体 ID 并新增可返回全文证据的来源关系

### Requirement: 未下发部门任务材料
系统 SHALL 从人工确认实体生成按角色部、场景部、道具部或 VFX 等部门组织的任务材料草稿。草稿 SHALL 保存实体、版本、来源证据和制作要求快照，并 MUST 明确标为未下发。

#### Scenario: 生成 VFX 部门草稿
- **WHEN** 用户从已采用的 VFX 实体生成任务材料
- **THEN** 系统创建可追溯到精确证据的未下发草稿，不显示真实收件人、送达或回执

#### Scenario: 信息仍有缺口
- **WHEN** 实体缺少任务所需制作要求
- **THEN** 系统非阻断提示缺失字段，不编造负责人、截止日、预算或完成度

<!-- comet-acceptance: AIWF-08 -->
### Requirement: 任务草稿保存创建时快照
重新分析或处理单元边界变化 MUST NOT 静默改写旧任务草稿。受影响草稿 MAY 显示只读复核提示，但 MUST NOT 声称更新或撤回真实任务。

#### Scenario: 来源关系需要复核
- **WHEN** 处理单元插入/切分影响草稿引用的实体来源
- **THEN** 原草稿内容保持不变并显示“来源已变化，发布前复核”

## ADDED Requirements

<!-- comet-acceptance: AIR-04 -->
### Requirement: 确定性演示数据真实披露
系统 SHALL 以确定性《暴风雨》数据完成全部核心链，并 SHALL 清楚显示这是演示数据、不代表模型质量。核心 Demo MUST NOT 依赖模型凭证或实时供应商响应。

#### Scenario: 无模型配置运行
- **WHEN** 部署环境没有任何模型凭证
- **THEN** 用户仍可从样本 1 / ACT I, SCENE I 完成来源、建议、实体、任务材料和版本关系复核主链

<!-- comet-acceptance: AIR-04 -->
### Requirement: 默认剧本来源与改编披露
系统 SHALL 显示《暴风雨》V1 的公版英文来源、取得日期、使用场次边界与项目自译声明，并 SHALL 清楚说明 V2 是项目内演示改编版。系统 MUST NOT 使用未核验第三方中文译本。

#### Scenario: 查看来源说明
- **WHEN** 用户查看默认项目或产品说明
- **THEN** 用户能区分公版英文来源、中文界面 Metadata 与项目内演示改编内容

<!-- comet-acceptance: AIR-04 -->
### Requirement: 范围边界真实披露
系统 SHALL 将部门产物称为未下发任务材料草稿，并 SHALL 说明真实收件人、通知、回执、权限、审计及下发后更新/撤回不在 MVP。

#### Scenario: 读者理解交付边界
- **WHEN** 读者只查看公开 Demo 与产品文档
- **THEN** 读者不会把模拟建议当成实时模型结果，也不会把任务草稿理解为已送达

<!-- comet-acceptance: AIR-04 -->
### Requirement: 产品说明可独立阅读
公开仓库 SHALL 包含产品规格、范围决策和演示脚本，解释目标用户、来源—实体—部门材料主链、版本关系、AI/模拟边界、MVP 非目标与 DEFERRED。

#### Scenario: 面试官从仓库理解产品
- **WHEN** 读者只阅读产品与 OpenSpec 文档
- **THEN** 读者能区分录音事实、用户确认、MVP 产品选择和后续能力

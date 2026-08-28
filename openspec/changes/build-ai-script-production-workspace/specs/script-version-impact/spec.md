## ADDED Requirements

<!-- comet-acceptance: AIWF-08 -->
### Requirement: 一次处理单元插入或切分影响
系统 SHALL 演示一次处理单元插入或切分导致实体来源关系需要人工复核。系统 MUST NOT 把该案例描述为原作场次变化、通用自动 diff 或通用自动继承。

#### Scenario: 处理单元边界发生变化
- **WHEN** V2 插入或切分一个处理单元
- **THEN** 系统显示受影响实体的旧新来源和精确 evidence，并等待人工决定

### Requirement: 版本影响不静默覆盖
系统 MUST NOT 静默覆盖 V1、自动重建实体或改写旧任务快照。用户 SHALL 能选择重连 V2 来源或保留原关系。

#### Scenario: 人工处理来源关系
- **WHEN** 用户审阅一个受影响实体
- **THEN** 更新只作用于所选 V2 来源关系，V1 和旧草稿保持可回看

<!-- comet-acceptance: AIWF-09 -->
### Requirement: 重新分析采用追加批次
重新分析当前或全部处理单元 SHALL 创建新的 run 和 SuggestionBatch，MUST NOT 自动修改旧建议决定、实体、来源关系、任务草稿或剧本文本。

#### Scenario: 同一处理单元连续分析两次
- **WHEN** 用户发起第二次分析
- **THEN** 系统保留两个 run/batch 和旧人工决定，下游数据保持不变

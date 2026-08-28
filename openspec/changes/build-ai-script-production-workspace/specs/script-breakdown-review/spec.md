## ADDED Requirements

<!-- comet-acceptance: AIR-01 -->
### Requirement: 《暴风雨》场次与来源锚点
系统 SHALL 从《暴风雨》样本第 1 项 ACT I, SCENE I 开始呈现正式 Demo，并 SHALL 使用真实 Act/Scene 标识、英文公版来源片段、明确标注的项目自译和可定位的来源锚点。系统 MUST NOT 在正式 Demo 保留旧原创剧本名、虚构地点或任意场次编号。

#### Scenario: 从第一个真实场次开始
- **WHEN** 用户打开默认项目
- **THEN** 系统选择《暴风雨》V1 的样本 1 / ACT I, SCENE I，并显示来源信息、英文原文/项目自译片段和对应建议

<!-- comet-acceptance: AIR-01 -->
### Requirement: 受控建议与制作判断
系统 SHALL 使用项目预设的受控实体类型展示 AI/确定性建议。每条建议 MUST 关联来源锚点；任何超出原文字面事实的隐含 VFX/制作需求 MUST 同时显示制作判断。

#### Scenario: 从风暴线索形成制作建议
- **WHEN** ACT I, SCENE I 的风暴/雷电来源锚点被选中
- **THEN** 系统显示受控类型、原文来源与可编辑的声音/灯光/VFX 制作判断

<!-- comet-acceptance: AIR-01 -->
### Requirement: 人工校订与实体写入
系统 SHALL 支持用户校订建议，并 SHALL 仅在用户显式选择后采用为新实体或关联到既有实体；系统 MUST NOT 按名称自动合并或让建议直接写入生产实体。

#### Scenario: 采用为新实体
- **WHEN** 用户修订建议并选择采用为新实体
- **THEN** 系统创建带修订内容、来源锚点和版本关系的实体

#### Scenario: 关联跨场次既有实体
- **WHEN** 用户在另一个 Act/Scene 中选择“关联到既有实体”
- **THEN** 系统保留同一实体 ID，并新增该场次与来源锚点的关系

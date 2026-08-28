## ADDED Requirements

<!-- comet-acceptance: AIWF-01 -->
### Requirement: 第四幕处理单元真实顺序分析
系统 SHALL 按导入配置顺序处理《雷雨》第四幕的实际 3–4 个 AnalysisUnit，并 SHALL 逐个调用现有 DeepSeek API。AnalysisUnit MUST 仅表示系统执行边界，MUST NOT 在产品文案中表示为原作场次。

#### Scenario: 完成一次全部处理
- **WHEN** 用户发起“分析全部处理单元”
- **THEN** 系统前一单元返回后才开始下一单元，且请求数与导入配置一致

<!-- comet-acceptance: AIWF-02 -->
### Requirement: 诚实的处理状态和模式
系统 SHALL 只展示等待、当前单元请求中、DeepSeek 已校验待审、fallback 待审或失败，并 SHALL 为每个单元显示最终 mode。系统 MUST NOT 伪造模型内部阶段。

#### Scenario: fallback 不冒充 DeepSeek
- **WHEN** 一个单元返回 mode=fallback 和原因
- **THEN** 系统显示 fallback 待审及原因，不显示为 DeepSeek 成功

<!-- comet-acceptance: AIWF-03 -->
### Requirement: 结构化建议与精确 evidence
每条待审建议 SHALL 包含至少一个精确 evidence quote/range。服务端 SHALL 验证 quote 是当前处理单元文本的逐字子串并重算范围；不合格上游输出 MUST NOT 以 mode=deepseek 返回。

#### Scenario: 模型引用不存在的原文
- **WHEN** DeepSeek 输出的 quote 不存在于当前处理单元文本
- **THEN** 服务端拒绝该模型输出并返回明确 fallback

<!-- comet-acceptance: AIWF-06 -->
### Requirement: 第四幕导入全文与证据导航
中间阅读区 SHALL 连续显示本次导入的第四幕全部文本，MUST NOT 声称是整部《雷雨》。点击处理单元 SHALL 只滚动到对应锚点；点击建议/evidence SHALL 切换正确版本、滚动并高亮精确 quote。

#### Scenario: 从建议返回全文证据
- **WHEN** 用户点击一条制作建议的 evidence
- **THEN** 系统在该建议所属版本的第四幕导入全文中滚动并高亮精确原文

<!-- comet-acceptance: AIWF-05 -->
### Requirement: 人工审阅是唯一写入边界
系统 SHALL 支持用户编辑建议、采用为新实体、关联既有实体或忽略。AI MUST NOT 自动创建实体、来源关系或任务草稿，文本片段 MUST NOT 直接变成实体。

#### Scenario: 编辑后采用为新实体
- **WHEN** 用户编辑建议并选择采用为新实体
- **THEN** 系统使用编辑后内容创建稳定实体并保留精确来源

<!-- comet-acceptance: AIWF-10 -->
### Requirement: 主操作必须可兑现
主 UI 的可点击操作 SHALL 完成承诺结果。镜头级拆分、自动拆分、通用 diff 和真实任务派发 SHALL 只静态说明，MUST NOT 以死按钮出现。

#### Scenario: 遍历主界面控件
- **WHEN** 验收者点击所有主操作
- **THEN** 每个操作均完成可观察结果，未来能力仅为非交互说明

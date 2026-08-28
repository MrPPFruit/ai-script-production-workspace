## ADDED Requirements

<!-- comet-acceptance: AIWF-10 -->
### Requirement: 默认内容和使用边界真实披露
产品 SHALL 显示“《雷雨》·面试 Demo 导入版本（第四幕）”，并 SHALL 说明完整文本仅指本次导入的第四幕。系统 MUST NOT 编造原作场次编号或声称展示整部《雷雨》。

#### Scenario: 读者查看默认项目
- **WHEN** 面试官打开 Demo
- **THEN** 能区分第四幕原作来源、系统处理单元和精确 evidence

### Requirement: 正文加载与公开仓库决策分离
本 Demo SHALL 记录文本来源和“仅供面试官查看”的使用边界，并 SHALL 支持通过私有部署数据或本地导入加载正文。公开仓库是否包含正文 SHALL 由最终交付阶段单独决定，运行链 MUST NOT 依赖仓库内置正文。

#### Scenario: 当前仓库不含正文
- **WHEN** 当前公开仓库没有第四幕正文
- **THEN** 运行环境仍能从私有/本地来源加载，且产品链不受影响

<!-- comet-acceptance: AIWF-01 -->
### Requirement: DeepSeek 是正式主路径
正式 Demo SHALL 通过服务端 DeepSeek 配置处理全部 AnalysisUnit。确定性建议 MAY 作为明确预览或 fallback，但 MUST NOT 替代真实主链验收。

#### Scenario: 正式主链进入审阅
- **WHEN** 全部单元上游响应通过校验
- **THEN** 每个单元以 mode=deepseek 进入待审并形成数量一致的摘要

<!-- comet-acceptance: AIWF-04 -->
### Requirement: fallback 保持单元语义
DeepSeek 不可用或输出不合格时，系统 SHALL 使用相同 analysisUnitId 的确定性建议进入审阅，并 SHALL 显示 mode=fallback 和原因。系统 MUST NOT 只返回通用占位或冒充模型成功。

#### Scenario: 一个处理单元超时
- **WHEN** 当前单元请求超时
- **THEN** 该单元使用对应确定性建议并显示 UPSTREAM_TIMEOUT，后续单元仍按顺序处理

<!-- comet-acceptance: AIWF-03 -->
### Requirement: 服务端凭证边界
DeepSeek 凭证 MUST 只从服务端环境读取，MUST NOT 出现在客户端、仓库、文档、日志、截图或前端产物。

#### Scenario: 扫描公开交付物
- **WHEN** 发布前扫描仓库和构建产物
- **THEN** 不存在真实凭证或供应商 Authorization

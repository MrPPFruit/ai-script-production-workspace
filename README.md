# AI 剧本生产台

面向制片、制作统筹与部门主管的 AI 剧本拆解 Demo。系统围绕《雷雨》第四幕演示“完整文本 → 处理单元 → DeepSeek 结构化建议 → 人工审阅 → 生产实体 → 未下发任务材料”的可追溯链路。

- 在线 Demo（正式入口）：<https://script-demo.ppserver.xyz>
- 网页产品手册（完整 Markdown 版）：<https://script-demo.ppserver.xyz/product-guide>
- Cloudflare Worker 备用入口：<https://ai-script-production-demo-ppfruit.mrppfruit-portfolio.workers.dev>
- Sites 旧镜像：<https://ai-script-production-workspace.ppfruit.chatgpt.site>（可能触发平台边缘拦截，不作为交付入口）
- 完整 Markdown 手册：[docs/product/INTERVIEW_PRODUCT_GUIDE.md](docs/product/INTERVIEW_PRODUCT_GUIDE.md)

## 当前可演示能力

- 中文完整剧本阅读、处理单元导航、来源证据定位与高亮；
- DeepSeek Flash 同源服务端调用、顺序处理、可见状态和诚实 fallback；
- 建议类型中文筛选，其中 `cast` 显示为“人物关系”，未知扩展类型显示为“待分类”；
- 建议编辑、采用、关联与忽略，稳定实体与来源关系；
- 可编辑的部门任务材料草稿，来源、版本和“未下发”保持只读；
- V1/V2 影响审阅，以及版本化编辑的正确后续流程说明。

## 已知缺陷与边界

线上真实 DeepSeek 请求已经接通，但模型返回仍可能未通过结构与逐字证据校验。此时页面会明确显示 `fallback · INVALID_MODEL_OUTPUT`，继续使用同一处理单元的预置审阅数据演示产品链路；不会隐藏问题，也不会把 fallback 说成模型成功。

当前不提供真实任务派发/撤回、剧本正文直接保存、通用版本 diff、数据库持久化与多人权限。版本编辑入口为明确禁用的产品规划说明，不是假功能。

## 本地运行

```bash
cd web
npm install
npm run dev
```

访问终端输出的本地地址。没有服务端 `DEEPSEEK_API_KEY` 时，AI 接口会明确进入确定性 fallback；密钥不得写入前端、仓库或提交历史。

验证命令：

```bash
cd web
npm run typecheck
npm run build
node --test tests/*.test.mjs
```

## 演示材料说明

本项目及内置文本仅用于本次非商业面试 Demo，用于说明产品流程与交互思考，不用于商业发行。面试结束后可按实际使用边界替换或移除演示文本。

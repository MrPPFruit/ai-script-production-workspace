# 中国大陆与 VPN 双情景部署决策

> 核验日期：2026-08-28。本文只引用平台官方资料，并把“平台能力”“本项目已部署状态”“用户既有链路实测”分开记录。网络可达性会受运营商、地区、DNS、平台风控和跨境链路影响，任何平台说明都不能替代目标设备实测。

## 结论

Cloudflare（本项目通过 OpenAI Sites 的 Cloudflare Worker 托管链路）是当前唯一主部署平台。原因不是它能保证中国大陆直连，而是用户已确认 VPN 可用，同时其既有 Cloudflare 部署在中国大陆无 VPN 也能打开、只是可能较慢；在此前提下，Cloudflare 提供稳定 URL、静态前端与 Worker 同源部署、服务端 Secret、较低迁移成本，最适合面试时限。

EdgeOne Pages / EdgeOne Pages for Makers 仅作为备用：只有本项目新 Cloudflare 链接在目标城市、运营商、无 VPN 设备上实测失败，且面试场景必须无 VPN，才切换。EdgeOne 的中国大陆系统域名预览链接只有 3 小时，适合临时演示；长期中国大陆自定义域仍需要 ICP 备案，因此不作为当前主线。

### 双情景决策

| 情景 | 首选 | 选择边界 |
| --- | --- | --- |
| A. 面试官/用户在中国大陆且不使用 VPN | 先实测本项目 Cloudflare 链接；失败后用 EdgeOne 3 小时预览链接 | 用户既有 Cloudflare 链路的成功经验不是新链接的稳定性保证；EdgeOne 临时链路也必须现场实测 |
| B. 可以使用 VPN | Cloudflare / Sites | 优先稳定 URL、同源 Worker、Secret、最少迁移；无需为一次面试先购买域名或办理 ICP |

若只能选一个平台，选 Cloudflare / Sites。主、备双路线不是同时维护两套生产系统：Cloudflare 是持续更新目标，EdgeOne 只保留失败时的短时演示预案，因此不会把当前交付过度设计成双云生产。

## 三类事实必须分开

### 1. 平台能力

Cloudflare Pages 支持 GitHub / GitLab 自动部署，也支持 Wrangler Direct Upload；Direct Upload 项目获得稳定的 `<PROJECT>.pages.dev` 地址。Pages Functions 的变量和 Secret 通过 `context.env` 读取，Secret 值加密存储且设置后不可再次查看。静态资源请求免费且不限量；免费层 Pages Functions 计入 Workers 配额。官方当前 Workers Free 计划为每日 100,000 次请求、每次 10 ms CPU 时间，仍须以账户控制台实际计划为准。

本项目走 Sites 的 Worker 静态资产部署链路，而不是直接新建普通 Cloudflare Pages 项目。两者底层能力相近，但项目 ID、版本、访问控制和发布操作由 Sites 管理，不能把普通 Pages 控制台步骤原样套用。

官方资料：

- [Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Pages Functions bindings 与 Secrets](https://developers.cloudflare.com/pages/functions/bindings/)
- [Pages Functions API](https://developers.cloudflare.com/pages/functions/api-reference/)
- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Static Assets 计费与限制](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Workers Builds Git 集成](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [`workers.dev` 路由](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)

### 2. 本项目已部署状态

| 项目项 | 当前状态 |
| --- | --- |
| Sites 项目 | 已创建并已将真实 `project_id` 写入 `web/.openai/hosting.json` |
| 静态页面 | 已将版本 1 私有发布到 `https://ai-script-production-workspace.ppfruit.chatgpt.site`；owner 鉴权请求返回 200，未鉴权请求返回 401 |
| 同源 `/api/ai/breakdown` | **未部署、不可用**；当前 Worker 只处理静态资产和 SPA fallback |
| `DEEPSEEK_API_KEY` | **未配置**；不得写入代码、Git、构建产物、终端输出或文档 |
| DeepSeek 真调用 | **未验收**；必须等 Worker adapter 完成、Secret 由用户安全录入后单独验证 |

当前静态页面来自 integration commit `47141b9` 的已验证基线，Sites 版本 1 对应托管提交 `94b46b2`。页面仍明确展示“确定性 Demo 数据 · 未调用模型”；线上 `POST /api/ai/breakdown` 已验证返回 404。存在 `web/api/ai/breakdown.js` 不等于它已适配 Cloudflare Worker，也不等于线上 API 可用。

用户已决定放弃《暴风雨》，后续改用中文默认剧本。因此版本 1 的页面内容已经过期，只能作为 **Cloudflare 网络连通性测试基线**；它不接受内容正确性验收，也不是最终演示内容版本。该变化不需要重做 Site 或更换稳定 URL，后续在同一 Site 发布新版本即可。

### 3. 用户无 VPN 实测状态

- 用户已确认：其**既有** Cloudflare 部署在中国大陆无 VPN 可访问，但可能较慢；VPN 访问没有问题。
- 本项目新 Cloudflare / Sites URL：已完成 owner 鉴权下的服务端访问验证，但尚未由中国大陆无 VPN 设备实测，状态仍为 `unknown`。
- 当前匿名 Vercel 临时链接：用户实际环境中 VPN 开启时返回 `403 Forbidden`，关闭 VPN 时无法访问，因此该**具体链接**不能交付。这是具体链路实测，不泛化为所有 Vercel 部署都不可用。

Vercel 官方也说明其没有中国大陆基础设施，`.vercel.app` 域名可能被阻断；自定义域名只能降低域名层面的风险，不能提供大陆可达性保证：[Accessing Vercel-hosted sites from mainland China](https://vercel.com/kb/guide/accessing-vercel-hosted-sites-from-mainland-china)。

## 四项独立验收

四项不得合并成一句“部署成功”。前一项通过不能证明后一项成立。

1. **静态页面**：稳定 URL 可打开；刷新 SPA 子路由仍回到应用；页面明确显示当前是确定性 Demo 基线。
2. **同源 Cloud Function / Worker**：`POST /api/ai/breakdown` 由同一域名上的 Cloudflare Worker adapter 处理；非 API 路径仍保持静态资源和 SPA fallback；当前未实现。
3. **服务端 Secret**：用户在受保护的 Sites / Cloudflare 设置界面录入名为 `DEEPSEEK_API_KEY` 的 Secret；浏览器包、Git、日志和消息均不得出现值；当前未配置。
4. **DeepSeek 真调用**：从页面发起一条最小请求，收到真实模型响应，并同时验证无 Secret 泄露、错误态和超时行为；当前未验收。

反例：静态页面返回 200、构建通过或 Worker 已发布，都不能证明 `/api/ai/breakdown` 已存在，更不能证明 DeepSeek 真调用成功。

## 为什么现有仓库适合 Cloudflare / Sites

现有构建链已经为 Sites 准备：

- `web/scripts/prepare-sites-build.mjs` 将 Vite 产物整理为 `dist/client/index.html`、`dist/server/index.js` 和 `dist/.openai/hosting.json`。
- `web/worker/index.js` 使用 `env.ASSETS.fetch()` 提供静态资源，并为 HTML 导航提供 SPA fallback。
- `web/tests/sites-worker.test.mjs` 明确断言不存在的 API 路由保持 404，避免静态 fallback 把 API 失败伪装成页面成功。

因此今天部署静态基线无需改 React UI；后续只需在同一个 Site 的 Worker 入口增加 `/api/ai/breakdown` adapter，并把现有 Node / Vercel 风格 `req`、`res`、`process.env` 适配到 Workers `Request`、`Response`、`env`。这属于后续 AI core 集成，不在本次静态发布中假装完成。

## 平台比较

| 平台 | URL 与大陆访问 | 函数 / Secret | 账号、备案与跨境边界 | 今天适配成本 | 决策 |
| --- | --- | --- | --- | --- | --- |
| **Cloudflare / Sites** | 稳定 Sites / Cloudflare URL；普通全球网络不承诺中国大陆可达。用户既有部署无 VPN 可用，但新链接必须实测 | Worker 可同源处理 API，支持服务端 Secret；当前仓库尚缺 Worker API adapter | 当前 Sites 身份已可创建项目；临时平台域名无需先办 ICP。普通 Cloudflare 与中国网络企业版不是一回事 | 静态基线最低；API adapter 后续局部迁移 | **主推荐** |
| **EdgeOne Pages / Makers** | 中国大陆 / 全球含大陆的系统预览 URL 有效 3 小时，过期后返回 401；永久自定义域需 ICP | Pages Functions 支持服务端函数与 Secret / 环境变量 | 需要腾讯云账号及通常的实名认证；大陆稳定自定义域涉及 ICP 和平台审核 | 静态与函数可行，但临时 URL 需面试前重发 | **无 VPN 且 Cloudflare 实测失败时备用** |
| **阿里云 ESA Functions and Pages** | 全球含大陆需要相应加速区域；免费入口不能当成大陆稳定能力保证 | 支持边缘函数、Pages、加密函数变量 | 需要阿里云账号、域名接入；大陆区域涉及 ICP。免费资格和区域以控制台为准 | 账号、域名和接入前置较重 | **今天不推荐** |
| **Vercel** | 当前具体匿名链接已经实测失败；官方不提供中国大陆基础设施保证 | Functions 与环境变量成熟，现有 Node handler 适配最小 | 自定义域不能消除跨境链路风险；当前链接还出现 403 | 技术迁移最少，但真实访问目标失败 | **不推荐交付当前链接** |
| **GitHub Pages** | 只有稳定静态站点 URL；大陆访问无 SLA / 保证 | 不支持服务端语言或同源 Secret 函数 | GitHub 账号即可；若另接 API，仍有跨域、Secret 和第二平台运维 | 静态简单，但必须双部署 | **不推荐本项目** |

### EdgeOne 官方边界

- [系统域名与 3 小时预览 URL](https://pages.edgeone.ai/document/domain-overview)
- [套餐限制](https://pages.edgeone.ai/document/limits-and-quotas)
- [Pages Functions](https://pages.edgeone.ai/document/pages-functions-overview)
- [构建指南](https://pages.edgeone.ai/document/build-guide)
- [DeepSeek 环境变量示例](https://edgeone.ai/document/184787238051311616)
- [Secrets](https://edgeone.ai/document/62764)
- [自定义域](https://pages.edgeone.ai/document/custom-domain)
- [ICP 备案说明](https://edgeone.ai/document/54208)

当前没有 EdgeOne 部署，也没有本项目 EdgeOne URL；3 小时预览链路只是官方能力与备用计划，不能写成已部署或已实测。

### 阿里云 ESA 官方边界

- [Functions and Pages 概览](https://www.alibabacloud.com/help/en/edge-security-acceleration/esa/user-guide/what-is-functions-and-pages/)
- [函数触发与站点前置](https://www.alibabacloud.com/help/en/edge-security-acceleration/esa/user-guide/trigger)
- [接入站点、区域与 ICP](https://www.alibabacloud.com/help/en/edge-security-acceleration/esa/getting-started/add-your-website-to-esa)
- [函数变量](https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/function-variable)
- [ESA 免费计划](https://www.alibabacloud.com/help/en/edge-security-acceleration/esa/product-overview/how-to-get-esa-for-free)

### Cloudflare China 不是普通 Cloudflare Pages

Cloudflare China Network 是与京东云合作的企业产品，需要单独订阅；每个接入的 apex domain 都需要有效 ICP。官方 FAQ 还说明 Pages 在中国网络内不可用，因为 `pages.dev` 证书不在中国网络中。不能把它与本项目使用的普通全球 Cloudflare / Sites 混为一谈。

- [Cloudflare China Network](https://developers.cloudflare.com/china-network/)
- [Cloudflare China Network FAQ](https://developers.cloudflare.com/china-network/faq/)

### Vercel 与 GitHub Pages 官方边界

- [Vercel Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [GitHub Pages 是静态托管](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages 不支持 PHP、Ruby、Python 等服务端语言](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## ICP、域名、跨境网络与平台风控

- 使用普通 Cloudflare / Sites 平台域名进行面试 Demo，不等于接入中国大陆 CDN，也不产生“大陆稳定可达”的承诺。跨境路径仍可能因地区、运营商、DNS、SNI、TLS、平台安全策略或 VPN 出口信誉波动。
- 未来若要求长期、面向中国大陆稳定服务，应使用已备案自定义域并选择明确覆盖中国大陆的合规托管 / CDN；这不是当天临时部署能保证的结果。
- `403` 可能来自平台访问控制、WAF、滥用风控或出口网络信誉，不能仅凭一次状态码归因于中国网络封锁。
- 不使用第三方测速结果作为稳定性保证；最终证据必须来自面试设备或同运营商、同网络条件的真实访问。

## 今天可做、需用户操作、无法保证

### 今天可做

- 已在同一 Sites 项目发布 47141b9 的静态基线，获得稳定生产 URL；此版本只验收网络连通性。
- 已运行类型检查、Sites Worker 测试、生产构建和产物结构检查。
- 已验证 owner 鉴权下静态首页返回 200，并确认 `/api/ai/breakdown` 返回 404、没有被误报为可用。
- 后续 AI Worker adapter 完成后，在同一 Site 保存新版本并更新发布，不更换用户测试入口。

### 需要用户提供或现场操作

- 用中国大陆、关闭 VPN 的真实设备测试新 URL；再用 VPN 测一次，记录城市、运营商、状态码和大致首屏体验。
- AI adapter 上线前，通过安全 UI 手动录入 Secret 名称 `DEEPSEEK_API_KEY`；绝不在聊天、终端、Git 或文档中粘贴值。
- 若 Cloudflare 无 VPN 实测失败且面试必须直连，再提供腾讯云账号并在需要时完成实名认证、控制台授权和 EdgeOne Secret 录入。

### 无法保证

- 普通 Cloudflare / Sites 在所有中国大陆地区和运营商长期无 VPN 可达。
- VPN 出口不会触发平台风控。
- EdgeOne 3 小时预览链接过期后继续可用。
- 没有 Worker adapter 和服务端 Secret 时完成 DeepSeek 真调用。

## 回滚与链接生命周期

- Sites 每次发布基于已保存版本；当前可回滚点是版本 1（托管提交 `94b46b2`）。出现回归时应重新发布上一份已验证版本，而不是删除项目或复用来源不明的构建产物。
- 当前目标是稳定 Cloudflare / Sites 生产 URL；同一 Site 后续更新版本时入口保持不变，实际 URL 以发布结果为准。
- EdgeOne 中国大陆系统预览 URL 只有 3 小时，过期后返回 401；它不是永久链接。若启用备用方案，应在面试前重新生成并现场验证。
- 不删除或覆盖现有 Vercel 部署；只是停止把已实测失败的匿名链接作为交付入口，因此回滚不依赖它。

# 默认剧本选择：《暴风雨》公版节选

## 已确认结论

公开 Demo 的默认剧本正式采用 William Shakespeare 的 **The Tempest（《暴风雨》）**。只提取以下三个有界片段：

1. **ACT I, SCENE I**：海上船只，暴风雨中的甲板调度。
2. **ACT I, SCENE II**：Prospero 居所前，Ariel 汇报制造风暴的经过。
3. **ACT III, SCENE III**：岛上宴席，Ariel 以鹰身女妖形象出现并使宴席消失。

Demo 选取列表按上述样本顺序从 1 开始展示；ACT/SCENE 是来源标识，二者不能被旧视觉占位编号替换。V2 拆分后的列表仍从 1 连续编号，样本 3、4 都明确来源于 ACT III, SCENE III。

这三个片段足以覆盖重复角色、跨场复用的国王船只、岛屿与 Prospero 居所、魔法斗篷、宴席桌、剑、湿服装、雷电、风浪、喊声、音乐、Ariel 变形和宴席消失等制作元素。它们可自然形成“原文证据 → 制作建议 → 人工确认 → 项目实体 → 部门任务材料 → V2 影响审阅”的主链，不需要复制整部作品。

## 固定来源

| 项目 | 固定值 |
| --- | --- |
| 作品 | *The Tempest*，William Shakespeare |
| 主文本来源 | [MIT Shakespeare — The Tempest](https://shakespeare.mit.edu/tempest/) 及其 [Act I, Scene 1](https://shakespeare.mit.edu/tempest/tempest.1.1.html)、[Act I, Scene 2](https://shakespeare.mit.edu/tempest/tempest.1.2.html)、[Act III, Scene 3](https://shakespeare.mit.edu/tempest/tempest.3.3.html) |
| 主来源许可陈述 | [MIT Shakespeare 首页](https://shakespeare.mit.edu/)明确说明其 HTML versions are placed in the public domain |
| 辅助核对版本 | [Project Gutenberg eBook #23042](https://www.gutenberg.org/ebooks/23042)，1863 Cambridge Edition，页面标记 Public domain in the USA |
| 提取日期 | 2026-08-28 |
| 中文文本 | 本项目基于上述英文公版片段自行翻译，仅用于 Demo；未使用网络中文译本 |

源文本与逐场截取边界见 `fixtures/SOURCE_AND_LICENSE.md`。公开仓库只保存工作流所需的最少片段，不复制 Project Gutenberg 的封面、站点说明或整部电子书。

## Demo profile，而非固定制作分类

默认数据使用项目统一 taxonomy：`character`、`location`、`set`、`prop`、`costume`、`vehicle`、`vfx`、`sfx`、`sound`、`lighting` 等。当前 fixture 只是一个 **Demo profile**：它展示哪些类别在所选片段中有证据，不把“录音要求”或任何单一部门字段写成不可扩展的剧本结构。

明确事实与制作推断必须分开：例如“Thunder and lightning”是原文明确证据；需要多声道回放、LED 闪电、风机或实时合成，则是待人工审阅的生产推断，不能伪装成莎士比亚原文。

## V1 与 V2 的边界

- V1 是英中对照的公版原文节选，中文为本项目自行翻译。
- V2 是**基于公版原作的演示性制作修订**，不是莎士比亚原文，也不是学术译本。它把 Act III, Scene 3 拆成 3A“宴席出现”和 3B“鹰身女妖揭示”，并把实物宴席的“机关消失”改为“实物桌 + 实时合成宴席影像”的制作方案。
- V2 不改写 V1 已确认实体或任务。系统只生成待审的场次关联与制作方案影响，由用户决定保留、合并或新建。

## 文件角色

- `fixtures/default-script-v1.md`：英文来源摘录与自行翻译中文对照。
- `fixtures/default-script-v2.md`：明确标注的演示性制作修订。
- `fixtures/default-script.txt`：可导入的 UTF-8 简体中文 V1 样本。
- `fixtures/default-script.json`：实现可消费的稳定对象、证据、实体、任务材料与版本影响。
- `fixtures/SOURCE_AND_LICENSE.md`：来源、许可、提取边界和翻译声明。
- `fixtures/internal/echo-window-*`：旧原创内部结构校验样本，不再作为 default。

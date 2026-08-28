# 公开 Demo 的经典剧本候选研究（已决策）

> 决策状态：**已选择《暴风雨》作为默认经典剧本。** 默认节选、来源与版本边界见 `DEFAULT_SCRIPT_SELECTION.md`；其余候选仅保留作决策记录。

## 结论先行

不建议直接把“经典电影”当作默认剧本来源。电影进入公版、图书馆能看见扫描件、或 GitHub 上有人上传，均**不能**单独证明某一份 screenplay／continuity script 可以被复制到公开 GitHub 和网页 Demo。美国国会图书馆的电影版权描述馆藏确实包含 dialogue／continuity scripts，但也明确有馆藏会限制复制、引用或出版；因此本轮不选用这类馆藏材料。[馆藏范围](https://www.loc.gov/collections/motion-picture-copyright-descriptions/about-this-collection/)；[受限脚本馆藏示例](https://findingaids.loc.gov/repositories/5/resources/369)

若目标是一个可公开演示、可合法取得纯文本、又能展示制片拆解链路的默认样本，首选应是英文公版**舞台剧文本**，而不是现成商业电影 screenplay。以下排序是“许可可核验 + 拆解覆盖 + 三分钟可讲清”的综合排序，不是文学价值排名。

## 许可判定口径与共同风险

1. 本文所称“可用”只表示可从下列权威文本库取得；它**不是**面向所有国家/地区的法律意见。Project Gutenberg 明确将其 eBook 标为“美国公版”，并提醒美国以外使用者自行核验当地法律；MIT Shakespeare 明确将其 HTML 版本置入 public domain。[Project Gutenberg 许可说明](https://www.gutenberg.org/help/license.html)；[MIT Shakespeare](https://shakespeare.mit.edu/)
2. 公开 GitHub／网页部署时，不应整份复制 Project Gutenberg 的封面、署名、说明页或站点标识；应仅使用已核验的原作品正文／舞台指示，并在仓库保留来源、版本、提取日期和许可判断。对 Shakespeare，优先以 MIT 明示 public-domain 的 HTML 为上游；对 Wilde，使用 Project Gutenberg 的 UTF-8 纯文本时应遵守其适用条款。
3. 中文展示是单独风险：中文现成译本通常可能有翻译版权，不能因英文原文公版而直接搬用。更稳的路径是自行翻译已核验的英文公版片段，或采用已获得明确开放许可的中文译本；本次不翻译、不导入正文。
4. 即使原作品和所选数字文本在美国可复用，面向全球的公开部署仍应由项目负责人确认目标司法辖区、商标/资料页使用方式及中文翻译来源。因此下方“公开部署”一栏均为“条件可用”，不是无条件放行。

## 候选比较矩阵

| 排名 | 候选与直接原始文本来源 | 是否为剧本 | 文本/许可核验 | 2–4 场的拆解覆盖 | 版本影响演示 | 结论 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **《暴风雨》（The Tempest）— William Shakespeare**：[MIT HTML](https://shakespeare.mit.edu/tempest/)；[Project Gutenberg 纯文本/下载页](https://www.gutenberg.org/ebooks/1540) | 是，舞台剧本；MIT 页面含 act/scene、人物与舞台指示，不是影迷转写。 | MIT 明示其 HTML 版本为 public domain；PG 将此书标为美国公版且提供 Plain Text。全球/中文部署仍为条件可用。 | 船难、岛屿、魔法精灵、宴席幻象：重复角色、场景、服化、风暴声光、魔法视觉效果齐全。 | 可把“宴席/幻象保留”改为“消失或以投影替代”，生成 V2 的 VFX、音效、道具任务影响。 | **首选，条件推荐。** 覆盖最全面，也最接近虚拟制片语言。 |
| 2 | **《仲夏夜之梦》（A Midsummer Night’s Dream）— William Shakespeare**：[MIT HTML](https://shakespeare.mit.edu/midsummer/)；[Project Gutenberg 文本版本说明](https://www.gutenberg.org/help/shakespeare.html) | 是，舞台剧本；MIT 的完整分幕分场文本与舞台指示可核验。 | MIT HTML 明示 public domain；原作亦是长期公版。不要误用 Project Gutenberg 的有版权音频表演版本。 | 林地、精灵、花汁、变形、婚礼/戏中戏，可覆盖重复角色、服化、手持道具、魔法 SFX/VFX、音乐。 | 可把花汁道具改成可发光的版本，或把精灵入场从现场演员改为投影，展示实体与部门任务影响。 | **次选，条件推荐。** 视觉丰富，但人物与关系更杂，首次演示要严格截短。 |
| 3 | **《麦克白》（Macbeth）— William Shakespeare**：[MIT HTML](https://shakespeare.mit.edu/macbeth/)；[Project Gutenberg 纯文本/下载页](https://www.gutenberg.org/ebooks/1533) | 是，舞台剧本；两来源均为完整的 act/scene 剧本文本，不是影视台词转写。 | MIT HTML 明示 public domain；PG 标为美国公版并提供 Plain Text。全球/中文部署仍为条件可用。 | 女巫、雷电、书信、匕首幻象、宴会鬼影：重复角色/道具、城堡场景、盔甲服化、雷声灯光、幻象效果。 | 可将“鬼影”从演员/化妆方案改为投影方案，或改变匕首处理，形成可审阅的 V2 VFX 与道具影响。 | **可用但不优先。** 证据非常强，暴力、血腥和悲剧调性会分散面试 Demo 对工作流的注意力。 |
| 4 | **《不可儿戏》（The Importance of Being Earnest）— Oscar Wilde**：[Project Gutenberg HTML/UTF-8 文本页](https://www.gutenberg.org/ebooks/844) | 是，舞台剧本；该页标注为 comedy play，并提供 UTF-8 Plain Text。 | Project Gutenberg 标为美国公版；可获得结构化 HTML 与纯文本。未找到同等强度的“网页 HTML 明示 public domain”第二来源，故全球公开部署为条件可用、证据较 Shakespeare 弱。 | 公寓、花园、客厅、手提包、茶具、卡片、燕尾服/礼服；适合角色、道具、置景、服化和连续性任务。 | 可把手提包来源或花园/客厅段落顺序改动，产生道具与置景影响。 | **备用，谨慎推荐。** 文本易读、道具连续性好，但几乎没有自然的声音/灯光/VFX 需求。 |

## 每个候选最合适的短段落

### 1. 《暴风雨》：最适合默认 Demo

建议选择以下三场，不复制整部文本：

- Act I, Scene 1（海上船只）：风暴、船员、重复角色与紧急声音/灯光/特技需求。
- Act I, Scene 2（Prospero 的居所前）：Prospero、Miranda、Ariel 重复出现；岛屿置景、服装与魔法叙事证据进入同一上下文。
- Act III, Scene 3（岛上另一处）：宴席出现又消失，且有 thunder and lightning 的舞台指示；可形成道具、艺术、声音、灯光与 VFX 的明确来源。

这三场可把“宴席桌／酒器”“Ariel”“岛屿场景”“风暴与雷电”做成跨场实体。V2 仅需把 Act III 的宴席从实体道具改为实时合成或删去其中一项，即可得到一个不需要复杂算法的、可审阅的实体与任务影响。Project Gutenberg 的 Cambridge 1863 文本保留场次目录及舞台指示，可作为可验证的纯文本来源。[具体版本](https://www.gutenberg.org/cache/epub/23042/pg23042-images.html)

### 2. 《仲夏夜之梦》：视觉型备选

- Act II, Scene 1（林地）：Oberon、Titania、Puck 与精灵；森林场景、服化、音乐与魔法氛围。
- Act II, Scene 2（林地）：Puck 使用花汁；可明确建立“花汁”道具和角色重复关系。
- Act III, Scene 2（林地）：魔法误施造成身份/视觉处理变化；适合 VFX 或妆发推断。

它适合突出“原文明确”和“生产推断”的区分，但必须压缩角色数，避免把演示变成角色关系说明会。淘汰错误来源：Project Gutenberg 的 #8609 搜索结果是有版权的计算机生成音频表演，不可把它误当成可部署的剧本文本。[该音频页的版权提示](https://www.gutenberg.org/files/8609/8609-index.htm)

### 3. 《麦克白》：强证据、重调性备选

- Act I, Scene 1（荒原）：三女巫、雷电与雨；最短的声光/天气效果证据。
- Act I, Scene 3（荒原）：女巫、Macbeth、Banquo、预言和道具/服化语境。
- Act III, Scene 4（宴会厅）：Macbeth、Lady Macbeth、宴席与 Banquo 鬼影；实体、场景与幻象效果的最佳集中点。

它的优点是舞台指示与制作需求密度高；淘汰为默认项的原因不是许可，而是谋杀、血迹和鬼影会把一个“制片统筹工作流”Demo 推向恐怖/暴力内容展示。Project Gutenberg 的完整文本清楚展示人物表、分场结构和舞台指示。[具体文本](https://www.gutenberg.org/cache/epub/1533/pg1533-images.html)

### 4. 《不可儿戏》：非视觉特效的运营型备选

- Act I（Algernon 的公寓）：Algernon、Jack、Lane，茶点/卡片/室内陈设。
- Act II（花园）：Jack、Cecily、Miss Prism 等重复人物，花园置景与服化。
- Act III（庄园客厅）：手提包揭示与人物汇合，适合展示跨场道具的来源链与版本影响。

它最适合演示角色、置景、服装和手提包连续性；淘汰为首选的原因是声音、灯光与 VFX/SFX 的生产推断过于牵强，不能自然覆盖本 Demo 的技术部门链路。

## 不纳入候选的方向

| 方向 | 淘汰理由 |
| --- | --- |
| 公开 GitHub 上的电影剧本 PDF/转写 | 上游常无法证明是正式 screenplay 或持权人授权；仓库存在不构成许可。 |
| Library of Congress 的一般电影脚本馆藏 | 馆藏说明和单件权利状态不等于网页再发布许可；部分馆藏明确提示复制、引用、出版可能受限。 |
| 近现代名片、影视剧或中文商业剧本 | 文本/译本权利链通常无法在本任务内可靠核验；电影本体公版也不自动使 screenplay、译本或修订稿公版。 |
| 仅有台词、无舞台指示的影迷转写 | 没有可核验的场次和动作证据，无法可靠产出场景、道具、声音或部门任务。 |

## 决策后的实施边界

1. 采用 MIT Shakespeare 的 public-domain HTML 为主来源，Project Gutenberg 1863 Cambridge Edition eBook #23042 只作版本核对。
2. 中文由本项目依据英文公版片段自行翻译；不使用、改写或拼接网络中文译本。
3. 只收录 Act I, Scene 1、Act I, Scene 2、Act III, Scene 3 的最小有界片段；V2 必须标成演示性制作修订，不得标成莎士比亚原文。
4. 若未来扩大全文、引入第三方译本或改变部署司法辖区，应重新进行许可核验。

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { filterSuggestions, filterTasks } from "../src/lib/reviewFilter.ts";
import { taxonomyDescription, taxonomyLabel } from "../src/lib/taxonomy.ts";

test("建议筛选只保留选中的 taxonomy，并能回到全部", () => {
  const suggestions = [
    { taxonomy: "character", id: "a" },
    { taxonomy: "other", id: "b" },
    { taxonomy: "character", id: "c" },
  ];
  assert.deepEqual(
    filterSuggestions(suggestions, "character").map((item) => item.id),
    ["a", "c"],
  );
  assert.equal(filterSuggestions(suggestions, "all").length, 3);
});

test("实体复用生产分类筛选，任务按负责部门筛选", () => {
  const entities = [
    { taxonomy: "character", id: "e1" },
    { taxonomy: "sound", id: "e2" },
  ];
  const tasks = [
    { department: "sound", id: "t1" },
    { department: "art", id: "t2" },
    { department: "sound", id: "t3" },
  ];
  assert.deepEqual(
    filterSuggestions(entities, "sound").map((item) => item.id),
    ["e2"],
  );
  assert.deepEqual(
    filterTasks(tasks, "sound").map((item) => item.id),
    ["t1", "t3"],
  );
  assert.equal(filterTasks(tasks, "all").length, 3);
});

test("taxonomy 使用完整中文标签，other 保留人工调整说明", () => {
  assert.deepEqual(
    [
      taxonomyLabel("cast"),
      taxonomyLabel("makeup_hair"),
      taxonomyLabel("sfx"),
      taxonomyLabel("stunt"),
      taxonomyLabel("wardrobe"),
      taxonomyLabel("costume"),
      taxonomyLabel("art"),
      taxonomyLabel("camera"),
      taxonomyLabel("other"),
    ],
    [
      "人物关系",
      "妆发",
      "现场特效",
      "动作特技",
      "服装",
      "服装",
      "美术",
      "摄影",
      "待分类",
    ],
  );
  assert.equal(
    taxonomyDescription("other"),
    "尚未归入标准制作分类，需人工调整。",
  );
});

test("产品手册与版本编辑边界均有真实入口和清楚说明", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const guide = readFileSync(
    new URL("../public/product-guide.html", import.meta.url),
    "utf8",
  );
  assert.match(app, /href="\/product-guide\.html"/);
  assert.match(
    app,
    /保存编辑将创建新版本、记录修改并要求重新分析受影响单元；当前 Demo\s*暂未开放。/,
  );
  assert.match(app, /筛选实体分类/);
  assert.match(app, /实体名称、生产分类和 Metadata/);
  assert.match(app, /筛选任务部门/);
  assert.match(guide, /href="https:\/\/script-demo\.ppserver\.xyz\/"/);
  assert.match(guide, /在线工作台（正式入口）/);
  assert.match(guide, /https:\/\/script-demo\.ppserver\.xyz/);
  assert.match(guide, /离线产品手册/);
  assert.match(guide, /从剧本到部门材料的完整\s+Workflow/);
  assert.match(guide, /剧本版本化编辑：正确流程与本轮边界/);
  assert.match(guide, /三分钟演示脚本/);
  assert.match(guide, /面试官可能追问/);
  assert.match(guide, /验收证据/);
  assert.match(guide, /后续路线图/);
});

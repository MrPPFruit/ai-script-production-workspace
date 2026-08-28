# Design QA

- Source visual truth: `/Users/ppg/Documents/CloudCodeWorkSpace/Work/ai-script-production-workspace/design/concepts/direction-c-document-ledger-workbench.png`
- Secondary right-panel reference: `/Users/ppg/Documents/CloudCodeWorkSpace/Work/ai-script-production-workspace/design/concepts/direction-a-light-production-editor.png`
- Implementation evidence: live built-in-browser capture at the 1440 px desktop state and 390 px narrow state. The capture was intentionally not written to `web/artifacts/`, because this change is limited to `web/src/**`, optional UI tests, and this QA report.
- Viewport: reference source is 1440×960 px. Desktop was rendered and visually inspected at 1440 px wide; narrow layout was inspected with the 720 px media query active and no page-level horizontal overflow.

## Full-view comparison

- C's information architecture remains intact: top project bar, scene rail, central screenplay, right review rail, and bottom ledger.
- Major dimensions remain intentional: a narrow scene rail, document-first center column, fixed review rail, and a visibly collapsible bottom table. The workflow extension stays inside those containers instead of adding pages or card grids.
- Typography retains Chinese serif treatment for screenplay text and sans-serif application chrome. Small UI text, buttons, table cells, and source labels remain legible at the desktop density.
- White papers, cool gray dividers, dark green primary action, amber V2 warning, and muted source highlighting still match the selected C palette.
- The visual source has no standalone image assets; the implementation uses the existing Phosphor icon library and introduces no emoji, handcrafted SVG, CSS illustration, or placeholder imagery.

## Workflow and focused-region evidence

- Scene original text has explicit evidence highlighting and the review rail names its source as “场次 13 证据”.
- Every simulated-AI card has an editable input and exactly three primary outcomes: create a production entity, merge into an existing entity, or defer. Each outcome changes the displayed local state.
- The “实体与任务” tab exposes stable entities, metadata, and cross-scene sources. It states that `/api/ai/breakdown` is reserved but not called.
- A V2 insert case marks “货轮汽笛” as requiring manual relationship handling. “按新场次拆分” updates the source association to 场次 13 / 13A; “保留关联” preserves the existing source set. Neither happens automatically.
- “生成任务材料” adds a local department-lead draft, while both the entity and the bottom ledger state “未真实下发”. Export and unrelated toolbar actions are disabled rather than inert.
- Expanded/collapsed controls for scene rail, suggestion cards, review rail, version-impact details, and the default-expanded task ledger remain available.

## Responsive and accessibility check

- At narrow width, the scene rail initializes collapsed; central script content is first, and no document-level horizontal overflow was detected.
- Buttons use native semantics, visible focus styles, descriptive labels for icon controls, `aria-expanded` on disclosure controls, tabs with selected state, and an `aria-live` update for pending AI suggestions.

## Interaction check

- Verified in the built-in browser: V2 impact detail opens; manual split resolves the V2 warning; an entity task-material action increases local drafts from 2 to 3; create, merge, and defer actions each update their card status; review and task tabs switch; task ledger and rails collapse; task completion checkbox updates status.
- Browser console: no application errors. The only information message is React DevTools availability.

## Intentional scope boundary

This is a local seed-state demonstration. It does not call `/api/ai/breakdown`, parse uploads, persist entities, notify people, export files, or create backend records.

## Fixture replacement boundary

- “雾港” and the visible 12 / 13 / 14 scene labels are visual placeholders only.
- Production state stores source links as one-based `sampleIndex` values, never as those labels. The current V2 case inserts sample item 3 after item 2 and moves the prior item 3 to item 4.
- The formal 《暴风雨》fixture still needs to supply real Act/Scene display labels and its ordered sample sequence beginning at item 1. Replacing the local seed is the remaining work; no fixture file was read or changed in this pass.

final result: passed

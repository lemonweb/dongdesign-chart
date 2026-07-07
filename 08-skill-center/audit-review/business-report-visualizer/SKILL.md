---
name: business-report-visualizer
description: Convert business diagnosis Markdown reports into structured Report IR, narrative visual report configuration, and renderable HTML/Figma/React handoff assets. Use when the user asks to turn a pure Markdown business report, product diagnosis, campaign review, traffic analysis, conversion analysis, or operating report into an easy-to-read, data-backed, visual narrative report with charts, KPI cards, bento layout, and QA checks.
---

# Business Report Visualizer

## 1. 文档定位

本 Skill 将纯 Markdown 经营诊断报告转换为用户易读、易懂、图文并茂、具有叙事性的可视化报告。

它不是“Markdown 美化器”，而是一条结构化工作流：

```txt
Markdown 经营报告
→ Markdown 解析
→ Report IR
→ 诊断叙事重组
→ 图表与组件选型
→ Bento Layout
→ 可渲染 Visual JSON / HTML / React / Figma handoff
→ QA
```

核心原则：不得直接从 Markdown 画界面，必须先生成结构化 `Report IR`，再按叙事、图表、布局和视觉规则逐步生成。

## 2. 规则分层原则

本 Skill 是轻量执行入口，不内置 dongDesign Chart Wiki 正文，也不把所有阶段细则堆在 `SKILL.md` 中。

| 位置 | 负责内容 |
|---|---|
| `SKILL.md` | 触发场景、总流程、必读文件索引、输入输出骨架、跨 Skill 边界 |
| `runtime-wiki-rules.md` | 远程 Wiki 来源、读取时机、路径筛选、引用格式、降级策略 |
| 阶段规则文件 | 输入、解析、叙事、图表、组件、布局、视觉、QA 的具体约束 |
| `report-ir-schema.json` | Report IR 的机器可校验结构 |

判断原则：跨阶段、影响运行方式的约定放在 `runtime-wiki-rules.md`；只影响某个阶段的细则放在对应规则文件；只有 Agent 启动和路由必须知道的信息才放在 `SKILL.md`。

## 3. 必读文件

执行前按任务需要读取：

```txt
08-skill-center/skill-runtime-contract.md
08-skill-center/audit-review/business-report-visualizer/runtime-wiki-rules.md
08-skill-center/audit-review/business-report-visualizer/input-definition.md
08-skill-center/audit-review/business-report-visualizer/report-ir-schema.json
08-skill-center/audit-review/business-report-visualizer/markdown-parser-rules.md
08-skill-center/audit-review/business-report-visualizer/narrative-rules.md
08-skill-center/audit-review/business-report-visualizer/chart-selection-rules.md
08-skill-center/audit-review/business-report-visualizer/component-mapping.md
08-skill-center/audit-review/business-report-visualizer/bento-layout-rules.md
08-skill-center/audit-review/business-report-visualizer/visual-style-rules.md
08-skill-center/audit-review/business-report-visualizer/qa-checklist.md
```

当用户只要求其中一个阶段，例如“只生成 IR”或“只做图表选型”，只读取该阶段必需文件。

如果这些文件不在当前安装包中，按第 2 节的远程 Wiki 规则读取同路径 main 分支文件。

## 4. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| Markdown 报告正文 | 必需 | 经营诊断、单品分析、活动复盘、流量分析、转化分析等 |
| 报告对象 | 推荐 | 商品、店铺、活动、行业、人群、渠道等 |
| 时间周期 | 推荐 | 原文没有时标记 `unknown` |
| 目标读者 | 推荐 | 老板、运营、商家、分析师、设计/研发 |
| 输出目标 | 推荐 | `ir_json` / `visual_json` / `html` / `react` / `figma_handoff` |
| 图表引擎 | 可选 | G2、ECharts、静态 SVG、HTML Canvas 等 |

必需输入不足时先停步索要；推荐输入不足时继续执行，但在输出中标注影响。

## 5. 执行流程

```txt
0. 解析远程 Wiki 依赖
   - 根据任务阶段筛选需要读取的 Wiki 文件。
   - 优先读取 main 分支最新内容，并记录 source、retrieved_at、commit。
   - 找不到或无法访问时按远程 Wiki 运行约定降级。

1. 解析 Markdown
   - 识别标题、报告对象、时间周期、章节、表格、指标、结论、建议。
   - 保留原始数据与证据来源。
   - 无法识别的字段写为 unknown，不编造。

2. 生成 Report IR
   - 按 report-ir-schema.json 输出结构化对象。
   - 为指标标注 value、unit、change、polarity、severity、source_ref。
   - 为结论标注 evidence_refs。

3. 重组叙事
   - 按“发生了什么 → 问题多严重 → 原因在哪里 → 下一步做什么”组织。
   - 不照搬原 Markdown 章节顺序。
   - 首屏必须服务经营决策阅读。

4. 图表与组件选型
   - 按 chart-selection-rules.md 判断图表。
   - 表格不得默认保留为表格，除非是明细数据或对比矩阵。
   - 每个图表必须声明回答的问题。

5. 布局规划
   - 按 bento-layout-rules.md 生成 12 栅格布局。
   - 高优先级结论、风险和核心指标放在首屏。
   - 行动建议必须有独立区域。

6. 输出可视化报告配置
   - 输出统一 Visual JSON。
   - 包含页面结构、组件类型、图表配置、文案、布局和状态颜色。
   - 保证可被 React / Figma 插件 / HTML 渲染器消费。

7. 质量检查
   - 按 qa-checklist.md 检查数据一致性、图表匹配、证据链和视觉可读性。
   - 发现无证据归因、误导性图表或数据缺失时必须标注风险。
```

## 6. 输出格式

默认输出 `Visualization Delivery Packet`：

```txt
## 输入摘要
- 报告对象：
- 时间周期：
- 目标读者：
- 输出目标：

## Report IR
（符合 report-ir-schema.json）

## Narrative Plan
- 开场结论：
- 核心异动：
- 趋势证据：
- 结构拆解：
- 原因判断：
- 行动建议：

## Visual JSON
（组件、图表、布局、视觉状态）

## Render Handoff
- HTML / React / Figma / PPT 接入说明：
- 图表引擎：
- 数据字段：

## QA 结果
- 数据一致性：
- 图表匹配：
- 证据链：
- 风险与缺口：

## Wiki 引用
- source:
- retrieved_at:
- commit:
- wiki_status:
```

## 7. 依赖 Skill

| Skill | 关系 |
|---|---|
| chart-selector-skill | 当图表选型存在争议或需严格按 Wiki 图表规范判断时调用 |
| chart-builder-skill | 当需要生成规范图表设计方案或组件结构时调用 |
| g2-codegen-skill / echarts-codegen-skill | 当 Visual JSON 需要落成图表代码时调用 |
| visual-auditor-skill | 当输出设计稿或长图需要视觉审查时调用 |
| code-review-skill | 当输出 React / HTML / 图表代码后需要审查时调用 |

下游 Skill 只按任务需要调用，不在本 Skill 包中内置其正文。正式移交时输出结构化 handoff packet，并让下游 Skill 自行按远程 Wiki 规则读取最新规范。

## 8. 不负责事项

- 不替代业务口径定义。
- 不编造缺失数据、趋势、归因或建议收益。
- 不把 OCR 或模糊图中文字识别结果写成已确认事实。
- 不绕过图表选型、视觉审查和代码审查链路。
- 不默认生成万能报告模板；优先完成单品经营诊断、活动复盘、流量/转化分析的稳定闭环。
- 不把远程 Wiki 正文复制进 Skill 包；只保留执行流程、路径策略、筛选规则、引用规则和降级规则。

## 9. 自查清单

- 是否按任务阶段读取了远程 Wiki 或明确标注降级来源？
- 是否为 Wiki 依据输出了 source、retrieved_at、commit 或 unknown？
- 是否先生成 Report IR，再生成视觉报告？
- 是否保留原始数据与 source_ref？
- 是否把无依据字段标为 `unknown`？
- 是否把信息罗列重组为诊断叙事？
- 是否避免把所有表格继续渲染成表格？
- 是否为每个图表声明回答的问题？
- 是否将首屏留给结论、风险和核心指标？
- 是否输出可被渲染器消费的结构化 JSON？
- 是否按 QA 清单标注风险与缺口？

# Skill Dependency Map

## 1. 文档定位

本文记录 `08-skill-center/` 中各 Skill 之间的调用关系和依赖边界。

Skill 之间只传递任务意图、读取路径和输出结果，不复制 Knowledge Layer 的规范正文。

## 2. 设计规范转 Wiki 链路

### 2.1 主链路

```txt
Figma / Zero / Relay 设计规范链接 + 目标 md
→ design-spec-to-wiki-skill
→ dependency-checker-skill
→ sync-planner-skill
```

### 2.2 依赖关系

| 上游 Skill | 下游 Skill | 触发条件 |
|---|---|---|
| `design-spec-to-wiki-skill` | `doc-scaffold-skill` | 目标 md 为空、缺少基础章节或需要新建文档 |
| `design-spec-to-wiki-skill` | `wiki-maintainer-skill` | 设计规范内容暴露 Wiki 上游规范缺口 |
| `design-spec-to-wiki-skill` | `dependency-checker-skill` | 文档完成后检查引用、变量、路径和冲突 |
| `design-spec-to-wiki-skill` | `visual-auditor-skill` | 目标文档属于视觉语言规范 |
| `dependency-checker-skill` | `sync-planner-skill` | 需要提交、同步或发布到 GitHub / Pages |

### 2.3 运行边界

- `design-spec-to-wiki-skill` 负责从 Figma / Zero / Relay 等设计规范来源转成 Wiki md。
- `doc-scaffold-skill` 只负责骨架，不判断设计规范语义。
- `wiki-maintainer-skill` 负责跨目录补缺口。
- `dependency-checker-skill` 负责检查依赖，不改写核心内容。
- `sync-planner-skill` 负责同步计划，不决定文档内容。

## 3. 图表设计生成链路

### 3.1 主链路

```txt
业务问题 + 数据字段
→ chart-selector-skill
→ chart-builder-skill
→ visual-auditor-skill
→ visualAuditReviewFrame（写入设计工具画布）
→ Wiki Compliance Packet + Builder Fidelity Gate
→ optimizedChartFrame（仅继承原图类型、尺寸和数据构成；按 Wiki + selector + builder 强约束重绘）
```

### 3.2 图表样式优化闭环

```txt
指定图表 + 当前数据构成 + 原始尺寸
→ chart-style-optimizer-skill
→ chart-selector-skill（仅当图表类型与数据结构不匹配）
→ chart-builder-skill / g2-codegen-skill / echarts-codegen-skill
→ visual-auditor-skill / code-review-skill
```

### 3.3 代码生成延展链路

```txt
chart-builder-skill 输出的图表设计方案
→ g2-codegen-skill / echarts-codegen-skill
→ code-review-skill
```

### 3.4 依赖关系

| 上游 Skill | 下游 Skill | 触发条件 |
|---|---|---|
| `chart-selector-skill` | `chart-builder-skill` | 已完成图表选型，需要生成设计方案或组件结构 |
| `chart-selector-skill` | `chart-appropriateness-reviewer` | 图表选型存在争议、复杂图表或用户指定图表不匹配数据 |
| `chart-builder-skill` | `visual-auditor-skill` | 已生成 Figma / Relay 图表，需要在设计工具画布旁生成评审建议文档，并在 `Wiki Compliance Packet` 与 `Builder Fidelity Gate` 通过后，补充同类型、同尺寸、按 Wiki 规范重建的可视化方案 |
| `chart-style-optimizer-skill` | `visual-auditor-skill` | 用户只需要审查结论，或优化后需要二次视觉审查 |
| `chart-style-optimizer-skill` | `chart-selector-skill` | 当前图表类型与数据构成明显不匹配，需要重新判断图表类型 |
| `chart-style-optimizer-skill` | `chart-builder-skill` | 需要生成同尺寸设计方案、SVG / HTML 或设计节点 |
| `chart-style-optimizer-skill` | `g2-codegen-skill` | 同尺寸重生成目标为 G2 |
| `chart-style-optimizer-skill` | `echarts-codegen-skill` | 同尺寸重生成目标为 ECharts |
| `chart-style-optimizer-skill` | `code-review-skill` | 生成代码后需要审查引擎配置与规范一致性 |
| `chart-builder-skill` | `g2-codegen-skill` | 用户需要 G2 代码实现 |
| `chart-builder-skill` | `echarts-codegen-skill` | 用户需要 ECharts 代码实现 |
| `g2-codegen-skill` | `code-review-skill` | G2 代码生成后需要审查 |
| `echarts-codegen-skill` | `code-review-skill` | ECharts 代码生成后需要审查 |

### 3.5 运行边界

- `chart-selector-skill` 负责判断图表类型，不生成视觉方案。
- `chart-builder-skill` 负责把图表组件文档和视觉语言转成可执行设计方案，不重新选图；输出中必须包含 `Visual Fidelity Packet`，把文字规格、图例 shape、Tooltip effect 等可验证约束传给下游。
- `visual-auditor-skill` 负责把审查结果以 VibeDesign 形式写入被审查设计稿旁边，生成 `visualAuditReviewFrame`。该 Frame 必须包含评审建议文档，并在文档末尾结合 `chart-selector-skill` 与 `chart-builder-skill` 绘制 `optimizedChartFrame`：它只从原图继承图表类型、宽高尺寸、数据构成和系列构成；颜色、坐标轴、图例、标签、Tooltip、布局和洞察标注必须按 `Wiki Compliance Packet` 与 `Builder Fidelity Gate` 重建。缺少精确 token、resolved value、字号、间距或组件规格时不得绘制优化图。它不默认覆盖原图，不负责最终修复落稿，也不得只在 AgentChat 中提供完整建议后结束。
- `chart-style-optimizer-skill` 负责“审查 + 优化 + 同尺寸重生成”的闭环；它不得改变数据事实，不得通过扩大画布解决拥挤问题，且必须输出 `Same-size Generation Packet`。
- `g2-codegen-skill` / `echarts-codegen-skill` 负责代码实现，不改变设计意图。

## 4. 经营报告可视化链路

### 4.1 主链路

```txt
Markdown 经营报告 / OCR 转写文本 / 已有 IR
→ business-report-visualizer
→ Report IR
→ Narrative Plan
→ Visual JSON
→ chart-selector-skill（复杂或高风险图表）
→ chart-builder-skill（规范图表设计方案）
→ g2-codegen-skill / echarts-codegen-skill / HTML / React / Figma handoff
→ visual-auditor-skill / code-review-skill
```

### 4.2 依赖关系

| 上游 Skill | 下游 Skill | 触发条件 |
|---|---|---|
| `business-report-visualizer` | `chart-selector-skill` | Markdown 表格需要转成图表，且图表选型存在争议或高误读风险 |
| `business-report-visualizer` | `chart-builder-skill` | Visual JSON 需要生成规范图表设计方案或组件结构 |
| `business-report-visualizer` | `g2-codegen-skill` | 用户要求生成 G2 图表代码 |
| `business-report-visualizer` | `echarts-codegen-skill` | 用户要求生成 ECharts 图表代码 |
| `business-report-visualizer` | `visual-auditor-skill` | 输出为设计稿、长图或可视化页面，需要审查视觉一致性与可读性 |
| `business-report-visualizer` | `code-review-skill` | 输出 HTML / React / 图表代码，需要审查实现质量 |
| `data-dashboard-skill` / `campaign-analysis-skill` | `business-report-visualizer` | 场景自动化链路已经产出 Markdown 经营报告，需要转成叙事型可视化报告 |

### 4.3 运行边界

- `business-report-visualizer` 负责 Markdown 解析、Report IR、叙事重组、Visual JSON 和渲染 handoff，不替代业务口径定义。
- `business-report-visualizer` 不编造缺失数据；OCR、小字或冲突字段必须进入 `quality_flags`。
- `business-report-visualizer` 可以给出图表建议，但复杂图表或正式落稿必须交给 `chart-selector-skill` / `chart-builder-skill`。
- 下游代码生成 Skill 不得改写 Report IR 中的数据事实和证据链。

# Chart Style Optimizer Skill

## 1. 文档定位

本 Skill 用于检查指定可视化图表的样式是否符合 Wiki 规范；当图表不符合规范时，基于当前图表的数据构成进行样式优化，并生成一个与原图同尺寸、符合规范和可视化标准的新图表。

它回答：

> 这个已有图表哪里不符合规范？在不改变数据事实和画布尺寸的前提下，应该如何优化并重新生成？

本 Skill 属于 Execution Layer，不重新定义视觉语言、图表组件或引擎规则，只负责读取相关 Wiki 规范，完成“审查 → 数据构成识别 → 优化方案 → 同尺寸重生成”的闭环。

## 2. 触发场景

当用户表达以下意图时触发：

- “检查这个图表样式是否符合规范，不符合就优化”
- “帮我审查并重画这张图”
- “根据当前图表数据，生成一张同尺寸的规范图表”
- “这个图表视觉不对，按 Wiki 标准改一版”
- “保持尺寸不变，优化图表颜色、坐标轴、图例、Tooltip 或标签”
- “对截图 / SVG / ECharts option / G2 代码 / Figma / Relay 节点进行图表规范修复”

如果用户只要求“指出问题”，应使用 `visual-auditor-skill` 的审查流程，不默认生成新图表。

如果用户要求改变图表类型、分析目标或看板结构，应先调用 `chart-selector-skill` 或 `chart-refactor-skill`。

## 3. 输入要求

最小输入：

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 目标图表 | 必需 | 可为截图、设计节点、SVG、HTML、ECharts option、G2 代码或图表配置 |
| 原始尺寸 | 必需 | 图表画布宽高；若可从文件、截图或节点读取，应自动识别 |
| 数据构成 | 推荐 | 数据字段、数据样例、系列、单位、口径、时间范围 |
| 当前图表类型 | 推荐 | 如折线图、柱状图、饼图、热力图等 |
| 输出目标 | 推荐 | Figma / Relay / SVG / HTML / ECharts / G2 / 图片 |
| 主题模式 | 可选 | light / dark；未说明时默认 light |
| 保留约束 | 可选 | 如“标题不变”“只改颜色”“必须使用 ECharts”“不要改图表类型” |

如果只提供截图而没有数据源：

- 可审查样式、布局和可见编码问题。
- 可根据可读标签提取有限数据构成。
- 不得猜测缺失数据值。
- 若重生成需要精确数据，应要求用户补充数据源，或明确标记为“基于截图可读信息的近似重建”。

## 4. 必读 Wiki 文件

### 4.1 默认必读

```txt
00-overview/how-to-use.md
00-overview/ai-reading-flow.md
01-design-language/README.md
05-rules/generation-flow.md
06-self-check/design-checklist.md
```

### 4.2 视觉语言按需必读

| 审查对象 | 必读文档 |
|---|---|
| 色彩、系列色、状态色 | `01-design-language/theme-token.md`、`01-design-language/color.md` |
| 字号、数字、标签层级 | `01-design-language/typography.md` |
| 容器、留白、绘图区 | `01-design-language/layout.md` |
| X / Y 轴、网格线、刻度 | `01-design-language/axis.md` |
| 多系列、分类、连续色阶 | `01-design-language/legend.md` |
| 数据标签、异常点、阈值 | `01-design-language/label.md` |
| hover、读数、浮层 | `01-design-language/tooltip.md` |

### 4.3 图表类型必读

必须读取当前图表或优化后图表对应的具体图表文档。

示例：

```txt
02-chart-type/basic/line-chart.md
02-chart-type/basic/bar-chart.md
02-chart-type/composite/bar-line-chart.md
```

如果当前图表类型与数据构成明显不匹配，应读取：

```txt
00-overview/decision-tree.md
02-chart-type/capability-matrix.md
02-chart-type/selection-rules.md
```

## 5. 执行流程

```txt
1. 识别输入载体和输出目标
2. 读取原始尺寸，建立 same_size_contract
3. 识别当前图表类型、分析目标和数据构成
4. 读取对应图表文档和视觉语言规范
5. 建立 Style Audit Matrix
6. 判断是否存在规范问题、可视化问题或数据表达问题
7. 若通过审查，输出通过结论和可选微调建议，不强制重生成
8. 若不通过，生成 Optimization Plan
9. 按数据构成和同尺寸约束生成 Same-size Generation Packet
10. 使用目标工具或代码路径生成新图表
11. 对新图表执行二次自查，输出审查结果、优化摘要和交付物
```

## 6. 数据构成识别

优化前必须先识别数据构成，不得只看视觉样式。

必须输出：

| 字段 | 说明 |
|---|---|
| `chart_type_current` | 当前图表类型 |
| `primary_intent` | 当前图表主要回答的问题 |
| `dimension_fields` | 类目、时间、层级、流向等维度字段 |
| `measure_fields` | 数值、比例、金额、次数等指标字段 |
| `series_fields` | 分组、颜色、图例系列 |
| `data_grain` | 日 / 周 / 月 / 类目 / SKU / 店铺等粒度 |
| `value_range` | 数值范围、是否含 0、负值、极端值 |
| `category_count` | 类目数量和是否过多 |
| `series_count` | 系列数量和是否需要图例 |
| `semantic_state` | 是否存在 normal / warning / danger 等状态含义 |
| `known_data_limits` | 缺失值、截图不可读字段、无法确认口径 |

数据优化只允许改变表达方式，不允许改变事实：

- 不改数据值。
- 不改排序，除非排序本身是可视化问题且用户未要求保持原序。
- 不删除异常值，除非用户明确要求过滤。
- 不把负值、比例、单位或口径改成更好看的形式。
- 不为了画面平衡而虚构补点、补类目或补系列。

## 7. Style Audit Matrix

审查时至少覆盖以下维度：

| 维度 | 检查内容 | 典型问题 |
|---|---|---|
| 图表选型 | 图表类型是否匹配分析目标和数据结构 | 用饼图表达趋势、用雷达图表达普通排名 |
| 尺寸与布局 | 原尺寸下标题、图例、坐标轴、绘图区是否有稳定空间 | 图例挤压绘图区、标签重叠、画布边距不足 |
| 颜色 | 是否使用正确色板、状态色和 token | 随机色、分类色表达顺序、红绿误用 |
| 字体 | 字号、行高、字重是否符合层级 | 轴标签 16px、图例加粗、数值不对齐 |
| 坐标轴 | 起点、刻度、网格线、轴标题和标签是否规范 | Y 轴无理由不从 0 起、刻度过密、网格线过重 |
| 图例 | 是否需要图例，shape 是否匹配系列形态 | 折线图用色块图例、图例包含非系列说明 |
| 标签 | 标签是否必要、可读、避让合理 | 标签遮挡、过度标注、缺少单位 |
| Tooltip | 结构、对齐、阴影、系列行是否符合规范 | value 未右对齐、多系列无两列结构 |
| 交互状态 | hover、选中、弱化、禁用状态是否一致 | hover 指示器溢出、状态只靠颜色表达 |
| 可访问性 | 对比度、颜色冗余编码、文本可读性 | 低对比、色盲不可辨、只靠红绿判断 |
| 引擎实现 | G2 / ECharts 默认样式是否覆盖规范 | 默认 mark、默认 legend shape、containLabel 不稳定 |

问题分级：

| 等级 | 含义 | 处理 |
|---|---|---|
| P0 | 数据表达错误、严重误读、关键元素缺失 | 必须修复后才能交付 |
| P1 | 明显违反视觉规范或影响阅读效率 | 应修复 |
| P2 | 轻微一致性、精致度或可维护性问题 | 可修复并说明 |

## 8. 优化规则

### 8.1 同尺寸约束

生成结果必须遵守 `same_size_contract`：

```txt
source_width:
source_height:
output_width:
output_height:
device_pixel_ratio:
padding_strategy:
plot_area_bounds:
preserved_elements:
changed_elements:
```

规则：

- `output_width` 必须等于 `source_width`。
- `output_height` 必须等于 `source_height`。
- 不得通过放大画布解决拥挤问题。
- 若原尺寸无法容纳所有信息，应优先通过抽样、换行、图例分页、标签省略、方向调整或图表类型优化解决。
- 绘图区可以重算，但标题区、图例区、坐标轴区和边距必须有明确布局。

### 8.2 优化优先级

按以下顺序优化：

```txt
数据表达正确
→ 图表选型合理
→ 视觉规范一致
→ 同尺寸下可读
→ 交互和状态清晰
→ 代码或设计节点可维护
```

### 8.3 可调整项

在不改变数据事实的前提下，可调整：

- 图表类型或子类型，例如柱状改条形、饼图改条形、双轴改分面。
- 颜色映射、系列色、状态色、透明度。
- 坐标轴刻度、单位格式、标签抽样、网格线强度。
- 图例位置、shape、分页、折叠策略。
- 标签显示策略、避让、单位、精度。
- Tooltip 结构和字段展示顺序。
- 排序方式，但必须说明排序逻辑。
- 绘图区和辅助区域的空间分配。

不可调整：

- 数据值、单位、统计口径。
- 用户明确要求保留的图表类型、标题或字段。
- 与业务含义相反的颜色语义。
- 通过隐藏关键数据换取“更干净”的画面。

## 9. 生成路径

根据输入和输出目标选择生成路径：

| 输出目标 | 生成方式 | 验证要求 |
|---|---|---|
| Figma / Relay | 使用可编辑 Frame、Text、Line、Shape、Component 实例生成 | 检查图层结构、尺寸、token、文本规格 |
| SVG / HTML | 生成同尺寸 SVG 或 HTML 图表 | 检查 viewBox / 容器尺寸、文本不溢出 |
| ECharts | 生成 option 或页面示例 | 检查 grid、axis、legend、tooltip、series 样式 |
| G2 | 生成 G2 配置或页面示例 | 检查 theme、scale、axis、legend、interaction |
| 图片 | 仅当用户只需要位图结果时使用 | 必须说明后续不可编辑限制 |

如果用户没有指定输出目标，默认选择与输入载体相同的输出方式；无法判断时优先输出 SVG / HTML 方案，因为它最容易保持同尺寸并进行视觉验证。

## 10. 输出格式

执行完成后输出：

```txt
## 审查结论
结果：通过 / 不通过 / 需补充数据
原始尺寸：
输出尺寸：
主要问题：

## 数据构成
chart_type_current:
primary_intent:
dimension_fields:
measure_fields:
series_fields:
data_grain:
value_range:
known_data_limits:

## 问题清单
| 等级 | 位置 | 问题 | 依据 | 修复方式 |

## 优化方案
chart_type_final:
layout_strategy:
color_strategy:
axis_strategy:
legend_strategy:
label_strategy:
tooltip_strategy:
interaction_strategy:

## Same-size Generation Packet
source_width:
source_height:
output_width:
output_height:
plot_area_bounds:
token_bindings:
engine_or_tool:
validation_steps:

## 交付物
生成文件 / 设计节点 / 代码片段 / 图片：
二次自查结果：
仍需确认：
```

## 11. 依赖 Skill

| Skill | 关系 |
|---|---|
| `visual-auditor-skill` | 当用户只需要审查、不需要重生成时使用 |
| `chart-selector-skill` | 当前图表类型与数据构成明显不匹配时，用于重新选型 |
| `chart-builder-skill` | 需要生成规范图表结构、设计方案或组件结构时调用 |
| `chart-refactor-skill` | 需要调整图表表达方式、排序、分组或信息层级时调用 |
| `g2-codegen-skill` | 输出目标为 G2 时调用 |
| `echarts-codegen-skill` | 输出目标为 ECharts 时调用 |
| `code-review-skill` | 生成代码后进行实现审查 |

## 12. 不负责事项

本 Skill 不负责：

- 生成完整业务看板或多图表页面。
- 替代业务指标口径判断。
- 在缺少数据源时虚构精确数据。
- 为了视觉效果改变事实、单位、口径或异常值。
- 批量重构整个图表组件库。
- 长期维护 Wiki 规范；发现规范缺口时应交给 `wiki-maintainer-skill`。

## 13. 自查清单

输出前检查：

- 是否读取了当前图表类型和相关视觉语言文档？
- 是否建立了 `same_size_contract`？
- 是否识别了数据构成，而不只是审查视觉？
- 是否把问题分成 P0 / P1 / P2？
- 是否说明每个问题的 Wiki 依据？
- 是否没有改变数据事实？
- 是否保持输出宽高与原图一致？
- 是否重算绘图区、图例区、坐标轴区和标签策略？
- 是否绑定主题变量并写出当前模式解析值？
- 是否对生成结果做了二次自查？
- 如果缺少数据源，是否明确标记近似或要求补充？

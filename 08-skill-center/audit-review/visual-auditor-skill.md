# Visual Auditor Skill

## 1. 文档定位

本 Skill 用于在设计工具中评审指定可视化图表是否符合 Wiki 的视觉语言、图表组件、交互状态和可读性规范，并以 VibeDesign 形式在被审查图表旁边生成一份可编辑的评审建议文档。

它回答：

> 这个图表是否符合规范？哪里影响阅读、理解或表达？哪些位置可以增加激发洞察的表现方式？如果做一版更有可读性和叙事性的参考方案，应该长什么样？

本 Skill 属于 Audit Review，不直接替代原图修复流程。它负责评审、解释、提出建议，并在评审建议文档末尾结合 `chart-selector-skill` 与 `chart-builder-skill`，按原图表类型和原尺寸重新绘制一版符合规范的可视化设计方案供参考；当用户要求“覆盖原图并修复为最终稿”时，应交给 `chart-style-optimizer-skill`。

重要边界：

- 评审建议的主产物必须写入被审查的设计工具画布，而不是只在 AgentChat 中输出说明。
- 如果目标来自 Figma / Relay / Zero 等设计工具，必须在原图表旁边创建 `visualAuditReviewFrame`。
- `optimizedChartFrame` 必须与被审查图表保持同图表类型、同宽高尺寸；不得在 Visual Auditor 中改成另一种图表类型。
- 原图表只作为类型、尺寸、数据构成和系列构成的参考来源；不得沿用原图中不符合 Wiki 的颜色、轴线、图例、标签、Tooltip、布局或装饰样式。
- 重绘必须以可视化 Wiki、`chart-selector-skill` 的适配性复核和 `chart-builder-skill` 的规范构建策略为准。
- AgentChat 只用于简短说明已生成什么、位于哪里、是否有阻塞；不得把完整评审建议当作唯一交付。
- 如果设计工具 MCP 不可用或目标不可写，应输出可复制给设计工具 Agent 的 VibeDesign 构建指令，并明确说明未能写入画布。

## 2. 触发场景

当用户表达以下意图时触发：

- “评审这个图表”
- “检查这个图表是否符合规范”
- “帮我看看这张图有哪些视觉问题”
- “给这个图表一些优化建议”
- “在设计方案旁边生成评审建议说明”
- “指出哪些位置可以增加洞察标注、阈值线、对比说明或叙事表达”
- “基于当前图表画一版建议方案供参考”

如果用户只要求代码质量、配置项、引擎实现，应使用 `code-review-skill`。

如果用户明确要求自动修复并生成同尺寸结果，应使用 `chart-style-optimizer-skill`。

如果用户要求重新选择图表类型，应先调用 `chart-selector-skill` 或 `chart-appropriateness-reviewer`。

## 3. 输入要求

最小输入：

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 目标图表 | 必需 | 截图、Figma / Relay 节点、SVG、HTML、ECharts option、G2 代码或图片 |
| 图表类型 | 推荐 | 折线图、柱状图、饼图、热力图、柱线混合图等 |
| 数据构成 | 推荐 | 字段、系列、单位、口径、时间范围、分类数量 |
| 业务问题 | 推荐 | 图表想回答的问题，决定洞察建议是否成立 |
| 展示上下文 | 可选 | 看板卡片、报告页、大屏、移动端、设计规范验证等 |
| 输出目标 | 可选 | 默认写入 Figma / Relay / Zero 画布；无法写入时输出 VibeDesign 构建指令 |
| 约束 | 可选 | 如“不要改图表类型”“只给设计建议”“生成旁边说明即可” |

若缺少数据构成，AI 可以基于图中可见信息评审视觉规范和阅读体验，但不得推断不可见数据事实；涉及洞察建议时，应明确“需数据源确认”。

## 4. 必读 Wiki 文件

### 4.1 默认必读

```txt
00-overview/how-to-use.md
00-overview/ai-reading-flow.md
01-design-language/README.md
06-self-check/design-checklist.md
08-skill-center/design-efficiency/chart-selector-skill.md
08-skill-center/design-efficiency/chart-builder-skill.md
```

### 4.2 按评审对象读取

| 评审对象 | 必读文档 |
|---|---|
| 图表选型与数据结构 | `00-overview/decision-tree.md`、`02-chart-type/capability-matrix.md`、`02-chart-type/selection-rules.md` |
| 目标图表组件 | 对应 `02-chart-type/` 下具体图表文档 |
| 颜色与状态 | `01-design-language/theme-token.md`、`01-design-language/color.md` |
| 字号与数字阅读 | `01-design-language/typography.md` |
| 容器和绘图区 | `01-design-language/layout.md` |
| 坐标轴和网格线 | `01-design-language/axis.md` |
| 图例和系列说明 | `01-design-language/legend.md` |
| 洞察标注和关键点 | `01-design-language/label.md` |
| 悬停读数和上下文 | `01-design-language/tooltip.md` |

### 4.3 设计工具写入时补充读取

如果目标来自 Figma / Relay / Zero，或用户要求在设计稿旁边生成评审文档，应补充读取：

```txt
05-rules/vibedesign-rules.md
05-rules/generation-flow.md
```

## 5. 执行流程

```txt
1. 识别输入载体、图表类型、展示上下文和输出目标
2. 读取图表组件文档和相关视觉语言文档
3. 建立 Audit Context：业务问题、数据构成、画布尺寸、图表结构
4. 从规范性、可读性、叙事性、可维护性四个维度评审
5. 生成问题清单，按 P0 / P1 / P2 分级
6. 执行 chart-selector-skill 的选型复核，生成 Selector Review Packet
7. 执行 chart-builder-skill 的构建复核，生成 Builder Improvement Packet
8. 生成 Insight Opportunity Map，标记可激发洞察的位置
9. 在设计工具画布中、被审查图表旁边创建 visualAuditReviewFrame
10. 在 visualAuditReviewFrame 中写入评审建议文档
11. 在评审建议文档末尾绘制同类型、同尺寸的 Optimized Visualization Proposal
12. AgentChat 仅输出简短完成摘要、画布位置和阻塞项
```

## 6. Audit Context

评审前必须整理上下文：

| 字段 | 说明 |
|---|---|
| `chart_type` | 当前图表类型 |
| `primary_intent` | 主要分析目标，如趋势、比较、占比、分布、关系 |
| `data_fields` | 维度、指标、系列、单位、口径 |
| `data_grain` | 时间、类目、SKU、店铺、渠道等粒度 |
| `display_context` | 卡片、报告页、大屏、移动端、设计规范验证等 |
| `canvas_size` | 原图或设计节点尺寸；优化方案必须继承该宽高 |
| `visible_structure` | 标题、坐标轴、图例、标签、Tooltip、标注、绘图区 |
| `known_limits` | 数据不可见、交互不可见、截图无法确认等限制 |

没有数据源时，不得把“可能存在异常点”“可能需要阈值线”等写成确定结论，应写成建议机会或待确认项。

## 7. Original Reference Contract

重绘优化图表时，原图只能提供以下输入：

| 可参考内容 | 用途 |
|---|---|
| 图表类型 | 锁定 `optimizedChartFrame.chart_type = current_chart_type` |
| 画布尺寸 | 锁定 `optimizedChartFrame.width / height` |
| 数据构成 | 识别维度、指标、系列、单位、口径、时间范围 |
| 图表构成 | 识别是否存在标题、坐标轴、图例、标签、Tooltip、标注等组件 |
| 业务上下文 | 判断主要分析目标和洞察机会 |

原图中以下内容不得作为规范依据：

- 原颜色、随机色、品牌色或未绑定 token 的色值。
- 原坐标轴起点、刻度、网格线、标签抽样和轴标题位置。
- 原图例位置、shape、间距和非系列说明文本。
- 原数据标签密度、字号、位置和避让方式。
- 原 Tooltip 结构、阴影、字体、行距和 icon 形态。
- 原图层结构、装饰容器、卡片样式或临时说明。
- 原图中任何违反 Wiki 的视觉细节。

重绘依据的优先级必须为：

```txt
可视化 Wiki 规范
→ chart-selector-skill 适配性复核
→ chart-builder-skill Visual Fidelity / VibeDesign 构建策略
→ 原图类型、尺寸和数据构成
```

如果原图样式与 Wiki 规范冲突，必须按 Wiki 重绘，并在评审文档中把冲突写入问题清单。

## 8. Wiki Compliance Packet

绘制 `optimizedChartFrame` 前，必须先生成 `Wiki Compliance Packet`。该 Packet 是重绘的硬输入，不是评审说明。

```txt
Wiki Compliance Packet:
  required_docs:
    chart_type_doc:
    visual_language_docs:
    selector_skill:
    builder_skill:
  chart_type_lock:
    current_chart_type:
    chart_type_doc_path:
    allowed_to_change_type: false
  exact_tokens:
    series_colors:
      - series:
        token:
        resolved_value:
    text_colors:
      axis_label:
      legend_text:
      tooltip_text:
    component_colors:
      axis_line:
      split_line:
      tooltip_background:
      tooltip_axis:
  typography:
    chart_title:
    axis_label:
    axis_title:
    legend:
    data_label:
    tooltip_title:
    tooltip_label:
    tooltip_value:
  layout_metrics:
    yAxisLabelRailWidth:
    yAxisLabelRightPadding:
    xAxisLabelBandHeight:
    xAxisLabelTopOffset:
    axisTickLength:
    dimensionAxisInnerPadding:
    plotAreaBounds:
  legend_spec:
    position:
    shape_dict:
    item_gap:
    shape_label_gap:
  tooltip_spec:
    container_padding:
    title_body_gap:
    columns:
    row_height:
    item_gap:
    value_alignment:
    shadow:
  label_annotation_spec:
    label_targets:
    label_style:
    overlap_strategy:
  interaction_spec:
    hover_pointer:
    hover_marker:
    highlight_area:
```

强制规则：

- `required_docs` 必须列出本次实际读取的具体 Wiki 文档路径；不得只写“参考 Wiki”。
- `exact_tokens` 必须同时包含 token 名和当前模式 resolved value，例如 `分类色板/item-1 → #3365F7`。
- `typography` 必须写明字号、行高、字重，例如 `axis_label = .textSmall 12/18 400`。
- `layout_metrics` 必须写明精确数值；不得写“标准间距”“合适间距”“参考组件”。
- `legend_spec` 必须写明 shape 类型和尺寸，例如折线 `line 10×2 radius 2`，柱 / 面 / 饼 `rectangle 10×10 radius 2`，点图 `dot 10×10`。
- `tooltip_spec` 必须写明两列结构、`18px` 行高、`0px` 系列行间距、value 右对齐和阴影参数。
- 如果任何必需字段无法从 Wiki 或 `chart-builder-skill` 得到，必须在评审文档中标记为阻塞或规范缺口，不得用原图样式、个人审美或设计工具默认值补齐。

## 9. Builder Fidelity Gate

`chart-builder-skill` 对 `optimizedChartFrame` 具有强约束。Visual Auditor 只能把 builder 的规范构建策略转成画布节点，不得自行改写。

绘制前必须生成：

```txt
Builder Fidelity Gate:
  visual_fidelity_packet:
    design_structure:
    auto_layout_plan:
    typography_constraints:
    axis_layout_constraints:
    legend_shape_dict:
    tooltip_layout:
    effect_constraints:
    label:
    interaction_state:
    token_bindings:
  pass_to_render: true / false
  blocked_reasons:
```

通过条件：

- `design_structure` 必须包含 `chartFrame / headerFrame / bodyFrame / plotAreaFrame / seriesLayer / annotationLayer / interactionLayer`。
- `typography_constraints` 必须覆盖标题、轴标签、图例、标签、Tooltip。
- `axis_layout_constraints` 必须覆盖坐标轴标签轨道、绘图区、X 轴标签带、首尾留白。
- `legend_shape_dict` 必须与当前图表系列形态一致。
- `tooltip_layout` 必须是 Wiki 规定的结构，不能使用设计工具默认 Tooltip。
- `token_bindings` 必须与 `Wiki Compliance Packet.exact_tokens` 一致。
- `pass_to_render` 为 `false` 时不得绘制 `optimizedChartFrame`，只能在评审文档中说明阻塞原因。

## 10. 评审维度

### 10.1 规范性

检查图表是否符合 Wiki 视觉语言和组件规范：

| 维度 | 检查重点 |
|---|---|
| 颜色 | 是否使用正确色板、状态色、系列色和 token |
| 字体 | 标题、轴标签、图例、Tooltip、标签是否使用规定字号、行高、字重 |
| 坐标轴 | 起点、刻度、网格线、轴标题、标签抽样是否合理 |
| 图例 | 是否必要，shape 是否匹配图表系列真实形态 |
| 标签 | 是否只标关键读数，是否遮挡主体 |
| Tooltip | 是否有稳定结构、单位、两列对齐、正确 icon 和状态 |
| 布局 | 图表区域、说明区、图例区是否有清晰层级 |
| 交互 | hover、选中、弱化、告警状态是否一致 |

### 10.2 可读性

检查用户能否快速读懂图表：

- 主要结论是否能在 3 秒内被感知。
- 标题是否说明“指标 + 维度 + 时间 / 范围”。
- 数据单位和口径是否明确。
- 类目、系列和时间点是否过密。
- 颜色、线型、标签、图例是否互相解释，而不是互相竞争。
- 绘图区是否被装饰、标签或图例挤压。

### 10.3 叙事性

检查图表是否能帮助用户形成判断，而不仅是展示数据：

- 是否有可以被解释的峰值、谷值、拐点、异常点。
- 是否需要目标线、阈值线、基准线、均值线或活动区间。
- 是否需要标注“为什么值得看”，例如阶段变化、同比差异、转化断点。
- 是否需要把多系列关系转化成对比叙事，例如领先、追平、背离、交叉。
- 是否需要补充说明，避免用户把颜色、涨跌或比例误读成业务好坏。

### 10.4 可维护性

设计方案或图表代码还应检查：

- 图层是否有可维护结构，而不是所有元素平铺。
- 标注、Tooltip、图例、坐标轴是否独立分层。
- 系列色、文本和状态是否绑定 token 或可追溯变量。
- 建议方案是否能被 `chart-builder-skill`、G2 或 ECharts 继续实现。

## 11. Insight Opportunity Map

评审时应输出可激发洞察的位置，而不是只列视觉问题。

可建议的洞察表现方式：

| 类型 | 适用位置 | 用途 |
|---|---|---|
| 关键点标注 | 最大值、最小值、最新值、异常值、拐点 | 帮助用户快速发现值得关注的数据点 |
| 阈值线 / 目标线 | 达标率、转化率、库存、风险指标 | 明确业务判断标准 |
| 基准线 / 均值线 | 排名、分布、效率、客单价 | 判断高低和偏离 |
| 阶段区间 | 活动期、政策变化、投放周期、节假日 | 解释趋势变化原因 |
| 对比标注 | 同比、环比、竞品、目标差 | 强化差异感 |
| Top / Bottom 标记 | 排名、类目比较、渠道对比 | 突出贡献和短板 |
| 说明 note | 口径、异常原因、数据延迟、样本限制 | 避免误读 |
| 交互提示 | hover、筛选、图例联动、数据下钻 | 引导用户探索 |

建议必须绑定到具体位置：

```txt
位置：x = 2026-05-18 / 类目 = 搜索 / 系列 = GMV
建议：添加活动区间标注
原因：该区间趋势斜率明显变化，可帮助用户理解增长来自活动影响
前置条件：需要确认活动起止日期
```

## 12. Canvas Review Document

当用户使用 `visual-auditor-skill` 评审指定设计工具中的图表时，必须在设计工具画布中创建可编辑评审文档，而不是只在 AgentChat 中返回 Markdown。

### 12.1 画布位置

评审文档默认放在被审查图表右侧。

```txt
targetChartFrame
visualAuditReviewFrame
```

布局规则：

- `visualAuditReviewFrame.x = targetChartFrame.x + targetChartFrame.width + 48`
- `visualAuditReviewFrame.y = targetChartFrame.y`
- `visualAuditReviewFrame.width` 建议为 `420-560px`
- `visualAuditReviewFrame.height` 不小于被审查图表高度；内容较多时可纵向延展
- 如果右侧空间不足，可放在图表下方，间距 `48px`
- 不遮挡、不移动、不覆盖原图表，除非用户明确要求重排画布

### 12.2 VibeDesign 图层结构

评审文档必须是可编辑设计结构：

```txt
visualAuditReviewFrame
  reviewHeader
    title
    verdictBadge
    metaRow
  auditSummarySection
  specFindingsSection
  readabilityFindingsSection
  narrativeOpportunitiesSection
  selectorReviewSection
  builderImprovementSection
  optimizedProposalSection
    proposalHeader
    optimizedChartFrame
    proposalNotes
  nextStepSection
```

要求：

- 使用 Frame / Auto Layout / Text / Shape 创建结构，不使用整张位图。
- 每条评审建议都是独立可编辑文本或卡片。
- P0 / P1 / P2 可使用轻量 badge，但颜色必须绑定语义色或中性色 token。
- 建议文档中的文字默认使用 `.textSmall 12/18 400`，标题可使用 `14/20 600` 或 Wiki 已定义标题层级。
- 评审文档是画布上的设计交付物；AgentChat 中不要重复完整正文。

### 12.3 文档内容顺序

`visualAuditReviewFrame` 必须按以下顺序写入：

```txt
1. 评审结论
2. 图表上下文
3. 规范问题
4. 可读性问题
5. 洞察增强建议
6. chart-selector 选型复核
7. chart-builder 构建复核
8. 优化后的可视化设计方案
9. 后续执行建议
```

第 8 节必须出现在评审文档最后一段核心内容中，并绘制与原图同类型、同尺寸的 `optimizedChartFrame`。

### 12.4 设计工具写入路由

根据被审查图表来源选择写入方式：

| 来源 | 读取方式 | 写入方式 |
|---|---|---|
| Figma | 读取目标节点 context / screenshot / variables | 使用 Figma 写入工具创建 `visualAuditReviewFrame` |
| Relay / Zero | 读取目标节点 context / metadata / screenshot / variables | 使用 Relay / Zero 写入脚本创建 `visualAuditReviewFrame` |
| SVG / HTML | 解析结构、尺寸和样式 | 在同目录生成 VibeDesign 参考 HTML / SVG，并标明无法直接写入设计工具 |
| 图片截图 | 读取可见结构和尺寸 | 仅生成低保真参考方案，除非用户补充数据或设计节点 |

写入要求：

- 先读取目标图表的位置、宽高和图层结构。
- 再在目标图表旁创建 `visualAuditReviewFrame`。
- 最后在 `optimizedProposalSection` 内绘制 `optimizedChartFrame`，且 `optimizedChartFrame.width = targetChartFrame.width`、`optimizedChartFrame.height = targetChartFrame.height`。
- 写入完成后应再次读取或截图确认评审文档确实位于原图旁边。
- 如果写入失败，不得伪称已生成；应输出阻塞原因和可复制的 VibeDesign 构建指令。

## 13. Optimized Visualization Proposal

评审文档最后必须结合 `chart-selector-skill` 与 `chart-builder-skill`，重新绘制一版同图表类型、同尺寸的优化后可视化设计方案。该方案用于在设计稿旁边对照评审，不默认覆盖原图。

生成前必须完成：

```txt
Selector Review Packet:
  current_chart_type:
  chart_type_fit:
  type_change_risk:
  alternative_chart_types:
  not_recommended:
  selection_reason:
  selection_risks:

Builder Improvement Packet:
  wiki_compliance_packet:
    exact_tokens:
    typography:
    layout_metrics:
    legend_spec:
    tooltip_spec:
    label_annotation_spec:
    interaction_spec:
  builder_fidelity_gate:
    visual_fidelity_packet:
    pass_to_render:
    blocked_reasons:
  same_size_contract:
    source_width:
    source_height:
    output_width:
    output_height:
    chart_type_locked:
  original_reference_contract:
    use_original_for:
      - chart_type
      - canvas_size
      - data_composition
      - series_composition
    do_not_copy_original_style:
      - colors
      - axis_style
      - legend_style
      - label_style
      - tooltip_style
      - layout_style
  design_structure:
  visual_encoding:
  axis_strategy:
  color_strategy:
  legend_strategy:
  label_strategy:
  tooltip_strategy:
  insight_annotation_strategy:
  token_bindings:
```

优化方案硬性约束：

- 图表类型必须等于被审查图表类型，即 `optimized_chart_type = current_chart_type`。
- 输出尺寸必须等于原图尺寸，即 `optimized_width = source_width`、`optimized_height = source_height`。
- 只继承原图的类型、尺寸、数据构成和系列构成；所有视觉规则必须按 Wiki 和 `chart-builder-skill` 重建。
- `optimizedChartFrame` 的每一个视觉元素都必须能追溯到 `Wiki Compliance Packet` 或 `Builder Fidelity Gate`。
- 颜色必须使用 `exact_tokens` 中的 token 和 resolved value；不得使用相近色、吸管色、原图色或设计工具默认色。
- 字体必须使用 `typography` 中的精确字号、行高、字重；不得依赖默认字体样式。
- 坐标轴、图例、Tooltip、标签、标注和交互层必须使用 Packet 中的精确规格；不得“目测接近”。
- `chart-selector-skill` 只能用于复核当前图表类型是否合适；即使它发现更合适的替代图表，`optimizedChartFrame` 仍必须先按当前类型重绘，并在 `selectorNotes` 中记录“若允许改类型，可考虑的替代方案”。
- 如果当前图表类型存在 P0 级误导风险，应在评审文档中明确标记，但仍不得在 Visual Auditor 的 `optimizedChartFrame` 中擅自切换图表类型；需要改类型时交给 `chart-style-optimizer-skill` 或重新进入 `chart-selector-skill`。

优化方案应遵守：

- 严格保持原图尺寸，便于对照。
- 保留原数据事实、字段、单位和口径。
- 不沿用原图中不规范的颜色、字体、坐标轴、图例、Tooltip、标签和布局细节。
- 明确标出相对于原图的变化。
- 用规范 token、坐标轴、图例、标签和 Tooltip 策略。
- 洞察标注必须少而准，不得把所有点都标满。
- 如果数据不完整，只绘制结构参考或低保真建议，并标记需要补充数据。
- 如果缺少精确数据，不得虚构数值；可以绘制结构化占位方案，并在 `proposalNotes` 中标记所需数据。

`optimizedProposalSection` 必须包含：

| 内容 | 说明 |
|---|---|
| `proposalHeader` | 当前图表类型、原始尺寸、主要分析目标 |
| `optimizedChartFrame` | 同类型、同尺寸重绘后的规范图表 |
| `selectorNotes` | 当前图表类型适配性、风险、替代方案说明；不改变本次重绘类型 |
| `wikiComplianceNotes` | 读取的 Wiki 文档、精确 token、色值、字号、布局规格 |
| `builderNotes` | 同尺寸构建策略、原图参考边界、Visual Fidelity Packet、交互和 token 绑定 |
| `changeCallouts` | 相比原图的关键变化 |
| `dataRisks` | 数据缺失、业务口径或待确认事项 |

如果输出到 Figma / Relay，应优先创建可编辑结构：

```txt
reviewFrame
  originalChartFrame / optional
  visualAuditReviewFrame
    auditSummarySection
    findingsSections
    insightOpportunitiesSection
    optimizedProposalSection
      proposalHeader
      optimizedChartFrame
        chartFrame
          headerFrame
          bodyFrame
            plotAreaFrame
              gridLayer
              seriesLayer
              annotationLayer
              interactionLayer
          footerFrame
      proposalNotes
```

`optimizedChartFrame` 必须遵守 `chart-builder-skill` 的 VibeDesign 结构，并仅继承原图类型、尺寸和数据构成：

```txt
optimizedChartFrame
  width = targetChartFrame.width
  height = targetChartFrame.height
  chart_type = current_chart_type
  data_composition = source_data_composition
  style_source = Wiki Compliance Packet + Builder Fidelity Gate
  headerFrame
  bodyFrame
    yAxisTitleBand
    plotRowFrame
      yAxisLabelRail
      plotAreaFrame
        gridLayer
        annotationLayer
        seriesLayer
        interactionLayer
    xAxisLabelBand
    xAxisTitleBand
  footerFrame / optional
```

## 14. AgentChat 输出边界

AgentChat 中只输出简短摘要：

```txt
已在设计稿旁生成 visualAuditReviewFrame。
包含：评审结论、规范问题、洞察建议、选型复核、构建复核和优化设计方案。
位置：目标图表右侧 / 下方。
阻塞：如有数据缺失或设计工具不可写，在这里说明。
```

禁止：

- 在 AgentChat 中输出完整评审文档后就结束。
- 只给文字建议，不在设计工具中生成评审文档。
- 只写构建复核文字，不重绘同类型、同尺寸的优化图。
- 只画建议图，不写选型复核和构建复核。
- 在 `optimizedChartFrame` 中擅自改变图表类型或尺寸。
- 按原图样式临摹，而不是按 Wiki 规范重绘。
- 使用与 Wiki 近似但不一致的色值、字号、间距、图例 shape 或 Tooltip 结构。
- 在缺少 `Wiki Compliance Packet` 或 `Builder Fidelity Gate` 的情况下绘制优化图。
- 把优化方案画到原图表上导致原稿被覆盖。
- 在缺少数据源时伪造精确优化图。

## 15. 问题分级

| 等级 | 含义 | 示例 |
|---|---|---|
| P0 | 会造成数据误读、结论错误或严重规范违背 | 错误图表类型、数值轴误导、单位缺失、数据标签遮挡关键趋势 |
| P1 | 明显影响阅读效率或与组件规范冲突 | 图例 shape 错误、轴标签 16px、Tooltip 无单位、颜色语义错误 |
| P2 | 影响精致度、一致性或叙事表达 | 网格线过重、图例位置不佳、缺少关键点标注机会 |

评审建议必须优先处理 P0 / P1。P2 可以作为增强建议，不应压过主要问题。

## 16. 输出格式

设计工具中的 `visualAuditReviewFrame` 应包含：

```txt
## 评审结论
结果：通过 / 有条件通过 / 不通过 / 需补充信息
图表类型：
主要分析目标：
总体判断：

## 规范问题
| 等级 | 位置 | 问题 | 依据 | 影响 | 建议 |

## 洞察增强建议
| 位置 | 建议表现方式 | 叙事价值 | 前置条件 |

## 评审建议文档
review_document_title:
summary:
key_findings:
insight_opportunities:
risks:

## chart-selector 选型复核
current_chart_type:
chart_type_fit:
type_change_risk:
alternative_chart_types:
not_recommended:
selection_reason:

## chart-builder 构建复核
wiki_compliance_packet:
  required_docs:
  exact_tokens:
  typography:
  layout_metrics:
  legend_spec:
  tooltip_spec:
  label_annotation_spec:
  interaction_spec:
builder_fidelity_gate:
  visual_fidelity_packet:
  pass_to_render:
  blocked_reasons:
same_size_contract:
  source_width:
  source_height:
  output_width:
  output_height:
  chart_type_locked:
original_reference_contract:
  use_original_for:
  do_not_copy_original_style:
design_structure:
visual_encoding:
axis_strategy:
color_strategy:
legend_strategy:
label_strategy:
tooltip_strategy:
insight_annotation_strategy:
token_bindings:

## 优化后的可视化设计方案
是否已绘制：必须为是；不可写入时说明阻塞
图表类型：必须等于 current_chart_type
输出尺寸：必须等于原图尺寸
数据构成：必须来自原图或用户提供数据
规范来源：必须来自 Wiki + chart-selector-skill + chart-builder-skill
Wiki 符合性：必须列出 token / resolved value / typography / layout metrics
Builder 门禁：必须通过 Builder Fidelity Gate
方案类型：VibeDesign / Figma / Relay / Zero / SVG fallback
主要变化：
保留内容：
需要确认：

## 下游建议
需要同尺寸修复：交给 chart-style-optimizer-skill
需要重新选型：交给 chart-selector-skill
需要代码审查：交给 code-review-skill
```

AgentChat 中只输出简短摘要，不复制完整评审文档。

## 17. 依赖 Skill

| Skill | 关系 |
|---|---|
| `chart-style-optimizer-skill` | 当用户要覆盖原图、批量修复或生成最终同尺寸规范图表时调用 |
| `chart-selector-skill` | 评审时必须用于图表选型复核，并产出 `Selector Review Packet` |
| `chart-appropriateness-reviewer` | 当选型是否合理存在争议时调用 |
| `chart-builder-skill` | 评审时必须用于生成优化设计方案的规范构建策略，并产出 `Builder Improvement Packet` 和 `Builder Fidelity Gate`；重绘不得照搬原图样式 |
| `g2-codegen-skill` / `echarts-codegen-skill` | 当建议方案需要输出工程配置时调用 |
| `code-review-skill` | 当目标是图表代码实现质量时调用 |

## 18. 不负责事项

本 Skill 不负责：

- 默认修改原图或覆盖设计稿；评审文档和同类型同尺寸优化方案应生成在原图旁边。
- 擅自改变优化方案的图表类型或尺寸；Visual Auditor 的优化图只做同类型、同尺寸规范重绘。
- 沿用原图不符合规范的样式；原图只提供类型、尺寸、数据构成和系列构成。
- 使用近似规范或默认样式代替 Wiki 精确 token、resolved value、字号、间距和组件规格。
- 在 `Wiki Compliance Packet` 或 `Builder Fidelity Gate` 缺失时继续绘制优化图。
- 直接生成覆盖原图的最终修复图表；这属于 `chart-style-optimizer-skill`。
- 只在 AgentChat 中提供完整评审建议而不写入设计工具画布。
- 在缺少数据源时虚构精确洞察。
- 替代业务指标口径判断。
- 把所有可想到的标注都加进图里。
- 生成完整看板规划或多图表页面。

## 19. 自查清单

输出前检查：

- 是否读取了目标图表类型和相关视觉语言文档？
- 是否读取并执行了 `chart-selector-skill` 的选型复核？
- 是否读取并执行了 `chart-builder-skill` 的构建复核？
- 是否生成了完整 `Wiki Compliance Packet`？
- 是否生成并通过了 `Builder Fidelity Gate`？
- 所有颜色是否都能追溯到 token 和 resolved value？
- 所有文本是否都使用 Wiki 中的精确字号、行高、字重？
- 坐标轴、图例、Tooltip、标签、交互是否都来自 Packet，而不是目测重绘？
- 是否在设计工具画布中创建了 `visualAuditReviewFrame`？
- `visualAuditReviewFrame` 是否在原图表旁边，而不是覆盖原图？
- `optimizedChartFrame` 是否与原图保持同图表类型？
- `optimizedChartFrame` 是否与原图保持同宽高尺寸？
- `optimizedChartFrame` 是否只参考原图的数据构成和系列构成，而不是照搬原图样式？
- `optimizedChartFrame` 的颜色、轴、图例、标签、Tooltip 和布局是否来自 Wiki 与 `chart-builder-skill`？
- 是否区分了规范问题、可读性问题和叙事增强建议？
- 是否按 P0 / P1 / P2 分级？
- 是否为每条建议提供具体位置和理由？
- 洞察建议是否基于可见数据或明确标记为待确认？
- 是否避免把建议说明塞进原图表主体导致遮挡？
- 评审文档最后是否重绘了同类型、同尺寸的优化后图表？
- 优化方案是否包含选型复核、同尺寸构建复核、原图参考边界、token 绑定和主要变化说明？
- 如果绘制优化方案，是否保持数据事实、字段、单位和口径不变？
- 是否说明建议方案是参考稿而不是自动覆盖原图？
- AgentChat 是否只输出简短完成摘要和阻塞项？
- 是否明确需要交给哪个下游 Skill 继续执行？

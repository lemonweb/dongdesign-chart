---
name: dongDesignChart
description: Guide Figma or design agents to create responsive, editable dongDesign chart visuals from data, business intent, screenshots, or chart requests. Use when the agent must generate Figma charts that strictly follow dongDesign Chart visual rules for colors, typography, layout, axes, legends, labels, tooltip, interaction states, responsive Auto Layout structure, scalable layer hierarchy, and chart semantics; when this Skill does not cover a scenario, the agent must first search the dongDesign for Chart Figma component library, variables, and styles before making tasteful visual decisions.
---

# dongDesignChart

## 1. Skill 目标

本 Skill 用于指导 Figma / 设计类 Agent 基于 dongDesign Chart 规范创建可编辑图表。

核心目标：

```txt
业务意图正确
→ 图表选型合理
→ dongDesign Chart 已定义的视觉规范严格还原
→ Figma 图层可编辑、可维护
→ 图表支持自适应缩放和响应式布局
→ Skill 未覆盖时优先复用 dongDesign for Chart 组件库、变量和样式
→ 组件库也无法覆盖时，才允许有限审美发挥
```

本 Skill 是单文件 Skill。即使 Agent 只能读取一个 Markdown 文件，也应能完成图表设计生成。若完整 Wiki 可用，可将下列来源作为追溯依据：`01-design-language/theme-token.md`、`01-design-language/color.md`、`01-design-language/typography.md`、`01-design-language/axis.md`、`01-design-language/legend.md`、`01-design-language/label.md`、`01-design-language/tooltip.md`、`02-chart-type/selection-rules.md`、`02-chart-type/capability-matrix.md`、`08-skill-center/design-efficiency/chart-builder-skill.md`。

## 2. 使用边界

当用户要求“在 Figma 里画图表”“基于数据创建图表”“按 dongDesign 图表规范生成图表”“优化已有图表视觉”“生成可编辑图表组件”时使用本 Skill。

不得用本 Skill 替代业务口径定义、数据清洗、指标解释或完整 BI 系统开发。缺少关键数据时，可以创建结构和样式准确的示例图，但必须标注数据为示例或占位。

## 3. 输入要求

优先获取以下信息：

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 业务问题 | 必需 | 图表要回答什么问题 |
| 数据字段 | 必需 | 维度、时间、指标、分组、单位 |
| 数据样例 | 推荐 | 用于判断数量级、类别数、极值和密度 |
| 图表类型 | 可选 | 未指定时按选型规则选择 |
| 目标尺寸 | 推荐 | 未指定时使用标准分析卡片尺寸 |
| 主题模式 | 可选 | 默认 light |
| 交互状态 | 可选 | 静态 / hover / selected / disabled |

输入不足时：

- 缺少业务问题或字段时，先请求补充，不直接定稿。
- 用户明确要求快速出样时，可用合理示例数据，但必须在图层或说明中标记 `sample data`。
- 发现用户指定图表类型明显不匹配数据时，先提示风险，再给出更合适方案。

## 4. 执行流程

```txt
1. 识别业务问题和主要分析意图
2. 识别字段角色、单位、粒度和数据密度
3. 若未指定图表类型，按选型规则选择 1 个主图表和最多 2 个替代方案
4. 建立字段到视觉通道的映射
5. 创建 Figma 可编辑图层结构和响应式布局契约
6. 按 Auto Layout / Constraints 分区绘制坐标轴、图例、Tooltip、标签和数据图形
7. 应用 dongDesign Chart token、字号、坐标轴、图例、标签、Tooltip 规则
8. 若本 Skill 未覆盖当前业务诉求，先遍历 dongDesign for Chart Figma 组件库、变量和样式寻找可复用方案
9. 若组件库仍无覆盖，才在不破坏规范的前提下加入可视化强化表达
10. 执行自查并修正重叠、溢出、错色、错字重、错图例形态、缩放失效等问题
11. 输出或落稿最终图表
```

## 5. 图表选型规则

选型必须先判断业务问题，再判断数据结构，最后选择图表。不要只看关键词。

| 分析意图 | 典型问题 | 优先图表 |
|---|---|---|
| 比较 | 谁更高、差异多大 | 柱状图、条形图、分组柱状图、热力图 |
| 趋势 | 指标随时间如何变化 | 折线图、面积图、堆叠面积图、迷你趋势图 |
| 占比 / 构成 | 各部分占整体多少 | 环图、饼图、百分比堆叠柱状图 |
| 排名 | Top / Bottom 是谁 | 条形图、排行榜、柱状图 |
| 分布 | 数据集中在哪里、是否异常 | 直方图、箱线图、散点图、热力图 |
| 关系 | 两个或多个变量是否相关 | 散点图、气泡图、热力图 |
| 流程 / 转化 | 阶段转化或路径流向如何 | 漏斗图、桑基图、路径流转图 |
| 多维评估 | 多个维度能力结构如何 | 雷达图、评分卡、热力图、多指标表格 |
| 监控 | 当前状态是否正常 | 指标卡、折线图、告警列表、热力图 |

默认优先选择低复杂度图表。柱状、条形、折线、面积、环图、散点、热力图、漏斗图优先于桑基、旭日、网络图、平行坐标等高认知负担图表。复杂图表必须说明必要性。

## 6. Figma 图层结构

生成结果必须是响应式、可编辑、可维护的 Figma 图表。不得像 SVG 或单层 DOM 绘制那样，把所有元素直接放在一个根节点下；不得默认使用单张位图、不可拆解的大 SVG，或一个包含所有图形和文字的扁平 Vector。

标准结构：

```txt
chartFrame
  headerFrame
    title
    subtitle / meta
    legendFrame / optional
  bodyFrame
    yAxisTitleBand / optional
    plotRowFrame
      yAxisLabelRail
      plotAreaFrame
        gridLayer
        annotationLayer
        seriesLayer
        interactionLayer
      rightYAxisLabelRail / optional
    xAxisLabelBand
    xAxisTitleBand / optional
  tooltipFrame / optional hover state
  footerFrame / optional
```

规则：

- `chartFrame` 使用清晰命名，尺寸稳定，支持宽高调整，不靠内容意外撑大。
- `chartFrame`、`headerFrame`、`bodyFrame`、`plotRowFrame`、`footerFrame` 默认使用 Auto Layout 或等价布局约束。
- 标题、图例、坐标轴、绘图区、Tooltip、系列层必须按职责分组，不把所有节点平铺在根画布下。
- 网格线、轴线、标签、图例和数据图形必须分门别类，可单独选择和编辑。
- 折线 / 趋势线优先使用完整 path-like 节点承载一条 series，不把连续折线拆成大量独立 Line 节点。
- Tooltip 和 hover 状态应放在 `interactionLayer` 或独立 `tooltipFrame`，不要遮挡关键数据。

### 6.1 响应式布局契约

每次生成图表都必须支持自适应缩放。Figma Agent 应先建立布局框架，再绘制数据图形。

布局职责：

- `chartFrame`：Auto Layout vertical，宽高可调整，内部区域按约束重排。
- `headerFrame`：Auto Layout horizontal / vertical，标题 hug content，图例可 fill remaining 或换行。
- `bodyFrame`：Auto Layout vertical，绘图区随剩余空间伸缩。
- `plotRowFrame`：Auto Layout horizontal，轴标签 rail 固定宽度，`plotAreaFrame` fill remaining。
- `plotAreaFrame`：fill container，数据图形、网格、标注按绘图区等比或约束缩放。
- `xAxisLabelBand` / `legendFrame` / `tooltipFrame`：使用 fixed / hug / wrap 等约束，避免挤压绘图区。

响应式规则：

- 横向或纵向缩放时，优先伸缩 `plotAreaFrame`；轴 rail、图例 shape、Tooltip padding、字号和行高保持规范值。
- 坐标轴标签按空间抽样、截断、换行或旋转，不通过压缩字体解决。
- 数据图形坐标必须相对 `plotAreaFrame` 计算；首尾留白、band 宽度、柱体宽度、折线点位、网格线长度必须随 `plotAreaFrame` 尺寸重算或等比例约束。
- 如果工具无法绑定真正响应式公式，至少使用清晰 Frame 层级、Auto Layout、constraints 和相对命名表达可维护结构，并在 `known_gaps` 标记缺口。

### 6.2 绝对定位边界

图表中的数据图形可以在绘图区内部使用绝对定位，但绝对定位只能发生在 `plotAreaFrame` 内。

允许：

- `seriesLayer` 内的柱体、点、折线路径、面积路径、气泡、热力单元格按数据坐标定位。
- `gridLayer`、`annotationLayer`、`interactionLayer` 内的网格线、阈值线、区间背景、hover 指示线、高亮矩形和 markPoint 按 plotArea 坐标定位。

禁止：

- 把坐标轴标签、图例、Tooltip、标题、数据图形全部作为根节点的同级自由元素。
- 把 `x` / `y` 坐标写死到整个画布，导致 chartFrame 缩放后图形、轴线和标签错位。
- 把每个图形元素都放在一个无语义 `Group` 或 `Vector` 下，导致设计师无法按组件职责编辑。
- 为了视觉还原把图表导入为单个 SVG、PNG 或 flatten 后的 Vector 作为最终交付。

### 6.3 专业命名与层级

节点命名必须稳定、专业、可检索。推荐使用 slash 命名表达职责：

```txt
chartFrame/sales-trend
header/title
header/legend
yAxis/labelRail
plot/grid/splitLine/0
plot/series/bar/gmv/item/0
plot/series/line/conversion/path
plot/interaction/hover/categoryHighlight
xAxis/label/2026-06-01
tooltip/valueColumn/gmv
```

命名规则：

- 用组件职责命名，不用 `Rectangle 12`、`Group 48`、`Vector 91` 等默认名称交付。
- 同一类元素使用稳定序号或业务 key，例如 `item/0`、`label/gmv`、`series/conversion_rate`。
- 系列层必须能从名称看出图形类型、指标和角色，例如 `plot/series/bar/gmv`、`plot/series/line/cvr`。
- 交互层和静态层分开命名，避免 hover 元素混入数据 series。

## 7. Figma Agent 组件库优先级

Figma Agent 在遇到本 Skill 没有明确覆盖的业务诉求、图表变体、交互状态、组件细节或样式表达时，必须按以下优先级决策：

```txt
P0 本 Skill 已明确定义的硬规范
→ P1 dongDesign for Chart 设计组件库中的图表组件 / 变体 / 实例
→ P2 dongDesign for Chart 设计变量、文字样式、颜色样式、效果样式
→ P3 同文件或同组件库中的相近图表模式和成熟设计样例
→ P4 Agent 自行补充的可视化强化表达
```

执行要求：

- 先查找组件库中是否已有对应图表类型、组件变体、状态或图层结构，例如折线图 hover、柱状图 selected、Tooltip、多系列图例、空状态、双轴组合图等。
- 再查找变量和样式是否已有可绑定项，例如颜色变量、文本样式、阴影效果、圆角、间距或状态色。
- 如果找到组件或变量，优先复用或按其结构扩展，不重新发明相同样式。
- 如果组件库样式与本 Skill 的硬规范冲突，以本 Skill 中的硬规范为准，并在 `known_gaps` 中记录冲突。
- 如果组件库只有相近组件，可以借用其结构、命名、状态层级和变量绑定方式，但不得套用不匹配的数据语义。
- 只有当本 Skill、组件库、变量和相近样例都无法满足当前业务诉求时，Agent 才可以自行发挥。

自行发挥时必须记录：

```txt
uncovered_need: 当前业务诉求中未被 Skill / 组件库覆盖的点
library_search: 已检查的组件、变量或样式范围
decision_reason: 为什么不能直接复用
freeform_choice: 自行补充的视觉表达
guardrail: 如何保证不覆盖 dongDesign 已定义规范
```

禁止项：

- 禁止未搜索组件库和变量就直接生成自定义样式。
- 禁止用 Agent 偏好的渐变、阴影、插图、色值或复杂装饰替代已有组件库样式。
- 禁止因为组件库存在某个视觉效果，就把它套用到语义不匹配的图表或状态上。
- 禁止把组件库中的示例数据、标题或业务文案当作当前图表事实。

## 8. 布局硬约束

图表布局必须先为阅读结构分配空间，再绘制数据。

直角坐标系默认规格：

```txt
yAxisLabelRailWidth = 50px
yAxisLabelRightPadding = 10px
rightYAxisLabelRailWidth >= 50px when dual-axis
rightYAxisLabelLeftPadding = 10px when dual-axis
xAxisLabelBandHeight >= 28px
xAxisLabelTopOffset = 10px
axisTickLength = 4px when shown
axisLabelLineHeight = 18px
plotArea = excludes axis label rail and x-axis label band
```

规则：

- Y 轴标签右对齐，标签右边缘距绘图区左边界 `10px`。
- 右 Y 轴标签左对齐，标签左边缘距绘图区右边界 `10px`。
- X 轴标签顶部距底部轴线 `10px`。
- 类目轴和时间轴默认保留首尾留白，首末数据位置内缩半个 band，不让柱体、折线点或标签顶到绘图区边缘。
- 双轴图必须建立独立左右 label rail，并清楚标注单位和系列对应关系。
- 画布拥挤时优先抽样、换行、截断、翻转图例或改用条形图，不允许缩小到 12px 以下。

## 9. 色彩规则

必须区分“绑定变量”和“当前模式显示值”。Figma 可绑定变量时优先绑定变量；无法绑定时，也要在命名、注释或交付说明中保留变量来源。

色彩选择：

| 数据关系 | 使用色板 | 规则 |
|---|---|---|
| 无序类别 | `分类色板/item-*` | 从 item-1 顺序取色，同一对象在同一页面保持一致 |
| 连续高低 | `有序色板/*` | 同一指标使用单一色相由浅到深，必须有连续图例 |
| 正负 / 偏离中心 | `发散色板/*` | 先定义中心值，如 0、均值、目标值 |
| 状态 / 风险 | `语义色板/*` | normal / warning / danger 只表达业务状态 |
| 结构元素 | `坐标轴/*`、`图例/*`、`提示/*`、`背景/*` | 低对比，辅助阅读 |

禁止项：

- 不要用分类色表达高低强弱。
- 不要用顺序色表达无序类别。
- 不要在没有中心值的场景使用发散色。
- 不要用语义色做普通数据系列。
- 不要为了好看写随机 hex 覆盖 token。
- 不要只靠红绿表达好坏，必须有文字、符号或 Tooltip 辅助。

## 10. 字体规则

图表内部只使用确定字号、行高和字重。

```txt
允许字号：12 / 14 / 16
允许行高：18 / 20 / 24
允许字重：400 / 600
letter-spacing: 0
```

字体映射：

| 元素 | 样式 | 颜色变量 |
|---|---|---|
| 看板区块标题 | `.textLarge 16/24 600` | `text/400` |
| 单图标题 | `.textMedium 14/20 600` | `text/400` |
| 副标题 / 口径说明 | `.textSmall 12/18 400` | `text/200` |
| 坐标轴标签 | `.textSmall 12/18 400` | `坐标轴/axisLabelColor` |
| 坐标轴标题 | `.textSmall 12/18 400`，必要时 600 | `text/300` |
| 图例文字 | `.textSmall 12/18 400` | `图例/legendTextColor` |
| Tooltip 标题 | `.textSmall 12/18 600` | `text/300` |
| Tooltip label / note | `.textSmall 12/18 400` | `text/300` |
| Tooltip value | `.numberSmall 12/18 600` | `text/300` |
| 数据标签 | `.numberSmall 12/18 400`，关键值可 600 | `text/300` 或系列色 |

禁止使用 `10px`、`11px`、`13px`、`15px`、`18px+` 作为图表内部文字。信息过密时减少文字或放入 Tooltip，不缩小字号。

## 11. 坐标轴与网格

坐标轴是辅助阅读元素，视觉优先级必须低于数据图形。

规则：

- 轴标签固定 `12/18 400`，不得加粗。
- 轴线绑定 `坐标轴/axisLineColor`。
- 刻度线绑定 `坐标轴/tickColor`。
- 网格线绑定 `坐标轴/splitLineColor`，笛卡尔坐标系默认 `1px` 虚线，建议 dash `4 / 4`。
- 轴标题包含单位时优先写成 `指标（单位）`。
- 当标题或上下文已清楚说明轴含义时，可省略轴标题。
- 对数轴、双轴、复杂口径必须显示轴标题或明确单位说明。
- 时间轴按粒度显示，避免堆叠完整时间戳。
- 分类轴标签过长时优先换行、截断、旋转或改用条形图。

## 12. 图例

只有当颜色、形状、线型、尺寸或色阶承载数据含义时才需要图例。单系列且标题已说明含义时可省略。

离散图例默认 shape 字典：

| shape | 尺寸 | 用途 |
|---|---:|---|
| `rectangle` | `10 × 10`，圆角 `2px` | 柱、条、面积、饼图、热力色块 |
| `line` | `10 × 2`，圆角 `2px` | 折线、趋势线、路径、预测线 |
| `dot` | `10 × 10` 圆形 | 散点、气泡点、事件点 |

布局规则：

- 图例文字固定 `.textSmall 12/18 400`。
- shape 与 label 间距 `5px`。
- 图例项高度 `18px`。
- 笛卡尔图表离散图例默认右上角水平排列，与图表内容区右侧对齐。
- 水平图例项之间默认 `20px` 间距。
- 图例只解释数据系列，不加入“左轴金额 / 右轴转化率”“柱线混合图”等非系列说明。
- Tooltip icon 必须与图例 shape 和系列形态一致。

连续图例必须显示最小值、最大值、单位和区间规则。发散色图例必须说明中心值和两端含义。

## 13. 数据标签与标注

标签只用于增强关键读数，不替代坐标轴和 Tooltip。

规则：

- 默认不为每个数据点显示标签。
- 趋势图优先标记最大值、最小值、最新值或异常点。
- 柱状图优先标记 Top / Bottom、目标差异或异常值。
- 饼图 / 环图只标主要分类，其余进入 Tooltip 或图例。
- 标签密集时优先隐藏普通标签，保留关键标签，必要时使用引导线或放入 Tooltip。
- 折线 hover markPoint 固定 `8 × 8px` 圆形，系列色填充，`1px` 白色描边。
- 标签不得遮挡折线、柱体、坐标轴、图例或 Tooltip。
- 禁止为了塞下标签使用小于 `12px` 的字号。

标签策略必须明确：

```txt
label_enabled:
label_targets:
label_style:
label_color:
overlap_strategy:
```

## 14. Tooltip 与 Hover

Tooltip 用于精确读数，必须结构清晰、对齐稳定。

默认结构：

```txt
tooltipFrame
  FormatSlot vertical gap 4
    title
    body
      content horizontal gap 8
        label_column min-width 60 padding-right 12
          item icon + label
        value_column align right
          value
    note / optional
```

样式规则：

- 容器背景绑定 `提示/backgroundColor`，light 显示值通常为 `#FFFFFF`。
- 圆角 `4px`。
- padding `12px` 水平、`8px` 垂直。
- shadow `0 4 16 rgba(0,0,0,0.16)`，Figma 中使用原生 drop shadow。
- title 与 body 间距 `4px`。
- 多系列内容使用 `label_column + value_column` 两列结构，列间距 `8px`。
- 系列行高 `18px`，行间距 `0px`。
- value 使用 `.numberSmall 12/18 600` 并右对齐。
- note 位于系列列表下方，距上方 `4px`，不得当作第三条系列。
- Figma 中 value 右对齐要先设置文本再读取实际宽度，避免数值被裁切。

Hover 指示器：

| 图表类型 | 指示器 |
|---|---|
| 折线 / 面积 | 垂直 `1px` 实线，绑定 `提示/tooltipAxisColor` |
| 柱状 / 柱线混合 | 类目高亮矩形，`rgba(0,0,0,0.03)`，宽度为完整 category band |

禁止折线 hover 指示线使用虚线。禁止柱状图同时显示类目高亮矩形和垂直 line 指示器。

## 15. 图表类型专项规则

### 折线图

- 用于趋势、时间序列或有序维度变化。
- 多系列折线必须有稳定颜色映射和图例。
- 单条 series 用完整 path 节点，不拆成多段 Line。
- 预测、目标、基准线可使用虚线，但图例 shape 必须同步虚线语义。
- 默认不显示所有点标签，关键点或 hover 时才强调。

### 柱状图 / 条形图

- 用于比较、排名和分类差异。
- 普通默认态柱体使用分类色板实色填充，不随意降低 opacity。
- opacity 只用于 disabled、unselected、hover 弱化、背景参考柱、目标/实际嵌套等明确状态。
- 类目过多或名称过长时优先使用条形图。

### 饼图 / 环图

- 用于低类别数量的构成表达，建议主要分类不超过 5 个。
- 分类过多时合并为“其他”或改用堆叠条形 / 条形图。
- 必须提供图例或外置标签解释分类。
- 不用于趋势、排名精确比较或类别很多的场景。

### 散点图 / 气泡图

- 用于关系、分布和异常识别。
- 默认不显示全部点位标签。
- 若开启全部点标签，必须有防重叠策略和白色文字描边。
- 气泡尺寸必须与规模字段单调对应，并提供尺寸图例或说明。

### 热力图

- 用于矩阵强弱、分布密度和连续程度。
- 必须使用有序色板或发散色板。
- 必须显示连续图例和单位。

### 漏斗图

- 用于阶段转化，不用于普通排名。
- 阶段色优先依赖 `funnelPalette/*` 或同色相 `有序色板/*`。
- 转化率、变化值和阶段值必须清楚区分。
- 转化线和转化标签是结构信息，不可用装饰箭头替代。

### 双轴 / 组合图

- 只有当两个指标单位不同且需要同维度联动比较时才使用。
- 左右轴必须各自有 label rail 和单位说明。
- 图例项按系列真实形态分别选择 shape，例如柱为 `rectangle`，线为 `line`。
- 不用图例解释“左轴 / 右轴”，图例只解释数据系列。

## 16. 可自由发挥的边界

dongDesign Chart 已明确约束的内容必须严格遵守，不允许审美覆盖：

```txt
token 来源、颜色语义、字号行高字重、坐标轴间距、图例 shape、Tooltip 结构、hover 指示器、标签策略、数据事实、图表选型基本原则
```

可以自由发挥的范围：

- 仅当本 Skill、dongDesign for Chart 组件库、变量、样式和相近样例都没有覆盖时，才进入自行发挥。
- 未定义的辅助标注样式，但必须弱于数据主体。
- 未定义的空状态、加载态、无数据态表达。
- 未定义的轻量插图或背景辅助，但不得干扰读数。
- 未定义的微交互节奏或动效方向，但不得改变 hover / selected 的语义。
- 未定义的布局细节，例如标题区与图例的局部组合方式，但必须不破坏绘图区和坐标轴规格。
- 未定义的叙事强化，例如关键洞察 callout、目标线说明、异常区间背景，但必须绑定正确语义色或结构色。

自由发挥必须遵守三条线：

```txt
不改数据事实
不覆盖 dongDesign 已定义规范
不让装饰元素比数据主体更抢眼
```

## 17. 交付格式

在 Figma 中完成后，至少保证：

- 图表是可编辑 Frame / Text / Line / Shape / Vector 结构。
- 关键图层命名清楚，例如 `series/line/gmv/path`、`legend/item/gmv/shape`、`tooltip/value/gmv`。
- 图表尺寸、绘图区、坐标轴、图例、Tooltip、标签无重叠。
- 所有文字显式设置字号、行高、字重和 letter spacing。
- 所有颜色有 token 来源或明确降级说明。

若需要向用户说明设计结果，输出：

```txt
chart_type:
primary_intent:
data_mapping:
token_strategy:
library_search:
layout_spec:
responsive_layout:
layer_hierarchy:
legend_spec:
label_strategy:
tooltip_spec:
interaction_state:
freeform_enhancements:
known_gaps:
```

## 18. 自查清单

交付前逐项检查：

- 图表是否回答了业务问题？
- 图表类型是否匹配数据结构？
- 是否保留了数据值、单位、排序和口径？
- 是否避免单层 SVG / DOM 式扁平绘制，并按 header、body、axis、plot、series、interaction、tooltip 分层？
- `chartFrame`、`bodyFrame`、`plotRowFrame`、`plotAreaFrame` 等关键容器是否设置了 Auto Layout、constraints 或等价响应式规则？
- 图形、坐标轴、网格线和标签是否会随 `plotAreaFrame` 自适应缩放或重算？
- 数据图形的绝对定位是否只发生在 `plotAreaFrame` 内，而不是根画布下？
- 图层命名是否专业清晰，避免默认 `Group`、`Rectangle`、`Vector` 名称？
- Skill 未覆盖时，是否先搜索了 dongDesign for Chart 组件库、变量、样式和相近样例？
- 自行发挥时，是否记录了 `uncovered_need`、`library_search`、`decision_reason` 和 `guardrail`？
- 颜色是否来自正确 token 或色板类型？
- 是否避免随机 hex、随机渐变和无语义装饰色？
- 图表内部字号是否只使用 `12 / 14 / 16`？
- 坐标轴标签是否为 `12/18 400`？
- X / Y 轴 label rail、plotArea 和首尾留白是否正确？
- 图例 shape 是否匹配系列形态？
- 图例是否只包含数据系列？
- Tooltip 是否是两列结构，value 是否右对齐？
- hover 指示器是否符合图表类型？
- 标签是否只强调关键值且不重叠？
- Figma 图层是否可编辑、分组清晰、命名可理解？
- 自由发挥部分是否没有覆盖 dongDesign 已定义规则？

任一硬约束不通过时，先修正再交付。

# 最近 30 天成交金额与转化率趋势 - Relay 设计方案

## 1. 方案定位

本方案用于在 Zero / Relay 中验证「最近 30 天成交金额和转化率的变化趋势」图表设计。

目标工具：Zero / Relay  
设计路径：VibeDesign  
业务问题：查看最近 30 天成交金额和转化率的变化趋势  
数据字段：

| 字段 | 类型 | 角色 | 说明 |
|---|---|---|---|
| `date` | date | time / x | 日期，按日连续排序 |
| `gmv` | number | value | 成交金额，建议展示单位为 `万元` |
| `conversion_rate` | number | value | 成交转化率，展示单位为 `%` |

参考设计节点：

```txt
https://relay.jd.com/file/design?id=2056672603766009858&page_id=19%3A1&node_id=22%3A5076
```

说明：当前会话未暴露可直接写入 Zero / Relay 的 MCP 工具。本文件作为可交给 Relay Agent 执行的设计构建方案；不得视为已经写入画布。

## 2. 图表选型结论

推荐图表：双轴柱线混合图  
推荐等级：P1  
primary_intent：`trend`  
secondary_intents：`monitoring / relationship`

选择理由：

- `date` 是连续时间字段，适合观察 30 天趋势。
- `gmv` 和 `conversion_rate` 都是连续数值，但单位不同，不应共用同一 Y 轴。
- `gmv` 用柱体表达每日成交规模，读者能快速感知体量变化。
- `conversion_rate` 用折线表达效率趋势，读者能快速判断转化率的波动方向。
- 双轴必须明确左右轴单位、图例与系列形态，避免制造虚假相关性。

替代方案：

| 方案 | 适用条件 | 风险 |
|---|---|---|
| 上下分面折线 / 柱线 | 更强调两个指标各自趋势，降低双轴误读 | 占用高度更大，同日联动读数弱于双轴 |
| 两张指标趋势小卡 | 用于窄空间或看板概览 | 不适合比较同日波动关系 |

不推荐方案：

| 不推荐图表 | 原因 |
|---|---|
| 单轴双折线 | `gmv` 与 `conversion_rate` 单位不同，不能共用纵轴 |
| 饼图 / 环图 | 不表达时间变化 |
| 漏斗图 | 适合阶段转化，不适合连续 30 天趋势 |
| 面积图 | 会强调体量 / 累计语义，不适合与转化率混合 |

## 3. 图表设计方案

图表类型：双轴柱线混合图  
展示空间：标准分析卡片  
主题模式：Light  
推荐尺寸：`720 × 420`，可按容器宽度扩展  
标题：最近 30 天成交金额与转化率趋势  
副标题：按日统计，成交金额与转化率使用左右双轴  

### 3.1 字段映射

| 编码 | 字段 | 展示名称 | 图形形态 | 单位 | 轴 |
|---|---|---|---|---|---|
| x / time | `date` | 日期 | 时间轴 | 日 | X 轴 |
| y / value | `gmv` | 成交金额 | 柱体 | 万元 | 左 Y 轴 |
| y / value | `conversion_rate` | 成交转化率 | 折线 | % | 右 Y 轴 |
| color / group | metric | 成交金额 / 成交转化率 | 图例区分 | - | - |
| tooltip | `date`, `gmv`, `conversion_rate` | 同日聚合读数 | Tooltip | 万元 / % | - |

### 3.2 视觉编码

- `gmv`：竖向柱体，柱宽随容器自适应，最大宽度 `18px`，顶部圆角 `1px`。
- `conversion_rate`：平滑折线，线宽 `2.5px`，普通状态不显示全部点。
- X 轴：时间轴，展示首尾与等间隔日期，例如 `04/25 / 05/02 / 05/09 / 05/16 / 05/24`。
- 左 Y 轴：成交金额，默认从 `0` 起步，`5` 个等距刻度。
- 右 Y 轴：成交转化率，默认从 `0` 起步，`5` 个等距刻度。
- 网格线：仅使用左 Y 轴刻度对应的水平网格线，避免左右轴各画一套网格造成噪声。
- 图例：右上角水平排列，柱体使用 `rectangle`，折线使用 `line`。
- 标签：默认不铺满标签；可选标记最新值或异常点。

## 4. 组件构成

```txt
chartFrame
  headerFrame
    titleGroup
      title
      subtitle
    legendFrame
      legend/item/gmv
        shape/rectangle
        label
      legend/item/conversion_rate
        shape/line
        label
  bodyFrame
    yAxisTitleBand
      yAxisTitle/left
      yAxisTitle/right
    plotRowFrame
      yAxisLabelRail/left
      plotAreaFrame
        gridLayer
        axisLayer
        seriesLayer
          series/gmv/barGroup
          series/conversion_rate/linePath
        annotationLayer
        interactionLayer
          hoverAxisPointer
          hoverPoint/conversion_rate
      yAxisLabelRail/right
    xAxisLabelBand
    xAxisTitleBand / optional
  tooltipFrame / hidden by default
```

### 4.1 Auto Layout 计划

| 区域 | 布局方式 | 说明 |
|---|---|---|
| `chartFrame` | vertical Auto Layout | 承载 header、body，内边距建议 `24px` |
| `headerFrame` | horizontal Auto Layout | 左侧标题组 grow，右侧图例 hug |
| `titleGroup` | vertical Auto Layout | 标题与副标题间距 `4px` |
| `legendFrame` | horizontal Auto Layout | 图例 item 间距 `16px` |
| `bodyFrame` | vertical Auto Layout | 轴标题带、绘图区、X 轴标签带 |
| `plotRowFrame` | horizontal Auto Layout | 左轴标签轨道、绘图区、右轴标签轨道 |
| `plotAreaFrame` | fixed / fill | 唯一数据坐标空间 |
| `tooltipFrame` | vertical Auto Layout | 内部使用 `FormatSlot` 两列结构 |

数据柱体与折线路径允许在 `seriesLayer` 内按 `plotAreaFrame` 坐标绝对定位；标题、图例、坐标轴标签、Tooltip 必须保持可编辑结构。

## 5. 尺寸与布局规格

推荐 `chartFrame`：

| 项 | 值 |
|---|---:|
| 宽度 | `720px` |
| 高度 | `420px` |
| 内边距 | `24px` |
| 背景 | `背景/cardBackground` 或等价卡片背景 |
| 圆角 | `8px` |

坐标系区域：

| 项 | 值 |
|---|---:|
| `bodyFrame` 高度 | `320px` |
| `yAxisTitleBand` 高度 | `24px` |
| 左 `yAxisLabelRail` 宽度 | `50px` |
| 右 `yAxisLabelRail` 宽度 | `50px` |
| `xAxisLabelBand` 高度 | `28px` |
| Y 轴标签右内距 | `10px` |
| X 轴标签上边距 | `10px` |
| 网格线数量 | `5` 条 |
| 网格线样式 | `1px dashed 4/4` |
| X 轴底线 | `1px solid` |
| Hover 指示线 | `1px solid` |

执行公式：

```txt
plotLeft = chartLeft + 50
plotRight = chartRight - 50
plotBottom = chartBottom - 28
yAxisLabelRightLeft = plotLeft - 10
yAxisLabelLeftRight = plotRight + 10
xAxisLabelTop = plotBottom + 10
```

## 6. 变量绑定

| 元素 | 绑定变量 | Light 显示值 | 说明 |
|---|---|---:|---|
| GMV 柱体 | `分类色板/item-1` | `#3365F7` | 成交金额 |
| 转化率折线 | `分类色板/item-2` | `#30CAFA` | 成交转化率 |
| Hover 点 | `分类色板/item-2` | `#30CAFA` | 转化率当前点填充 |
| Hover 点描边 | white | `#FFFFFF` | `1px` 描边 |
| 轴线 | `坐标轴/axisLineColor` | `#D9D9D9` | X 轴底线 |
| 网格线 | `坐标轴/splitLineColor` | `#EBEBEB` | 水平虚线 |
| 轴标签 | `坐标轴/axisLabelColor` | `#8C8C8C` | X / 左右 Y 轴标签 |
| 图例文字 | `图例/legendTextColor` | `#595959` | 图例 label |
| Tooltip 背景 | `提示/backgroundColor` | `#FFFFFF` | 浮层背景 |
| Hover 指示线 | `提示/tooltipAxisColor` | `#B5B5B5` | 垂直实线 |
| Tooltip 文字 | `text/300` | `#595959` | title / label / value |

## 7. 字体与文本

| 元素 | 样式 | 颜色 |
|---|---|---|
| 标题 | `.textMedium 14/20 600` | `text/400` |
| 副标题 | `.textSmall 12/18 400` | `text/200` |
| 轴标题 | `.textSmall 12/18 400` | `text/300` |
| 轴标签 | `.textSmall 12/18 400` | `坐标轴/axisLabelColor` |
| 图例文字 | `.textSmall 12/18 400` | `图例/legendTextColor` |
| Tooltip title | `.textSmall 12/18 600` | `text/300` |
| Tooltip label | `.textSmall 12/18 400` | `text/300` |
| Tooltip value | `.numberSmall 12/18 600` | `text/300` |
| 数据标签 | `.numberSmall 12/18 400`，关键值可 `600` | `text/300` 或系列色 |

禁止使用 `10px`、`11px`、`13px`、`16px` 默认回退作为图表内部辅助文字。

## 8. 图例规格

| 系列 | shape | 尺寸 | 颜色 |
|---|---|---:|---|
| 成交金额 | rectangle | `10 × 10px`, `r2` | `分类色板/item-1` |
| 成交转化率 | line | `10 × 2px`, `r2` | `分类色板/item-2` |

图例位置：`headerFrame` 右上角，水平排列。  
图例 item：shape 与 label 间距 `5px`，item 高度 `18px`，item 间距 `16px`。

## 9. Tooltip 方案

触发方式：`axis`，按 `date` 聚合展示两项指标。  
默认位置：hover 指示线右侧 `12-16px`，靠近右边界时翻转到左侧。  
状态反馈：显示垂直 hover 指示线、GMV 当前柱高亮、转化率 hover 点。

Tooltip 结构：

```txt
tooltipFrame
  FormatSlot vertical gap 4
    title
    body
      content horizontal gap 8
        label_column min-width 60 padding-right 12
          item/gmv horizontal gap 4 height 18
            icon rectangle 8x8 r2
            label 成交金额
          item/conversion_rate horizontal gap 4 height 18
            icon line 8x2 r2
            label 成交转化率
        value_column vertical align right
          value/gmv
          value/conversion_rate
    note optional
```

Tooltip 示例：

```txt
2026-05-24
成交金额        330 万元
成交转化率      5.5%
```

样式：

| 项 | 值 |
|---|---|
| 背景 | `提示/backgroundColor` |
| 圆角 | `4px` |
| padding | `12px 8px` |
| shadow | 原生 drop shadow：`0 4 16 rgba(0,0,0,0.16)` |
| title 与 body 间距 | `4px` |
| label / value 列间距 | `8px` |
| 系列行高 | `18px` |
| 系列行间距 | `0px` |
| note 与系列列表间距 | `4px` |

Relay 生成时，value 右对齐必须按实际文本宽度二次定位：先设置 `characters`，读取 `text.width`，再设置 `x = valueColumnRight - text.width`。

## 10. 交互规则

| 交互 | 启用条件 | 系统反馈 |
|---|---|---|
| Hover Tooltip | 需要读取同日精确值 | 显示垂直实线、当前柱高亮、转化率 hover 点、Tooltip |
| 图例筛选 | 用户需要聚焦单指标 | 点击图例可隐藏 / 显示对应系列，保留轴标题与单位 |
| 数据标签 | 存在最大值、最小值、最新值或异常点 | 只标记关键点，不铺满全部 30 天 |
| 边界翻转 | Tooltip 靠近画布右侧 | Tooltip 翻转到指示线左侧 |

Hover 层级：

```txt
hoverAxisPointer
→ barHoverState
→ lineHoverPoint
→ tooltipFrame
```

## 11. Relay 构建指令

1. 在目标节点附近创建 `chartFrame`，尺寸 `720 × 420`，命名为 `chart/30d-gmv-conversion`.
2. 创建 `headerFrame`，内部包含标题组和图例。图例必须分别使用 rectangle 与 line shape。
3. 创建 `bodyFrame`，拆分 `yAxisTitleBand`、`plotRowFrame`、`xAxisLabelBand`。
4. 在 `plotRowFrame` 中创建左 `yAxisLabelRail`、中 `plotAreaFrame`、右 `yAxisLabelRail`。
5. 在 `plotAreaFrame` 内创建 `gridLayer`，只绘制 `5` 条水平虚线。
6. 在 `axisLayer` 绘制 X 轴底部 `1px` 实线；默认不绘制左 Y 轴实线，右 Y 轴不绘制轴线。
7. 在 `seriesLayer/series/gmv/barGroup` 中按 30 天绘制柱体，柱体共享左 Y 轴 scale。
8. 在 `seriesLayer/series/conversion_rate/linePath` 中绘制平滑折线路径，使用右 Y 轴 scale。
9. 创建 `interactionLayer`，保留一个示例 hover 状态：建议取最新日期 `2026-05-24`。
10. 创建 `tooltipFrame`，展示最新日期的两列内容，并用原生 effects 实现投影。
11. 所有 Text 节点显式设置字号、行高和字重，不依赖 Relay 默认文本样式。
12. 所有图层按本方案命名，不使用 `Rectangle 1`、`Text 24` 这类默认名称交付。

## 12. Visual Fidelity Packet

```yaml
component_variant: dual-axis bar-line trend chart
design_structure:
  root: chartFrame
  header: headerFrame
  body: bodyFrame
  plot: plotAreaFrame
  series: seriesLayer
  interaction: interactionLayer
auto_layout_plan:
  chartFrame: vertical
  headerFrame: horizontal
  titleGroup: vertical
  legendFrame: horizontal
  bodyFrame: vertical
  plotRowFrame: horizontal
plot_area:
  width: chartFrame.width - 24*2 - 50 - 50
  height: 260
axis:
  x: time axis / sampled date labels
  yLeft: value axis / gmv / min 0 / 5 ticks
  yRight: value axis / conversion_rate / min 0 / 5 ticks
axis_layout_constraints:
  yAxisLabelRailWidth: 50
  yAxisLabelRightPadding: 10
  xAxisLabelBandHeight: 28
  xAxisLabelTopOffset: 10
  axisTickLength: 4
typography_constraints:
  axisLabel: 12/18/400
  legendLabel: 12/18/400
  tooltipTitle: 12/18/600
  tooltipLabel: 12/18/400
  tooltipValue: 12/18/600
series:
  gmv:
    type: bar
    token: 分类色板/item-1
    maxWidth: 18
    topRadius: 1
  conversion_rate:
    type: line
    token: 分类色板/item-2
    lineWidth: 2.5
    symbol: hover-only
legend_shape_dict:
  gmv: rectangle 10x10 radius 2
  conversion_rate: line 10x2 radius 2
tooltip:
  trigger: axis
  axisPointer: vertical 1px solid 提示/tooltipAxisColor
tooltip_layout:
  padding: 12px 8px
  radius: 4
  titleBodyGap: 4
  columns: label_column + value_column
  columnGap: 8
  labelColumnMinWidth: 60
  labelColumnPaddingRight: 12
  rowHeight: 18
  rowGap: 0
  noteGap: 4
effect_constraints:
  tooltipShadow: native drop shadow 0 4 16 rgba(0,0,0,0.16)
token_bindings:
  category1: '#3365F7'
  category2: '#30CAFA'
  axisLine: '#D9D9D9'
  axisLabel: '#8C8C8C'
  splitLine: '#EBEBEB'
  legendText: '#595959'
  tooltipBg: '#FFFFFF'
  tooltipAxis: '#B5B5B5'
fallback_reference:
  - 柱线混合图与双轴图文档当前为空
  - 柱体规格继承柱状图 Bar Chart
  - 折线规格继承折线图 Line Chart
  - 双轴约束继承坐标轴 Axis / 异轴与双轴
known_gaps:
  - 需要通过 Relay MCP 读取目标节点截图后校验组件实例差异
  - 若 Relay 组件库已有双轴组合图实例，应优先替换为组件实例而非手绘节点
```

## 13. 验证清单

设计稿完成后逐项检查：

- 图层结构存在 `chartFrame / headerFrame / bodyFrame / plotAreaFrame`，不是所有元素平铺在根画布。
- 标题区、图例、Tooltip 使用 Frame 或 Auto Layout 管理。
- `gmv` 是柱体，`conversion_rate` 是折线，图例 shape 分别为 rectangle 与 line。
- 左轴标题为 `成交金额（万元）`，右轴标题为 `成交转化率（%）`。
- 左右 Y 轴默认从 `0` 起步，且各自约 `5` 个等距刻度。
- 网格线只在 `plotAreaFrame` 内，不伸入轴标签轨道。
- X 轴标签抽样显示，不铺满 30 个日期。
- 轴标签、图例、Tooltip 正文均为 `12/18/400`。
- Tooltip title 与 value 为 `12/18/600`。
- Tooltip 使用 label / value 两列结构，value 右对齐且没有裁切。
- Hover 指示线为垂直 `1px` 实线，不是虚线。
- 转化率 hover 点为 `8 × 8px`，系列色填充，`1px` 白色描边。
- 普通状态不显示全部折线数据点。
- 没有使用未定义颜色、渐变、投影柱体、3D 或发光装饰。

## 14. Builder Handoff Packet

```yaml
chart_type: dual-axis bar-line chart
primary_intent: trend
secondary_intents:
  - monitoring
  - relationship
data_fields:
  date:
    role: time
    type: date
  gmv:
    role: value
    type: number
    unit: 万元
    visual: bar
    axis: left
  conversion_rate:
    role: value
    type: number
    unit: '%'
    visual: line
    axis: right
display_context: standard analytics card / Zero Relay VibeDesign
required_docs:
  - 02-chart-type/basic/line-chart.md
  - 02-chart-type/basic/bar-chart.md
  - 01-design-language/theme-token.md
  - 01-design-language/color.md
  - 01-design-language/typography.md
  - 01-design-language/axis.md
  - 01-design-language/legend.md
  - 01-design-language/label.md
  - 01-design-language/tooltip.md
known_risks:
  - 双轴可能制造虚假相关性，必须显示左右轴标题和单位
  - 柱线混合图 / 双轴图组件文档当前为空，需以柱状图、折线图与坐标轴规范补齐
  - 当前会话未暴露 Relay MCP 写入工具，尚未完成画布写入与截图验证
```

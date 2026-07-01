# 直方图 Histogram

## 1. 文档定位

本文定义直方图在 dongDesign Chart 知识库中的选型、数据结构、分箱规则、视觉构成、交互行为和代码映射。

直方图主要用于回答：

> 一个连续变量的数据集中在哪里？分布是否偏斜？是否存在多峰、长尾或异常区间？

本文不重新定义坐标轴、图例、标签、Tooltip、颜色和字体规范。相关视觉规则应读取 `01-design-language/`。当通用视觉语言与本文冲突时，以本文针对直方图的统计语义约束为准。

## 2. 图表定义

直方图是用于展示连续数值变量分布的统计图表。它先将连续数值按区间切分为若干个 `bin`，再用相邻矩形的高度表示每个区间内的数据数量、频率或密度。

在直方图中：

- 横轴表示连续数值区间，而不是离散分类。
- 纵轴表示每个区间的频数、频率或概率密度。
- 每个柱体表示一个连续区间 `[binStart, binEnd)`。
- 柱体之间默认相邻或仅保留 `1px` 分隔，用于表达连续分布。
- 柱体高度越高，表示该区间内样本越集中。

直方图强调单变量分布，不强调分类之间的大小比较。若横轴是无序分类，应使用柱状图而不是直方图。

## 3. 属性摘要

| 属性 | 说明 |
| --- | --- |
| 图表类型 | 统计图表 |
| 图形形态 | 连续区间柱体 |
| 主要功能 | 单变量分布、集中趋势、离散程度、偏态、峰态、异常区间 |
| 适合的数据 | 一个连续数值字段；可选一个分组字段用于少量分布对比 |
| 数据与图形映射 | 数值字段先映射为 `bin` 区间，区间映射到 X 轴位置，频数 / 频率 / 密度映射到 Y 轴高度 |
| 数据体量 | 原始样本建议不少于 `30` 条；`50-5000` 条更适合观察分布 |

## 4. 适用场景

直方图适用于以下场景：

| 场景 | 使用条件 | 价值 |
| --- | --- | --- |
| 单指标分布分析 | 存在连续数值字段 | 判断数据集中区间、分散程度和长尾 |
| 异常区间发现 | 某些区间频数明显偏高或偏低 | 识别异常样本、异常价格带或异常行为区间 |
| 多峰结构判断 | 分布可能存在多个集中峰 | 发现不同人群、渠道或业务模式混合 |
| 阈值前后分析 | 存在业务阈值、目标线或风控边界 | 判断样本集中在阈值哪一侧 |
| 少量分组对比 | 需要比较 2-3 个群体的同一数值分布 | 观察不同群体的分布偏移和重叠 |

典型业务问题：

- 用户客单价主要集中在哪些区间？
- 商品价格是否存在明显长尾？
- 配送时长是否超过 SLA 阈值？
- 不同渠道用户的停留时长分布是否不同？
- 是否存在异常高频的折扣区间或退款金额区间？

## 5. 不适用场景

| 不适用场景 | 原因 | 替代方向 |
| --- | --- | --- |
| 比较离散分类大小 | 直方图横轴必须是连续区间，不适合无序分类 | 柱状图、条形图 |
| 展示单个数值指标 | 没有分布分析需求 | 指标卡、统计卡 |
| 展示时间趋势 | 直方图不表达时间路径 | 折线图、面积图 |
| 展示整体与部分占比 | 直方图不表达组成结构 | 饼图、环图、堆叠柱状图 |
| 样本量过少 | 区间频数不稳定，容易误导 | 点图、表格、箱线图 |
| 需要精确读取每条记录 | 直方图会聚合样本 | 表格、散点图 |

## 6. 数据结构

直方图支持两类输入：原始样本数据和已分箱数据。AI 生成时必须明确当前输入属于哪一类。

### 6.1 原始样本数据

```json
[
  { "orderId": "A001", "price": 39.9 },
  { "orderId": "A002", "price": 82.0 },
  { "orderId": "A003", "price": 120.5 }
]
```

字段约束：

| 字段角色 | 是否必需 | 说明 |
| --- | --- | --- |
| 数值字段 `value` | 必需 | 连续数值变量，用于计算分箱 |
| 样本 ID `id` | 可选 | 用于 Tooltip 或明细钻取，不参与坐标映射 |
| 分组字段 `series` | 可选 | 用于少量分组分布对比，不应超过 3 个 |
| 权重字段 `weight` | 可选 | 用于加权频数，必须说明统计口径 |
| 阈值字段 `threshold` | 可选 | 用于业务阈值线、目标线或异常边界 |

### 6.2 已分箱数据

```json
[
  { "binStart": 0, "binEnd": 20, "count": 12 },
  { "binStart": 20, "binEnd": 40, "count": 38 },
  { "binStart": 40, "binEnd": 60, "count": 64 }
]
```

字段约束：

| 字段角色 | 是否必需 | 说明 |
| --- | --- | --- |
| 区间起点 `binStart` | 必需 | 当前区间的左边界 |
| 区间终点 `binEnd` | 必需 | 当前区间的右边界 |
| 统计值 `count` / `frequency` / `density` | 必需 | 映射到柱体高度 |
| 区间标签 `binLabel` | 可选 | 仅用于 Tooltip 或轴标签格式化 |
| 分组字段 `series` | 可选 | 用于分组直方图或小多图 |

### 6.3 数据要求

- 原始样本数量建议不少于 `30` 条；少于 `30` 条时应优先考虑点图、箱线图或表格。
- 数值字段必须为连续数值，不应把等级、枚举、文本区间直接作为直方图横轴。
- 已分箱数据必须保证区间连续、无重叠，并按 `binStart` 升序排列。
- 同一张直方图中的 `binWidth` 应保持一致。若业务明确使用不等宽分箱，必须使用密度 `density` 而不是频数 `count` 表达高度。
- 分组直方图要求所有分组使用相同 `domain`、`binCount` 和 `binWidth`，否则不能直接比较柱体高度。

## 7. 分箱规则

分箱是直方图的核心语义。VibeDesign 和 VibeCode 必须共享同一套分箱结果，不得设计端手工画区间、代码端重新计算另一套区间。

### 7.1 默认分箱策略

| 数据规模 | 默认 `binCount` | 说明 |
| --- | --- | --- |
| `30-100` 条 | `8-12` | 保持分布可读，避免过碎 |
| `100-1000` 条 | `12-24` | 默认推荐区间 |
| `1000-5000` 条 | `24-40` | 可适当增加分辨率 |
| 超过 `5000` 条 | `40` 起，配合采样或服务端聚合 | 避免前端过度计算和渲染压力 |

若用户未指定分箱方式，AI 可使用 `sqrt` 或 `Freedman-Diaconis` 作为计算参考，但最终必须把 `binCount`、`binWidth`、`domain` 和每个 `bin` 的边界写入输出。

### 7.2 分箱配置项

| 配置项 | 规则 |
| --- | --- |
| `binMethod` | `auto` / `fixedCount` / `fixedWidth` / `customBreaks` |
| `binCount` | 推荐 `8-40`，默认根据样本量计算 |
| `binWidth` | 当业务有固定区间口径时优先使用，例如价格每 `50` 元一档 |
| `domain` | 默认使用数据最小值到最大值，可按业务阈值扩展到整十、整百或自然边界 |
| `closed` | 默认 `[start, end)`，最后一个区间包含右边界 |
| `includeEmptyBins` | 默认 `true`，空区间应保留高度为 `0` 的柱体，避免分布断裂 |
| `normalize` | `count` / `frequency` / `density`，默认 `count` |

### 7.3 分箱结果结构

```json
{
  "binningSpec": {
    "binMethod": "fixedCount",
    "binCount": 12,
    "domain": [0, 600],
    "binWidth": 50,
    "closed": "[start,end)",
    "includeEmptyBins": true
  },
  "bins": [
    { "binStart": 0, "binEnd": 50, "count": 18, "frequency": 0.09 },
    { "binStart": 50, "binEnd": 100, "count": 46, "frequency": 0.23 }
  ]
}
```

## 8. 视觉构成

| 构成元素 | 作用 | 是否必需 |
| --- | --- | --- |
| X 轴 | 表示连续数值区间或区间边界 | 必需 |
| Y 轴 | 表示频数、频率或密度 | 必需 |
| Histogram Bar | 表示每个区间的统计值 | 必需 |
| 网格线 | 辅助读取频数或比例 | 建议启用 |
| Tooltip | 展示区间边界、统计值、占比和样本数 | 建议启用 |
| 阈值线 | 表示目标线、警戒线或业务边界 | 按需启用 |
| 图例 | 仅分组直方图需要 | 按需启用 |
| 标签 | 默认不显示，仅标记关键区间 | 可选 |
| dataZoom / brush | 数据范围较大或需要局部分析时启用 | 按需启用 |

直方图的基础结构是“连续坐标轴 + 相邻柱体 + 频数轴”。不应为了装饰额外添加卡片、背景图形或复杂容器。

## 9. 形态类型

### 9.1 基础频数直方图

基础频数直方图展示每个区间内的样本数量，是默认形态。

适用条件：

- 用户关注某个区间有多少样本。
- 各区间宽度一致。
- 样本总量本身有业务意义。

### 9.2 频率直方图

频率直方图展示每个区间样本占总样本的比例。

适用条件：

- 用户需要比较不同样本量数据集的分布。
- Y 轴应格式化为百分比。
- Tooltip 同时展示 `count` 和 `frequency`。

### 9.3 密度直方图

密度直方图展示概率密度，适合不等宽分箱或概率分布分析。

适用条件：

- 存在不等宽分箱。
- 用户关注概率密度而非绝对数量。
- 必须在 Y 轴标题或 Tooltip 中明确 `density` 口径。

### 9.4 分组直方图

分组直方图用于比较少量群体在同一连续变量上的分布。

执行规则：

- 分组数量建议 `2-3` 个，超过 3 个应使用筛选、小多图或密度曲线。
- 所有分组必须共用同一分箱配置。
- 默认优先使用小多图或半透明重叠。若使用并列柱，必须保证每个 `bin` 内的分组柱仍能被识别。
- 分组直方图必须显示图例。

### 9.5 累积分布直方图

累积分布直方图展示从左到右累计的频数或频率。

适用条件：

- 用户关注“小于某个值的样本占比”。
- Y 轴应明确标注累计口径。
- 若使用折线叠加累计比例，应升级为组合图，并声明第二 Y 轴或比例轴。

## 10. 样式生成规则

### 10.1 坐标轴与布局

直方图必须使用直角坐标系布局，并继承 `01-design-language/axis.md` 的坐标轴、刻度和网格规则。

执行规则：

- 数据柱体坐标必须以 `plotArea` 为计算边界，不得包含轴标签轨道。
- `Y` 轴标签轨道默认 `50px`，标签右边缘距绘图区左边界 `10px`。
- `X` 轴标签带高度至少 `28px`，标签顶部距底部轴线 `10px`。
- 网格线必须裁切在 `plotArea` 内，不得延伸到轴标签轨道、标题区或图例区。
- X 轴应显示连续数值刻度或关键区间边界，不应把每个 `binLabel` 当作离散分类标签全部铺满。
- 当 `binCount > 20` 时，X 轴标签必须抽样显示，Tooltip 承担完整区间读取。

### 10.2 柱体样式

直方图柱体表达连续区间，视觉上应比柱状图更强调连续性。

执行规则：

- 柱体默认相邻排列，`barGap = 0`。
- 可保留 `1px` 分隔线或 `1px` 背景缝隙，帮助识别区间边界。
- 不使用柱状图的 `16px` 分类间距。
- 柱体顶部圆角默认 `0`；如组件库统一要求轻微圆角，最大不超过 `1px`，且不得破坏连续分布感。
- 柱体最小可见宽度 `2px`；小于 `2px` 时应减少 `binCount` 或启用缩放。
- 单系列直方图使用 `分类色板/item-1` 或主题主强调色。
- 普通态不使用大面积渐变、投影、描边、发光或 3D 效果。

### 10.3 颜色规则

颜色只用于表达系列、阈值或状态，不用于给每个区间随机上色。

执行规则：

- 单系列直方图所有柱体使用同一颜色。
- 不得按 `bin` 顺序套用分类色板。
- 若某个区间被标记为异常，可使用语义色或描边高亮，但必须在 Tooltip 或标签中说明原因。
- 分组直方图按 `series` 映射分类色，图例颜色必须与柱体一致。
- 重叠分组直方图可使用 `opacity = 0.45-0.65`，并确保重叠区域可识别。

### 10.4 标签规则

直方图默认不显示所有柱体标签。

允许显示标签的场景：

- 标记最高频区间。
- 标记异常区间。
- 标记业务阈值附近区间。
- 用户显式开启数据标签用于走查。

执行规则：

- 标签使用 `.textSmall 12/18 400` 或 `.numberSmall 12/18 400`。
- 标签优先显示在柱体上方，空间不足时隐藏。
- 不得因为标签导致柱体之间的连续关系被破坏。
- 当标签与网格线或柱体重叠时，使用白色文字描边或隐藏普通标签。

### 10.5 阈值线

阈值线用于标记业务边界，例如 SLA、风控阈值、价格带上限。

执行规则：

- 阈值线应垂直于 X 轴，位于对应数值位置。
- 阈值线样式使用语义色或中性色虚线，不应抢占柱体主视觉。
- 阈值标签应放在绘图区上方或线条附近，避免遮挡柱体。
- 多条阈值线超过 3 条时，应改用范围带或筛选说明。

## 11. 交互规则

| 交互 | 启用条件 | 系统反馈 |
| --- | --- | --- |
| 悬停 Tooltip | 默认启用 | 展示区间 `[binStart, binEnd)`、频数、频率、密度和样本占比 |
| 区间高亮 | 悬停某个 `bin` | 当前柱体增强，其他柱体保持或轻微弱化 |
| 图例筛选 | 存在分组字段 | 支持隐藏或高亮某个分组 |
| Brush 区间选择 | 需要筛选数值范围 | 选中连续区间并输出范围条件 |
| dataZoom | `binCount` 较多或数值域较宽 | 支持查看局部区间 |
| 明细钻取 | 需要查看区间样本 | 点击区间后打开该区间样本列表或下钻 |

### 11.1 Tooltip 内容

Tooltip 内容顺序：

```txt
区间：0 - 50
频数：18
占比：9.0%
必要时显示：分组、密度、累计占比、样本明细入口
```

执行规则：

- Tooltip 必须展示区间边界，不得只展示柱体索引或 `binLabel`。
- 若最后一个区间包含右边界，应在 Tooltip 中使用正确闭区间说明。
- 分组直方图使用 axis trigger 聚合展示同一 `bin` 下各分组的统计值。

### 11.2 Brush 与筛选

当用户框选一段 X 轴范围时，应输出连续区间筛选条件，例如：

```json
{
  "filter": {
    "field": "price",
    "gte": 50,
    "lt": 150
  }
}
```

筛选后，图表可以高亮选中区间或重新计算分布。若重新计算分布，必须在状态中说明当前视图已被过滤。

## 12. 与视觉语言的关系

直方图依赖以下视觉语言文档：

| 依赖文档 | 使用内容 |
| --- | --- |
| `01-design-language/theme-token.md` | 颜色、坐标轴、图例、Tooltip、选中态和弱化态变量 |
| `01-design-language/color.md` | 单系列色、分组色、异常色和阈值色 |
| `01-design-language/typography.md` | 坐标轴、Tooltip、标签、阈值说明的字号和字重 |
| `01-design-language/axis.md` | 直角坐标系、轴标签轨道、刻度、网格线和裁切规则 |
| `01-design-language/legend.md` | 分组直方图的图例位置、图形和筛选状态 |
| `01-design-language/label.md` | 标签显示、避让和描边规则 |
| `01-design-language/tooltip.md` | 悬停信息结构和浮层样式 |

直方图不得单独发明坐标轴间距、图例形态、Tooltip 样式或临时颜色。若本文未明确某个细节，应按 `05-rules/README.md` 使用 G2 / ECharts 常规布局作为兜底，并在输出中说明 `fallback_reference`。

## 13. G2 / ECharts 映射

### 13.1 统一配置语义

无论使用 G2、ECharts、SVG、Canvas 还是设计节点，直方图都应先生成以下统一配置，再转换为具体引擎配置。

| 语义 | 取值 / 规则 | 说明 |
| --- | --- | --- |
| `chartType` | `histogram` | 固定为直方图 |
| `variant` | `count` / `frequency` / `density` / `grouped` / `cumulative` | 明确统计口径 |
| `dataMode` | `raw` / `binned` | 原始样本或已分箱数据 |
| `dataMapping.value` | 连续数值字段 | 原始样本模式必需 |
| `dataMapping.binStart` / `binEnd` | 区间边界字段 | 已分箱模式必需 |
| `dataMapping.count` | 频数字段 | 默认 Y 轴 |
| `dataMapping.frequency` | 频率字段 | 比例口径 |
| `dataMapping.density` | 密度字段 | 不等宽分箱或概率密度 |
| `dataMapping.series` | 分组字段 | 可选，不超过 3 个 |
| `binningSpec` | `binMethod`、`binCount`、`binWidth`、`domain` | 分箱配置 |
| `styleSpec.barGap` | `0` 或 `1px` | 保持连续分布感 |
| `interaction.tooltip` | `true` | 默认启用 |

### 13.2 G2

原始样本数据可由 G2 或上游预处理生成分箱。为保证 VibeDesign 和 VibeCode 一致，推荐先显式生成 `bins`，再渲染。

```js
const bins = binHistogram(data, {
  field: "price",
  binCount: 12,
  domain: [0, 600]
});

chart
  .interval()
  .data(bins)
  .encode("x", "binStart")
  .encode("y", "count")
  .style("inset", 0)
  .tooltip((d) => ({
    name: `${d.binStart} - ${d.binEnd}`,
    value: d.count
  }));
```

G2 映射规则：

- `binStart` / `binEnd` 共同定义连续区间；若引擎只能 encode 一个 X 字段，应使用区间中心点或自定义 shape，但 Tooltip 必须保留边界。
- `count` / `frequency` / `density` 映射到 Y 轴。
- `series` 存在时映射到 `color`，并确保共用同一 `binningSpec`。
- 不得只把 `binLabel` 当分类字段生成普通柱状图。

### 13.3 ECharts

ECharts 没有独立直方图类型，必须先预处理为分箱数据，再使用 `bar` 渲染。

```js
option = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter(params) {
      const d = params[0].data;
      return [
        `区间：${d.binStart} - ${d.binEnd}`,
        `频数：${d.count}`,
        `占比：${d.frequency}`
      ].join("<br/>");
    }
  },
  grid: { left: 50, right: 16, top: 30, bottom: 28, containLabel: false },
  xAxis: {
    type: "category",
    data: bins.map(d => `${d.binStart}-${d.binEnd}`),
    axisLabel: {
      interval: "auto"
    }
  },
  yAxis: { type: "value" },
  series: [
    {
      type: "bar",
      data: bins,
      barGap: "0%",
      barCategoryGap: "0%",
      itemStyle: { borderRadius: [0, 0, 0, 0] }
    }
  ]
};
```

ECharts 映射规则：

- 必须在 `data` 中保留 `binStart`、`binEnd`、`count`、`frequency` 等字段，不能只保留单个数值数组。
- `barGap` 和 `barCategoryGap` 应接近 `0`，避免被渲染成普通分类柱状图。
- X 轴标签应抽样显示，不应为每个 `bin` 强行展示长区间文本。
- 分组直方图可拆为多个 `series`，但所有 series 必须共享相同 `bins`。

## 14. AI 输出格式

AI 生成直方图设计或代码时，应输出以下结构：

```json
{
  "chartType": "histogram",
  "variant": "count",
  "purpose": "distribution-analysis",
  "dataMode": "raw",
  "dataMapping": {
    "value": "price",
    "series": "channel optional",
    "weight": "weight optional",
    "threshold": "sla optional"
  },
  "binningSpec": {
    "binMethod": "fixedCount",
    "binCount": 12,
    "binWidth": 50,
    "domain": [0, 600],
    "closed": "[start,end)",
    "includeEmptyBins": true,
    "normalize": "count"
  },
  "geometrySpec": {
    "axisLayout": "yAxisLabelRail 50px; xAxisLabelBand >= 28px",
    "barGap": 0,
    "minBarWidth": 2,
    "barRadius": [0, 0, 0, 0]
  },
  "styleTokens": {
    "barColor": "分类色板/item-1",
    "axisLabelColor": "坐标轴/axislabelcolor",
    "gridLineColor": "坐标轴/gridlinecolor",
    "font": ".textSmall 12/18 400"
  },
  "components": {
    "xAxis": true,
    "yAxis": true,
    "grid": true,
    "legend": "when-series-exists",
    "tooltip": true,
    "label": "key-bins-only",
    "thresholdLine": "when-threshold-exists",
    "dataZoom": "when-bin-overflow"
  }
}
```

若输入已经是分箱数据，应把 `dataMode` 改为 `binned`，并声明：

```json
{
  "dataMapping": {
    "binStart": "binStart",
    "binEnd": "binEnd",
    "count": "count",
    "frequency": "frequency optional",
    "density": "density optional"
  }
}
```

## 15. 禁止项

AI 生成直方图时禁止：

- 禁止把无序分类柱状图称为直方图。
- 禁止只写 `type: "bar"`，不声明分箱方式和区间边界。
- 禁止设计端和代码端各自重新计算分箱，导致区间不一致。
- 禁止在样本量过少时强行生成直方图并解读分布。
- 禁止按每个 `bin` 随机分配不同分类色。
- 禁止使用柱状图的大分类间距，导致连续分布被误读为分类比较。
- 禁止默认显示所有柱体标签。
- 禁止在不等宽分箱中用频数高度比较区间，应使用密度或明确说明口径。
- 禁止分组直方图使用不同 `binCount`、`binWidth` 或 `domain`。
- 禁止隐藏空区间造成分布断裂，除非业务明确只展示非空区间并声明原因。
- 禁止使用 3D、投影、发光、大圆角、渐变等装饰效果。
- 禁止 Tooltip 只展示柱体高度，不展示区间范围。

## 16. AI 自查清单

生成直方图前，AI 必须检查：

- [ ] 当前横轴是否为连续数值变量，而不是无序分类？
- [ ] 当前任务是否是在分析分布、集中区间、偏态、峰态或异常区间？
- [ ] 输入数据是原始样本还是已分箱数据？
- [ ] 原始样本量是否足以支撑分布判断？
- [ ] 是否显式声明 `binMethod`、`binCount`、`binWidth`、`domain` 和区间闭合规则？
- [ ] VibeDesign 和 VibeCode 是否共用同一份 `bins`？
- [ ] 空区间是否保留，以避免分布断裂？
- [ ] Y 轴口径是 `count`、`frequency` 还是 `density`？
- [ ] 若存在不等宽分箱，是否使用密度而非频数直接比较？
- [ ] 柱体是否相邻排列，避免被误读为普通柱状图？
- [ ] 单系列是否使用同一主题色，而不是按区间随机上色？
- [ ] 分组数量是否控制在 2-3 个，并共享同一分箱配置？
- [ ] 是否只对关键区间显示标签？
- [ ] Tooltip 是否展示区间边界、频数和占比？
- [ ] 是否已绑定坐标轴、网格、颜色、字体、图例和 Tooltip 的主题变量？

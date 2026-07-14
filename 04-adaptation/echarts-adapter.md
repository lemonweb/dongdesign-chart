# ECharts 适配 ECharts Adapter

## 1. 文档定位

本文定义 Wiki 图表语义到 ECharts option 的关键映射关系，帮助 VibeCode 在 ECharts 中稳定还原图表组件规范。

本文不展开完整业务代码，只约束必须显式配置的图表语义、样式和交互。

## 2. 通用映射

| Wiki 语义 | ECharts 实现方向 |
|---|---|
| 图表类型 | `series.type` |
| 横轴字段 | `xAxis` + `series.data` / `dataset.encode.x` |
| 纵轴字段 | `yAxis` + `series.data` / `dataset.encode.y` |
| 系列字段 | 多 `series` 或 `dataset` + `encode.seriesName` |
| Tooltip | `tooltip` |
| 图例 | `legend` |
| 坐标轴 | `xAxis` / `yAxis` |
| 标记 | `markPoint` / `markLine` / `markArea`，按需使用 |

## 3. 折线图适配

折线图必须符合以下规则：

| 元素 | ECharts 规则 |
|---|---|
| line series | `series.type = "line"`，`lineStyle.width = 2.5` |
| 普通数据点 | `showSymbol = false` |
| hover 点 | 由 hover / emphasis 显示，不默认铺满所有点 |
| xAxis | `type = "category"` 或 time；时间标签抽样 |
| yAxis | 默认 `min = 0`，不显示左侧轴线；显示标签和水平网格线 |
| yAxis 刻度 | 默认约 `5` 个等距刻度 / 网格线；必要时设置 `splitNumber: 4` 或显式 `interval` |
| splitLine | 网格 / 分隔线默认 `1px` 虚线，`type: "dashed"` |
| hover 指示线 | `tooltip.axisPointer.type = "line"`，仅显示垂直 `1px` 实线，不使用 cross |
| 图例 | 折线图应使用 line icon；若默认 icon 不符合规范，使用自定义 SVG icon |

## 4. 坐标轴样式

ECharts 轴样式不得依赖默认值，必须显式设置：

```js
xAxis: {
  axisLine: { lineStyle: { color: axisLineColor, width: 1 } },
  axisTick: { show: false },
  axisLabel: {
    color: axisLabelColor,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 18
  }
}

yAxis: {
  min: 0,
  max: valueAxisMax,
  interval: valueAxisStep,
  splitNumber: 4,
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { color: splitLineColor, width: 1, type: "dashed", dashOffset: 0 } },
  axisLabel: {
    color: axisLabelColor,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 18
  }
}
```

如果 ECharts 自动 nice tick 导致刻度超过 `5` 个或间距不均，应显式计算 `max` / `interval`，确保线性等距。无特殊业务说明时禁止使用 `min: "dataMin"`。

ECharts 默认 `splitLine` 容易被写成实线；笛卡尔坐标系图表必须显式设置为虚线，轴线与 hover 指示线仍按规范保留实线。

数值轴必须采用统一动态取值算法：默认 `splitNumber = 4`，`tickCount = 5`，通过 `dataMax × 1.08` 计算目标上界；当 `axisMax / dataMax > 1.25` 时，使用按展示精度向上取整的 `precisionStep`，避免趋势被过大上界压扁。

## 5. 图例与 Tooltip

- 折线图图例 icon 必须体现 line 语义。
- 如果 ECharts 默认图例 icon 不符合 `10 × 2px` line shape，可使用 `image://data:image/svg+xml` 自定义图例 icon。
- Tooltip icon 与图例 shape 应保持一致。
- Tooltip formatter 必须展示业务名、单位和格式化数值。
- 不得直接使用 ECharts 默认 `params.marker` 作为正式交付的 Tooltip icon；默认 marker 常渲染为圆点，容易与折线图 line 图例或柱状图 rectangle 图例不一致。
- 当图表存在 legend 时，`tooltip.formatter` 必须显式生成与 legend 相同语义的 icon：
  - 折线图：`8-10px × 2px` line icon。
  - 柱状图 / 条形图 / 面图：`8-10px × 8-10px` rectangle icon。
  - 散点图：`8-10px × 8-10px` dot icon。
- 自定义 Tooltip icon 的颜色必须取当前 `params.color` 或该系列绑定的分类色 token，不能写成与系列无关的临时色。

## 6. 常见风险

| 风险 | 处理方式 |
|---|---|
| 默认显示所有 symbol | 设置 `showSymbol: false` |
| 默认 axisPointer 为不符合规范的样式 | 显式设置 `type: "line"` 和 `lineStyle.type: "solid"` |
| 默认 crosshair 交互过重 | 不使用 `axisPointer.type = "cross"`，仅保留垂直指示线 |
| 默认字号不一致 | 显式设置 `fontSize: 12`、`lineHeight: 18`、`fontWeight: 400` |
| 默认从数据最小值起步 | 设置 `yAxis.min = 0`，必要时显式 `max` / `interval` |
| 自动刻度过密 | 设置 `splitNumber: 4` 或显式 `interval`，保持约 `5` 个等距刻度 |
| 默认分隔线为实线 | 设置 `splitLine.lineStyle.type = "dashed"` |
| 双轴误导 | 不同单位指标优先分面；必须双轴时显示左右轴单位 |
| 图例 icon 不符合规范 | 使用自定义 line icon |
| Tooltip marker 与图例形态不一致 | 不使用 `params.marker`，在 `formatter` 中按系列形态生成 line / rectangle / dot icon |

## 7. 禁止项

- 禁止默认显示所有折线数据点。
- 禁止使用未配置的默认 Tooltip 样式交付。
- 禁止无业务说明时使用 `dataMin` 或数据最小值作为数值轴起点。
- 禁止输出密集或非均匀的普通线性轴刻度。
- 禁止把笛卡尔坐标系网格 / 分隔线渲染为默认实线后直接交付。
- 禁止 hover 指示线使用非规范样式。
- 禁止默认显示横向 crosshair 或字段名 tooltip 后直接交付。
- 禁止图例 icon 与图表系列形态不一致。
- 禁止 Tooltip icon 与图例 icon 形态不一致。
- 禁止在存在图例的折线图、柱状图、条形图中直接使用默认 `params.marker` 作为 Tooltip icon。
- 禁止轴标签与图形、标题或图例重叠。

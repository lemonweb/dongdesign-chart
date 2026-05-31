# G2 适配 G2 Adapter

## 1. 文档定位

本文定义 Wiki 图表语义到 AntV G2 的关键映射关系，帮助 VibeCode 在 G2 中稳定还原图表组件规范。

本文不提供完整业务代码，只规定必须映射的语义、样式和交互。

## 2. 通用映射

| Wiki 语义 | G2 实现方向 |
|---|---|
| 图表类型 | `chart.line()`、`chart.interval()`、`chart.point()` 等 mark |
| 横轴字段 | `encode("x", field)` |
| 纵轴字段 | `encode("y", field)` |
| 系列字段 | `encode("color", field)` 或按系列拆 mark |
| Tooltip | 默认关闭 G2 原生 tooltip interaction，使用自定义 DOM / SVG tooltip |
| 坐标轴 | `chart.axis("x" / "y", config)` |
| 图例 | `chart.legend(...)` 或自定义 DOM legend |

## 3. 折线图适配

折线图必须符合以下规则：

| 元素 | G2 规则 |
|---|---|
| line mark | 使用 `chart.line()`，线宽 `2.5`，颜色绑定 `分类色板/item-*` |
| 普通数据点 | 默认不创建 `point()` mark，或确保默认不可见 |
| hover 点 | 仅通过 tooltip / interaction 强调当前点 |
| xAxis | 时间轴标签抽样；多分面时优先只在下方 plot 显示 |
| yAxis | 默认 `domainMin = 0`，不显示左侧轴线；显示标签和水平网格线 |
| yAxis 刻度 | 默认约 `5` 个等距刻度 / 网格线；必要时设置 `tickCount: 5` |
| splitLine | 网格 / 分隔线默认 `1px` 虚线，`lineDash: [4, 4]` |
| hover 指示线 | 默认只显示垂直 `1px` 实线，颜色绑定 `提示/tooltipAxisColor`；不显示横向 crosshair |
| 图例 | 折线图 shape 为 `10 × 2px` line，不使用圆点或色块 |

## 4. 坐标轴样式

G2 轴样式不得依赖默认值，必须显式设置：

```js
chart.axis("x", {
  tick: false,
  line: { style: { stroke: axisLineColor, lineWidth: 1 } },
  label: { style: { fill: axisLabelColor, fontSize: 12, fontWeight: 400 } }
})

chart.axis("y", {
  line: false,
  tick: false,
  grid: { style: { stroke: splitLineColor, lineWidth: 1, lineDash: [4, 4] } },
  label: { style: { fill: axisLabelColor, fontSize: 12, fontWeight: 400 } }
})

chart.scale("y", {
  domain: [0, valueAxisMax],
  domainMin: 0,
  domainMax: valueAxisMax,
  ticks: valueAxisTicks,
  tickCount: 5,
  nice: false
})
```

轴标题不得因为规避重叠而放入绘图区、压在分隔线上，或挤占轴标签区域。默认优先使用以下两种位置：

1. Y 轴标签上方的左上角说明区，适合 G2 / ECharts 等运行时图表，布局最稳定。
2. Y 轴左侧独立竖排 title rail，必须位于轴标签区域外侧，并与绘图区垂直居中对齐。

G2 内置 axis title 在多分面和自适应场景中容易与标签或网格线冲突，因此建议关闭内置 `title`，使用外部 DOM / SVG 文本承载轴标题。若使用竖排标题，必须单独预留 `titleRail + labelGutter + plotGap` 三段空间；无法精确测量时，默认改用 Y 轴标签上方标题。禁止把轴标题移动到水平分隔线、数据线、轴标签列或 plot 内部来“避开重叠”。

当 Y 轴标题位于标签上方时，G2 必须显式增加顶部 padding / inset，为 `axisTitle + gap + topTickLabel` 留出空间。建议 title band 不小于 `30px`，标题底部与首个 Y 轴标签至少保持 `12px` 间距。不得让标题覆盖首个刻度标签。

如果 G2 容器中同时存在轴标题和图表实例，应优先使用 `plotContainer + chartHost` 两层结构：

```txt
plotContainer
  axisTitle  固定在顶部 title band
  chartHost  位于 title band 下方，承载 G2 chart、hover layer、hit layer
```

不要把 axisTitle 覆盖在 G2 画布本体之上。hover layer 和 hit layer 也必须绑定 `chartHost`，不能覆盖整个 `plotContainer`，否则垂直 hover 线会溢出到标题区。

G2 默认 tooltip / crosshair 容易生成横向辅助线、默认字段名和不符合规范的点位样式。折线图 hover 验证应优先关闭默认 tooltip interaction，使用自定义 DOM / SVG hover layer 承载：

- 垂直 `1px` 实线 axisPointer。
- 当前系列 hover 点。
- 按 Wiki Tooltip 结构生成的浮层。
- 图例同语义的 line icon 和业务字段名。

只有业务明确需要同时定位 X/Y 值时，才允许显示横向 crosshair，并必须在方案中说明。

## 5. 图例与 Tooltip

- G2 默认 legend 若无法稳定还原 `line` shape，应使用自定义 DOM legend。
- Tooltip icon 必须与图例 shape 保持一致。
- Tooltip 内容必须包含系列名、数值、单位和当前时间 / 类目。
- 不得把字段名直接展示给用户。

## 6. 常见风险

| 风险 | 处理方式 |
|---|---|
| G2 默认点位显示 | 不创建 `point()` mark，或将 point 仅用于 hover 状态 |
| 轴标签与数据重叠 | 增大 padding，抽样 X 轴标签，必要时隐藏上方分面的 X 轴 |
| 轴标题与网格线重叠 | 默认使用 Y 轴标签上方标题；竖排标题必须有独立 title rail |
| 轴标题与首个 tick label 重叠 | 增加顶部 padding / title band，保证标题底部与首个 Y 轴标签至少 `12px` 间距 |
| hover 线溢出标题区 | hover layer 只覆盖 chartHost，不覆盖 plotContainer |
| hover 点与折线偏移 | 优先使用 G2 提供的坐标转换或从实际渲染的 series geometry 取点；禁止只用外部复刻 scale 猜坐标 |
| 默认从数据最小值起步 | 设置 `scale("y", { domainMin: 0 })` |
| 自动刻度过密 | 设置 `tickCount: 5`，保持线性等距 |
| 分隔线实线化 | 显式设置 `grid.style.lineDash = [4, 4]` |
| 默认 tooltip/crosshair 不符合规范 | 关闭默认 interaction，使用自定义 hover layer |
| 默认字号不一致 | 显式设置 `fontSize: 12`、`fontWeight: 400` |
| 默认 Tooltip 不符合规范 | 自定义 Tooltip 内容和样式 |
| 默认 legend shape 不符合规范 | 使用自定义 legend 或覆盖 marker |

## 7. 禁止项

- 禁止直接使用 G2 默认图例作为折线图规范结果，除非已验证 shape 为 `10 × 2px` line。
- 禁止默认显示所有折线数据点。
- 禁止无业务说明时使用数据最小值作为数值轴起点。
- 禁止输出密集或非均匀的普通线性轴刻度。
- 禁止把轴标题放在分隔线、数据线或绘图区内部。
- 禁止把竖排轴标题和轴标签放在同一列里互相挤压。
- 禁止把笛卡尔坐标系网格线渲染为默认实线后直接交付。
- 禁止默认显示横向 crosshair 或默认字段名 tooltip 后直接交付。
- 禁止 hover MarkPoint 使用与实际 series geometry 不同的坐标来源。
- 禁止轴标签与数据区域重叠。
- 禁止 hover crosshair 使用与规范不一致的样式。
- 禁止多分面图重复显示密集 X 轴标签。

# Chart Builder Skill

## 1. 文档定位

本 Skill 用于根据已选图表、数据字段和 Wiki 规范生成可用于 Figma / Relay 验证的图表设计方案或组件结构。

它回答：

> 已经确定要使用某种图表后，AI 应如何读取图表组件文档和视觉语言规范，生成与图表组件库、设计指南一致的图表设计结果？

本 Skill 属于 Execution Layer，不重新定义图表规范，只把图表组件文档、视觉语言、主题变量和交互规则组织成可执行的设计生成流程。

## 2. 触发场景

当用户表达以下意图时触发：

- “按 Wiki 规范生成一个图表设计方案”
- “根据这个图表类型生成 Figma / Relay 图表”
- “用已有图表组件库设计一个和规范一致的图表”
- “验证目前文档能否指导 AI 画出和组件库一致的图表”
- “根据 chart-selector 的结果继续生成图表结构”

如果用户没有指定图表类型，本 Skill 应先调用或执行 `chart-selector-skill` 的选型流程。

## 3. 输入要求

最小输入：

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 图表类型 | 必需 | 如折线图、柱状图、饼图、散点图 |
| 数据字段 | 必需 | 字段名、字段类型、单位、分组字段 |
| 分析目标 | 必需 | 趋势、比较、占比、分布、关系等 |
| 目标工具 | 推荐 | Figma / Zero / Relay / 文本方案 |
| 组件来源 | 推荐 | 图表组件库、设计指南或目标设计文件 |
| 主题模式 | 可选 | light / dark；未说明时默认 light |
| 展示空间 | 可选 | 小卡片、标准分析卡片、大屏、移动端 |

推荐输入来自 `chart-selector-skill` 的 `Builder Handoff Packet`。

## 4. 必读 Wiki 文件

### 4.1 默认必读

```txt
00.总览 Overview/01.使用说明 How-to-use.md
00.总览 Overview/02.AI读取顺序 AI-reading-flow.md
02.图表模式 Chart-type/README.md
07.文档治理 Document Governance/05.图表组件写法原则 Chart-component-writing-guide.md
```

### 4.2 图表组件必读

必须读取目标图表对应文档。

示例：

```txt
02.图表模式 Chart-type/04.基础图表 Basic/01.折线图 Line-chart.md
```

如果目标图表文档为空或规范不足，应先标记缺口；除非用户要求继续试验，否则不得假装规范完整。

### 4.3 视觉语言必读

根据目标图表构成读取相关视觉语言文档：

| 图表元素       | 必读文档                                                                |
| ---------- | ------------------------------------------------------------------- |
| 颜色、状态、系列色  | `01.视觉语言 Design Language/02.主题变量 Theme-token.md`、`03.色彩系统 Color.md` |
| 字体、数值、标签   | `04.字体排版 Typography.md`                                             |
| 坐标轴、网格线    | `06.坐标轴 Axis.md`                                                    |
| 多系列或分类图表   | `07.图例 Legend.md`                                                   |
| 关键值、异常点、阈值 | `08.标签 Label.md`                                                    |
| 悬停读数       | `09.提示信息 Tooltip.md`                                                |

## 5. 执行流程

```txt
1. 接收图表类型或 Builder Handoff Packet
2. 如果缺少图表类型，先执行 chart-selector-skill
3. 读取目标图表组件文档
4. 读取对应视觉语言文档
5. 建立字段映射和数据编码关系
6. 生成图表构成清单
7. 绑定主题变量和当前模式 resolved value
8. 生成交互规则和状态规则
9. 生成 Figma / Relay 设计构建指令
10. 输出验证清单
```

### 5.1 VibeDesign 优先级

当目标是 Figma / Zero / Relay 设计验证时，优先级应为：

```txt
组件库还原
→ 视觉细节还原
→ 数据表达正确
→ 代码实现可迁移
```

这意味着 AI 不能只生成“语义正确的图表”，还必须读取并还原目标组件的关键 UI 结构，例如图例 shape、Tooltip 浮层、hover 指示线、网格线样式和轴标签抽样策略。

### 5.2 参考节点读取策略

如果用户提供 Figma / Relay 设计规范链接：

1. 先读取精确节点的 `design_context` 和 `screenshot`。
2. 如果节点过大，先读取 metadata，再定位到单个组件实例节点。
3. 只抽取当前图表所需的组件细节，不把整份设计指南全部塞入上下文。
4. 将抽取结果整理为 `Visual Fidelity Packet`，再进入生成。

`Visual Fidelity Packet` 建议包含：

```txt
component_variant:
design_structure:
auto_layout_plan:
plot_area:
axis:
axis_layout_constraints:
typography_constraints:
fallback_reference:
series:
legend:
legend_shape_dict:
tooltip:
tooltip_layout:
effect_constraints:
label:
interaction_state:
token_bindings:
known_gaps:
```

其中 `design_structure` 必须描述 VibeDesign 的可维护图层结构，而不是只列视觉元素。默认结构应包含：

```txt
chartFrame
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

`auto_layout_plan` 必须说明哪些区域使用 Auto Layout、哪些区域使用固定尺寸、哪些数据图形允许在 `seriesLayer` 内绝对定位。Figma / Relay / Zero 设计稿不得把所有 Text、Line、Ellipse、Rectangle 直接平铺在根画布下。

其中 `typography_constraints` 必须列出图表内部文字的精确字号、行高、字重。坐标轴标签、图例文字、Tooltip label / note 默认都是 `.textSmall 12/18 400`；Tooltip title 为 `.textSmall 12/18 600`，Tooltip value 为 `.numberSmall 12/18 600`。如果生成目标是 SVG 或设计工具脚本，必须把这些值写入具体 text 节点，不能只写“使用 textSmall”。

`axis_layout_constraints` 必须列出直角坐标系的元素间距，不能只写“使用标准坐标轴”。默认规格为：

```txt
yAxisLabelRailWidth = 50px
yAxisLabelRightPadding = 10px
xAxisLabelBandHeight >= 28px
xAxisLabelTopOffset = 10px
axisTickLength = 4px when shown
axisLabelLineHeight = 18px
plotArea = excludes axis label rail and x-axis label band
```

设计工具生成时，应先创建 `yAxisLabelRail`、`plotArea`、`xAxisLabelBand` 三个可编辑区域，再将网格线、轴线和数据图形约束在 `plotArea` 内。不得把 X 轴标签的 `10px` 偏移误用为 Y 轴标签的整体距离；Y 轴标签约束的是“标签右边缘距离绘图区左边界 `10px`”。

`fallback_reference` 用于记录 Wiki 未明确约束时的兜底依据。若设计规范文档没有明确指出某个细节，应优先参考 G2 / ECharts 的常规布局样式和成熟图表语义，不允许自行发挥。兜底规则只能补齐缺失项，不能覆盖 Wiki 已明确的颜色、字号、间距、图例形状、Tooltip 结构或交互行为。

`legend_shape_dict` 必须列出当前图表涉及的图例 shape 类型、尺寸和映射关系。默认仅允许：

```txt
rectangle: 10×10, radius 2, for area/bar/pie/heatmap
line: 10×2, radius 2, for line/path/trend
dot: 10×10 circle, for scatter/bubble point
```

`effect_constraints` 必须列出 Tooltip shadow 等效果的实现方式。Figma / Relay 可编辑稿应使用原生 drop shadow / effects；如果使用轻量 SVG，应确认目标工具保留 filter，否则将 Tooltip 拆成可编辑节点设置投影。

`tooltip_layout` 必须列出 Tooltip 的内部结构和间距，至少包含：容器 `padding 12px 8px`、`FormatSlot` 垂直结构、title 与 body 间距 `4px`、多系列 body 使用 `label_column + value_column` 两列结构、列间距 `8px`、`label_column min-width 60px + padding-right 12px`、系列行高 `18px`、系列行间距 `0px`、note 与系列列表间距 `4px`、value 列右对齐。不得只写“Tooltip 使用标准样式”。

Figma / Relay 生成时，Tooltip value 右对齐必须按实际文本宽度完成二次定位：先设置 `characters`，读取 `text.width`，再设置 `x = valueColumnRight - text.width`。禁止把 value 文本的 `x` 坐标当作右边界，导致数值被容器裁切。

### 5.3 Token 与性能预算

为兼顾视觉还原和 token 消耗，AI 应按需读取：

| 任务 | 必读 | 按需读取 |
|---|---|---|
| 单折线图 | 折线图、主题变量、坐标轴、图例、Tooltip | 标签、dataZoom、标注 |
| 无交互静态图 | 图表文档、主题变量、坐标轴 | Tooltip 可只读取摘要 |
| hover 验证图 | 图表文档、坐标轴、图例、Tooltip | 标签 |
| 多系列趋势 | 折线图、主题变量、图例、Tooltip | 色彩系统详细规则 |

不得为了“保险”一次性读取所有视觉语言文档全文。读取过长设计指南时，应优先定位组件实例和变量定义。

### 5.4 VibeDesign 与 VibeCode 输出路径

图表生成必须先判断当前任务属于 VibeDesign 还是 VibeCode。两者目标不同，不能用同一套“渲染优先”策略处理。

| 路径 | 主要目标 | 默认产物 | 优先级 | 不应默认使用 |
|---|---|---|---|---|
| VibeDesign | 设计提效、组件规范验证、设计师可继续调整 | 可编辑 Frame / Auto Layout / Text / Line / Shape / Component 实例 | 结构可维护、样式可追溯、视觉还原 | 单 SVG 节点、不可拆解位图、不可维护大 Vector、所有元素平铺在根画布 |
| VibeCode | 原型页面、工程落地、交互验证 | G2 / ECharts / Canvas / SVG / DOM 代码 | 渲染正确、性能稳定、交互可实现 | 手工堆大量不可复用设计节点 |

执行原则：

- 当用户指定 Figma / Zero / Relay 作为验证工具，默认按 VibeDesign 路径生成。
- VibeDesign 应尽量使用设计工具原生节点：Frame、Text、Line、Rectangle、Ellipse、Component Instance；只有数据曲线或复杂图形在无替代方式时才用 Vector。
- VibeDesign 必须用 Frame、Auto Layout、约束和命名层级表达组件关系；标题区、图例、坐标轴、Tooltip、系列层、标注层不得全部平铺在根画布下。
- 单 SVG 节点只能作为“临时视觉快照”或“写入链路探针”，不得作为高质量设计验证稿的默认交付。
- VibeDesign 的图表元素必须有清晰命名，例如 `xAxis/label/05-01`、`legend/item/gmv/shape`、`tooltip/container`，方便设计师选中、调整和替换。
- VibeCode 才优先考虑渲染性能、代码体积和运行时交互；它可以用 path / canvas / chart library，但仍要继承 Wiki 的 token、字号和图例语义。

### 5.5 VibeCode 质量门禁

当任务进入 VibeCode 路径时，`chart-builder-skill` 不得只输出图表语义和代码结构，还必须读取并执行以下文档：

```txt
05.执行规则 Rules/02.VibeCode规则 VibeCode-rules.md
06.示例自查 Self-check/02.代码自查清单 Code-checklist.md
04.引擎适配 Adaptation/02.G2适配 G2-adapter.md
04.引擎适配 Adaptation/03.ECharts适配 ECharts-adapter.md
```

VibeCode 输出前必须生成 `Code Fidelity Packet`：

```txt
engine_targets:
  - ECharts
  - G2
render_strategy:
  - single_engine / multi_engine / fallback_svg
typography_constraints:
axis_constraints:
axis_layout_constraints:
fallback_reference:
legend_shape_dict:
series_marker_policy:
tooltip_policy:
tooltip_layout:
interaction_policy:
engine_specific_risks:
browser_validation:
```

其中：

- `typography_constraints` 必须写明轴标签、图例、Tooltip 的字号、行高和字重。
- `axis_constraints` 必须写明轴标题位置、标签抽样策略、数值轴起点、刻度 / 网格线数量和 hover 指示线样式。柱状图、折线图、散点图、气泡图等笛卡尔坐标系图表默认 `valueAxis.min = 0`，默认 `splitNumber = 4`，即 `5` 个等距刻度 / 网格线；数值轴上界通过 `targetMax = dataMax × 1.08` 与 `step × 4` 计算，当 `axisMax / dataMax > 1.25` 时使用按展示精度向上取整的 `precisionStep`，避免趋势被过大上界压扁；网格 / 分隔线默认 `1px` 虚线，轴线和 hover 指示线按规范为实线；Y 轴标题默认放在 Y 轴标签上方并预留 title band，标题底部与首个 Y 轴标签至少保持 `12px` 间距；若使用左侧竖排必须有独立 title rail，不得放入分隔线、数据线、轴标签列或绘图区内部；不得无说明地使用数据最小值起点或非均匀刻度。
- `axis_layout_constraints` 必须写明 `yAxisLabelRailWidth = 50px`、`yAxisLabelRightPadding = 10px`、`xAxisLabelBandHeight >= 28px`、`xAxisLabelTopOffset = 10px`、`axisTickLength = 4px`。可编辑设计稿应创建独立 `yAxisLabelRail`、`plotArea`、`xAxisLabelBand`；网格线和数据图形只能落在 `plotArea` 内，Y 轴标签右对齐到 `plotArea.left - 10px`，X 轴标签顶部为 `plotArea.bottom + 10px`。
- `fallback_reference` 必须列出 Wiki 缺失项的兜底来源，例如 `G2 axis label layout`、`ECharts grid.containLabel`、`ECharts tooltip item layout`。如果 Wiki 已明确规定，不得把引擎默认值作为覆盖依据。
- `legend_shape_dict` 必须写明折线图 `line = 10×2px radius 2px`，不得用圆点或色块替代。
- `series_marker_policy` 必须写明折线图普通数据点默认隐藏，只在 hover、选中、最新值、异常点等场景显示。
- `interaction_policy` 必须写明折线图默认 hover 只显示单根垂直 `1px` 实线 axisPointer、当前点和规范化 Tooltip；不得使用虚线 hover 指示线、引擎默认横向 crosshair 或字段名 Tooltip 直接交付；hover layer 必须与实际绘图区 / chartHost 绑定；hover 点必须来自引擎坐标转换、实际渲染 geometry，或与 series 同层同 scale 绘制，避免指示线溢出和 MarkPoint 偏移。
- `tooltip_layout` 必须写明多系列 Tooltip 的两列结构、`18px` 行高和 `0px` 系列行间距；如果有说明 note，必须写明 note 距系列列表 `4px`；title 和 value 必须为 `600`，label 和 note 必须为 `400`。
- `engine_specific_risks` 必须列出 G2 / ECharts 默认样式与 Wiki 规范可能冲突的点。
- `browser_validation` 必须说明是否已完成截图或浏览器交互验证；未验证不得标记为高质量通过。

VibeCode 必须把“视觉还原”视为与“代码可运行”同等重要的验收项。以下问题出现任一项时，不得声明完成：

- 轴标题、轴标签、数据线或标签发生重叠。
- Y 轴无特殊说明却没有从 `0` 起步。
- Y 轴刻度 / 网格线明显超过 `5` 个或间距不均匀。
- 图例 shape 与图表系列形态不一致。
- 折线图默认显示所有数据点 mark。
- hover 指示线样式与 Tooltip / 坐标轴规范不一致。
- Tooltip 内部没有使用两列结构、系列行间距过大、value 未加粗或 value 被裁切。
- ECharts 与 G2 切换后核心图表语义不一致。

## 6. 图表构建模型

### 6.1 数据编码

必须说明每个字段如何被图形编码：

| 编码 | 说明 |
|---|---|
| x / category / time | 横轴、类目、时间或位置 |
| y / value | 纵轴、长度、高度、面积或角度 |
| color / group | 系列、分类或状态 |
| size | 规模、权重或第三指标 |
| shape | 类型、状态或标记 |
| tooltip | 悬停时展示的上下文 |

### 6.2 视觉构成

必须根据图表组件文档输出构成清单。

示例：

```txt
chart_container
plot_area
xAxis
yAxis
series
legend
label
tooltip
annotation
interaction
```

不应把设计工具里的装饰容器、说明标注或临时参考线当作图表构成。

### 6.3 变量绑定

图表元素必须同时输出：

```txt
绑定变量
当前模式解析值
使用位置
```

示例：

| 元素 | 绑定变量 | Light resolved value | 使用位置 |
|---|---|---|---|
| 图例文字 | `图例/legendTextColor` | `#595959` | legend label |
| 坐标轴标签 | `坐标轴/axisLabelColor` | 读取 Theme-token | xAxis / yAxis label |
| 第一条系列线 | `分类色板/item-1` | `#3365F7` | line series |

不得为了显示正确值而绕过变量直接写色值。

## 7. Figma / Relay 生成原则

当目标是在 Figma / Relay 中验证时，AI 应优先复用设计工具中的组件、变量和样式。

执行原则：

- 优先使用图表组件库实例或变体，不手工画一套无绑定的图形。
- 如果需要从零生成，也必须使用 Wiki 中的变量、字号、坐标轴、图例、Tooltip 和标签规则。
- 如果 Wiki 没有明确指出某个细节，应参考 G2 / ECharts 的常规布局样式补齐，并在输出中记录 `fallback_reference`；不得使用个人审美或临时经验自行发挥。
- 必须先生成可维护结构：`chartFrame / headerFrame / bodyFrame / plotAreaFrame / legendFrame / tooltipFrame / seriesLayer` 等，再创建内部图形元素。
- 标题、图例、Tooltip、轴标签轨道等布局型元素优先使用 Frame / Auto Layout；数据点、柱体、折线路径等数据映射元素可在 `seriesLayer` 内按 plotArea 坐标绝对定位。
- 生成结果应能对照图表组件库和设计指南逐项检查。
- Light / Dark 模式应通过变量切换，不复制两套图表。
- 不应在设计工具中引入 Wiki 未定义的颜色、字号、线宽、动效或交互。

如果设计工具 MCP 不可用，应输出可复制给 Figma / Relay Agent 的设计构建指令，而不是伪造已生成结果。

### 7.1 写入策略与超时规避

Relay / Figma 写入时，单次大脚本容易触发超时或权限审查失败。生成图表验证稿时应按以下策略执行：

| 场景 | 推荐写入方式 |
|---|---|
| 只验证视觉相似度 | 优先使用轻量 SVG / 单节点导入 |
| VibeDesign 设计验证 | 分步骤创建 frame、axis、series、legend、tooltip，优先可编辑节点 |
| 需要可编辑组件结构 | 分步骤创建 frame、axis、series、legend、tooltip |
| 需要复用组件库 | 优先导入组件实例或变体，再改 props / 文本 |
| 数据点很多 | 使用 path / vector，不为每个点创建独立节点 |
| 多系列图 | 每个系列一个 path，hover 点少量节点 |
| Tooltip / 轴标签验收 | 优先使用可编辑 text/effect 节点，避免 SVG 导入丢失字号或阴影 |

执行规则：

- 先用最小写入测试确认目标节点可写。
- 再写入主图结构。
- 最后补充 Tooltip、图例、标签等交互态。
- 单次脚本只处理一个明确目标，返回 created / mutated node IDs。
- 如果只是验证视觉相似度，不要为了“可编辑”拆出大量点、线和文本节点。
- 如果 SVG 导入链路会丢失 `font-size`、`line-height` 或 `<filter>`，应将坐标轴标签、图例文字和 Tooltip 单独用原生 TextNode / FrameNode 生成。
- 写 SVG 时，不使用 CSS `font` shorthand 作为唯一字号声明；必须在关键文字节点内联 `font-size="12"`、`font-weight="400/600"`。
- Tooltip shadow 不以 `<filter>` 作为唯一实现；Relay / Figma 中应验证 effects 是否可见。
- VibeDesign 输出应控制节点数量，但不能牺牲关键元素可维护性；建议坐标轴、图例、Tooltip、hover 点使用原生可编辑节点，长数据曲线可按系列合并或分段。
- 分步骤写入时，每一步应围绕结构层级执行，例如先创建 `chartFrame/header/body/plotArea`，再写入 axis，随后写入 series、legend、tooltip；不得按“所有矩形、所有文本、所有线条”这种无结构批次写入。
- 如果为规避超时临时使用 SVG，必须在最终说明中标记为 `snapshot`，并在下一步转成可编辑结构。

### 7.2 视觉还原验收

生成完成后必须对照设计稿截图检查：

- 图层结构是否存在 `chartFrame / headerFrame / bodyFrame / plotAreaFrame` 等可维护层级，而不是所有元素平铺在根画布。
- 标题区、图例、Tooltip 是否被 Frame 或 Auto Layout 归纳，能整体移动和调整。
- 数据图形是否归属到 `seriesLayer`，标注是否归属到 `annotationLayer`。
- 折线是否平滑、线宽是否接近组件。
- 坐标轴标签是否为 `.textSmall 12/18 400`，没有回退成 `16px`。
- 网格线是否弱化，是否为 `1px` 虚线；轴线与 hover 指示线是否仍为实线。
- Y 轴是否默认从 `0` 起步，而不是使用数据最小值。
- Y 轴刻度 / 网格线是否约 `5` 个，并保持线性等距。
- 坐标轴是否建立 `yAxisLabelRail 50px`、`plotArea`、`xAxisLabelBand >= 28px` 的分区。
- Y 轴标签是否右对齐，且标签右边缘距离绘图区左边界 `10px`。
- X 轴标签是否在底部轴线下方 `10px` 起排，且文本框行高为 `18px`。
- 网格线是否只在 `plotArea` 内绘制，没有伸入轴标签轨道或标题区。
- X 轴标签是否按组件策略抽样。
- 图例 shape 是否按图形语义选择：折线 `line 10×2`、面/柱/饼 `rectangle 10×10 r2`、点图 `dot 10×10`。
- 折线 hover markPoint 是否为 `8×8` 圆形、系列色填充、`1px` 白色描边。
- Tooltip 是否有可见原生阴影、圆角、padding 和 item 内部结构。
- Tooltip title 是否为 `12/18 600`，value 是否为 `12/18 600`，label / note 是否为 `12/18 400`。
- Tooltip 多系列内容是否为左 label 列、右 value 列，value 右对齐。
- Tooltip 系列行高是否为 `18px`，系列之间是否没有额外大间距。
- Tooltip 说明 note 是否距系列列表 `4px`，且没有被当作第三条系列 item。
- hover 点、axisPointer 和 Tooltip 是否处于同一 x 位置。
- 是否出现多余卡片、边框、标题或说明，干扰组件还原。

## 8. 输出格式

执行完成后输出：

```txt
## 图表设计方案
图表类型：
分析目标：
展示空间：
主题模式：

## 字段映射
- x / category / time：
- y / value：
- color / group：
- size：
- tooltip：

## 组件构成
- chart_container：
- plot_area：
- xAxis：
- yAxis：
- series：
- legend：
- label：
- tooltip：
- tooltip_layout：
- annotation：

## 变量绑定
| 元素 | 绑定变量 | 当前模式显示值 | 说明 |

## Visual Fidelity Packet
- design_structure：
- auto_layout_plan：
- typography_constraints：
- axis_layout_constraints：
- fallback_reference：
- legend_shape_dict：
- effect_constraints：
- component_gaps：

## 交互规则
| 交互 | 启用条件 | 系统反馈 |

## Figma / Relay 构建指令
1. 使用的组件 / 变体：
2. 需要绑定的变量：
3. 需要开启的状态：
4. 需要校验的视觉点：

## 验证清单
- 与图表组件文档一致：
- 与视觉语言一致：
- 与主题变量一致：
- 与组件库实例一致：
- 风险：
```

## 9. 依赖 Skill

| Skill | 关系 |
|---|---|
| `chart-selector-skill` | 当未指定图表类型时，先完成选型 |
| `visual-auditor-skill` | 图表生成后进行视觉一致性审查 |
| `g2-codegen-skill` | 当用户需要代码时，将设计方案转为 G2 实现 |
| `echarts-codegen-skill` | 当用户需要代码时，将设计方案转为 ECharts 实现 |
| `chart-appropriateness-reviewer` | 当图表适配存在争议时复核 |

## 10. 不负责事项

本 Skill 不负责：

- 重新决定图表类型，除非输入缺失或明显错误。
- 编写完整 G2 / ECharts 代码。
- 修改 Wiki 知识层文档。
- 在没有 MCP 或用户授权的情况下声称已完成 Figma / Relay 画布生成。
- 绕过组件库和主题变量手工堆叠无绑定图形。

## 11. 自查清单

输出前检查：

- 是否读取了目标图表文档？
- 是否读取了必要视觉语言文档？
- 是否明确字段映射？
- 是否输出图表构成清单？
- 是否输出 VibeDesign 可维护结构和 Auto Layout 计划？
- 是否绑定主题变量并说明当前模式显示值？
- 是否说明坐标轴、图例、标签、Tooltip 的使用规则？
- 是否给出 Figma / Relay 构建指令？
- 是否输出与组件库和设计指南对齐的验证清单？
- 是否没有引入 Wiki 未定义的颜色、字号、线宽和装饰？

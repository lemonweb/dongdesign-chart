# 提示信息 Tooltip

## 1. 文档定位

本文定义图表 Tooltip 的结构、样式、布局、触发方式和交互反馈。

它回答：

> 用户悬停图表时，应该显示哪些精确信息？Tooltip 应如何与坐标轴、图例、系列色和 hover 点联动？

本文依赖：

- `01-design-language/theme-token.md`
- `01-design-language/color.md`
- `01-design-language/typography.md`
- `01-design-language/axis.md`
- `01-design-language/legend.md`

## 2. 使用场景

Tooltip 适用于需要读取精确值、上下文或多系列同维度对比的图表。

| 场景 | 触发 | Tooltip 内容 |
|---|---|---|
| 单系列折线 | hover 数据点或 x 轴位置 | 时间 / 类目、系列名、数值 |
| 多系列折线 | hover x 轴位置 | 同一时间点下多个系列值 |
| 柱状图 | hover 柱体 | 类目、系列名、数值、单位 |
| 散点图 | hover 点 | x、y、分组、必要上下文 |
| 热力图 | hover 单元格 | 行列维度、数值、区间说明 |

## 3. 结构规范

Tooltip 默认由以下部分组成：

```txt
tooltip_container
  title
  body
    content
      label_column
        item
          icon
          label
      value_column
        value
    note
```

Figma 折线图参考结构：

| 元素 | 规则 |
|---|---|
| 容器 | 白色背景，`4px` 圆角，内边距 `12px` 水平、`8px` 垂直 |
| 阴影 | `0 4px 16px rgba(0,0,0,0.16)` |
| 标题 | `.textSmall 12/18 600`，显示时间或类目 |
| title 与 body | 垂直间距 `4px` |
| body / content | 横向两列结构，`label_column + value_column`，列间距 `8px` |
| label_column | 最小宽度 `60px`，右侧可保留 `12px` 内距用于拉开 label 与 value |
| item | `icon + label` 横向排列，行高 `18px`，系列 item 之间不额外加垂直间距 |
| icon | `8 × 8px` 容器内居中绘制系列形状；折线图 shape 为 `8px × 2px` 线段 |
| label | 业务名称，不使用字段名 |
| value_column | 与 label 行一一对应，行高 `18px`，右对齐 |
| value | 数值右对齐，使用 `.numberSmall 12/18 600` |
| note | 可选说明文字，位于系列列表下方，距上方 `4px`，不带 icon 和 value |

折线图 hover 示例的强制结构：

```txt
tooltipFrame
  FormatSlot  vertical, gap 4
    title      12/18 600
    body
      content  horizontal, gap 8
        label_column  min-width 60, padding-right 12
          item        horizontal, gap 4, height 18
            icon      8×8 container; line shape 8×2 centered
            label     12/18 400
          item        horizontal, gap 4, height 18
            icon
            label
        value_column  vertical, align right, row height 18
          value       12/18 600
          value       12/18 600
    note              12/18 400, margin-top 4
```

执行约束：

- `body/content` 只能有两个主列：`label_column` 和 `value_column`。不得为每条系列单独创建一个带宽度撑开的“大行容器”。
- `label_column` 内部的系列 item 之间 `itemSpacing = 0`；`value_column` 内部的 value 之间 `itemSpacing = 0`；行距只来自 `12/18` 文本自身行高。
- `value_column` 必须整体右对齐。Figma / Relay 生成时，应先创建 value 文本并读取实际文本宽度，再设置 `value.x = valueColumnRight - value.width`；不得把 `value.x` 当作右边界直接赋值，否则会出现数值列裁切。
- `note` 是独立说明文本，位置在系列列表下方 `4px`，不得作为第三条系列 item，也不得插入一个空行或占位矩形制造间距。

## 4. 样式规则

| 元素 | 绑定变量 / 样式 | Light 显示值 |
|---|---|---|
| 背景 | `提示/backgroundColor` | `#FFFFFF` |
| 轴指示线 | `提示/tooltipAxisColor` | `#B5B5B5` |
| 标题文字 | `text/300` + `.textSmall 12/18 600` | `#595959` |
| 正文 label | `text/300` + `.textSmall` | `#595959` |
| 数值 value | `text/300` + `.numberSmall 12/18 600` | `#595959` |
| 系列 icon | 对应 `分类色板/item-*` | 读取系列色 |

固定值：

- Tooltip 容器圆角：`4px`。
- Tooltip 内边距：`12px 8px`，或设计系统等价 spacing。
- title 与 body 间距：`4px`。
- 多系列内容使用两列结构：左侧 `label_column`，右侧 `value_column`，列间距 `8px`。
- item 内 icon 与 label 间距：`4px`。
- label 与 value 不通过每行分散布局自由撑开，应通过两列结构稳定对齐；`label_column` 建议 `min-width: 60px`，并可设置右内距 `12px`。
- 系列 item 的垂直间距：`0px`，只使用文本自身 `18px` 行高形成节奏；禁止给系列行之间额外添加 `8px`、`12px` 或更大的 gap。
- 说明 note 与系列列表间距：`4px`。
- shadow：`0px 4px 16px rgba(0,0,0,0.16)`。

设计工具执行约束：

- Figma / Relay 可编辑节点必须使用原生投影效果：`DROP_SHADOW`，`offset: 0 4`，`radius: 16`，`spread: 0`，`color: rgba(0,0,0,0.16)`。
- 使用 SVG 轻量写入时，不得只依赖 `<filter>` / `feDropShadow` 表达投影；部分设计工具导入链路会忽略或扁平化 filter，导致 Tooltip 看起来无投影。
- 如果目标工具无法保留 SVG filter，应改为可编辑浮层节点并设置 effects，或在验证清单中明确标记“Tooltip shadow 未还原”。
- Tooltip 所有文字必须显式设置字号和字重：title `12/18 600`，label `12/18 400`，value `12/18 600`，note `12/18 400`；不得回退为默认 `16px` 或普通字重。
- Tooltip 的结构节点必须可维护：`tooltipFrame / FormatSlot / body / content / label_column / value_column / note` 至少应通过 Frame 或 component-like group 表达。禁止把标题、label、value、note 作为散落文本直接平铺在 Tooltip 容器下。
- Tooltip 容器开启裁切时，必须预留右侧 padding 并完成 value 右对齐校正；如果目标工具的文本节点会自动收缩或延迟计算宽度，生成脚本必须在设置 characters 后二次校准位置。

设计稿还原约束：

- 多系列 Tooltip 不应把每条系列渲染成彼此独立的大行容器。推荐结构是 `title -> body/content -> label_column + value_column`。
- `label_column` 内每个 item 只包含 `icon + label`，`value_column` 内每个 value 与左侧 item 通过相同行高对齐。
- 如果实现环境只能按行生成，应将每行高度固定为 `18px`，行间 gap 设为 `0px`，并让 value 列右对齐。
- 系列之间的视觉距离来自 `12/18` 文字行高，不来自额外 margin；这是避免 Tooltip 内容过松散的首要规则。

## 5. 折线图 Tooltip 规则

折线图应优先使用 axis trigger。

触发后同时显示：

- 垂直轴指示线，必须为 `1px` 实线。
- 当前点 symbol。
- Tooltip 容器。
- Tooltip 中的系列 icon，形状必须与图例和折线一致。

单系列示例：

```txt
15:00
— label        618
```

多系列示例：

```txt
2026-05-18
— 成交金额     172 万元
— 成交转化率   4.85%
同日联动读数
```

规则：

- 标题显示当前时间 / 日期 / 类目。
- 同一图表中数值单位和小数位必须稳定。
- 多系列 Tooltip 的条目顺序应与图例顺序一致。
- 多系列 Tooltip 应使用两列对齐结构：左侧连续排列 icon + label，右侧连续排列 value；系列行间距为 `0px`，行高为 `18px`。
- 说明文字如“同日联动读数”应作为 note 放在系列列表下方，距上方 `4px`，不得被当作第三条系列。
- 折线图 hover 的 axisPointer 只表达当前 X 位置，应为垂直 `1px` 实线，颜色绑定 `提示/tooltipAxisColor`；不得使用虚线、dashPattern 或大量小矩形拼接成虚线。
- Tooltip 推荐最多直接展示 `5` 个系列；超过 `5` 个时应分页、折叠或只显示重点系列。
- 组件能力可支持到 `10` 个条目；超过 `10` 个时必须使用自定义内容、滚动容器或聚合方案。

## 6. 坐标轴指示器类型

坐标轴指示器应根据图表类型选择形态，不同图表不得统一套用同一种 hover 辅助样式。

| 图表类型 | axisPointer / 指示器 | 规则 |
|---|---|---|
| 折线图 | `line` | 单根垂直 `1px` 实线，绑定 `提示/tooltipAxisColor` |
| 面积图 | `line` | 继承折线图的垂直实线指示器 |
| 柱状图 | `shadow` / 高亮矩形 | 只显示类目高亮矩形，不显示垂直指示线 |
| 柱线混合图 | `shadow` / 高亮矩形 | 只显示类目高亮矩形，不显示垂直指示线；折线 hover 点可保留 |

高亮矩形规格：

- 填充色为 `black 3%`，即 `rgba(0,0,0,0.03)`。
- 宽度等于当前类目 `category` 的完整占位宽度，而不是柱体自身宽度。
- 高度等于 `plotArea` 绘图区高度。
- X 位置以当前类目中心对齐：`x = categoryCenterX - categoryBandWidth / 2`。
- 高亮矩形必须放在 `interactionLayer`，视觉层级低于 Tooltip、hover 点和数据图形主读数，不得遮挡 Tooltip 文本。
- 柱状图和柱线混合图不得同时显示高亮矩形和垂直 line 指示器。

## 7. 位置规则

- Tooltip 应靠近 hover 点，但不遮挡当前点和关键趋势路径。
- 默认放在指示线右侧；靠近右边界时翻转到左侧。
- Tooltip 与指示线或点位之间建议保持 `12-16px` 间距。
- Tooltip 不应遮挡图例。
- 长时间序列图中，Tooltip 可跟随 x 轴位置水平移动。

## 8. 与图例的一致性

Tooltip icon 必须复用图例和系列的图形语义：

| 图表系列 | Tooltip icon |
|---|---|
| 折线 | line，`8-10px × 2px` 线段，必要时配合点 |
| 柱体 / 面 | rectangle，`8-10px × 8-10px` 圆角矩形 |
| 散点 | dot，`8-10px × 8-10px` 圆点 |
| 虚线预测 | 虚线 icon |

禁止用圆点替代所有类型的 Tooltip icon。若设计工具组件只支持圆点，需要在验证清单中标记与图例语义不一致。

## 9. AI 输出格式

AI 生成图表时应输出：

| 字段 | 示例 |
|---|---|
| trigger | `axis` |
| axisPointer | 折线图：`line; vertical 1px solid; tooltipAxisColor`；柱状 / 柱线混合：`shadow; rgba(0,0,0,0.03); width = categoryBandWidth; height = plotAreaHeight` |
| title | `date` |
| items | `series label + value + unit` |
| iconShape | `line` |
| layout | `FormatSlot vertical gap 4; label/value two columns; row height 18; item gap 0; note gap 4; value right aligned` |
| placement | `right of pointer, flip at edge` |
| shadow | `0 4 16 rgba(0,0,0,0.16)` |
| maxItems | `5` direct, `10` component limit |

## 10. 禁止项

- 禁止 Tooltip 中使用字段名替代业务名。
- 禁止数值无单位。
- 禁止 Tooltip icon 与系列色或图例形态不一致。
- 禁止多系列 item 之间使用额外大间距，导致 Tooltip 内容松散。
- 禁止将 label 和 value 做成多个互不对齐的自由文本块。
- 禁止用空白矩形、额外 spacer 或大行高模拟系列间距。
- 禁止把 value 文本的 `x` 坐标当作右边界，导致数值被容器裁切。
- 禁止 Tooltip 遮挡当前 hover 点。
- 禁止只显示当前系列而无法读取同维度其他系列。
- 禁止使用未定义的大字号、强投影或高饱和背景。
- 禁止把折线图 hover 轴指示线绘制成虚线；虚线只用于网格线、预测线、目标线等明确语义。
- 禁止柱状图或柱线混合图同时显示高亮矩形和垂直 line 指示器。
- 禁止把柱状图 / 柱线混合图的高亮矩形宽度做成柱体宽度；必须使用完整类目占位宽度。

## 11. AI 自查清单

- Tooltip 是否绑定 `提示/backgroundColor`？
- 轴指示线是否绑定 `提示/tooltipAxisColor`？
- Tooltip 标题是否表达当前维度？
- 每个 item 是否包含业务名、数值和单位？
- 多系列顺序是否与图例一致？
- 多系列 item 是否为 `18px` 行高、`0px` 行间距？
- Tooltip 是否使用左 label 列、右 value 列，并让 value 右对齐？
- note 是否与系列列表保持 `4px` 间距且不误作系列 item？
- icon 是否与图例和数据系列一致？
- 折线图 hover 指示线是否为垂直 `1px` 实线，而不是虚线或小矩形拼接？
- 柱状图 / 柱线混合图是否只显示 `black 3%` 的完整类目占位高亮矩形，没有额外垂直 line 指示器？
- Figma / Relay 中 value 列是否按实际文本宽度右对齐，且未被容器裁切？
- Tooltip 是否有边界翻转策略？
- 超过 5 个条目时是否有分页、折叠或重点系列策略？
- 超过 10 个条目时是否有自定义内容、聚合或滚动方案？

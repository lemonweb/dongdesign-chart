# 01.漏斗图 Funnel

## 1. 文档定位

漏斗图用于展示一个有明确顺序的多阶段流程中，各阶段数量、转化率和流失情况的变化。

本文档用于约束 AI 在生成漏斗图时的图表选型、数据字段、样式形态、标签布局、转化标记、交互状态和工程映射，确保后续 vibeDesign 与 vibeCode 生成的视觉效果接近设计指南中的基础漏斗图与矩形转化漏斗图。

vibeDesign 和 vibeCode 必须使用同一套中间语义：先确定 `variant`、`dataMapping`、`geometrySpec`、`labelSpec`、`conversionSpec`，再分别生成设计稿或代码。不得在设计端只描述截图、在代码端另起一套图形比例。

## 2. 图表定义

漏斗图是一种用于展示流程转化的数据可视化图表。它由多个水平层组成，每一层代表流程中的一个阶段，阶段宽度或面积与该阶段的数量或百分比成比例。

标准漏斗图通常从顶部开始展示，顶部最宽表示起始阶段，向下逐层收窄表示数量递减。它适合表达用户在购买、注册、销售线索、招聘、功能使用等单向流程中的转化与流失，帮助用户识别瓶颈环节并采取优化行动。

漏斗图强调“阶段顺序”和“转化效率”，不是普通分类比较图。

## 3. 属性摘要

| 属性 | 说明 |
| --- | --- |
| 图表类型 | 流程图表 / 统计图表 |
| 图形形态 | 多边形、梯形、矩形转化层 |
| 主要功能 | 趋势、组成、转化、流失 |
| 适合的数据 | 有明确顺序的阶段字段 + 连续数值字段 |
| 数据与图形映射 | 阶段映射到垂直层级；连续数值映射到梯形宽度或面积 |
| 数据体量 | 推荐 3-6 个阶段；可接受 3-7 条数据 |
| 默认方向 | 自上而下，从高数量阶段到低数量阶段 |

## 4. 适用场景

漏斗图适用于以下场景：

- 有明确顺序的多步骤流程：流程中的每一步都承接上一步。
- 衡量转化或流失：关注各阶段数量递减和效率变化。
- 识别流程瓶颈：快速定位用户流失最多、转化最低的环节。
- 展示关键业务路径：例如用户注册流程、销售线索转化、电商购物路径、产品功能使用路径、招聘流程。

典型业务问题包括：

- 从访问首页到支付成功，哪一步流失最多？
- 不同渠道的销售线索在哪个阶段转化效率最低？
- 新用户从注册到激活的关键瓶颈在哪里？
- 某个活动的浏览、加购、下单、支付转化是否健康？

## 5. 不适用场景

| 不适用场景 | 原因 | 替代方向 |
| --- | --- | --- |
| 各阶段不必然递减 | 漏斗图暗示流程递进和数量收窄，数据增加或大幅波动会误导判断 | 折线图、柱状图 |
| 部分与整体占比 | 漏斗图表达流程转化，不表达静态组成 | 饼图、环图、堆叠图 |
| 时间趋势变化 | 漏斗图不表达连续时间上的变化 | 折线图、面积图 |
| 并列指标比较 | 漏斗图强调流程，不适合独立指标对比 | 柱状图、条形图 |
| 阶段过多 | 过多层级会让图表细长、拥挤、难以阅读 | 合并阶段、下钻、小多图 |
| 阶段顺序不清晰 | 无法形成明确转化路径 | 先定义流程，或改用表格/柱状图 |

## 6. 数据结构

### 6.1 基础字段

| 字段角色 | 是否必需 | 说明 |
| --- | --- | --- |
| 阶段字段 `stage` | 必需 | 表示流程步骤，如访问首页、访问商详、加入购物车，映射到阶段标签 |
| 数值字段 `value` | 必需 | 表示该阶段数量，如人数、订单数、金额，映射到漏斗层宽度或面积 |
| 阶段短名 `shortStage` | 可选 | 当标签空间有限时使用，优先映射到图内标签 |
| 转化率字段 `conversionRate` | 建议 | 表示当前阶段相对上一阶段的转化率；第一阶段可为 `1` 或不展示 |
| 总转化率字段 `totalConversionRate` | 可选 | 表示当前阶段相对第一阶段的累计转化率 |
| 流失率字段 `lossRate` | 可选 | 表示当前阶段相对上一阶段的流失率，通常等于 `1 - conversionRate` |
| 变化字段 `change` / `changePp` | 可选 | 表示数量、转化率或总转化率相对上一周期的变化 |
| 单位字段 `unit` | 可选 | 表示人、单、元、万等格式化单位 |
| 排序字段 `order` | 必需 | 保证阶段按业务流程顺序展示 |

### 6.2 数据示例

```json
[
  { "stage": "店铺首页访客数", "shortStage": "首页访客", "value": 1000000, "conversionRate": 1, "totalConversionRate": 1, "change": 0.1234, "order": 1 },
  { "stage": "商详访客数", "shortStage": "商详访客", "value": 800000, "conversionRate": 0.8, "totalConversionRate": 0.8, "changePp": 0.3224, "order": 2 },
  { "stage": "加购客户数", "shortStage": "加购客户", "value": 600000, "conversionRate": 0.75, "totalConversionRate": 0.6, "changePp": 0.1212, "order": 3 },
  { "stage": "下单客户数", "shortStage": "下单客户", "value": 400000, "conversionRate": 0.6667, "totalConversionRate": 0.4, "changePp": 0.0456, "order": 4 },
  { "stage": "支付客户数", "shortStage": "支付客户", "value": 200000, "conversionRate": 0.5, "totalConversionRate": 0.2, "changePp": -0.0462, "order": 5 }
]
```

### 6.3 数据要求

- 阶段数量推荐 3-6 个，最多不超过 7 个。
- 阶段必须按流程顺序排列，不按数值大小随意排序。
- 每一层应代表关键决策点，次要步骤应合并或通过下钻查看。
- 同一漏斗中阶段粒度应一致，避免把粗粒度和细粒度阶段混排。
- 比较不同渠道、时间段或用户群体时，所有漏斗必须采用完全相同的阶段定义和顺序。
- 每个阶段除绝对数值外，应尽量提供转化率或流失率。

### 6.4 派生指标计算

当输入数据缺少转化率或流失率时，AI 可以基于数值字段派生，但必须在输出中标明为计算值。

| 指标 | 计算规则 | 映射位置 |
| --- | --- | --- |
| 归一化值 `normalizedValue` | `value / max(value)` | 阶段宽度或面积 |
| 相邻转化率 `conversionRate[i]` | `i = 0` 时为 `1` 或不展示；`i > 0` 时为 `value[i] / value[i - 1]` | 阶段标签、Tooltip |
| 转化带数值 `conversionBar[i]` | 表示从第 `i` 阶段到第 `i + 1` 阶段的转化率，即 `value[i + 1] / value[i]` | `conversionBar-01` 到 `conversionBar-(n-1)` |
| 流失率 `lossRate[i]` | `1 - conversionRate[i]` | Tooltip、外侧标注 |
| 总转化率 `totalConversionRate[i]` | `value[i] / value[0]` | 左侧或右侧累计说明 |
| 转化变化 `changePp` | 本期转化率减去上期转化率，单位为百分点 `pp` | 转化率标注的趋势值 |

生成转化文案时，默认使用“目标阶段短名 + 转化率”，例如第一条转化带为“商详转化率”，表示从“店铺首页访客数”到“商详访客数”的转化率。

## 7. 视觉构成

| 构成元素 | 作用 | 是否必需 |
| --- | --- | --- |
| 漏斗主体 Funnel Body | 承载各阶段的数量大小 | 必需 |
| 阶段 Stage / Item | 表示流程中的离散步骤 | 必需 |
| 梯形或矩形 Shape | 通过宽度或面积表达阶段数值 | 必需 |
| 标签 Label | 标识阶段名称、数值、百分比 | 必需 |
| 转化标记 Conversion Bar | 表示相邻阶段之间的转化率 | 转化漏斗建议启用 |
| 转化标记线 Connection | 将转化率说明与阶段或转化带关联 | 可选 |
| Tooltip | 悬停时展示阶段详细信息 | 建议启用 |
| 高亮态 Highlight | 悬停或选中阶段时突出当前对象 | 建议启用 |

## 8. 样式生成规则

### 8.1 统一几何坐标

漏斗图的设计稿和代码必须共用同一套几何坐标。设计稿中的尺寸可等比缩放，但比例关系不可改变。

| 几何项 | 默认值 / 规则 | 说明 |
| --- | --- | --- |
| 基础漏斗基准画布 | `433.55 x 360` | 对应设计稿中的基础漏斗图主体 |
| 矩形转化漏斗基准画布 | `360 x 360` | 对应设计稿中的矩形转化漏斗图主体 |
| 矩形转化漏斗完整说明区 | `600 x 360`，示例容器约 `625 x 400` | 主体 `360`，左侧总转化轨道 `120`，右侧相邻转化轨道 `120`，主体在完整容器内居中 |
| 最大宽度 `maxWidth` | 画布宽度的 `100%` | 第一阶段或最大值阶段宽度 |
| 最小宽度 `minWidth` | 画布宽度的 `20%` | 防止底部阶段过窄；设计稿基准约为 `86.71 / 433.55` 或 `72 / 360` |
| 水平对齐 | 居中 | 每一层 `x = (plotWidth - layerWidth) / 2` |
| 宽度映射 | `layerWidth = max(minWidth, maxWidth * value / maxValue)` | 不按标签长度改变宽度 |
| 阶段顺序 | 按 `order` 自上而下 | 不使用引擎默认排序 |
| 坐标轴 | 不显示 | 漏斗图只使用内部布局坐标，不渲染轴、刻度或网格 |

当所有 `value` 相同或业务明确使用等宽流程图时，必须把 `encoding.width = "constant"` 写入输出；否则默认使用数值比例映射宽度。

基础漏斗因每层高度一致，视觉面积会随宽度同步变化。为保证 vibeDesign 和 vibeCode 一致，默认以 `layerWidth` 作为可计算的主编码，再由梯形上下边界形成面积感；不得在设计端按宽度、代码端按另一套面积算法分别计算。

### 8.2 基础漏斗图形态

基础漏斗图应生成居中对称的垂直梯形漏斗。

执行规则：

- 漏斗整体垂直居中，阶段从上到下排列。
- 顶部阶段最宽，底部阶段最窄。
- 每一层高度保持一致，帮助用户判断宽度差异；`stageHeight = (plotHeight - gap * (n - 1)) / n`。
- 阶段之间保留 `2px` 左右的窄间隔；设计稿 5 阶段基准为 `stageHeight = 70.4px`、`gap = 2px`。
- 梯形左右两侧应对称收缩，不生成倾斜或偏移的漏斗主体。
- 阶段宽度由数值比例决定，不得随意等宽，除非使用矩形转化漏斗。
- 每一层应是独立可 hover 的数据单元，命名或语义为 `item-01`、`item-02`。
- 阶段主体为深蓝到浅蓝的连续色阶；顶部色阶最重，底部色阶最轻。
- 右侧转化标记线可从阶段右边缘或相邻阶段的过渡位置引出，必须避开图内居中标签。

### 8.3 矩形转化漏斗形态

矩形转化漏斗用于更明确地展示“阶段值 + 阶段间转化率”。

执行规则：

- 使用 `item` 与 `conversionBar` 交替排列。
- `item` 表示阶段数量，使用较高的矩形层；`conversionBar` 表示相邻阶段之间的转化率，使用较薄的过渡带。
- 设阶段数量为 `n`，基准画布高度为 `H`，则 `unit = H / (3n - 1)`，`itemHeight = 2 * unit`，`conversionBarHeight = unit`。设计稿 5 阶段基准为 `itemHeight = 51.43px`、`conversionBarHeight = 25.71px`。
- `item[i]` 的宽度按 `value[i] / maxValue` 映射，水平居中。
- `conversionBar[i]` 连接 `item[i]` 与 `item[i + 1]`，承载 `value[i + 1] / value[i]` 的转化率。转化带的外接框必须继承上一级阶段 `item[i]` 的 `x` 与 `width`，高度为 `conversionBarHeight`；视觉上使用浅蓝过渡面从上一阶段底边收束到下一阶段顶边。不得绘制一个占满 `plotWidth` 的透明外框，再在内部放置较窄图形。
- `conversionBar` 是浅色连接面，不是深色实心阶段条。它应位于深色 `item` 图层之间，颜色使用低饱和浅蓝或当前蓝色色阶的最浅一档，默认弱于所有 `item`，不得抢占阶段主体。
- `conversionBar` 的左右边缘应沿上下阶段的边缘方向形成斜切面：上边贴合 `item[i]` 底边宽度，下边朝向 `item[i + 1]` 顶边宽度收束。视觉结果应像连续漏斗的过渡面，而不是等宽矩形条。
- 转化带不替代阶段本身，只作为阶段之间的辅助说明。
- 适合需要同时展示绝对值、转化率、环比变化的场景。
- 矩形层应保持轻微或无圆角，不使用大圆角胶囊形。
- 当矩形层宽度小于图内标签宽度时，标签可以跨出该层但必须居中对齐该层；文字颜色应按背景明度切换，设计稿底部浅色层可使用深蓝文字。

5 阶段矩形转化漏斗的基准坐标必须按以下规则生成，允许整体等比缩放，但不允许单独改动某一项：

| 单元 | `x` | `y` | `width` | `height` |
| --- | --- | --- | --- | --- |
| `item-01` | `0` | `0` | `360` | `51.43` |
| `conversionBar-01` | `0` | `51.43` | `360` | `25.71` |
| `item-02` | `36` | `77.14` | `288` | `51.43` |
| `conversionBar-02` | `36` | `128.57` | `288` | `25.71` |
| `item-03` | `72` | `154.29` | `216` | `51.43` |
| `conversionBar-03` | `72` | `205.71` | `216` | `25.71` |
| `item-04` | `108` | `231.43` | `144` | `51.43` |
| `conversionBar-04` | `108` | `282.86` | `144` | `25.71` |
| `item-05` | `144` | `308.57` | `72` | `51.43` |

图内标签外接框宽度推荐 `106px`、高度 `38px`，位置为 `labelX = item.x + item.width / 2 - 53`、`labelY = item.y + 7`。当底部阶段宽度只有 `72px` 时，标签外接框会自然跨出图形边界，但仍必须以阶段中心线为准居中。

### 8.4 尺寸比例

生成视觉时应保持稳定比例，不因标签长短改变主体结构。

推荐规则：

- 图表主体使用固定宽高比例，常规容器可按基础漏斗 `433.55 x 360`、矩形转化漏斗 `360 x 360` 或等比例缩放。
- 基础漏斗每层高度相等；矩形转化漏斗按 `itemHeight : conversionBarHeight = 2 : 1` 分配高度。
- 3-7 阶段均使用同一公式重算高度，不手动调整个别层。
- 最窄阶段仍需保留足够标签空间；当底层过窄时，应使用外置标签或 Tooltip。
- 画布缩放时，文字字号默认不随画布等比放大；保持视觉语言中的 `12px / 18px` 与 `14px / 20px` 层级。

### 8.5 色彩样式

漏斗图应使用单色调渐变，避免多色干扰。

执行规则：

- 生成漏斗图设计或代码时，颜色描述必须优先依赖 dongDesign Charts 全局变量体系；只有在说明当前模式预览值时，才写 resolved hex。不得把 resolved hex 当作规范源头。
- 变量依赖优先级为：漏斗图专用变量 `funnelPalette/*` > 全局顺序色板 `有序色板/*` > 全局文本、边框、趋势语义变量（如 `text/*`、`border/*`、`语义色板/*`）> 当前模式 resolved value。若文档中需要列示色值，必须同时说明对应变量或变量族。
- 顶部高数量阶段使用更深色。
- 底部低数量阶段使用更浅色。
- 推荐使用深蓝到浅蓝的连续色阶；设计稿的深色文字基准为深蓝，工程实现应优先映射到主题 token。
- 不使用多组无关分类色表达阶段，因为阶段不是分类对比。
- 高亮态可以提高当前阶段亮度或描边，但不得改变整体色阶逻辑。
- 趋势变化值使用趋势语义色：上升使用趋势上升色，下降使用趋势下降色。
- `conversionBar` 使用浅蓝连接面，不使用深蓝、强饱和色或独立分类色；它的视觉权重必须低于阶段 `item`。

推荐变量映射：

| 元素 | 优先变量 / 变量族 | Light resolved value 示例 | 兜底规则 |
| --- | --- | --- | --- |
| `item-01` 至 `item-05` | `funnelPalette/1-5` | 深蓝到浅蓝连续色阶 | 没有 `funnelPalette` 时，使用同一蓝色色相的 `有序色板/*` 变量 |
| `conversionBar` | `funnelPalette/transition` 或同色相顺序色低透明派生 | 蓝色低透明渐变 | 允许使用同色相低透明渐变，但必须弱于所有 `item` |
| 转化线 / 轨道线 | `border/*` 或图表辅助线变量 | `#D9D9D9` 级别浅灰线 | 禁止改为深色、品牌色或高饱和色 |
| 转化指标名 | `text/secondary` 或等价正文辅助文本变量 | `#595959` | 不得使用阶段色或强调色 |
| 转化率数值 | `text/primary` 或等价主文本变量 | `#262626` | 数值必须中性，不使用蓝色强调 |
| `changePp` | 趋势 / 语义变量，如 `语义色板/danger`、`语义色板/normal` 或趋势上升 / 下降变量 | 正向 `#F33B50`，负向 `#009A5F` | 必须遵循业务语义；不得用分类色替代 |
| 白色图内标签描边 | 当前阶段填充变量或同阶深一阶变量 | 与阶段色同源 | 必须为外描边，不得使用居中描边 |

### 8.6 标签样式

标签是漏斗图的核心读数入口，必须清晰、简洁、稳定。

执行规则：

- 阶段名称使用 `12px / 18px`，推荐半粗体。
- 数值和变化值使用 `14px / 20px`，数值与趋势值可同一行展示。
- 阶段名称和数值上下排列，整体标签高度基准为 `38px`。
- 同一阶段内的数值与变化值之间使用 `8px` 横向间距。
- 图内标签默认水平居中、垂直居中，`label` 与 `value` 必须共同围绕当前阶段中心线对齐；不得因为文本盒宽度、字符串长度或引擎默认值变成左对齐。
- 基础漏斗默认使用居中白色标签；白色或浅色文字必须添加对应系列色描边，描边色取当前阶段填充色或同一色阶的深一阶颜色。
- 浅色文字描边应只用于增强溢出识别，不应改变标签主色；推荐 `strokeWeight = 1px`、`strokeAlign = "OUTSIDE"` 外描边。设计工具支持外描边时必须使用外描边，不得退化为居中描边；SVG 兜底可使用“描边文本在下 + 填充文本在上”的等效外轮廓。
- 当底层背景过浅或宽度过窄时，文字应切换为深色或移到外侧。
- 当标签宽度大于当前阶段最窄可用宽度时，可以允许文本盒跨出图形边界，但必须保持中心对齐，并依赖对应系列描边保证跨出部分仍能识别所属阶段。
- 标签不得重叠、溢出或遮挡转化标记线。
- 图内标签优先使用 `shortStage`，Tooltip 和外侧标注使用完整 `stage`。
- 变化值为百分点时必须显示 `pp`，例如 `+32.24pp`；普通比例变化才显示 `%`。

### 8.7 转化标记线与外侧说明

当需要强调转化率或流失率时，可以显示转化标记线。

执行规则：

- 标记线应从阶段边缘或转化带延伸到外侧说明文字。
- 右侧标记适合展示每一步转化率。
- 左侧标记适合展示跨阶段总转化率。
- 标记文字包含转化率、流失率或环比变化。
- 标记线不得穿过漏斗主体中心标签。
- 标记说明按“指标名 + 数值 + 趋势变化”组织，指标名使用 `12px / 18px`，数值行使用 `14px / 20px`。
- 右侧标记的第 `i` 条对应 `conversionBar[i]`，即从阶段 `i` 到阶段 `i + 1` 的转化率。
- 外侧说明区应预留固定宽度，不挤压漏斗主体；当容器不足时优先隐藏外侧说明，保留 Tooltip。

矩形转化漏斗必须使用外侧指标轨道呈现转化指标，不应把指标标签塞进转化带内部。

| 轨道 | 基准位置 | 用途 | 线条规则 | 标签规则 |
| --- | --- | --- | --- | --- |
| 右侧相邻转化轨道 | `x = plotWidth`，`width = 120` | 展示每一步 `conversionBar[i]` 的转化率与变化 | 每条转化线宽约 `116.81px`、高约 `77.14px`，基准路径为浅灰细线矩形轮廓：`M0 0 L116.81 0 L116.81 77.143 L0 77.143`，颜色依赖 `border/*` 或图表辅助线变量；不要改成短横线、粗弧线、深色线或装饰性箭头 | 指标锚点约为 `x = 109.5`，`y = 64.29 + i * 77.14`；指标名在上并右对齐，数值和 `changePp` 在下，整体向锚点左侧展开 |
| 左侧总转化轨道 | `x = -120`，`width = 120` | 展示首阶段到末阶段的 `totalConversionRate` | 使用一条跨阶段总转化线，基准路径为 `M116.75 0 L3.338 0 C1.494 0 0 1.535 0 3.429 L0 298.286 C0 300.179 1.494 301.714 3.338 301.714 L116.75 301.714`；颜色依赖 `border/*` 或图表辅助线变量 | 标签位于轨道中部，约 `x = 14`、`y = 180`，文案为“起始阶段-最终阶段转化率” |

右侧相邻转化标签的布局应保持稳定：指标名宽度约 `60px`，以锚点右对齐；数值行宽度约 `100-106px`，`conversionRate` 与 `changePp` 间距 `8px`，整体向锚点左侧展开。左侧总转化标签以轨道内侧左对齐，避免压住主体。

生成设计稿时，应优先复用规范中的矢量路径语义和全局变量依赖：`item` 使用矩形主体矢量，`conversionBar` 使用浅蓝过渡矢量，`connection/line` 使用设计稿细线矢量。不得只根据文字描述手写一组相似但不同的贝塞尔曲线；不得复制 resolved hex 而丢失 dongDesign Charts 的变量继承关系。

## 9. 设计原则

### 9.1 控制阶段数量

阶段数量不宜过多，建议在 3-6 个阶段之间。过多阶段会使图表过于细长，难以阅读和聚焦。

执行规则：

- 3-5 个阶段适合清晰展示关键路径。
- 6 个阶段需要确认标签空间。
- 7 个阶段是上限，应谨慎使用。
- 超过 7 个阶段时，应合并次要阶段、抽象关键阶段，或提供下钻查看详情。

### 9.2 保持阶段粒度一致

每一层应代表相似粒度的流程节点。不要把“访问首页”这类粗阶段与“点击某个按钮”这类细动作混在同一漏斗中。

### 9.3 保持阶段顺序一致

比较不同渠道、时间段或用户群体时，所有漏斗必须采用完全相同的阶段定义和顺序。

### 9.4 转化与流失并重

每个阶段除了展示绝对数值，还应清晰展示与前一阶段相比的转化率或流失率。缺少转化率/流失率时，漏斗图的分析价值会明显下降。

### 9.5 标签与排版清晰

阶段名称、绝对数值、百分比标签应清晰、简洁、易读，位置稳定，避免重叠和溢出。

### 9.6 色彩克制

漏斗图不应使用过多颜色。色彩只用于表达从高到低的阶段递减、高亮状态或趋势变化，不用于制造装饰效果。

## 10. 交互规则

| 交互 | 启用条件 | 系统反馈 |
| --- | --- | --- |
| 悬停 Tooltip | 需要读取阶段详情 | 显示阶段名称、数值、转化率、流失率、环比变化 |
| 阶段高亮 | 鼠标悬停某个阶段 | 当前阶段视觉增强，其他阶段保持或轻微弱化 |
| 转化带高亮 | 鼠标悬停转化带 | 高亮相邻阶段关系，并显示该段转化率 |
| 选中 | 用户点击某个阶段或转化带 | 当前对象保持选中态，用于进一步分析 |
| 下钻 | 阶段包含子阶段 | 点击阶段后展开或跳转到更细流程 |

交互应帮助用户读清阶段数据和转化关系，不应让漏斗图变成复杂操作面板。

## 11. 与视觉语言的关系

漏斗图依赖以下视觉语言文档：

| 依赖文档 | 使用方式 |
| --- | --- |
| `01-design-language/theme-token.md` | 绑定漏斗填充、标签、Tooltip、选中态、高亮态 |
| `01-design-language/color.md` | 定义单色渐变、趋势上升/下降色、弱化状态色 |
| `01-design-language/typography.md` | 控制阶段标签、数值、转化率、Tooltip 的字号和字重 |
| `01-design-language/label.md` | 管理阶段标签、外置标签、转化标记文字 |
| `01-design-language/tooltip.md` | 管理悬停详情展示 |

漏斗图不使用常规坐标轴。若实现中需要坐标系统，仅作为布局计算，不应显示坐标轴、刻度线或网格线。

## 12. G2 / ECharts 映射

### 12.1 统一配置语义

无论使用 G2、ECharts、SVG、Canvas 还是 Relay 设计节点，漏斗图都应先生成以下统一配置，再转换为具体引擎配置。

| 语义 | 取值 / 规则 | 说明 |
| --- | --- | --- |
| `chartType` | `funnel` | 固定为漏斗图 |
| `variant` | `basic-trapezoid` / `rectangular-conversion` | 基础漏斗或矩形转化漏斗 |
| `dataMapping.stage` | 阶段字段 | 映射到图内标签和 Tooltip |
| `dataMapping.value` | 连续数值字段 | 映射到阶段宽度或面积 |
| `dataMapping.order` | 排序字段 | 映射到自上而下流程顺序 |
| `dataMapping.conversionRate` | 相邻转化率字段 | 映射到转化带、外侧说明、Tooltip |
| `dataMapping.totalConversionRate` | 累计转化率字段 | 可映射到左侧或 Tooltip |
| `geometrySpec.plotWidth` | 基础 `433.55` / 矩形 `360` | 可等比缩放 |
| `geometrySpec.plotHeight` | `360` | 可等比缩放 |
| `geometrySpec.minWidthRatio` | `0.2` | 对应 `minSize = 20%` |
| `geometrySpec.maxWidthRatio` | `1` | 对应 `maxSize = 100%` |
| `geometrySpec.gap` | 基础漏斗 `2px` | 矩形转化漏斗不使用独立 gap，以 `conversionBar` 作为间隔 |
| `labelSpec.position` | `inside-center` / `outside-when-overflow` | 图内居中优先，空间不足外置 |
| `conversionSpec.showBar` | `true` / `false` | 矩形转化漏斗必须为 `true` |
| `conversionSpec.barBounds` | `inherit-source-item-bounds` | 矩形转化带外接框继承上一级 `item[i]` 的 `x` 与 `width` |
| `conversionSpec.showConnector` | `true` / `false` | 基础漏斗按需启用右侧标记线，矩形转化漏斗默认启用左右外侧轨道 |
| `conversionSpec.rightRail` | `{ width: 120, anchorX: 112.5 }` | 相邻转化指标线和标签的右侧轨道 |
| `conversionSpec.leftRail` | `{ width: 120, anchorY: 180 }` | 总转化指标线和标签的左侧轨道 |

### 12.2 G2

| 语义 | G2 映射 |
| --- | --- |
| 图表类型 | `polygon` / 自定义 shape；不建议只用普通 `interval` 伪装 |
| 阶段字段 | `stage` / `name` |
| 数值字段 | `value` |
| 阶段顺序 | `order` |
| 阶段宽度 | 预处理计算上下边界宽度与 `points` 后绘制 polygon |
| 矩形转化带 | 预处理生成 `conversionBar` polygon，数据类型标记为 `transition` |
| 标签 | 自定义 label 或 DOM / SVG overlay |
| Tooltip | 建议使用自定义 DOM tooltip，展示阶段值和转化关系 |

G2 实现基础漏斗时，应把每一层转换为四点梯形多边形：

```js
const maxValue = Math.max(...data.map(d => d.value));
const minWidth = plotWidth * 0.2;
const ordered = data.sort((a, b) => a.order - b.order);
const widths = ordered.map(d => Math.max(minWidth, plotWidth * d.value / maxValue));
const layers = ordered.map((d, index) => {
  const topWidth = widths[index];
  const bottomWidth = widths[index + 1] ?? widths[index];
  const topX0 = (plotWidth - topWidth) / 2;
  const topX1 = topX0 + topWidth;
  const bottomX0 = (plotWidth - bottomWidth) / 2;
  const bottomX1 = bottomX0 + bottomWidth;
  const y0 = index * (stageHeight + gap);
  const y1 = y0 + stageHeight;
  return {
    ...d,
    points: [
      [topX0, y0],
      [topX1, y0],
      [bottomX1, y1],
      [bottomX0, y1]
    ],
    type: "item"
  };
});
```

矩形转化漏斗中，`item` 和 `conversionBar` 必须作为两类图形单元输出。`conversionBar[i]` 使用上阶段宽度与下阶段宽度构成过渡 polygon，并绑定 `sourceStage`、`targetStage`、`conversionRate`。

### 12.3 ECharts

```js
option = {
  tooltip: {
    trigger: "item"
  },
  series: [
    {
      type: "funnel",
      sort: "none",
      orient: "vertical",
      left: "center",
      width: 433.55,
      height: 360,
      minSize: "20%",
      maxSize: "100%",
      gap: 2,
      label: {
        show: true,
        position: "inside",
        fontSize: 12,
        fontWeight: 600
      },
      data: [
        { name: "店铺首页访客数", value: 1000000 },
        { name: "商详访客数", value: 800000 },
        { name: "加购客户数", value: 600000 },
        { name: "下单客户数", value: 400000 },
        { name: "支付客户数", value: 200000 }
      ]
    }
  ]
};
```

ECharts 映射规则：

- `series.type = "funnel"` 对应漏斗图。
- `sort = "none"` 保持业务流程顺序，不按数值自动重排。
- `minSize = "20%"`、`maxSize = "100%"` 对应设计稿最窄层和最宽层比例。
- `gap = 2` 对应基础漏斗层间距；矩形转化漏斗不得只靠 `gap` 表达转化带。
- `label.position = "inside"` 适合基础居中漏斗。
- 当底层标签空间不足时，标签应改为外置或 Tooltip 展示。
- 转化标记线可使用 `graphic`、自定义 DOM overlay 或业务组件实现；线条必须绑定 `conversionBar[i]` 的语义。
- 矩形转化漏斗必须使用 `custom series` / `graphic` / SVG 组件实现，不能只用 ECharts 原生 `funnel` 加大 `gap` 模拟。

### 12.4 矩形转化漏斗渲染映射

矩形转化漏斗的渲染顺序必须稳定：

```txt
item-01
conversionBar-01  // item-01 -> item-02
item-02
conversionBar-02  // item-02 -> item-03
item-03
...
item-n
```

每个渲染单元的配置项应包含：

| 单元 | 必需字段 | 图形映射 |
| --- | --- | --- |
| `item` | `stage`、`value`、`order`、`normalizedValue` | 矩形层宽度、填充色、图内标签 |
| `conversionBar` | `sourceStage`、`targetStage`、`conversionRate`、`lossRate`、`changePp` | 过渡带高度、过渡形状、右侧相邻转化标注或 Tooltip |
| `conversionLine` | `sourceStage`、`targetStage`、`conversionRate`、`lineSide`、`anchor` | 右侧每步转化线，或左侧总转化线 |
| `label` | `shortStage` / `stage`、`formattedValue`、`formattedChange` | 居中标签，必要时外置 |
| `tooltip` | 完整阶段名、数值、相邻转化率、流失率、总转化率 | 悬停详情 |

配置转换时，`conversionBar-01` 不表示第一阶段本身，而表示第一阶段到第二阶段的关系。vibeDesign 和 vibeCode 必须使用相同索引规则。

矩形转化漏斗的转化带、转化线和指标标签必须采用同一组索引：

```txt
conversionBar-01 = item-01 -> item-02
rightConversionLine-01 = conversionBar-01 的右侧说明线
rightConversionLabel-01 = conversionBar-01 的右侧指标标签
totalConversionLine = item-01 -> item-n
totalConversionLabel = totalConversionRate
```

当数据提供 `totalConversionRate` 时，默认生成左侧总转化线；当数据只提供相邻转化率时，至少生成右侧相邻转化线。若画布宽度不足以展示左右轨道，应在输出中显式声明 `conversionSpec.compactMode = "hide-external-rail-use-tooltip"`，不得悄悄改为内部标签。

## 13. AI 输出格式

AI 生成漏斗图设计或代码时，应输出：

```json
{
  "chartType": "funnel",
  "variant": "basic-trapezoid",
  "purpose": "conversion-analysis",
  "dataMapping": {
    "stage": "stage",
    "shortStage": "shortStage",
    "value": "value",
    "conversionRate": "conversionRate",
    "totalConversionRate": "totalConversionRate",
    "lossRate": "lossRate",
    "change": "change | changePp",
    "order": "order"
  },
  "constraints": {
    "stageCount": "3-6, max 7",
    "sort": "business-order",
    "mustDecrease": true,
    "minWidthRatio": 0.2
  },
  "geometrySpec": {
    "plotWidth": 433.55,
    "plotHeight": 360,
    "stageHeightRule": "equal-height",
    "gap": 2,
    "widthFormula": "max(plotWidth * 0.2, plotWidth * value / maxValue)",
    "align": "center"
  },
  "style": {
    "shape": "centered-trapezoid",
    "colorMode": "single-hue-gradient",
    "colorRamp": "deep-blue-to-light-blue",
    "labelFontSize": 12,
    "valueFontSize": 14,
    "labelPosition": "inside-center",
    "labelAlign": "center",
    "lightLabelStroke": {
      "enabled": true,
      "strokeColor": "current-series-color",
      "strokeWeight": 1,
      "purpose": "preserve-readability-when-overflow"
    },
    "showConversionBar": false,
    "showConnector": true
  },
  "interaction": {
    "tooltip": true,
    "highlight": true,
    "select": true
  }
}
```

矩形转化漏斗必须把 `variant` 和 `geometrySpec` 改为：

```json
{
  "variant": "rectangular-conversion",
  "geometrySpec": {
    "plotWidth": 360,
    "plotHeight": 360,
    "visualWidthWithRails": 600,
    "exampleContainer": {
      "width": 625,
      "height": 400,
      "plotX": 132.5,
      "plotY": 20
    },
    "unitFormula": "plotHeight / (3 * stageCount - 1)",
    "itemHeight": "2 * unit",
    "conversionBarHeight": "unit",
    "widthFormula": "max(plotWidth * 0.2, plotWidth * value / maxValue)",
    "align": "center",
    "itemLabelFrame": {
      "width": 106,
      "height": 38,
      "xFormula": "item.x + item.width / 2 - 53",
      "yOffset": 7
    }
  },
  "style": {
    "shape": "rectangular-layer-with-transition-bar",
    "showConversionBar": true,
    "conversionBarMapping": "sourceStage -> targetStage",
    "conversionBarBounds": "inherit-source-item-bounds",
    "conversionBarTone": "pale-blue-transition-surface",
    "conversionLine": {
      "rightRailWidth": 120,
      "rightLineHeight": "itemHeight + conversionBarHeight",
      "rightAnchorX": 112.5,
      "rightAnchorYFormula": "64.29 + index * (itemHeight + conversionBarHeight)",
      "leftRailWidth": 120,
      "leftAnchorY": 180,
      "lineTone": "light-gray-blue-thin-vector",
      "pathSource": "design-vector-template"
    }
  }
}
```

AI 在输出给 vibeDesign / videDesign 时，应包含 `geometrySpec` 和可绘制的层级顺序；输出给 vibeCode 时，应包含同一份 `geometrySpec` 和引擎映射。两者不得只共享 `chartType`。

## 14. 禁止项

- 禁止在没有明确流程顺序的数据中使用漏斗图。
- 禁止把普通并列分类比较做成漏斗图。
- 禁止把阶段按数值大小自动重排，破坏业务流程顺序。
- 禁止在阶段数量超过 7 个时直接生成单张漏斗图。
- 禁止缺少转化率或流失率说明时仍声称完成转化分析。
- 禁止使用多组无关分类色表达阶段。
- 禁止让标签重叠、溢出或被漏斗边界裁切。
- 禁止在底部过窄阶段强行放入完整长标签。
- 禁止用漏斗图表达时间趋势或静态占比。
- 禁止显示坐标轴、刻度线和网格线。
- 禁止 vibeDesign / videDesign 使用一套手工尺寸、vibeCode 使用引擎默认尺寸，导致造型不一致。
- 禁止矩形转化漏斗用普通漏斗 `gap` 冒充 `conversionBar`。
- 禁止把 `conversionBar-01` 误解为第一阶段数值；它表示第一阶段到第二阶段的转化关系。
- 禁止把矩形转化带画成占满 `plotWidth` 的外框加内部窄图形；`conversionBar[i]` 的外接框必须继承 `item[i]` 的 `x` 与 `width`。
- 禁止把矩形转化带画成深色实心条；转化带必须是浅蓝低权重过渡面。
- 禁止把转化带画成纯等宽矩形；转化带两侧应形成连接上下阶段边缘的斜切过渡。
- 禁止把右侧转化线退化为短横线、点状标记或只靠文字说明；右侧转化线必须跨越约 `120px x 77.14px` 的外侧轨道，并沿用设计稿浅灰蓝细线风格。
- 禁止把右侧转化线画成粗重曲线、深色曲线或与设计稿方向不一致的装饰箭头。
- 禁止在存在 `totalConversionRate` 时省略左侧总转化线，除非明确进入紧凑模式并改由 Tooltip 展示。
- 禁止把矩形转化漏斗的转化指标标签放进转化带内部，导致图形和指标层级混淆。
- 禁止把 `changePp` 渲染为 `%`，百分点变化必须显示 `pp`。
- 禁止在未声明 `encoding.width = "constant"` 的情况下生成等宽漏斗。
- 禁止图内标签使用引擎默认左对齐；必须显式声明 `labelAlign = "center"` 或等效配置。
- 禁止白色 / 浅色图内标签没有对应系列描边后直接跨出阶段图形边界。

## 15. AI 自查清单

生成漏斗图前，AI 必须检查：

- [ ] 是否存在明确的单向流程？
- [ ] 阶段数量是否在 3-6 个之间，且不超过 7 个？
- [ ] 阶段是否按业务顺序排列，并设置 `sort = "business-order"` / `sort: "none"`？
- [ ] 各阶段是否存在连续数值字段？
- [ ] 是否计算或提供了相邻转化率、流失率和必要的总转化率？
- [ ] 是否明确选择了 `basic-trapezoid` 或 `rectangular-conversion`？
- [ ] 是否输出了 `geometrySpec`，并让 vibeDesign / videDesign 与 vibeCode 共用？
- [ ] 宽度是否使用 `max(minWidth, maxWidth * value / maxValue)`，且 `minWidthRatio = 0.2`？
- [ ] 基础漏斗是否使用等高层、`2px` 左右间隔和居中对称收缩？
- [ ] 矩形转化漏斗是否使用 `itemHeight : conversionBarHeight = 2 : 1`？
- [ ] `conversionBar[i]` 是否绑定从阶段 `i` 到阶段 `i + 1` 的转化关系？
- [ ] 矩形转化带的外接框是否继承上一级 `item[i]` 的 `x` 与 `width`，而不是占满 `plotWidth`？
- [ ] 矩形转化带是否为浅蓝过渡面，而不是深色阶段条或等宽矩形条？
- [ ] 矩形转化漏斗是否为相邻转化率生成右侧 `120px` 轨道的转化线和指标标签？
- [ ] 右侧转化线是否使用设计稿浅灰蓝细线矢量，而不是手写近似粗曲线？
- [ ] 当存在 `totalConversionRate` 时，是否生成左侧总转化线和总转化指标标签？
- [ ] 漏斗是否使用单色渐变，而不是杂乱多色？
- [ ] 阶段标签是否清晰，是否使用 `12px / 18px` 阶段名和 `14px / 20px` 数值？
- [ ] 图内 `label` 和 `value` 是否都显式居中对齐，而不是依赖引擎默认文本对齐？
- [ ] 白色 / 浅色标签是否添加了对应系列色描边，以保证溢出图形边界时仍可识别所属阶段？
- [ ] 底层标签是否有足够空间，浅色或窄层是否切换深色/外置标签？
- [ ] 是否启用了 Tooltip、高亮和必要的选中态？
- [ ] 是否避免显示坐标轴、刻度线和网格线？

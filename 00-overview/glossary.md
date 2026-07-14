# 术语表 Glossary

## 1. 文档定位

本文定义 dongDesign Chart Wiki 中高频术语的统一含义，帮助 AI Agent、设计师和工程师在图表选型、设计生成、代码生成和审查时保持语义一致。

本文只解释概念，不替代具体规范。涉及样式值、组件结构、字段映射或执行流程时，应继续读取对应目录文档。

## 2. 核心分层

| 术语 | 含义 | 主要引用 |
|---|---|---|
| Knowledge Layer | Wiki 中沉淀设计语言、图表类型、业务场景、适配规则和自查标准的知识层 | `01-design-language/`、`02-chart-type/`、`03-pattern/` |
| Execution Layer | Skill Center 中把 Wiki 规则转化为执行流程的技能层 | `08-skill-center/` |
| Visual Language | 所有图表共享的视觉语言，包括色彩、字体、布局、坐标轴、图例、标签和 Tooltip | `01-design-language/` |
| Chart Type | 单个图表组件类型，例如折线图、柱状图、漏斗图、散点图 | `02-chart-type/` |
| Pattern | 面向业务问题的图表组合和分析链路，例如经营分析、流量分析、商品分析 | `03-pattern/` |
| Adaptation | 将设计体系映射到 G2 / ECharts 等图表引擎的实现层规则 | `04-adaptation/` |
| Self Check | 交付前用于发现设计、代码和规范偏差的检查清单与反例 | `06-self-check/` |

## 3. 图表选型术语

| 术语 | 含义 | AI 使用规则 |
|---|---|---|
| 分析目标 | 用户真正要回答的问题，例如比较、趋势、占比、分布、关系、排名、流程 | 选图前必须先判断分析目标 |
| 数据结构 | 字段类型和字段角色的组合，包括维度、指标、时间、分组、层级、流向等 | 不得只凭图表名称选图 |
| Primary Intent | 图表最主要的分析意图 | 输出图表方案时必须明确 |
| Secondary Intents | 图表可以辅助表达的次要意图 | 只能作为补充，不得覆盖主意图 |
| Required Fields | 图表成立所需的必要字段 | 字段不足时不得直接定稿 |
| Optional Fields | 用于增强表达或交互的可选字段 | 不得把可选字段当作必需条件 |
| AI Warning | AI 生成该图表时容易误用的风险提示 | 生成和审查时必须检查 |

## 4. 数据字段术语

| 术语 | 含义 | 示例 |
|---|---|---|
| 维度字段 | 用于分组、分类、时间或空间定位的字段 | 日期、渠道、品类、地区 |
| 指标字段 | 用于度量大小、数量、比例或金额的字段 | GMV、订单量、转化率、客单价 |
| 时间字段 | 表达连续或离散时间点的字段 | 日、周、月、小时 |
| 分组字段 | 用于区分多系列或多类别的字段 | 渠道类型、用户分层 |
| 层级字段 | 表达父子、树状或钻取关系的字段 | 一级品类、二级品类、SKU |
| 流向字段 | 表达来源、去向和流量大小的字段 | source、target、value |
| 标记字段 | 表达目标、阈值、异常、事件或阶段的辅助字段 | target、threshold、event |

## 5. 视觉结构术语

| 术语 | 含义 | 主要引用 |
|---|---|---|
| chartFrame | 图表根容器，承载标题、图例、绘图区、轴和页脚 | `05-rules/vibedesign-rules.md` |
| headerFrame | 标题、说明和图例所在区域 | `05-rules/vibedesign-rules.md` |
| bodyFrame | 图表主体区域，包含坐标轴轨道和绘图区 | `05-rules/vibedesign-rules.md` |
| plotAreaFrame | 唯一的数据坐标空间，网格线、系列、标注和交互反馈必须以它为基准 | `05-rules/vibedesign-rules.md` |
| seriesLayer | 数据图形所在层，如线、柱、点、面积、节点和边 | `05-rules/vibedesign-rules.md` |
| annotationLayer | 静态标注、参考线、区间、关键点标签所在层 | `09-visual-enhancement/` |
| interactionLayer | hover、选中、框选、联动等交互反馈所在层 | `09-visual-enhancement/interaction-enhancement.md` |
| tooltipLayer | Tooltip 浮层所在层 | `01-design-language/tooltip.md` |

## 6. 视觉增强术语

| 术语 | 含义 | AI 使用规则 |
|---|---|---|
| 洞察标注 | 对最大值、最小值、最新值、异常点、拐点、事件点等关键对象的说明 | 必须有明确数据证据 |
| 高亮 | 强化重点对象、当前对象或选中对象的视觉手段 | 不得改变数据语义 |
| 弱化 | 降低非重点对象干扰的视觉手段 | 弱化后仍应可通过 Tooltip 读数 |
| 参考线 | 目标线、阈值线、均值线、基准线或预测线 | 必须说明业务含义 |
| 区间标记 | 活动区间、异常区间、阶段背景、风险区间或预测区间 | 必须绑定明确起止范围 |
| Callout | 对同比、环比、目标差、阶段差异、贡献差异等关系的解释说明 | 不得替代证据 |
| 置信度 | Agent 对增强判断依据完整性的标记 | 使用 `confirmed`、`partial`、`inferred`、`needs_spec` |

## 7. 设计与代码术语

| 术语 | 含义 | AI 使用规则 |
|---|---|---|
| VibeDesign | 面向 Figma / Relay / Zero 等设计工具的可编辑设计生成路径 | 必须输出可维护图层结构 |
| VibeCode | 面向 G2 / ECharts / SVG / Canvas / DOM 的运行时代码生成路径 | 必须输出可运行字段映射和主题绑定 |
| Theme Token | 图表元素绑定的主题变量 | 不得随机写死颜色、字号、间距 |
| Resolved Value | 当前 Light / Dark mode 下 token 解析后的显示值 | 输出样式时建议与 token 同时说明 |
| Engine Mapping | 设计语义到 G2 / ECharts 配置的映射关系 | 读取 `04-adaptation/` |
| Fallback Reference | Wiki 未明确定义时临时引用的成熟引擎默认实践 | 必须标记来源，不得写成正式规范 |

## 8. AI 使用规则

- 遇到中文业务词时，先查 `ai-file-index.md`，再查本文。
- 术语解释与具体规范冲突时，以具体规范为准。
- 本文未定义的业务指标口径不得由 AI 自行编造。
- 若术语涉及业务判断，例如异常、达标、健康、恶化，必须要求目标、阈值、历史基准、同类基准或用户明确口径。

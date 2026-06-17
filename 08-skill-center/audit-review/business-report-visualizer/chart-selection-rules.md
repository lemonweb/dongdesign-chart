# Chart Selection Rules

## 1. 规则来源

本文件是 `business-report-visualizer` 的报告场景适配规则，不重新定义 dongDesign Charts 的图表选型规范。

执行图表选型时必须优先参考：

```txt
02-chart-type/README.md
02-chart-type/capability-matrix.md
02-chart-type/selection-rules.md
02-chart-type/complexity-level.md
```

初步确定候选图表后，继续读取对应图表组件文档，例如：

```txt
02-chart-type/basic/bar-chart.md
02-chart-type/basic/line-chart.md
02-chart-type/basic/area-chart.md
02-chart-type/basic/pie-chart.md
02-chart-type/flow/funnel.md
02-chart-type/statistical/scatter.md
02-chart-type/statistical/heatmap.md
02-chart-type/composite/dual-axis.md
```

本文件只补充：如何把 Markdown 经营报告里的指标、表格和结论映射到 dongDesign Charts 的选型流程。

## 2. 选型总流程

报告可视化不得直接根据“趋势”“占比”“表格”等关键词选图。必须按 dongDesign Charts 的顺序执行：

```txt
业务问题
→ 分析意图 primary_intent
→ 次要意图 secondary_intents
→ 数据结构 data_shape
→ 查阅 capability-matrix.md
→ 筛选 1-3 个候选图表
→ 快速排除不适合图表
→ 查阅具体图表文档
→ 输出推荐图表、字段映射、替代方案和不推荐方案
```

每个图表必须回答一个明确的经营问题。表格只是数据容器，不是默认视觉表达。

## 3. Report IR 到分析意图

| Report IR 内容 | 常见业务问题 | primary_intent | secondary_intents |
|---|---|---|---|
| `executive_summary.key_metrics` | 当前经营状态是否正常？ | Monitoring | Comparison |
| `trend_analysis` | 指标随时间如何变化？异常从何时开始？ | Trend | Monitoring, Comparison |
| `channel_diagnosis` | 哪些渠道贡献最大或下滑最明显？ | Ranking | Comparison |
| `conversion_diagnosis` | 哪个环节流失最严重？ | Flow | Comparison, Monitoring |
| `competitor_analysis` | 本品相对竞品弱在哪里？ | Comparison | Multivariate, Ranking |
| `price_analysis` | 价格带是否有竞争力？ | Distribution | Comparison |
| `action_plan` | 下一步先做什么？ | Comparison | Multivariate |
| `quality_flags` | 哪些数据或结论有风险？ | Monitoring | Ranking |

## 4. Report IR 到数据结构

选图前必须从 Report IR 标注数据结构：

| 数据结构 | 判断字段 | 能力矩阵字段 |
|---|---|---|
| 类目比较 | category + value | Categorical |
| 时间序列 | time/date + value | Time Series |
| 多指标 | 多个 value / metric | Multi Measure |
| 连续数值关系 | x numeric + y numeric | Continuous |
| 分布 | bucket / range + count | Continuous |
| 流程转化 | stage + value 或 source/target/value | Flow Data |
| 层级构成 | parent/child/value | Hierarchical |

缺少对应字段时，不得选择依赖该结构的图表。例如没有时间字段时不得生成趋势图；没有 source/target 或阶段字段时不得生成桑基/漏斗类图表。

## 5. 报告场景推荐映射

下表是报告场景的候选建议，最终必须回到 `02-chart-type/capability-matrix.md` 确认能力分值和复杂度。

| 原始内容 | primary_intent | 数据结构 | 优先候选 | 备选 | 默认避免 |
|---|---|---|---|---|---|
| 核心指标表 | Monitoring | 多指标 + 状态 | 指标卡 / KPI Group | 迷你趋势图、进度条 | 强行图表化所有指标 |
| UV / GMV 趋势 | Trend | 时间序列 | 折线图 | 面积图、上下排列双趋势图 | 无业务关系的双轴图 |
| 多指标同周期趋势 | Trend | 时间序列 + 多指标 | 多折线图 | 小多图、上下排列趋势图 | 系列过多的面积图 |
| 流量来源表 | Ranking | 类目 + 数值 + 变化 | 横向条形图 | 柱状图、排行榜 | 饼图 |
| 渠道构成随时间变化 | Trend | 时间序列 + 分组 + 数值 | 堆叠面积图 | 百分比堆叠柱状图 | 普通饼图 |
| 搜索关键词表 | Ranking | 类目 + 数值 + 变化 | 横向条形图 / 排行榜 | 热力图、机会矩阵 | 复杂气泡图 |
| 竞品对比表 | Comparison | 类目 + 多指标 | 分组条形图 / 对比矩阵 | 热力图、评分卡 | 未标准化雷达图 |
| 价格区间 | Distribution | 区间 + 数量/销量 | 直方图 / 价格带分布 | 箱线图、条形图 | 饼图 |
| 转化链路 | Flow | 阶段 + 数值 | 漏斗图 | 路径步骤图、阶段条形图 | 没有阶段顺序的漏斗 |
| 流向归因 | Flow | source/target/value | 桑基图 | Flow Bar、漏斗图 | 数据不足时强行桑基 |
| 异常点说明 | Monitoring | 时间序列 + 标注 | 折线图 + annotation | 指标卡 + 趋势图 | 只用红色大字告警 |
| 行动建议优先级 | Comparison | 建议 + 影响 + 成本 | 影响 × 成本矩阵 | 优先级卡片、表格 | 无量化依据的象限图 |

## 6. 能力矩阵判定规则

候选图表必须满足：

```txt
primary_intent 在 Layer 1 中评分为 3，或在强约束场景下至少为 2
data_shape 在 Layer 2 中评分为 3，或至少为 2 且有清晰补充说明
Readability 不低于当前报告读者可接受水平
Hallucination Risk 可控
Runtime Fit 与输出目标匹配
```

默认优先选择能力矩阵中的 P0 图表：

```txt
Bar
Horizontal Bar
Line
Area
Pie / Donut（仅简单占比）
Scatter
Funnel
Histogram
```

条件推荐 P1 图表：

```txt
Bubble
Heatmap
Radar
Treemap
Waterfall
Boxplot
Gauge
Candlestick
```

高复杂 P2 图表只有在业务问题、数据结构和阅读价值都明确时使用：

```txt
Sankey
Sunburst
Parallel Coordinates
Chord
Network Graph
复杂复合图
```

## 7. 展示空间约束

报告布局会影响选型，必须结合 `bento-layout-rules.md` 判断空间。

| 展示空间 | 优先图表 | 避免 |
|---|---|---|
| 小卡片 | 指标卡、迷你趋势图、简化柱状图、进度条 | 桑基、多系列折线、复杂热力图、雷达图 |
| 标准分析卡 | 柱状图、条形图、折线图、面积图、堆叠柱、散点图、漏斗图、热力图 | 高交互复杂图 |
| 首屏总结区 | 指标卡、结论卡、迷你趋势 | 明细表、复杂关系图 |
| 移动端 | 指标卡、折线图、条形图、列表 | 复杂图例、密集标签、桑基图、多系列复杂图 |
| 长图报告 | 高可读图表、分段说明、固定图例 | 依赖 hover 才能理解的图表 |

## 8. 快速排除规则

沿用 `02-chart-type/selection-rules.md` 的全局排除规则，并在报告场景中强化：

- 不要默认使用饼图；分类过多、需要精确比较、需要趋势或多个对象比较构成时，改用条形图、百分比堆叠柱状图、矩形树图或表格。
- 不要滥用雷达图；维度过多、对象过多、指标未标准化、需要精确比较或排名时，改用热力图、评分卡、分组条形图或多指标表格。
- 不要滥用双轴图；两个指标没有明确业务关系、只是节省空间、单位不清晰或容易制造虚假相关时，改用上下排列趋势图、柱线混合图或指标卡 + 趋势图。
- 不要用复杂图表表达简单问题；简单比较优先柱状图、条形图、表格，简单趋势优先折线图和迷你趋势图。
- 不要在没有 source/target 字段时使用桑基图。
- 不要在没有阶段顺序时使用漏斗图。
- 不要生成没有字段映射说明的图表方案。

## 9. 单品诊断默认组合

单品经营诊断报告优先形成“核心状态 → 趋势证据 → 结构拆解 → 行动建议”的组合：

| 报告区块 | 推荐组件 / 图表 | 目的 |
|---|---|---|
| 首屏结论 | `InsightSummary` + `KpiGroup` | 快速说明经营状态与严重程度 |
| 趋势证据 | 折线图 / 多折线图 | 定位下滑或增长发生时间 |
| 渠道拆解 | 横向条形图 / 排行榜 | 找出拖累或贡献渠道 |
| 搜索关键词 | 排行榜 / 热力图 / 机会矩阵 | 找出关键词机会或承接缺口 |
| 价格与竞品 | 分组条形图 / 对比矩阵 / 热力图 | 说明价格、销量、评价等维度差异 |
| 转化链路 | 漏斗图 / 阶段条形图 | 定位流失环节 |
| 行动建议 | 优先级行动卡 / 影响 × 成本矩阵 | 给出下一步动作 |

## 10. 图表配置输出字段

Visual JSON 中每个图表组件必须包含：

```json
{
  "question": "这个图表回答的经营问题",
  "primary_intent": "Trend",
  "secondary_intents": ["Monitoring"],
  "data_shape": ["Time Series", "Multi Measure"],
  "chart_type": "line_chart",
  "capability_check": {
    "intent_score": 3,
    "data_shape_score": 3,
    "readability": "High",
    "hallucination_risk": "Low",
    "runtime_fit": "Native"
  },
  "field_mapping": {
    "x": "date",
    "y": ["uv", "gmv"],
    "color": "metric",
    "tooltip": ["date", "uv", "gmv"]
  },
  "reason": "为什么选择该图表",
  "alternatives": ["small_multiples", "stacked_area"],
  "not_recommended": [
    {
      "chart_type": "dual_axis",
      "reason": "两个指标单位不同且容易制造虚假相关，除非业务明确要求双轴"
    }
  ],
  "risk": "可能的误读或数据缺口"
}
```

## 11. 下游调用

当满足以下条件时，调用 `chart-selector-skill`：

- 图表类型存在争议。
- 用户指定图表与数据关系明显不匹配。
- 图表将进入正式设计稿或代码生产链路。
- 涉及复杂组合图、漏斗、桑基、双轴、雷达、热力图、气泡图等高误读或高实现风险图表。
- 能力矩阵中 `Hallucination Risk` 为 Medium / High，或 Runtime Fit 不是 Native。

调用下游时传递：

```txt
业务问题
primary_intent
secondary_intents
data_shape
候选图表
字段映射
展示空间
输出目标
已排除图表及原因
```

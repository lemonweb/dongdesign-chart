# Chart Selector Skill

## 1. 文档定位

本 Skill 用于根据业务问题、分析目标和数据结构选择合适的图表类型。

它回答：

> 当前需求应该优先使用哪一种或哪几种图表？为什么？哪些图表不应该使用？

本 Skill 属于 Execution Layer，不重新定义图表能力和设计规范，只负责读取 Wiki 中的图表选型规则、能力矩阵和具体图表文档，输出可交给 `chart-builder-skill` 的选型结果。

## 2. 触发场景

当用户表达以下意图时触发：

- “这个数据应该用什么图？”
- “帮我选一个合适的图表”
- “根据这些字段判断该用柱状图、折线图还是别的图”
- “我想在 Figma / Relay 里验证这个图表组件，先帮我判断图表类型”
- “帮我从 Wiki 里选一个最符合业务问题的图表”

如果用户已经明确指定图表类型，例如“生成一个折线图”，则可跳过本 Skill，直接进入 `chart-builder-skill`。但如果指定图表明显不匹配数据结构，本 Skill 应先给出风险提示。

## 3. 输入要求

最小输入：

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 业务问题 | 必需 | 用户要回答的问题，例如趋势、比较、占比、关系、分布 |
| 数据字段 | 必需 | 字段名、字段类型、单位、是否时间字段、是否分组字段 |
| 数据样例 | 推荐 | 用于判断字段粒度、分类数量、时间跨度、异常值 |
| 展示位置 | 可选 | 小卡片、标准分析卡片、大屏、移动端、报告页等 |
| 输出目标 | 可选 | Figma / Relay 设计验证、代码生成、文档建议、方案评审 |

如果用户没有提供字段信息，AI 应先从上下文推断；无法推断时，只输出候选方向和需要补充的信息，不给出最终图表结论。

## 4. 必读 Wiki 文件

### 4.1 默认必读

```txt
00-overview/how-to-use.md
00-overview/ai-reading-flow.md
00-overview/decision-tree.md
02-chart-type/README.md
02-chart-type/capability-matrix.md
02-chart-type/selection-rules.md
02-chart-type/complexity-level.md
```

### 4.2 候选图表必读

选出 1-3 个候选图表后，必须读取对应的具体图表文档。

示例：

```txt
02-chart-type/basic/line-chart.md
02-chart-type/basic/bar-chart.md
02-chart-type/statistical/scatter.md
```

如果候选图表文档为空或未完成，应标记为“规范不足”，不得把未完成文档当作完整依据。

## 5. 分析流程

```txt
1. 解析业务问题
2. 判断 primary_intent
3. 判断 secondary_intents
4. 识别字段角色和数据结构
5. 判断展示空间和运行目标
6. 读取能力矩阵筛选候选图表
7. 使用选型规则排除明显不合适图表
8. 读取候选图表具体文档确认适用 / 不适用场景
9. 生成最终推荐、替代方案和不推荐方案
10. 输出 chart-builder handoff packet
```

## 6. 判断维度

### 6.1 分析意图

必须明确：

| 字段 | 说明 |
|---|---|
| `primary_intent` | 当前图表最主要回答的问题 |
| `secondary_intents` | 兼顾的次要问题 |

可选意图：

```txt
comparison / trend / composition / distribution / relationship / flow / hierarchy / multivariate / monitoring / ranking
```

### 6.2 数据结构

必须识别：

| 字段角色 | 说明 |
|---|---|
| category | 分类字段 |
| time | 时间字段 |
| value | 数值字段 |
| group | 分组字段 |
| size | 规模字段 |
| source / target | 流向字段 |
| hierarchy | 层级字段 |
| status | 状态字段 |

### 6.3 展示约束

展示空间会影响选型。

| 场景 | 选型倾向 |
|---|---|
| 小卡片 | 指标卡、迷你趋势、简化柱状、简化条形 |
| 标准分析卡片 | 柱状、条形、折线、面积、散点、热力、漏斗 |
| 大屏 / 监控 | 指标卡、实时折线、Top 排名、告警列表 |
| 移动端 | 指标卡、折线、条形、环图、简化趋势 |

## 7. 推荐规则

### 7.1 默认优先简单图表

能用低复杂度图表回答问题时，不使用高复杂度图表。

```txt
Level 1 优先于 Level 2
Level 2 优先于 Level 3
复杂图表必须说明必要性
```

### 7.2 必须给出替代方案

最终输出必须包含：

- 推荐图表。
- 可选替代图表。
- 明确不推荐的图表和原因。

### 7.3 不得只看关键词

禁止行为：

- 看到“趋势”就直接选折线图。
- 看到“占比”就直接选饼图。
- 看到“多维”就直接选雷达图。
- 看到“关系”就直接选气泡图。

必须结合业务意图、字段结构、展示空间和具体图表文档共同判断。

## 8. 输出格式

执行完成后输出：

```txt
## 推荐图表
图表类型：
推荐等级：P0 / P1 / P2
主要分析目标：
次要分析目标：
选择理由：

## 数据字段映射
- x / category / time：
- y / value：
- group / color：
- size：
- tooltip：

## 选型证据
- 能力矩阵依据：
- 选型规则依据：
- 具体图表文档依据：

## 替代方案
- 方案 A：
- 方案 B：

## 不推荐方案
- 不推荐：
- 原因：

## Builder Handoff Packet
chart_type:
primary_intent:
secondary_intents:
data_fields:
display_context:
required_docs:
known_risks:
```

`Builder Handoff Packet` 是传给 `chart-builder-skill` 的标准输入。

## 9. 依赖 Skill

| Skill | 关系 |
|---|---|
| `chart-builder-skill` | 选型完成后，生成图表设计方案或组件结构 |
| `chart-appropriateness-reviewer` | 对复杂或争议选型进行复核 |
| `dashboard-planner-skill` | 当需求涉及多个图表或完整看板时，上游调用本 Skill |

## 10. 不负责事项

本 Skill 不负责：

- 在 Figma / Relay 中创建图表。
- 生成完整图表视觉方案。
- 生成 G2 / ECharts 代码。
- 维护图表组件文档。
- 替代具体图表文档中的限制规则。

## 11. 自查清单

输出前检查：

- 是否明确 primary_intent？
- 是否明确数据字段角色？
- 是否读取能力矩阵？
- 是否读取选型规则？
- 是否读取候选图表文档？
- 是否给出推荐、替代和不推荐方案？
- 是否说明图表复杂度和风险？
- 是否输出 `Builder Handoff Packet`？
- 是否避免只根据关键词选图？

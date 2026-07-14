# 可视化增强 Visual Enhancement

## 1. 目录定位

本目录用于沉淀跨图表类型的可视化增强规范，说明如何通过高亮、标注、参考线、区间、对比说明和交互反馈，让图表更容易读出关键洞察。

它回答：

> 在不改变数据事实、不破坏图表基础规范的前提下，哪些视觉增强可以帮助用户更快发现重点、理解变化和形成判断？

本目录属于 Knowledge Layer。它定义增强表达的原则、类型、边界和反模式，不直接替代单个图表类型规范、业务场景规范或 AI Skill 执行流程。

## 2. 使用时机

以下情况应读取本目录：

- 需要为图表增加关键点、异常点、最大值、最小值或最新值标注
- 需要表达目标线、阈值线、基准线、均值线或预警线
- 需要标记活动区间、异常区间、政策变化区间或阶段背景
- 需要突出某个系列、类别、区间或数据点，同时弱化非重点信息
- 需要为报告、看板或复盘图表增加洞察 callout
- 需要判断增强是否过度、误导、遮挡主体或破坏视觉层级

## 3. 建议拆分

本目录可持续扩展。建议优先按增强类型拆分：

```txt
09-visual-enhancement/
  README.md
  principle.md
  agent-workflow.md
  relationship-patterns.md
  enhancement-decision-tree.md
  data-evidence.md
  insight-annotation.md
  highlight.md
  reference-line.md
  mark-area.md
  comparison-callout.md
  interaction-enhancement.md
  density-and-declutter.md
  chart-type-mapping.md
  output-spec.md
  qa-checklist.md
  foundation-gaps.md
  anti-patterns.md
```

其中：

- `principle.md`：定义增强的总原则、层级和适用边界。
- `agent-workflow.md`：定义 Agent 从理解业务问题到输出增强方案的执行步骤。
- `relationship-patterns.md`：定义数据关系、状态判断和叙事重点如何驱动增强设计。
- `enhancement-decision-tree.md`：定义何时使用标注、高亮、参考线、区间、callout 或交互增强。
- `data-evidence.md`：定义增强表达需要的数据证据、置信度和禁止推断边界。
- `insight-annotation.md`：定义关键点、异常点、拐点、最新值等洞察标注。
- `highlight.md`：定义高亮、弱化、选中、hover 和聚焦策略。
- `reference-line.md`：定义目标线、阈值线、均值线、基准线。
- `mark-area.md`：定义活动区间、异常区间、阶段背景和风险区间。
- `comparison-callout.md`：定义同比、环比、目标差、竞品差等对比说明。
- `interaction-enhancement.md`：定义 hover、选中、联动、筛选等交互增强。
- `density-and-declutter.md`：定义密集图表中的抽样、隐藏、折叠和降噪策略。
- `chart-type-mapping.md`：定义不同图表类型适合使用的增强方式和禁用方式。
- `output-spec.md`：定义 Agent 输出增强方案时必须包含的结构化字段。
- `qa-checklist.md`：定义增强表达交付前的质量检查项。
- `foundation-gaps.md`：记录当前 Wiki 仍缺少的基础规范，避免 Agent 把推断当成明确规范。
- `anti-patterns.md`：定义过度装饰、误导性强调和无依据洞察等反模式。

## 4. 与其他目录的关系

本目录只定义通用增强表达。

- 具体图表中的增强细节：查阅 `../02-chart-type/`
- 颜色、字体、标签、Tooltip、坐标轴等基础视觉语言：查阅 `../01-design-language/`
- 业务页面和看板中的洞察链路：查阅 `../03-pattern/`
- G2 / ECharts 中的实现映射：查阅 `../04-adaptation/`
- AI 生成、审核和输出约束：查阅 `../05-rules/`
- 增强质量检查和反例：查阅 `../06-self-check/`
- 自动化执行 Skill：查阅 `../08-skill-center/`

## 5. 使用原则

- 可视化增强必须服务明确的业务问题或阅读任务。
- 增强不得改变、删减、夸大或虚构数据事实。
- 增强层级应低于数据主体，高于网格线和背景结构。
- 标注、参考线和区间必须说明业务含义，不能只作为装饰。
- 同一张图中增强类型应克制，优先突出最重要的 1-3 个信息点。
- 缺少数据证据时，只能提出增强机会，不得输出确定性洞察。
- 当增强规则与具体图表规范冲突时，优先遵守具体图表规范，并在文档中回流补充差异规则。

## 6. 初始读取顺序

建议读取：

1. `README.md`
2. `principle.md`
3. `relationship-patterns.md`
4. `enhancement-decision-tree.md`
5. `data-evidence.md`
6. `../01-design-language/label.md`
7. `../01-design-language/theme-token.md`
8. `../01-design-language/color.md`
9. `../01-design-language/axis.md`
10. `../06-self-check/design-checklist.md`
11. `foundation-gaps.md`

当基础规范缺失时，Agent 可以提出增强机会，但必须标记为 `inferred` 或 `needs_spec`，不得将推断写成 Wiki 已明确约束。

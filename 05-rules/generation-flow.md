# 图表生成流程 Generation Flow

## 1. 文档定位

本文约束 AI 从业务需求到图表设计、代码或审查结果的完整生成流程。

AI 不得仅根据目录分类、图表名称或用户偏好直接生成图表。必须先判断业务问题、数据结构和规范依据。

## 2. 总流程

```txt
用户需求
→ 识别任务类型
→ 判断业务问题
→ 判断数据结构
→ 读取 Wiki 规范
→ 选择图表与复杂度
→ 生成设计 / 代码 / 审查结果
→ 自查
→ 输出缺口与后续建议
```

## 3. 任务类型识别

| 任务类型 | 必读方向 |
|---|---|
| 图表选型 | `02-chart-type/capability-matrix.md`、`selection-rules.md`、`complexity-level.md` |
| 单图设计 | 具体图表文档 + `01-design-language/` |
| 业务看板 | `03-pattern/` + 相关图表文档 |
| G2 / ECharts 代码 | `04-adaptation/` + `06-self-check/code-checklist.md` |
| 视觉增强 | `09-visual-enhancement/` + 对应图表文档 |
| 设计审查 | `06-self-check/design-checklist.md` + 对应规范 |
| 文档维护 | `07-document-governance/` + `ai-file-index.md` |

## 4. 图表选择规则

AI 不得仅根据目录分类判断图表用途。

图表选择必须按照以下顺序：

1. 判断用户的主要分析目标：
   - 比较
   - 趋势
   - 占比
   - 分布
   - 关系
   - 排名
   - 流程
   - 多维评估

2. 判断数据结构：
   - 类目字段数量
   - 时间字段
   - 数值字段数量
   - 分组字段
   - 层级字段
   - 流向字段
   - 地理字段

3. 阅读 `02-chart-type/capability-matrix.md` 找到候选图表。

4. 阅读 `02-chart-type/selection-rules.md` 和 `02-chart-type/complexity-level.md`。

5. 阅读候选图表的具体文档，重点检查：
   - `primary_intent`
   - `secondary_intents`
   - `required_fields`
   - `optional_fields`
   - `ai_warning`
   - 适用场景和不适用场景

6. 根据任务目标选择图表：
   - 如果强调精确比较，优先使用柱状图、条形图、表格。
   - 如果强调趋势，优先使用折线图、面积图。
   - 如果强调构成变化，优先使用堆叠面积图、百分比堆叠图。
   - 如果强调变量关系，优先使用散点图、气泡图。
   - 如果强调多维画像，优先使用雷达图，但需要限制维度数量。
   - 如果强调路径流转，必须确认 source、target、value 等字段后再考虑桑基图。

## 5. 视觉生成流程

生成设计方案时必须：

1. 读取 `01-design-language/principle.md` 和 `layout.md`。
2. 按需读取 `theme-token.md`、`color.md`、`typography.md`、`axis.md`、`legend.md`、`label.md`、`tooltip.md`。
3. 建立 `chartFrame / headerFrame / bodyFrame / plotAreaFrame` 结构。
4. 将数据主体放入 `seriesLayer`。
5. 将参考线、标注、区间放入 `annotationLayer`。
6. 将 hover、选中、联动反馈放入 `interactionLayer`。
7. 检查图例、轴、标签、Tooltip 和标注是否重叠。

## 6. 代码生成流程

生成 G2 / ECharts 代码时必须：

1. 明确字段映射：`x / y / color / size / tooltip / series`。
2. 读取 `04-adaptation/theme-schema.md`。
3. 根据目标引擎读取 `g2-adapter.md` 或 `echarts-adapter.md`。
4. 如涉及跨引擎一致性，读取 `mapping-table.md`。
5. 绑定主题 token，不使用随机颜色、字号、线宽和阴影。
6. 输出空状态、加载态、异常态处理。
7. 使用 `06-self-check/code-checklist.md` 检查。

## 7. 缺口处理

当输入或 Wiki 规范不足时：

| 缺口 | 处理方式 |
|---|---|
| 缺少业务问题 | 先输出候选方向和需要确认的问题 |
| 缺少必要字段 | 不定稿，列出 required fields |
| 缺少目标 / 阈值 | 不判断达标、异常或风险 |
| 缺少主题 token | 标记 `needs_spec`，使用 fallback 时说明来源 |
| 具体图表文档为空 | 标记“规范不足”，不得当作完整依据 |
| 只有截图无数据 | 只能做近似结构分析，不虚构精确值 |

## 8. 输出要求

图表方案至少包含：

```yaml
task_type:
business_question:
chart_type:
complexity_level:
primary_intent:
required_fields:
field_mapping:
visual_rules:
interaction_rules:
wiki_refs:
risks:
missing_info:
next_action:
```

## 9. 禁止项

- 禁止跳过业务问题直接画图。
- 禁止字段不足时输出最终结论。
- 禁止复杂图表不说明必要性。
- 禁止使用 Wiki 未定义的随机样式。
- 禁止把图表库默认样式当作 dongDesign 规范。
- 禁止没有证据地输出异常、风险、达标、原因等判断。
- 禁止生成后不做设计或代码自查。

## 10. 自查清单

- 是否识别任务类型？
- 是否判断业务问题和数据结构？
- 是否读取能力矩阵、选型规则和复杂度分级？
- 是否读取具体图表文档？
- 是否读取必要视觉语言文档？
- 代码任务是否读取引擎适配文档？
- 是否说明缺口、风险和 fallback？
- 是否通过设计或代码自查清单？

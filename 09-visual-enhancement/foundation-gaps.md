# 基础规范缺口 Foundation Gaps

## 1. 文档定位

本文记录当前 Wiki 中仍不足以明确指导可视化增强的基础规范缺口。

这些缺口不阻止 Agent 提出增强机会，但涉及确定样式、状态判断或交互闭环时，必须标记 `needs_spec` 或 `inferred`。

## 2. 当前已有基础

| 已有规范 | 可支撑内容 |
|---|---|
| `01-design-language/label.md` | 数据标签、关键点标签、阈值标签、区间标签、引导线 |
| `01-design-language/theme-token.md` | mark-line、mark-area、series、toolbox 的 token 框架 |
| `01-design-language/tooltip.md` | Tooltip、hover 指示线、类目高亮矩形 |
| `01-design-language/axis.md` | 坐标轴、网格线、折线 hover 线 |
| `02-chart-type/basic/line-chart.md` 等 | 部分图表的标记、hover 和交互策略 |
| `05-rules/vibedesign-rules.md` | 图层结构、plotAreaFrame 和 annotationLayer 约束 |
| `06-self-check/design-checklist.md` | 通用设计走查基础 |

## 3. 缺口清单

| 缺口 | 影响 | 建议补齐位置 |
|---|---|---|
| 状态语义判定标准不足 | 无法稳定判断偏离、波动、异常、失衡、恶化 | `09-visual-enhancement/data-evidence.md` 或业务场景文档 |
| callout 组件样式不足 | 无法明确洞察 callout 的容器、间距、层级和位置 | `01-design-language/label.md` 或新增 callout 基础规范 |
| 选中态 / 联动态 token 不完整 | 跨图表联动、高亮、弱化缺少统一 token | `01-design-language/theme-token.md` |
| markArea 详细样式不足 | 区间背景的透明度、标签位置、重叠规则不够明确 | `01-design-language/theme-token.md`、`09-visual-enhancement/mark-area.md` |
| 参考线线型分级不足 | 目标线、均值线、阈值线、预测线容易混用 | `09-visual-enhancement/reference-line.md` 和 `04-adaptation/mapping-table.md` |
| 业务事件标注规范不足 | 活动上线、政策变化、版本发布等事件点缺少统一样式 | `09-visual-enhancement/insight-annotation.md` |
| 指标卡增强规范不足 | 目标差、趋势缩略、状态解释缺少系统规则 | `02-chart-type/other/statistics-card.md` |
| 表格增强规范缺失 | 条形背景、异常行、条件高亮、树形下钻缺少基础规范 | 建议新增表格可视化增强文档 |
| 跨载体联动规范缺失 | 图表、指标卡、表格、洞察卡之间的联动范围和反馈不明确 | `09-visual-enhancement/interaction-enhancement.md` 或 `05-rules/` |
| 下钻 / 面包屑 / 返回路径规范不足 | 层级探索难以形成一致体验 | `03-pattern/` 或交互增强专题 |
| AI 洞察证据展开规范不足 | AI 给出的原因、建议、验证路径缺少输出结构和 UI 承接 | `09-visual-enhancement/output-spec.md`、`08-skill-center/audit-review/` |
| 归因和因果表达规范不足 | 容易把相关性、贡献度和因果混淆 | 建议新增因果 / 归因表达规范 |
| 无障碍冗余编码规范不足 | 异常和风险只靠颜色时缺少统一替代编码 | `01-design-language/color.md`、`09-visual-enhancement/highlight.md` |

## 4. Agent 使用规则

- 涉及上述缺口时，Agent 可以给出建议，但必须标记 `needs_spec`。
- 如果已有图表类型文档已给出明确规则，优先使用具体图表规则。
- 如果业务方提供目标、阈值、异常规则或事件口径，可将置信度提升为 `confirmed`。


# pipeline/markdown-parser-rules · Markdown 解析

把输入的文字报告（Markdown/纯文本）解析为 Report IR（`report-ir-schema.json`）。

## 解析映射

| 源文本形态 | → IR |
|---|---|
| 一级标题 / "报告信息" 段（类型、对象、SKU、周期、状态） | `meta`（含 entity） |
| "核心结论 / A." 段（经营表现、问题定位、优化建议） | `summary`（sections + advices） |
| `## N. xxx` 一级标题 | 一个 `sections[]`，`level:1` |
| `### N.x xxx` | `level:2` 子模块 |
| 模块下 "诊断" 段落 | 该 section 的 `diagnosis` |
| 指标 + 数值 + 环比/同比/类目均值 表格或句子 | `blocks[].kind=kpi_group` |
| Markdown 表格（多列） | `blocks[].kind=table`，列 type 由表头语义判定（见下） |
| "趋势 / 走势 / 某日暴跌" 描述 | `blocks[].kind=chart`（line/line_dual），关键点入 annotations |
| "漏斗 / 曝光→点击→加购→订单" | `chart_type=funnel` |
| "贡献拆解 / 各维度对总量的正负贡献" | `chart_type=waterfall`（维度拆解，非公式） |
| "优化建议 / 应对措施" 列表 | `blocks[].kind=action_group` 或 summary.advices |
| "总结" 段 | `conclusion` |

## 列类型判定（table）

- 含"渠道/关键词/维度/名称" → `text`
- 纯数字、千分位 → `number`；带 ¥ → `currency`
- 含 % 且带 +/- 或"环比/变化" → `comparison`（表头有排序意味则 `comparison_sort`）
- "占比/进度" → `proportion`
- "质量/状态/判断" → `status`

## 注意

- **不新增源文本没有的字段**（如不自动加 1/2/3 序号）。
- 产品判定写入 `meta.product_mode`（见 `input-definition.md`）。
- 逐点趋势数据缺失时 `chart.illustrative=true`，渲染时注明"示意"。

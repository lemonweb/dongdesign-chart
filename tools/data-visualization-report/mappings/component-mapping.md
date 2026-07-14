# mappings/component-mapping · IR → 组件

把 Report IR 各部分稳定映射到 `modules/` 组件。

| IR 部分 | 组件（module） |
|---|---|
| `meta`（标题/周期/实体卡/装饰图） | `report-header` |
| `summary`（洞察摘要：sections + advices） | `diagnosis-advice`（全局摘要卡；含优化建议双列卡） |
| `sections[].diagnosis`（模块级结论） | `diagnosis-advice` 中的**局部诊断条** |
| `blocks.kind = kpi_group` | `kpi-card-group` |
| `blocks.kind = table` | `evidence-table` |
| `blocks.kind = chart` | `trend-analysis`（折线/柱/漏斗/瀑布/占比，走 `echarts-theme.json`） |
| `blocks.kind = action_group` | `action-card-group` |
| `conclusion` | 总结块（浅灰 fill-100 块，见 templates） |
| `disclaimer` | `report-footer`（白卡之外） |

## 装配顺序（默认）

由 `templates/data-interpretation-report.md` 决定：
`report-header → diagnosis-advice(洞察摘要) → [模块大白卡：sections 依次(标题+局部诊断条+blocks)] → 总结 → report-footer`。

## 组件选择判断

- 分析对象 < 3 → header 展示**实体卡**；≥ 3 → 展示为筛选条件，不用实体卡。
- 指标 + 数值 + 对比 → kpi-card-group；纯明细/多列对比 → evidence-table。
- 建议带优先级/时间 → action-card-group（P0/P1/P2）；洞察摘要内的优化建议用 diagnosis-advice 自带的双列建议卡（**与 action-card-group 不同**，见 modules 文档）。

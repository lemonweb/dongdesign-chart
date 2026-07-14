# modules · 可复用可视化组件范式

报告由以下组件按 `templates/data-interpretation-report.md` 的顺序装配。每个组件文档含：用途、结构、令牌、HTML 参考要点、触发的文字特征。

| 组件 | 文件 | 作用 |
|---|---|---|
| 报告头部 | `report-header.md` | 标题 / 统计周期 / 筛选条件 / 实体卡 / 右上装饰图；紫色渐变头融入 #FAFAFF |
| 全局摘要卡 + 局部诊断条 | `diagnosis-advice.md` | 顶部「洞察摘要」白卡（经营表现/问题定位/优化建议双列卡）；各模块标题下的局部诊断条 |
| KPI 指标卡 | `kpi-card-group.md` | 核心指标：京东正黑体大数值 + 单位 + 环比(+/-) + 类目对比(扩展区) + 状态提示 |
| 明细表格 | `evidence-table.md` | 多列结构化数据；列类型（文本/数值/金额/对比/占比/状态）；等比自适应 |
| 趋势 / 图表 | `trend-analysis.md` | 折线/双轴/柱/漏斗/瀑布/占比，走 ECharts jd 主题 + 分类色板 |
| 行动建议卡 | `action-card-group.md` | 优化建议：优先级 Tag(P0/P1/P2) + 标题 + 描述 + 预估提升 + CTA |
| 免责页脚 | `report-footer.md` | AI 免责声明；位于白卡之外、居中 |

## 约定

- 组件不写死颜色/字号/间距，一律引用 `rules/visual-style-rules.md`、`rules/bento-layout-rules.md` 的令牌。
- 涨跌色按产品开关；紫色仅用于联动交互。
- **注意区分**：洞察摘要内的"优化建议双列卡"（`diagnosis-advice.md`，76×28 白底次级按钮、无优先级）与独立的"行动建议卡组"（`action-card-group.md`，带优先级 Tag、52×24 按钮）是两种不同组件，勿混用。

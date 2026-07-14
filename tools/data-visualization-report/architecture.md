# architecture · 目录分层与扩展方式

本 Skill 采用分层结构：**入口薄、规则分层、组件可复用、模板可扩展**。SKILL.md 只做路由，细则下沉到各层。

## 一、规则分层原则

| 位置 | 负责内容 |
|---|---|
| `SKILL.md` | 触发场景、总流程、必读文件索引、输入输出骨架、跨 Skill 边界 |
| `architecture.md` | 目录分层、扩展方式、模块和模板新增规则 |
| `input-definition.md` · `report-ir-schema.json` | 输入契约 与 Report IR 机器可校验结构 |
| `pipeline/` | Markdown 解析、叙事重组、图表选型 |
| `mappings/` | IR → 组件、数据 → 视觉表达 的稳定映射 |
| `rules/` | 视觉（配色/字体）、布局、QA、运行时 Wiki 等横切规则 |
| `modules/` | 可复用可视化组件模块范式 |
| `templates/` | 页面级模板样式 profile |
| `examples/` | 输入 + 输出样例对 |
| `echarts-theme.json` | ECharts jd 主题 + 12 色分类色板（图表统一配色） |
| `assets/` | AI 星标图标；京东正黑体（KPI 数字，运行时优先用服务端 @font-face） |

## 二、目录树

```
data-visualization-report/
├─ SKILL.md                      入口 / 路由
├─ architecture.md               本文
├─ input-definition.md           输入契约
├─ report-ir-schema.json         中间表示 IR schema
├─ echarts-theme.json            图表主题 + 分类色板
├─ pipeline/                     解析 · 叙事 · 选型
│  ├─ markdown-parser-rules.md
│  ├─ narrative-rules.md
│  └─ chart-selection-rules.md
├─ mappings/                     IR→组件 · 数据→视觉
│  ├─ component-mapping.md
│  └─ data-to-visual-expression.md
├─ rules/                        横切规则
│  ├─ visual-style-rules.md      配色令牌 + 文本规范
│  ├─ bento-layout-rules.md      面板/栅格/白卡/间距
│  ├─ qa-checklist.md
│  └─ runtime-wiki-rules.md
├─ modules/                      组件范式
│  ├─ README.md
│  ├─ report-header.md
│  ├─ diagnosis-advice.md        全局摘要卡 + 局部诊断条
│  ├─ kpi-card-group.md          KPI 指标卡
│  ├─ evidence-table.md          明细表格
│  ├─ trend-analysis.md          趋势/图表
│  ├─ action-card-group.md       行动建议卡
│  └─ report-footer.md           AI 免责页脚
├─ templates/
│  ├─ README.md
│  └─ data-interpretation-report.md   页面级 profile
├─ examples/
│  └─ single-product-report/     input.md + report.html
└─ assets/                       ai-icon.svg · JDZhengHT-EN-Regular.ttf
```

## 三、扩展方式

- **新增组件**：在 `modules/` 加一份 `<name>.md`（用途 / 结构 / 令牌 / HTML 参考 / 触发的文字特征），并在 `mappings/component-mapping.md` 补一条"IR → 该组件"的映射；在 `modules/README.md` 登记。
- **新增图表类型**：在 `pipeline/chart-selection-rules.md` 补选型规则，颜色统一走 `echarts-theme.json`；如需专门范式在 `modules/trend-analysis.md` 或新 module 描述。
- **新增报告类型 / 页面模板**：在 `templates/` 加一份 profile（模块顺序、默认开关），不改组件与全局规则。
- **改配色 / 字体 / 间距**：只改 `rules/visual-style-rules.md`、`rules/bento-layout-rules.md`，组件不写死散值、一律引用令牌。
- **红绿产品开关**：属全局规则（`rules/visual-style-rules.md`），生成时按产品（对内/对外）统一切换，勿在组件内写死。

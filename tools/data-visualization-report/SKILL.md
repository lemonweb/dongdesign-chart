---
name: data-visualization-report
description: 把 AI 生成的文字版数据解读报告，转化为符合京东「东设计」规范的 HTML 可视化报告（业务/运营、财务、市场/调研）。当用户提供文字版数据分析/诊断/归因报告并希望生成可视化 HTML 时使用。
---

# data-visualization-report · 数据解读可视化报告

把一段**文字版数据解读报告**（AI 生成的指标分析 / 诊断 / 归因结论），转化为一份**符合「东设计」规范的 HTML 可视化报告**。

本 Skill 是**轻量执行入口**：不内置 dongDesign Chart Wiki 正文，也不把所有阶段细则堆在 SKILL.md 里，而是按需读取下方分层文件。

---

## 一、触发场景

- 用户给出文字版数据解读 / 诊断 / 归因报告（业务运营、财务、市场调研等），希望转成可视化 HTML。
- 关键信号："把这份报告做成可视化""生成 HTML 报告""按东设计出一版报告"。

## 二、总流程（Pipeline）

```
文字报告(输入)
  → ① 解析     pipeline/markdown-parser-rules.md   （Markdown → 结构化）
  → ② IR       input-definition.md + report-ir-schema.json （校验的中间表示）
  → ③ 叙事重组  pipeline/narrative-rules.md         （结论措辞 / 加粗 / 高亮 / 红绿）
  → ④ 组件映射  mappings/component-mapping.md        （IR → 用哪些 module）
  → ⑤ 图表选型  pipeline/chart-selection-rules.md    （数据 → 图表 + jd 主题）
  → ⑥ 视觉表达  mappings/data-to-visual-expression.md（数值 → 颜色/符号）
  → ⑦ 装配      templates/ + rules/bento-layout-rules.md（页面骨架 + 布局）
  → ⑧ 自检      rules/qa-checklist.md
  → HTML 可视化报告(输出)
```

## 三、必读文件索引

| 阶段           | 文件                                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 输入契约         | `input-definition.md`、`report-ir-schema.json`                                                                                                               |
| 解析 / 叙事 / 选型 | `pipeline/markdown-parser-rules.md`、`pipeline/narrative-rules.md`、`pipeline/chart-selection-rules.md`                                                       |
| 映射           | `mappings/component-mapping.md`、`mappings/data-to-visual-expression.md`                                                                                     |
| 横切规则         | `rules/visual-style-rules.md`（配色+字体）、`rules/bento-layout-rules.md`（布局）、`rules/qa-checklist.md`、`rules/runtime-wiki-rules.md`                                |
| 组件范式         | `modules/`（report-header / diagnosis-advice / kpi-card-group / evidence-table / trend-analysis / action-card-group / report-footer；总览见 `modules/README.md`） |
| 页面模板         | `templates/data-interpretation-report.md`（页面级 profile）、`templates/README.md`                                                                                |
| 图表主题         | `echarts-theme.json`（jd 主题 + 分类色板）                                                                                                                          |
| 参考成品         | `examples/single-product-report/`（input.md + report.html）                                                                                                   |
| 目录/扩展        | `architecture.md`                                                                                                                                           |

> **起手式**：先读 `architecture.md` 了解分层，再按总流程各阶段读取对应文件；生成前务必对照 `examples/single-product-report/report.html` 这一标准实现。

## 四、输入 / 输出骨架

- **输入**：一段文字数据解读报告（markdown 或纯文本）。含报告信息、核心结论、各分析模块（数据/趋势/流量/转化…）、明细表、优化建议、总结。
- **输出**：单个 `.html` 文件，保存到用户文件夹，用 `computer://` 链接交付。
- **不编造数据**：文字未提供的数据不虚构；缺值注明；源文档前后矛盾时忠实呈现并向用户指出。

## 五、两条关键规则（务必遵守）

1. **红绿配色按产品**（见 `rules/visual-style-rules.md`）：对内产品绿升红降 / 对外产品红升绿降，**可配置切换**，先判断产品再取色。
2. **忠实设计、不臆造元素**：只渲染源文本与规范中确有的内容，不自动加序号、图标、装饰等设计稿没有的元素。

## 六、跨 Skill 边界

- 本 Skill 只负责"**文字报告 → HTML 可视化**"。
- **取数**（从数据库/接口拿原始数据）由数据类 Skill 负责，产出文字/结构化结果后再交给本 Skill。
- **换输出格式**（PDF/PPT）由对应文档 Skill 负责；本 Skill 只产 HTML，可作为其输入。

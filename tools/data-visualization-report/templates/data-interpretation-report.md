# templates/data-interpretation-report · 数据解读报告模板

数据解读报告的**页面级 profile**：定义整页骨架与模块顺序。适用于单品诊断、大盘交易、归因分析等。参考实现见 `examples/single-product-report/report.html`。

## 一、页面骨架

```
面板 1000px（底色 #FAFAFF）
├─ report-header            紫色渐变头（融入 #FAFAFF）+ 装饰图（右缘 70px、底贴首卡）
├─ [正文区 padding 24 → 952]
│  ├─ 实体卡 / 洞察摘要卡     白卡（无描边）
│  └─ 模块大白卡（内容列 912，padding 20）  白卡（无描边）
│     ├─ section 1：模块标题(20/30) + 局部诊断条 + blocks(kpi/table/chart/action)
│     ├─ 1px 分割线（line-100，模块之间）
│     ├─ section 2 …（可含二级模块 2.x）
│     └─ 总结（浅灰 fill-100 块）
└─ report-footer            AI 免责声明（白卡之外，居中）
```

## 二、默认模块顺序

1. **report-header**（meta / 实体卡）
2. **diagnosis-advice**：洞察摘要卡（经营表现 → 问题定位 → 优化建议双列卡）
3. **模块大白卡**：按 IR `sections` 顺序，每个 = 模块标题 +（可选）局部诊断条 + 内容块
   - 核心数据 → kpi-card-group
   - 趋势分析 → trend-analysis（图表）
   - 流量/明细 → evidence-table（+ 关键词/投放等子表）
   - 转化 → trend-analysis(漏斗) + evidence-table(价格/竞争)
   - 各模块可跟 action-card-group（优化建议）
4. **总结**（conclusion，浅灰块）
5. **report-footer**

## 三、页面级令牌

| 项 | 值 |
|---|---|
| 面板宽 / 底色 | 1000px / #FAFAFF |
| 头部渐变 | `linear-gradient(180deg,#EFEDFF,#F4F2FF 45%,#FAFAFF)`（与面板底拼接） |
| 正文外边距 / 内容列 | 24px / 912px |
| 白卡 | #FFFFFF，圆角 8，**无描边**；卡间距 16 |
| 模块间分割线 | 1px line-100（#E6E7EB） |
| 总结块 | fill-100（#F7F8FA），圆角 6 |
| 装饰图 | 右缘 70px、底边贴首张白卡上缘、实际尺寸不拉伸 |

## 四、其它

- 分析对象 <3 → header 用实体卡；≥3 → 用筛选条件。
- 颜色按产品（对内/对外）统一切换；图表走 jd 主题。
- 交付前过 `rules/qa-checklist.md`。

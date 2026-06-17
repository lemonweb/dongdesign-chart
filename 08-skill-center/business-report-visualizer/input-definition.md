# Input Definition

## 1. 支持输入

本 Skill 支持以下输入形态：

| 输入形态 | 说明 | 处理方式 |
|---|---|---|
| 纯 Markdown 报告 | 标题、正文、表格、列表、结论与建议 | 直接解析为 Report IR |
| OCR 转写文本 | 来自图片或长图的识别文本 | 标注 `source_quality: ocr`，低置信内容不得当作事实 |
| Markdown + 数据表 | 报告正文附 CSV / JSON / 表格 | 以结构化数据为主，Markdown 为叙事来源 |
| 已有 IR JSON | 用户已提供中间层 | 校验 schema 后进入叙事与视觉阶段 |
| 已有 Visual JSON | 用户只要求渲染或审查 | 跳过解析，执行 QA 或渲染 handoff |

## 2. 必填字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `source_markdown` | string | 原始经营报告正文 |
| `report_goal` | string | 转成可视化报告的目标，例如复盘、诊断、监控、汇报 |

若缺失 `source_markdown`，必须停步索要。

## 3. 推荐字段

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `report_object` | string | `unknown` | 商品、店铺、活动、渠道、行业等 |
| `period` | string | `unknown` | 报告统计周期 |
| `audience` | string | `business_operator` | 目标读者 |
| `output_mode` | enum | `visual_json` | `ir_json`、`visual_json`、`html`、`react`、`figma_handoff` |
| `chart_engine` | enum | `unspecified` | `g2`、`echarts`、`svg`、`html` |
| `brand_theme` | string | `business_diagnosis_light` | 视觉主题 |
| `locale` | string | `zh-CN` | 输出语言 |

## 4. 输入质量标记

| 标记 | 使用场景 |
|---|---|
| `confirmed` | 原文清晰、字段可直接确认 |
| `inferred` | 从上下文推断，必须在输出中说明 |
| `unknown` | 无法识别或原文缺失 |
| `low_confidence_ocr` | OCR、小字、模糊截图或 ID 识别不可靠 |
| `conflicting` | 原文多处数据或日期互相冲突 |

## 5. 最小输入示例

```json
{
  "report_goal": "single_product_diagnosis",
  "source_markdown": "# 单品流量诊断报告\n\n本周期访客数下滑 28.6%，成交金额下滑 31.2%..."
}
```

## 6. 推荐输入示例

```json
{
  "report_goal": "single_product_diagnosis",
  "report_object": "冰岛普洱生茶 200g 珍藏版",
  "period": "2026-06-25 ~ 2026-07-01",
  "audience": "运营负责人",
  "output_mode": "html",
  "chart_engine": "echarts",
  "source_markdown": "..."
}
```

## 7. 输入不足处理

- 缺少报告正文：停步索要。
- 缺少报告对象：从标题或正文推断，标注 `inferred`。
- 缺少时间周期：写 `unknown`，不得自行补日期。
- 缺少目标读者：默认面向经营决策读者。
- 数据存在冲突：保留原始值，输出 `conflicts`，不擅自纠正。

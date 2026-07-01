# Component Mapping

## 1. 映射目标

将 Report IR 中的语义对象映射为可渲染的报告组件。组件名称保持稳定，便于 React / HTML / Figma / PPT 渲染器复用。

## 2. Markdown 到组件映射

| Markdown 内容类型 | IR 识别 | 推荐组件 |
|---|---|---|
| 标题 + 商品信息 | `report_meta` | `ReportHeader` |
| 核心结论段落 | `executive_summary` | `InsightSummary` |
| 指标表格 | `key_metrics` | `KpiGroup` |
| 同比 / 环比变化 | `metric.change` | `ChangeBadge` |
| 时间序列表格 | `trend_analysis` | `TrendChart` |
| 渠道数据表 | `channel_diagnosis` | `RankBarChart` |
| 竞品对比表 | `competitor_analysis` | `ComparisonMatrix` |
| 价格区间 | `price_analysis` | `PriceBandChart` |
| 转化链路 | `conversion_diagnosis` | `FunnelChart` / `PathSteps` |
| 问题清单 | `insights` | `DiagnosisCardGroup` |
| 优化建议 | `actions` | `ActionPlan` |
| 风险与缺口 | `quality_flags` | `RiskNotice` |

## 3. 组件契约

### ReportHeader

```json
{
  "type": "ReportHeader",
  "props": {
    "title": "单品流量诊断报告",
    "object": "冰岛普洱生茶 200g 珍藏版",
    "period": "2026-06-25 ~ 2026-07-01",
    "tags": ["单品诊断", "流量分析"]
  }
}
```

### InsightSummary

```json
{
  "type": "InsightSummary",
  "props": {
    "level": "high",
    "title": "流量与成交同步下滑",
    "description": "本周期访客数和成交金额均明显下滑，需优先排查搜索承接与价格竞争力。",
    "evidence_refs": ["metric_uv", "metric_gmv"]
  }
}
```

### KpiGroup

```json
{
  "type": "KpiGroup",
  "props": {
    "items": [
      {
        "label": "成交金额",
        "value": "¥45,600",
        "change": "-31.2%",
        "status": "negative",
        "source_ref": "table_core_metrics"
      }
    ]
  }
}
```

### Chart Component

所有图表组件共享字段：

```json
{
  "type": "TrendChart",
  "props": {
    "title": "UV 与 GMV 趋势",
    "question": "下滑从什么时候开始？",
    "chart_type": "line_chart",
    "data": [],
    "encoding": {
      "x": "date",
      "y": ["uv", "gmv"],
      "series": "metric"
    },
    "annotations": [],
    "evidence_refs": []
  }
}
```

### ActionPlan

```json
{
  "type": "ActionPlan",
  "props": {
    "items": [
      {
        "title": "优化搜索关键词承接",
        "priority": "high",
        "expected_impact": "提升自然搜索流量",
        "owner_hint": "运营",
        "evidence_refs": ["section_search"]
      }
    ]
  }
}
```

## 4. 状态映射

| IR polarity / severity | 视觉状态 |
|---|---|
| `positive` | `success` |
| `negative` + `critical` | `danger` |
| `negative` + `high` | `warning_high` |
| `negative` + `medium` | `warning` |
| `neutral` | `neutral` |
| `unknown` | `unknown` |

## 5. 组件输出要求

- 每个组件必须有稳定 `id`。
- 每个关键组件必须绑定 `evidence_refs` 或 `source_ref`。
- 每个图表必须包含 `question`。
- 不输出无数据支撑的装饰组件。
- 不把 `quality_flags` 隐藏，必须映射为风险提示或 QA 结果。

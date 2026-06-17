# Bento Layout Rules

## 1. 布局目标

用 Bento Layout 把经营报告组织成可扫描、可决策、可讲述的页面。布局必须先服务阅读顺序，再服务视觉均衡。

默认使用 12 栅格：

```txt
desktop: 12 columns
tablet: 6 columns
mobile: 1 column
```

## 2. 推荐页面结构

```txt
[Header 商品信息 + 报告周期]

[一屏结论区]
- 总体诊断结论
- 风险等级
- 3~5 个核心指标卡

[问题定位区]
- 趋势变化图
- 异常日期标注
- 关键变化解释

[原因拆解区]
- 流量来源拆解
- 搜索关键词表现
- 价格 / 竞品 / 转化对比

[行动建议区]
- 高优先级建议
- 中优先级建议
- 预期收益
- 对应证据
```

## 3. 区块优先级

| 优先级 | 区块 | 说明 |
|---|---|---|
| P0 | Header + InsightSummary | 必须首屏出现 |
| P0 | KpiGroup | 必须首屏出现 |
| P1 | TrendChart | 用于证明变化过程 |
| P1 | DiagnosisCardGroup | 用于收敛原因 |
| P1 | ActionPlan | 必须独立区域 |
| P2 | Channel / Competitor / Price / Funnel | 视报告内容出现 |
| P3 | DetailTable | 仅用于核对或附录 |

## 4. 栅格规则

| 组件 | desktop span | height | 说明 |
|---|---:|---|---|
| `ReportHeader` | 12 | compact | 页面头部 |
| `InsightSummary` | 12 | large | 一句话结论和风险等级 |
| `KpiGroup` | 12 | medium | 3~5 个指标卡 |
| `TrendChart` | 8 | large | 主趋势证据 |
| `DiagnosisCardGroup` | 4 | large | 原因摘要，与趋势并排 |
| `RankBarChart` | 6 | medium | 渠道/关键词排名 |
| `ComparisonMatrix` | 6 | medium | 竞品/价格对比 |
| `FunnelChart` | 6 | medium | 转化链路 |
| `ActionPlan` | 12 | large | 行动建议 |
| `RiskNotice` | 12 | compact | 风险与缺口 |

## 5. Visual JSON 布局格式

```json
{
  "layout": {
    "type": "responsive_bento",
    "columns": 12,
    "gap": 16,
    "sections": [
      {
        "id": "summary",
        "component_id": "insight_summary",
        "span": 12,
        "height": "large",
        "priority": 1
      }
    ]
  }
}
```

## 6. 移动端规则

- 单列堆叠，顺序按 `priority`。
- KPI 卡最多两列；空间不足时单列。
- 图表高度不得低于 240px。
- 复杂矩阵可降级为横向滚动表格。
- 行动建议不得折叠到不可见区域。

## 7. 布局禁忌

- 不先画卡片再决定阅读顺序。
- 不让低优先级明细表占首屏。
- 不让图表密度超过用户能扫描的范围。
- 不把行动建议作为尾注小字处理。
- 不为填满网格而增加无数据组件。

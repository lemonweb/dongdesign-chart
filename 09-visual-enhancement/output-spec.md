# 增强方案输出规范 Output Spec

## 1. 文档定位

本文定义 Agent 输出增强设计方案时必须包含的结构化字段、图层结构、数据证据和风险说明。

## 2. 输出结构

```yaml
visual_enhancement:
  business_question:
  relationship_type:
  state_judgement:
  narrative_focus:
  chart_or_carrier:
  enhancement_purpose:
  enhancement_items:
    - type:
      target:
      trigger:
      visual_rule:
      layer:
      evidence_source:
      confidence:
      wiki_refs:
      fallback_or_gap:
  interaction_followup:
  qa_result:
  risks:
```

## 3. enhancement_items 字段

| 字段 | 说明 |
|---|---|
| `type` | annotation / highlight / reference-line / mark-area / callout / interaction |
| `target` | 增强对象，例如某点、某系列、某区间、某行 |
| `trigger` | static / hover / selected / filtered / linked |
| `visual_rule` | 样式、位置、层级、token 绑定 |
| `layer` | seriesLayer / annotationLayer / interactionLayer / tooltipLayer |
| `evidence_source` | 数据字段、目标、阈值、基准、用户口径 |
| `confidence` | confirmed / partial / inferred / needs_spec |
| `wiki_refs` | 使用的 Wiki 文档路径 |
| `fallback_or_gap` | 兜底来源或基础规范缺口 |

## 4. 最小输出要求

Agent 至少必须输出：

- 增强服务的用户问题。
- 数据关系或状态判断。
- 增强元素及其位置。
- 使用的 Wiki 规范。
- 数据证据和置信度。
- 是否存在缺失规范。


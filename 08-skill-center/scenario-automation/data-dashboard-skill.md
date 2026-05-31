# Data Dashboard Skill

## 1. 文档定位

本 Skill 面向经营、流量、商品、店铺、行业等数据看板场景，把业务问题转化为看板蓝图 + 图表生成 + 代码落地的可执行链路。

它回答：

> 给定数据看板业务场景，如何端到端组合 Skill 完成从规划到落码的全过程？

本 Skill 是场景编排层，自身不绘图、不写代码，只调度 `dashboard-planner-skill`、`chart-selector-skill`、`chart-builder-skill`、`g2-codegen-skill` / `echarts-codegen-skill` 等执行 Skill。

## 2. 触发场景

- “帮我做一个商家经营看板”
- “这条业务线要一个流量诊断看板”
- “给一个商品健康度的标准看板模板”
- 由产品 / 业务侧通过自然语言触发，或被运营脚本批量召唤

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 业务域 | 必需 | 经营 / 流量 / 商品 / 店铺 / 行业 / 财务 |
| 业务目标 | 必需 | 看板用于支撑哪些决策 |
| 目标用户 | 必需 | 角色与场景 |
| 关键指标 | 必需 | 北极星指标与关键过程指标 |
| 数据源 | 推荐 | 字段、表、刷新频率 |
| 展示场景 | 推荐 | PC / 大屏 / 移动端 / 报告 |

## 4. 必读 Wiki 文件

```txt
03-pattern/README.md
03-pattern/business-analysis.md           # 缺失时按“规范不足”处理
03-pattern/transaction-analysis.md        # 缺失时按“规范不足”处理
03-pattern/traffic-analysis.md            # 缺失时按“规范不足”处理
03-pattern/product-analysis.md            # 缺失时按“规范不足”处理
02-chart-type/README.md
02-chart-type/capability-matrix.md
02-chart-type/selection-rules.md
05-rules/vibedesign-rules.md
_vibecode-projects/README.md
_vibecode-projects/30d-gmv-conversion/README.md
_vibecode-projects/30d-gmv-conversion/relay-design-scheme.md
```

## 5. 执行流程

```txt
1. 解析业务域与业务目标
2. 调用 dashboard-planner-skill 生成看板蓝图
3. 对每个区块调用 chart-selector-skill 确定图表类型
4. 调用 chart-builder-skill 生成区块设计方案
5. 视目标调用 g2-codegen-skill / echarts-codegen-skill 落码
6. 调用 visual-auditor-skill / code-review-skill 做尾端审查
7. 输出 Dashboard Delivery Packet：蓝图 + 设计方案 + 代码 + 风险
```

## 6. 编排维度

| 维度 | 说明 |
|---|---|
| 业务模式 | 与 `03-pattern/` 中的分析模式对齐 |
| 指标体系 | 区分北极星、过程、诊断指标 |
| 区块组合 | 借鉴 `_vibecode-projects/` 中的现成方案 |
| 图表组合 | 与 selector 配合，避免类型重复 |
| 复用 | 标注哪些组件 / 区块来自既有模板 |
| 数据契约 | 字段、单位、口径、刷新频率 |

## 7. 输出格式

```txt
## 场景概览
业务域：
业务目标：
目标用户：
展示场景：

## 看板蓝图
（来自 dashboard-planner-skill）

## 区块设计方案
- 区块 A：
  图表类型：
  设计方案要点：
  代码片段（如有）：
- 区块 B：

## 落码计划
- 引擎：
- 代码资产：
- 主题 Token：

## 审查结论
- visual-auditor-skill：
- code-review-skill：

## 风险与缺口
- 数据：
- 规范：
- 实施：
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `dashboard-planner-skill` | 看板规划 |
| `chart-selector-skill` | 图表选型 |
| `chart-builder-skill` | 区块图表设计方案 |
| `g2-codegen-skill` / `echarts-codegen-skill` | 区块落码 |
| `visual-auditor-skill` | 整体视觉一致性 |
| `code-review-skill` | 代码层审查 |

## 9. 不负责事项

- 不替代任何下游 Skill 的具体推理。
- 不修改业务后端数据。
- 不修改 Wiki 中的指标定义。
- 不绕过依赖检查 / 同步规划等治理流程。

## 10. 自查清单

- 是否明确业务域与业务目标？
- 是否对齐 `03-pattern/` 中的分析模式？
- 是否调用 dashboard-planner / selector / builder 全链路？
- 是否对每个区块都给出图表与设计方案？
- 是否输出代码资产与审查结论？
- 是否标注数据与规范风险？
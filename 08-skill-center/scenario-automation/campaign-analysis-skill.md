# Campaign Analysis Skill

## 1. 文档定位

本 Skill 面向营销活动场景（活动提报、活动监控、活动复盘、转化漏斗、人群洞察等），把营销业务问题转化为看板蓝图 + 图表生成 + 代码落地的端到端链路。

它回答：

> 给定一个营销活动场景，如何端到端组合 Skill 输出可落地的分析方案？

本 Skill 是场景编排层，自身不绘图、不写代码，只调度 `dashboard-planner-skill`、`chart-selector-skill`、`chart-builder-skill`、`g2-codegen-skill` / `echarts-codegen-skill` 等执行 Skill。

## 2. 触发场景

- “帮我做一个 618 大促复盘看板”
- “做一个活动漏斗分析模板”
- “营销活动人群洞察这块怎么排图”
- “给一个会员日活动监控看板”

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 活动阶段 | 必需 | 提报 / 预热 / 进行中 / 收尾 / 复盘 |
| 活动目标 | 必需 | GMV、UV、新客、转化率、ROI 等 |
| 目标用户 | 必需 | 运营、商家、业务负责人 |
| 关键指标 | 必需 | 北极星 + 过程指标 + 健康度指标 |
| 数据源 | 推荐 | 字段、口径、刷新频率 |
| 展示场景 | 推荐 | PC 看板 / 大屏 / 移动端 / 报告 |

## 4. 必读 Wiki 文件

```txt
03-pattern/README.md
03-pattern/campaign-analysis.md           # 缺失时按“规范不足”处理
03-pattern/transaction-analysis.md        # 缺失时按“规范不足”处理
03-pattern/traffic-analysis.md            # 缺失时按“规范不足”处理
02-chart-type/README.md
02-chart-type/capability-matrix.md
02-chart-type/selection-rules.md
02-chart-type/flow/funnel.md
05-rules/vibedesign-rules.md
_vibecode-projects/README.md
_vibecode-projects/30d-gmv-conversion/README.md
_vibecode-projects/30d-gmv-conversion/relay-design-scheme.md
```

## 5. 执行流程

```txt
1. 解析活动阶段与目标
2. 调用 dashboard-planner-skill 生成看板蓝图
3. 对漏斗、趋势、人群、商品、渠道等区块调用 chart-selector-skill
4. 调用 chart-builder-skill 生成区块设计方案
5. 视目标调用 g2-codegen-skill / echarts-codegen-skill 落码
6. 调用 visual-auditor-skill / code-review-skill 做尾端审查
7. 输出 Campaign Delivery Packet：蓝图 + 设计方案 + 代码 + 风险
```

## 6. 编排维度

| 维度 | 说明 |
|---|---|
| 阶段一致性 | 提报 / 进行中 / 复盘 三阶段的指标与图表组合差异 |
| 漏斗清晰度 | 漏斗节点定义、口径与图表表达是否对齐 |
| 趋势刻画 | 实时 / 当日 / 当周 / 自定义时间窗口 |
| 人群结构 | 新老客、人群标签、地域、渠道维度的图表选型 |
| 异常告警 | 是否设计关键异常预警区块 |
| 复盘回写 | 复盘结论是否回写到 `03-pattern/campaign-analysis.md` |

## 7. 输出格式

```txt
## 场景概览
活动阶段：
活动目标：
目标用户：
展示场景：

## 看板蓝图
（来自 dashboard-planner-skill）

## 区块设计方案
- 漏斗区块：
- 趋势区块：
- 人群区块：
- 商品 / 渠道区块：
- 异常告警区块：

## 落码计划
- 引擎：
- 代码资产：
- 主题 Token：

## 审查结论
- visual-auditor-skill：
- code-review-skill：

## 复盘回写
- 待回写到 03-pattern/campaign-analysis.md 的结论：

## 风险与缺口
- 数据口径：
- 规范缺口：
- 实施风险：
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `dashboard-planner-skill` | 看板规划 |
| `chart-selector-skill` | 图表选型，漏斗 / 趋势 / 人群图必经 |
| `chart-builder-skill` | 区块设计方案 |
| `g2-codegen-skill` / `echarts-codegen-skill` | 区块落码 |
| `visual-auditor-skill` | 视觉一致性 |
| `code-review-skill` | 代码层审查 |
| `data-dashboard-skill` | 与之并列，但 Campaign 场景更强调阶段化与漏斗 |

## 9. 不负责事项

- 不替代下游 Skill 的具体推理。
- 不替代业务侧 ROI 测算与口径定义。
- 不修改 Wiki 中的指标定义。
- 不绕过依赖检查 / 同步规划等治理流程。

## 10. 自查清单

- 是否明确活动阶段与目标？
- 是否覆盖漏斗、趋势、人群三大核心维度？
- 是否标注异常告警区块？
- 是否对每个区块输出图表与设计方案？
- 是否输出代码资产与审查结论？
- 是否标注需要回写到 `03-pattern/campaign-analysis.md` 的复盘结论？
- 是否标注数据口径与规范风险？
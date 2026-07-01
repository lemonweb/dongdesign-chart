# Dashboard Planner Skill

## 1. 文档定位

本 Skill 用于规划业务看板的信息架构、图表组合与阅读路径。

它回答：

> 给定业务目标与用户角色，看板应该包含哪些区块？区块之间怎么排布？每个区块用什么图表？阅读路径如何引导？

本 Skill 不直接绘制图表（由 `chart-builder-skill` 落稿），不替代选型（由 `chart-selector-skill` 完成），只负责规划层面的信息架构与组合。

## 2. 触发场景

- “帮我规划一个 30 天 GMV 转化看板”
- “这块业务要做经营看板，先列结构”
- “大屏内容怎么排？给一个分块方案”
- 由场景自动化 Skill（`data-dashboard-skill` / `campaign-analysis-skill`）作为上游调用

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 业务目标 | 必需 | 看板希望支撑的决策或动作 |
| 目标用户 | 必需 | 角色与使用场景 |
| 关键指标 | 必需 | 北极星指标、过程指标、健康度指标 |
| 数据可得性 | 推荐 | 字段是否齐备、刷新频率 |
| 展示场景 | 推荐 | PC 看板、大屏、移动端、报告 |
| 时间窗口 | 推荐 | 实时 / 日 / 周 / 月 / 自定义 |

## 4. 必读 Wiki 文件

```txt
00-overview/decision-tree.md
02-chart-type/README.md
02-chart-type/capability-matrix.md
02-chart-type/selection-rules.md
03-pattern/README.md
03-pattern/business-analysis.md           # 缺失时按“规范不足”处理
03-pattern/transaction-analysis.md        # 缺失时按“规范不足”处理
03-pattern/traffic-analysis.md            # 缺失时按“规范不足”处理
03-pattern/product-analysis.md            # 缺失时按“规范不足”处理
03-pattern/campaign-analysis.md           # 缺失时按“规范不足”处理
05-rules/vibedesign-rules.md
```

## 5. 执行流程

```txt
1. 解析业务目标与用户角色
2. 拆分指标层级：北极星 → 关键过程 → 诊断/明细
3. 划分区块：概览 / 趋势 / 结构 / 诊断 / 明细 / 异常告警
4. 为每个区块选择合适图表（调用 chart-selector-skill）
5. 设计阅读路径与跳转/钻取关系
6. 标注数据可得性与刷新频率
7. 输出 Dashboard Blueprint，逐区块给 builder 提供 handoff
```

## 6. 规划维度

| 维度 | 判断点 |
|---|---|
| 指标层级 | 是否区分北极星、过程、诊断指标 |
| 区块层次 | 是否区分概览、趋势、结构、诊断、明细、告警 |
| 阅读路径 | 是否有从全局到细节的顺序 |
| 图表组合 | 同区块图表类型是否互补、不重复 |
| 一致性 | 颜色、单位、时间窗口是否一致 |
| 数据可得性 | 缺失字段是否影响关键决策 |
| 移动 / 大屏适配 | 是否考虑差异化裁剪 |

## 7. 输出格式

```txt
## 看板蓝图
业务目标：
目标用户：
展示场景：
时间窗口：

## 指标体系
- 北极星指标：
- 关键过程指标：
- 诊断指标：

## 区块结构
| 区块 | 目的 | 推荐图表 | 关键字段 | 阅读路径位置 |
|---|---|---|---|---|

## 钻取与联动
- 区块 A → 区块 B：

## 数据契约
- 字段：
- 刷新频率：
- 缺失字段风险：

## 下游 Handoff
- chart-selector-skill 输入清单：
- chart-builder-skill 输入清单：

## 风险与缺口
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `chart-selector-skill` | 为每个区块选择图表 |
| `chart-builder-skill` | 区块图表落稿 |
| `data-dashboard-skill` | 数据看板业务场景上游 |
| `campaign-analysis-skill` | 营销分析场景上游 |
| `visual-auditor-skill` | 整体看板视觉一致性审查 |

## 9. 不负责事项

- 不直接绘制图表。
- 不替代图表选型推理。
- 不评估业务后端数据正确性。
- 不修改业务指标定义。

## 10. 自查清单

- 是否明确业务目标与目标用户？
- 是否区分指标层级？
- 是否给出区块结构与阅读路径？
- 是否对每个区块标注图表推荐与字段？
- 是否标注数据缺失风险？
- 是否产出可交付 builder 的逐区块 handoff？
- 是否避免越权选图（交给 selector）？
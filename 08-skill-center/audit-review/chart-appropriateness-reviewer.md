# Chart Appropriateness Reviewer

## 1. 文档定位

本 Skill 用于审查“当前图表选型是否与业务问题、数据结构和展示场景匹配”。

它回答：

> 这张图选得对吗？是否存在更合适或更简单的替代图表？为什么？

本 Skill 属于 Execution Layer，不重新定义图表能力和选型规则，只读取 Knowledge Layer 的选型与图表组件文档，输出审查结论与改造建议。

## 2. 触发场景

当用户表达以下意图时触发：

- “帮我看看这个图表用得合不合适”
- “这个数据用饼图 / 雷达图 / 漏斗 合理吗？”
- “我们要不要换一种图？”
- `chart-selector-skill` 给出复杂或争议选型，需要复核
- `chart-style-optimizer-skill` 发现类型与数据结构不匹配，需要回流复核

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 当前图表类型 | 必需 | 例如 line / bar / pie / radar / funnel |
| 业务问题 | 必需 | 用户希望回答的问题 |
| 数据字段 | 必需 | 字段名、类型、单位、分组维度 |
| 数据样例 | 推荐 | 用于判断分类数量、时间跨度、异常值 |
| 展示场景 | 推荐 | 看板卡片、大屏、移动端、报告页 |
| 既有选型理由 | 可选 | 用户或上游 Skill 提供的选型依据 |

输入不足时按 `skill-runtime-contract.md` 停步索要。

## 4. 必读 Wiki 文件

```txt
00-overview/decision-tree.md
02-chart-type/README.md
02-chart-type/capability-matrix.md
02-chart-type/selection-rules.md
02-chart-type/complexity-level.md
```

候选图表必读：

```txt
02-chart-type/basic/<chart>.md
02-chart-type/statistical/<chart>.md
02-chart-type/flow/<chart>.md
02-chart-type/composite/<chart>.md
```

## 5. 执行流程

```txt
1. 解析业务问题与 primary_intent
2. 识别数据字段角色与结构
3. 在能力矩阵中查找当前图表能力
4. 对照选型规则判断是否存在硬性禁用
5. 读取当前图表组件文档的“不适用场景”
6. 列出 1-3 个候选替代图表并复查能力
7. 给出最终结论：保留 / 替换 / 警示
8. 输出 Review Packet 与回流建议
```

## 6. 审查维度

| 维度 | 判断点 |
|---|---|
| 意图匹配 | 当前图表是否回答 primary_intent |
| 数据结构匹配 | 字段角色与图表所需结构是否一致 |
| 复杂度匹配 | 是否使用了不必要的高复杂度图表 |
| 可读性 | 分类数、序列数、时间跨度是否超出图表容量 |
| 业务可解释性 | 用户是否能用业务语言读出结论 |
| 风险点 | 是否触发明确禁用规则或反模式 |

## 7. 输出格式

```txt
## 审查结论
当前图表：
审查结果：保留 / 警示 / 替换
主要理由：

## 不匹配项
- 维度：
  现状：
  规范要求：
  风险：

## 替代方案
- 推荐图表：
  理由：
  数据字段映射：
- 备选图表：

## 证据
- 能力矩阵：
- 选型规则：
- 图表组件文档：

## 回流建议
- 回流 Skill：chart-selector-skill / chart-builder-skill / chart-style-optimizer-skill
- 传递信息：Builder Handoff Packet 或 Same-size Generation Packet
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `chart-selector-skill` | 替换图表时调用，重新执行选型 |
| `chart-builder-skill` | 替换图表后生成设计方案 |
| `chart-style-optimizer-skill` | 仅样式问题时回流到样式优化闭环 |
| `code-review-skill` | 当图表代码已实现，需要同步评估代码层风险 |

## 9. 不负责事项

- 不直接修改图表样式或代码。
- 不替代 `chart-selector-skill` 完成选型推理。
- 不为缺失字段补造业务数据。
- 不修改图表组件规范本身。

## 10. 自查清单

- 是否读取了能力矩阵、选型规则与当前图表组件文档？
- 是否给出了至少一个替代方案？
- 是否区分了“保留 / 警示 / 替换”三种结论？
- 是否避免了仅凭关键词判断？
- 是否标注了规范缺口和风险？
- 是否输出了下游 Skill 的回流建议？
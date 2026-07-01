# Code Review Skill

## 1. 文档定位

本 Skill 用于审查图表代码（G2 / ECharts）是否符合 Wiki 中的引擎适配、视觉语言、主题 Token 和可维护性规则。

它回答：

> 当前图表代码是否符合规范？哪些地方存在偏差？应该如何修复？

本 Skill 不重新定义代码规范，只读取 Knowledge Layer 中的引擎适配与代码规则，输出审查结论与修复建议。

## 2. 触发场景

- “帮我 review 一下这段 ECharts / G2 代码”
- “看看这段图表代码符不符合规范”
- “这段图表代码上线前要检查什么”
- 由 `g2-codegen-skill` / `echarts-codegen-skill` / `chart-style-optimizer-skill` 完成代码产出后自动回流

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 代码片段 | 必需 | 完整可运行的图表配置或组件代码 |
| 引擎类型 | 必需 | G2 / ECharts / 其他 |
| 图表类型 | 必需 | 用于读取对应组件文档 |
| 数据样例 | 推荐 | 用于判断字段映射与数据契约 |
| 设计目标 | 推荐 | `Visual Fidelity Packet`、`Wiki Compliance Packet`、`Same-size Generation Packet` 任一 |

## 4. 必读 Wiki 文件

```txt
04-adaptation/README.md
04-adaptation/g2-adapter.md          # 当引擎为 G2
04-adaptation/echarts-adapter.md     # 当引擎为 ECharts
04-adaptation/mapping-table.md       # 跨引擎对照（缺失时按“规范不足”处理）
04-adaptation/theme-schema.md        # 主题 Token Schema（缺失时按“规范不足”处理）
05-rules/vibecode-rules.md
05-rules/anti-patterns.md            # 缺失时按“规范不足”处理
06-self-check/code-checklist.md
01-design-language/theme-token.md
01-design-language/color.md
01-design-language/axis.md
01-design-language/legend.md
01-design-language/tooltip.md
01-design-language/typography.md
01-design-language/label.md
02-chart-type/<category>/<chart>.md
```

## 5. 执行流程

```txt
1. 识别引擎类型与图表类型
2. 读取对应引擎适配文档
3. 读取图表组件文档的“代码示例 / 配置要求”
4. 对照 vibecode-rules 与 code-checklist 逐项审查
5. 标注不符合项、风险项、建议项
6. 给出修复建议与修复后的最小可行代码片段
7. 输出 Review Packet 并按需回流到下游 Skill
```

## 6. 审查维度

| 维度 | 判断点 |
|---|---|
| 引擎适配 | API 用法是否符合 G2 / ECharts 当前版本与适配文档 |
| 主题 Token | 颜色、字号、间距是否走 token，而非硬编码 |
| 视觉语言 | 坐标轴、图例、标签、Tooltip 是否符合 `01-design-language/` |
| 数据契约 | 字段映射、空值处理、单位、缩放是否合理 |
| 可维护性 | 是否拆分配置与数据、是否有重复魔法值 |
| 性能 | 大数据量场景是否启用采样、虚拟化、增量渲染 |
| 无障碍 | 颜色对比度、键盘聚焦、屏幕阅读器文本是否到位 |
| 反模式 | 是否触发 `anti-patterns.md` 中的禁用项 |

## 7. 输出格式

```txt
## 审查结论
引擎：
图表类型：
总体结果：通过 / 警示 / 阻断

## 不符合项
- 维度：
  代码位置：
  现状：
  规范要求：
  修复建议：

## 修复后代码片段
```code
// 仅展示需要修改的最小片段
```

## 证据
- 引擎适配文档：
- 视觉语言文档：
- 代码规则：
- 图表组件文档：

## 回流建议
- 回流 Skill：g2-codegen-skill / echarts-codegen-skill / chart-engine-switcher-skill
- 传递信息：修复建议清单与目标 Token / API
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `g2-codegen-skill` | 修复 G2 实现 |
| `echarts-codegen-skill` | 修复 ECharts 实现 |
| `chart-engine-switcher-skill` | 切换引擎时联动 |
| `chart-appropriateness-reviewer` | 当代码层问题源于选型错误时回流 |
| `visual-auditor-skill` | 当代码层符合规范但视觉效果仍偏差时联动 |

## 9. 不负责事项

- 不直接生成全新图表代码（除最小修复片段）。
- 不重新选图。
- 不修改 Wiki 中的引擎适配规范。
- 不评估业务后端数据正确性。

## 10. 自查清单

- 是否读取了对应引擎的适配文档与代码规则？
- 是否覆盖了主题 Token、视觉语言、数据契约三大维度？
- 是否区分了“通过 / 警示 / 阻断”三种结论？
- 是否给出修复建议而非仅指出问题？
- 修复片段是否最小且可独立验证？
- 是否标注了规范缺口（如 `mapping-table.md` 为空）？
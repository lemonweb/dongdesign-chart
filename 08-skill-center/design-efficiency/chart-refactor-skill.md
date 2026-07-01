# Chart Refactor Skill

## 1. 文档定位

本 Skill 用于对已有图表进行重构，提升表达准确性、视觉一致性和可维护性。

它回答：

> 已有图表存在哪些可优化点？如何在不改变核心数据事实的前提下重构为更合规、更清晰的版本？

本 Skill 不重新选图（如有选型问题应回流到 `chart-selector-skill`），只在保留图表类型的前提下做结构、信息层级、视觉规范、交互的迭代。

## 2. 触发场景

- “帮我把这张图重构得更清晰”
- “这张图太杂，能不能精简一下”
- “按 Wiki 规范把这张图重做一版”
- 由 `chart-style-optimizer-skill` 在样式优化无法收敛时回流到本 Skill

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 原图源文件 | 必需 | Figma / Relay / 截图，需可读 |
| 图表类型 | 必需 | 用于读取组件文档 |
| 数据构成 | 必需 | 字段、序列、聚合方式 |
| 业务问题 | 必需 | 用于判断信息层级 |
| 展示位置 | 推荐 | 卡片、报告、大屏、移动端 |
| 既有问题清单 | 推荐 | 来自用户反馈或 Audit 结果 |

## 4. 必读 Wiki 文件

```txt
00-overview/decision-tree.md
02-chart-type/<category>/<chart>.md
01-design-language/color.md
01-design-language/axis.md
01-design-language/legend.md
01-design-language/label.md
01-design-language/tooltip.md
01-design-language/typography.md
01-design-language/theme-token.md
05-rules/vibedesign-rules.md
06-self-check/design-checklist.md      # 缺失时按“规范不足”处理
06-self-check/bad-cases.md             # 缺失时按“规范不足”处理
```

## 5. 执行流程

```txt
1. 还原原图意图与数据构成
2. 对照图表组件文档识别不合规项
3. 对照视觉语言识别样式偏差
4. 判断信息层级是否清晰（主信息 / 次信息 / 辅助信息）
5. 制定重构计划（保留 / 修改 / 删除 / 新增）
6. 生成重构后的设计方案（建议交由 chart-builder-skill 落稿）
7. 输出 Refactor Packet，含变更对照表
8. 必要时回流 chart-selector-skill / visual-auditor-skill
```

## 6. 重构维度

| 维度 | 判断点 |
|---|---|
| 数据事实 | 重构必须保留数据真实性，不得截断、缩放误导 |
| 信息层级 | 主次信息突出，辅助信息克制 |
| 视觉语言 | 颜色、字号、标签、轴线符合 Wiki 规范 |
| 交互 | Tooltip、Legend、Brush 是否符合场景需要 |
| 可维护性 | 图表结构是否模块化，便于后续替换 |
| 可读性 | 分类数、序列数、文字密度是否合理 |

## 7. 输出格式

```txt
## 重构结论
图表类型：
重构目标：

## 变更对照表
- 维度：
  原状态：
  新状态：
  理由：

## 重构后方案
- 图层 / 组件结构：
- 字段映射：
- 视觉规格：
- 交互：

## 下游 Handoff
- chart-builder-skill 输入：
- g2-codegen-skill / echarts-codegen-skill 输入：

## 风险与限制
- 数据事实保真：
- 规范缺口：
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `chart-builder-skill` | 重构后生成设计方案 |
| `chart-selector-skill` | 当重构发现图表类型不合适时回流 |
| `chart-style-optimizer-skill` | 样式微调级别的优化由它负责 |
| `visual-auditor-skill` | 重构后做最终视觉审查 |
| `g2-codegen-skill` / `echarts-codegen-skill` | 重构方案落代码 |

## 9. 不负责事项

- 不修改业务后端数据。
- 不生成全新图表代码（交给 codegen Skill）。
- 不擅自更换图表类型（交给 selector）。
- 不重写规范文档。

## 10. 自查清单

- 是否保留了数据事实？
- 是否给出了变更对照表？
- 是否覆盖信息层级与视觉语言两大维度？
- 是否产出可交给 builder 的方案？
- 是否标注了规范缺口？
- 是否避免越权改图表类型？
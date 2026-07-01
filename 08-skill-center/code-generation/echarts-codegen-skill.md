# ECharts Codegen Skill

## 1. 文档定位

本 Skill 用于根据 `chart-builder-skill` 的图表设计方案，生成符合 Wiki 规范的 ECharts 配置或组件代码。

它回答：

> 给定图表类型、字段映射、视觉规格，如何生成可直接使用的 ECharts 实现？

本 Skill 不重新选图、不重新设计视觉，只读取 Knowledge Layer 的 ECharts 适配规则与视觉语言，把上游 Handoff Packet 转译为 `option` 或封装组件。

## 2. 触发场景

- “帮我生成一段 ECharts 折线 / 柱状 / 漏斗代码”
- “把这个 builder 输出落到 ECharts”
- “这个看板要用 ECharts，先给我图表 option”
- 由 `chart-builder-skill` / `chart-style-optimizer-skill` 下游自动调用

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| Builder Handoff Packet | 必需 | 来自 `chart-builder-skill` 的标准方案 |
| Visual Fidelity Packet | 必需 | 字号、间距、颜色、Tooltip、Legend shape 等可验证约束 |
| 数据契约 | 必需 | 字段名、类型、单位、空值策略 |
| 运行目标 | 推荐 | Demo / Story / 业务组件 / 大屏 |
| 主题 Token | 推荐 | 来自 `01-design-language/theme-token.md` |

输入不完整时按 `skill-runtime-contract.md` 停步并向上游回流。

## 4. 必读 Wiki 文件

```txt
04-adaptation/README.md
04-adaptation/echarts-adapter.md
04-adaptation/mapping-table.md           # 缺失时标注“规范不足”
04-adaptation/theme-schema.md            # 缺失时标注“规范不足”
05-rules/vibecode-rules.md
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
1. 读取 Builder Handoff Packet 与 Visual Fidelity Packet
2. 读取 echarts-adapter.md 中的图表实现规范
3. 读取对应图表组件文档的“ECharts 实现要点”
4. 解析主题 Token，建立颜色、字号、间距映射
5. 生成 ECharts option（含 series / xAxis / yAxis / legend / tooltip / grid）
6. 生成数据契约示例与类型定义
7. 执行 code-checklist 自查
8. 输出 option、Token 映射表与已知风险
```

## 6. 生成规则

| 规则 | 说明 |
|---|---|
| Token 优先 | 颜色、字号、间距通过主题注册或外部传入，不硬编码 |
| Option 结构化 | series、axis、legend、tooltip、grid 各自分块，可独立替换 |
| dataset 优先 | 优先使用 `dataset` 描述数据，避免在 `series.data` 中堆叠 |
| 字段映射显式化 | `encode` 必须列出全部字段角色 |
| 空值与缺失值 | 用 `null` 表示缺失，标注断点策略 |
| 数据量提示 | 大数据量启用 `dataZoom`、`sampling`、`progressive` |
| 主题挂载 | 使用 `echarts.registerTheme` 注册一次，不在 option 中重复硬编码 |
| 命名 | 函数 / 组件名 PascalCase，文件 kebab-case |

## 7. 输出格式

```txt
## 概览
图表类型：
ECharts 版本：
依赖：

## Option
```ts
const option = { ... };
```

## 代码
```ts
// 组件封装（含主题注册与销毁）
```

## Token 映射
- color.brand → series.itemStyle.color
- font.size.label → axis label fontSize

## 数据契约
```ts
type ChartData = { ... }
```

## 已知风险
- 字段缺失：
- 数据量：
- 浏览器兼容：

## 自查结论
- code-checklist 是否通过：
- vibecode-rules 是否通过：
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `chart-builder-skill` | 上游，提供 Handoff Packet |
| `code-review-skill` | 下游，审查生成代码 |
| `chart-engine-switcher-skill` | 切换到 G2 或其他引擎时调用 |
| `code-snippet-builder-skill` | 当目标是片段或模板而非完整组件时联动 |

## 9. 不负责事项

- 不重新选图。
- 不修改 Wiki 适配规范。
- 不引入未在 Wiki 注册的第三方库。
- 不生成与设计方案冲突的视觉效果。

## 10. 自查清单

- 是否读取 `echarts-adapter.md` 与图表组件文档？
- Token 是否全部走 `01-design-language/theme-token.md`？
- 是否优先使用 `dataset` + `encode`？
- 空值、缺失值是否使用 `null` 并标注断点策略？
- 是否调用 `dispose` 处理组件销毁？
- 是否输出 Token 映射表？
- 是否标注了已知风险与规范缺口？
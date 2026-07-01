# Code Snippet Builder Skill

## 1. 文档定位

本 Skill 用于生成可复用的图表代码片段、示例和模板，作为 Wiki 中图表组件文档与脚手架项目的代码资产。

它回答：

> 当前图表类型 / 场景，应该沉淀哪些片段、示例或模板？如何让它们既轻量又能直接落地？

本 Skill 不替代完整组件落地（由 `g2-codegen-skill` / `echarts-codegen-skill` 负责），只生成片段级别的可复用资产。

## 2. 触发场景

- “给我一个 ECharts 折线最小示例”
- “整理一份柱状图标准片段，用于文档”
- “帮我把这个图做成 Storybook story”
- 由 `wiki-maintainer-skill` 在补齐图表组件文档时调用

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 引擎类型 | 必需 | G2 / ECharts |
| 图表类型 | 必需 | 用于读取组件文档 |
| 片段用途 | 必需 | Wiki 示例 / Storybook / 业务 Demo / Relay 物料 |
| 数据契约 | 必需 | 字段与示例数据 |
| 主题 Token | 推荐 | 默认使用 Wiki 主题 Token |

## 4. 必读 Wiki 文件

```txt
04-adaptation/g2-adapter.md
04-adaptation/echarts-adapter.md
05-rules/vibecode-rules.md
06-self-check/code-checklist.md
01-design-language/theme-token.md
02-chart-type/<category>/<chart>.md
07-document-governance/chart-component-writing-guide.md
```

## 5. 执行流程

```txt
1. 明确片段用途与目标引擎
2. 读取图表组件文档与对应适配规则
3. 准备最小可运行示例数据
4. 生成代码片段（含数据、配置、最少必要交互）
5. 生成片段说明、Token 映射、可替换变量列表
6. 输出 Snippet Packet
```

## 6. 片段规则

| 规则 | 说明 |
|---|---|
| 最小可运行 | 片段必须能复制即跑 |
| 单文件优先 | 用于文档时尽量单文件，复杂示例拆分 |
| 数据外置 | 把示例数据抽到独立常量，便于替换 |
| Token 显式 | 明确标注片段使用的 Token，便于二次主题化 |
| 复用模板化 | 关键参数（数据、字段、颜色）可通过变量替换 |
| 注释克制 | 仅注释关键意图，不重复 API 文档 |

## 7. 输出格式

```txt
## 片段概览
引擎：
图表类型：
用途：
依赖：

## 代码
```ts
// 最小可运行片段
```

## 示例数据
```ts
const data = [ ... ];
```

## Token 映射
- color.brand → ...
- font.size.label → ...

## 可替换变量
- chartTitle:
- xField:
- yField:
- seriesField:

## 使用说明
- 嵌入位置：
- 是否可直接用于 Wiki 示例：
- 是否可直接用于 Storybook：
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `g2-codegen-skill` | 复用 G2 生成规则 |
| `echarts-codegen-skill` | 复用 ECharts 生成规则 |
| `wiki-maintainer-skill` | 把片段写入 Wiki 文档 |
| `doc-scaffold-skill` | 补齐图表组件示例章节 |

## 9. 不负责事项

- 不生成完整业务组件。
- 不替代图表选型与设计方案。
- 不引入未在 Wiki 注册的第三方依赖。
- 不修改图表组件规范本身。

## 10. 自查清单

- 片段是否最小可运行？
- 数据是否抽离为常量？
- Token 是否显式标注？
- 是否标注了可替换变量？
- 是否说明了用途（Wiki / Story / Demo）？
- 是否避免重复 API 文档？
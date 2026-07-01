# Chart Engine Switcher Skill

## 1. 文档定位

本 Skill 用于在 G2 与 ECharts 之间迁移同一张图表的实现，保留设计意图、数据契约和视觉规范。

它回答：

> 这段 G2 / ECharts 实现，迁移到另一引擎后应该怎么写？哪些差异需要权衡？

本 Skill 不重新选图、不调整视觉规范，只读取 Knowledge Layer 中的两套适配规则与跨引擎映射表，输出迁移结果与差异说明。

## 2. 触发场景

- “把这段 G2 改成 ECharts”
- “这段 ECharts 给我换成 G2 实现”
- “项目要从 G2 切到 ECharts，先迁移这几张图”
- 由 `code-review-skill` 发现引擎不匹配项目主线时触发

## 3. 输入要求

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 源引擎代码 | 必需 | 完整可运行示例 |
| 源引擎类型 | 必需 | G2 / ECharts |
| 目标引擎类型 | 必需 | G2 / ECharts |
| 图表类型 | 必需 | 用于查找组件文档 |
| 数据契约 | 必需 | 字段、类型、单位 |
| Visual Fidelity Packet | 推荐 | 用于保留视觉细节 |

## 4. 必读 Wiki 文件

```txt
04-adaptation/README.md
04-adaptation/g2-adapter.md
04-adaptation/echarts-adapter.md
04-adaptation/mapping-table.md           # 缺失时按“规范不足”处理，输出迁移风险
04-adaptation/theme-schema.md            # 缺失时按“规范不足”处理
05-rules/vibecode-rules.md
06-self-check/code-checklist.md
01-design-language/theme-token.md
01-design-language/axis.md
01-design-language/legend.md
01-design-language/tooltip.md
02-chart-type/<category>/<chart>.md
```

## 5. 执行流程

```txt
1. 解析源引擎代码，抽取 encode / axis / legend / tooltip / data / theme
2. 在 mapping-table.md 中查找等价配置（缺失时显式标注）
3. 调用目标引擎对应 codegen 规则生成目标实现
4. 比对源与目标的视觉表达，记录差异点
5. 输出目标代码、差异说明与未覆盖项
6. 必要时回流 code-review-skill 与 visual-auditor-skill
```

## 6. 迁移规则

| 维度 | 规则 |
|---|---|
| 数据契约 | 字段名与单位保持一致，不擅自重命名 |
| 字段映射 | `encode` / `series.encode` 一一对齐 |
| 视觉规范 | Token 映射通过 `theme-schema.md`，不硬编码 |
| 交互 | Tooltip、Legend、Brush、Zoom 在两端都需保留语义 |
| 性能 | 大数据量场景按目标引擎规则调整（采样 / progressive） |
| 不支持项 | 如果目标引擎不支持源引擎某能力，必须显式标注并给出替代方案 |

## 7. 输出格式

```txt
## 迁移概览
源引擎：
目标引擎：
图表类型：
是否依赖 mapping-table：

## 目标代码
```ts
// 完整目标实现
```

## 差异说明
- 维度：
  源行为：
  目标行为：
  影响：
  替代方案：

## Token 映射
源 Token → 目标 Token

## 风险与未覆盖项
- 不支持能力：
- 视觉差异：
- 性能差异：

## 回流建议
- 回流 Skill：code-review-skill / visual-auditor-skill
```

## 8. 依赖 Skill

| Skill | 关系 |
|---|---|
| `g2-codegen-skill` | 目标为 G2 时复用其生成规则 |
| `echarts-codegen-skill` | 目标为 ECharts 时复用其生成规则 |
| `code-review-skill` | 迁移后审查 |
| `visual-auditor-skill` | 视觉是否仍符合规范 |

## 9. 不负责事项

- 不重新选图。
- 不重写设计规范。
- 不替代 Wiki 中的引擎适配定义。
- 不引入未在 Wiki 注册的第三方库。

## 10. 自查清单

- 是否读取了两个引擎的适配文档？
- mapping-table 是否覆盖当前迁移需求？缺失时是否标注？
- Token 映射是否完整？
- 是否列出了无法等价迁移的能力？
- 是否输出 Token 映射表与差异说明？
- 是否未擅自更改数据契约或图表类型？
# 使用说明 How to Use

## 1. 文档定位

本文是数据可视化 Wiki 的入口说明，用于帮助人和 AI 快速理解：

> 这套 Wiki 是什么、如何读取、如何协作、如何把知识转化为设计和代码结果。

本文不定义主题样式、颜色、字体、组件细节，也不依赖任何视觉变量。视觉规则请读取 `01-design-language/`。

## 2. 项目目标

本 Wiki 的目标是沉淀一套可被 AI 稳定读取、复用和执行的数据可视化知识体系。

它服务于三类工作：

- **VibeDesign**：帮助 AI 生成符合规范的可视化设计方案。
- **VibeCode**：帮助 AI 生成 G2 / ECharts 等图表代码。
- **CodeX 自动化**：帮助 AI 按固定目录、规则和技能完成文档维护、图表生成、审核和同步。

这套 Wiki 不是单纯的设计规范，也不是单纯的代码片段库，而是连接业务问题、图表知识、视觉语言、工程实现和自动化执行的知识层。

## 3. 架构共识

当前 Wiki 采用两层架构：

```txt
Knowledge Layer 知识层
→ Execution Layer 执行层
```

### 3.1 Knowledge Layer 知识层

知识层回答：

> 什么场景下应该怎么设计、怎么选图、怎么表达、怎么判断对错？

包含目录：

| 目录 | 职责 |
|---|---|
| `00-overview/` | 全局入口、读取顺序、选型决策树、术语 |
| `01-design-language/` | 颜色、字体、间距、坐标轴、图例、标签、Tooltip 等视觉规则 |
| `02-chart-type/` | 单个图表类型的能力、结构、适用场景和限制 |
| `03-pattern/` | 面向业务问题的图表组合与页面模式 |
| `04-adaptation/` | G2 / ECharts 等代码实现映射 |
| `05-rules/` | AI 生成、审核、约束和输出规则 |
| `06-self-check/` | 示例、反例、检查清单和质量评估 |
| `07-document-governance/` | 文档写法、命名、依赖和维护规则 |
| `09-visual-enhancement/` | 跨图表类型的高亮、标注、参考线、区间和洞察增强规范 |

### 3.2 Execution Layer 执行层

执行层回答：

> AI 应该调用什么技能、按什么顺序完成任务、如何把知识转化为自动化动作？

包含目录：

| 目录 | 职责 |
|---|---|
| `08-skill-center/` | Skill 注册、依赖、运行契约和自动化技能说明 |

执行层不重新定义知识，只引用知识层。Skill Center 中的技能应像“执行入口”一样读取 Wiki，而不是把规范复制一份。

## 4. 使用原则

使用本 Wiki 时遵循以下原则：

1. 先判断业务问题，再选择图表类型。
2. 先读取全局规则，再读取具体图表文档。
3. 先绑定变量和规范，再生成视觉或代码。
4. 先生成可解释结果，再做自动化执行。
5. 任何图表输出都应能说明：为什么选这个图、使用了哪些规则、是否通过自查。

AI 不应跳过上下文直接生成结果。

## 5. 人类使用方式

### 5.1 第一次了解项目

推荐读取：

1. `00-overview/README.md`
2. `00-overview/how-to-use.md`
3. `00-overview/ai-reading-flow.md`
4. `00-overview/decision-tree.md`

### 5.2 想知道某个场景该用什么图

推荐读取：

1. `00-overview/decision-tree.md`
2. `02-chart-type/README.md`
3. `02-chart-type/capability-matrix.md`
4. 对应图表类型文档

### 5.3 想统一图表视觉风格

推荐读取：

1. `01-design-language/README.md`
2. `01-design-language/theme-token.md`
3. `01-design-language/color.md`
4. `01-design-language/typography.md`
5. 与任务相关的视觉组件文档，例如坐标轴、图例、标签、Tooltip。

### 5.4 想增强图表洞察表达

推荐读取：

1. `09-visual-enhancement/README.md`
2. `09-visual-enhancement/principle.md`
3. `09-visual-enhancement/relationship-patterns.md`
4. `09-visual-enhancement/enhancement-decision-tree.md`
5. `01-design-language/label.md`
6. `01-design-language/theme-token.md`
7. 对应图表类型文档
8. `06-self-check/design-checklist.md`

### 5.5 想生成代码

推荐读取：

1. `00-overview/decision-tree.md`
2. 对应图表类型文档
3. `04-adaptation/README.md`
4. 对应引擎适配文档，例如 G2 或 ECharts
5. `06-self-check/`

### 5.6 想维护或扩展 Wiki

推荐读取：

1. `07-document-governance/general-writing-principles.md`
2. 对应目录的写法原则
3. `08-skill-center/registry.md`
4. `08-skill-center/dependency-map.md`

## 6. AI 使用方式

AI 使用本 Wiki 时，应按任务类型建立读取链。

### 6.1 默认读取链

```txt
00-overview/README.md
→ 00-overview/how-to-use.md
→ 00-overview/ai-reading-flow.md
→ 00-overview/decision-tree.md
```

### 6.2 图表设计任务

```txt
业务问题
→ 图表选型决策树
→ 图表模式文档
→ 视觉语言文档
→ 示例自查
→ 输出设计建议
```

AI 输出应包含：

- 业务意图判断。
- 推荐图表类型。
- 选择理由。
- 使用的视觉规则。
- 风险与限制。

### 6.3 图表代码任务

```txt
业务问题
→ 图表选型
→ 图表模式文档
→ 视觉语言变量
→ 引擎适配文档
→ 代码自查
→ 输出代码
```

AI 输出应包含：

- 图表类型。
- 数据字段映射。
- 主题变量绑定。
- G2 / ECharts 配置。
- 自查结果。

### 6.4 文档维护任务

```txt
维护目标
→ 文档治理规则
→ 目标目录 README
→ 相邻文档依赖
→ 编辑目标文件
→ 检查命名、引用和读取链
```

AI 输出应包含：

- 修改了哪些文件。
- 补充了哪些结构。
- 是否影响其他目录。
- 是否存在后续依赖。

## 7. 任务类型入口

| 用户问题 | 优先读取 |
|---|---|
| “这个数据应该用什么图？” | `00-overview/decision-tree.md` |
| “帮我设计一个图表 / 看板” | `00-overview/decision-tree.md`、`01-design-language/`、`03-pattern/` |
| “帮我生成 ECharts / G2 代码” | `02-chart-type/`、`04-adaptation/`、`06-self-check/` |
| “这个图表是否合理？” | `02-chart-type/`、`06-self-check/`、`05-rules/` |
| “帮我补一个规范文档” | `07-document-governance/`、目标目录 README、相邻文档 |
| “帮我做成可自动化技能” | `08-skill-center` |

## 8. 输出要求

AI 在使用本 Wiki 产出结果时，应尽量结构化输出。

### 8.1 设计建议输出

建议包含：

```txt
业务目标
推荐图表
字段映射
视觉规则
交互规则
限制与风险
自查结论
```

### 8.2 代码生成输出

建议包含：

```txt
图表类型
数据结构
主题变量绑定
引擎配置
可替换参数
自查清单
```

### 8.3 文档维护输出

建议包含：

```txt
修改文件
新增结构
依赖关系
后续建议
```

## 9. 变量与样式使用边界

本文不读取或定义主题样式。

当任务涉及视觉实现时，才需要进入视觉语言目录：

- 颜色：读取 `01-design-language/color.md`
- 字体：读取 `01-design-language/typography.md`
- 坐标轴：读取 `01-design-language/axis.md`
- 图例：读取 `01-design-language/legend.md`
- 标签：读取 `01-design-language/label.md`
- Tooltip：读取 `01-design-language/tooltip.md`

全局入口文档只负责说明如何使用 Wiki，不参与具体样式判断。

## 10. 维护约定

维护本 Wiki 时应遵循：

- 新增内容优先放入正确目录，不把所有规则堆在总览目录。
- 视觉规则写在 `01-design-language/`，不要写进图表模式文档。
- 单图表能力写在 `02-chart-type/`，不要写进业务场景文档。
- 业务组合写在 `03-pattern/`，不要写进视觉语言文档。
- 代码映射写在 `04-adaptation/`，不要写进设计原则文档。
- 自动化执行写在 `08-skill-center/`，不要替代知识层。

如果同一规则被多个目录使用，应在上游文档中定义，在下游文档中引用，避免重复维护。

## 11. 最小读取原则

AI 不需要每次读取整个 Wiki。

推荐策略：

```txt
先读总览
→ 判断任务类型
→ 读取目标目录 README
→ 读取必要的具体文档
→ 执行生成或修改
→ 用自查文件验证
```

这样可以减少上下文噪音，避免不同层级规则互相覆盖。

## 12. 一句话总结

本 Wiki 的使用方式是：

> 用总览判断路径，用知识层确定规则，用执行层驱动自动化，用自查层保证输出质量。

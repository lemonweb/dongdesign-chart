# Design Spec to Wiki Skill

## 1. 文档定位

本 Skill 用于把设计工具中的设计规范页面、Frame 或节点转化为数据可视化 Wiki 中指定的 Markdown 文档。

它解决的问题是：

> 用户只提供设计规范链接和目标 md 文件时，AI 能快速、准确、稳定地生成符合 Wiki 架构的规范文档。

本 Skill 属于 Execution Layer，不重新定义规范，只负责读取设计工具、提炼结构、对齐 Wiki 文档体系并写入目标文件。

当前支持的设计来源：

| 来源 | 说明 |
|---|---|
| Figma | 通过 Figma MCP 读取设计规范、节点结构、截图和变量 |
| Zero / Relay | 类 Figma 设计工具；Zero 是新名称，Relay 是旧名称，通过对应 MCP 读取设计规范、节点结构、截图和变量 |

如果未来接入其他类 Figma 工具，应扩展来源适配层，而不是重新创建一个新的转 Wiki Skill。

## 2. 触发场景

当用户表达以下意图时触发：

- “根据这个设计规范完善某个 md 文档”
- “把这个 Figma / Zero / Relay 页面转成 Wiki 文档”
- “参考设计工具中的设计指南补充某个视觉语言文档”
- “后续我少提供说明，你直接生成对应 md”
- “把坐标轴 / 图例 / 标签 / Tooltip / 图表组件等设计规范转成 Wiki”

典型输入：

```txt
设计规范链接 + 目标 Markdown 文件
```

示例：

```txt
用 design-spec-to-wiki-skill，把这个 Zero / Relay 图例设计规范完善到 01-design-language/legend.md
```

```txt
用 design-spec-to-wiki-skill，把这个 Figma 折线图设计指南完善到 02-chart-type/basic/line-chart.md
```

## 3. 输入要求

最小输入：

| 输入 | 是否必需 | 说明 |
|---|---|---|
| 设计规范链接 | 必需 | Figma / Zero / Relay 等设计工具链接，必须能定位到具体页面、Frame 或节点 |
| 目标 md 文件 | 必需 | Wiki 中要生成或完善的 Markdown 文件 |
| 来源工具 | 可选 | 如 Figma、Zero、Relay；用户未说明时应从链接域名或上下文判断 |
| 文档类型 | 可选 | 如视觉语言、图表组件、业务场景、引擎适配 |
| 特殊约束 | 可选 | 如“不依赖主题样式”“只允许固定字号”“不要覆盖已有变量定义”等 |

当用户没有说明文档类型时，AI 应根据目标路径判断。

## 4. 设计来源适配

### 4.1 来源判断

AI 应先判断设计规范来自哪个工具。

| 判断依据 | 来源 |
|---|---|
| 链接包含 `figma.com` | Figma |
| 链接或用户说明包含 `Zero` / `zero` / `Relay` / `relay` | Zero / Relay |
| 无法判断 | 询问用户，或先说明无法选择 MCP 来源 |

### 4.2 Figma 读取方式

从 Figma 链接提取：

```txt
fileKey
nodeId
```

优先使用 Figma MCP：

1. `get_design_context` 获取结构化内容。
2. 如果内容过大或稀疏，使用 `get_metadata` 获取结构。
3. 使用 `get_screenshot` 获取视觉参考。
4. 必要时对关键子节点再次调用 `get_design_context`。

### 4.3 Zero / Relay 读取方式

Zero / Relay 属于类 Figma 设计工具，Zero 是新名称，Relay 是旧名称。接入 MCP 后应按同样的读取模型处理：

```txt
designFileId / fileKey
nodeId / frameId / pageId
```

优先使用 Zero / Relay MCP 提供的等价能力：

1. 获取指定节点的设计上下文。
2. 获取节点或页面结构。
3. 获取截图或视觉预览。
4. 获取变量、样式、组件或 token 信息。
5. 对关键子节点再次读取上下文。

如果 Zero / Relay MCP 的工具命名与 Figma MCP 不同，AI 应先读取对应 MCP 工具说明，再把返回结果映射到本 Skill 的统一信息模型。

### 4.4 统一信息模型

无论来源是 Figma、Zero 还是 Relay，最终都应提炼为以下信息：

| 信息 | 说明 |
|---|---|
| 页面标题 | 规范页或节点的主题 |
| 定义 | 该组件、图表或规则的基本概念 |
| 应用场景 | 何时使用 |
| 不适用场景 | 何时避免使用 |
| 构成元素 | 设计对象由哪些元素组成 |
| 类型 / 变体 | 状态、尺寸、方向、图表类型或交互变体 |
| 布局关系 | 元素之间的位置、层级、排列规则 |
| 设计原则 | 应遵守的可执行规则 |
| 交互原则 | 用户动作、系统反馈、启用条件 |
| 推荐 / 不推荐案例 | 正反例中的规则差异 |
| 变量 / token | 颜色、字体、间距、线宽、状态等变量关系 |
| 工程映射 | 与 G2 / ECharts / 组件配置相关的语义映射 |

不要逐字搬运设计工具文案，应转化为 Wiki 可执行规则。

## 5. 必读 Wiki 文件

### 5.1 默认必读

```txt
00-overview/how-to-use.md
00-overview/ai-reading-flow.md
07-document-governance/general-writing-principles.md
```

### 5.2 按目标路径补充读取

| 目标目录 | 必读文件 |
|---|---|
| `01-design-language/` | `01-design-language/README.md`、`07-document-governance/design-language-writing-guide.md` |
| `02-chart-type/` | `02-chart-type/README.md`、`07-document-governance/chart-component-writing-guide.md` |
| `03-pattern/` | `03-pattern/README.md`、`07-document-governance/scenario-writing-guide.md` |
| `04-adaptation/` | `04-adaptation/README.md`、`07-document-governance/engine-adapter-writing-guide.md` |
| `05-rules/` | `05-rules/README.md`、`07-document-governance/ai-rules-writing-guide.md` |

### 5.3 相邻文档

生成目标文档前，应读取同目录中已经完成的 1-3 个相邻文档，复用结构、语气和约束。

例如完善 `01-design-language/legend.md` 时，应读取：

- `01-design-language/color.md`
- `01-design-language/typography.md`
- `01-design-language/axis.md`

## 6. 文档生成流程

```txt
1. 识别设计来源：Figma / Zero / Relay / 其他
2. 提取设计链接中的文件、页面、Frame 或节点信息
3. 识别目标 md 所在目录和文档类型
4. 读取目录 README 与写法原则
5. 读取相邻文档，提取已形成的结构和约束
6. 通过对应 MCP 读取设计节点结构和截图
7. 提炼设计规范中的统一信息模型
8. 转换为 Wiki 标准章节
9. 对齐已有主题变量、字体、色彩、交互规则
10. 写入或完善目标 md
11. 检查引用、命名、禁止项和 AI 自查清单
```

## 7. 推荐章节结构

### 7.1 视觉语言类文档

适用于坐标轴、图例、标签、Tooltip、布局等。

```txt
1. 文档定位
2. 定义
3. 应用场景
4. 构成
5. 类型
6. 设计原则
7. 交互原则
8. 与主题变量的关系
9. G2 / ECharts 映射
10. AI 输出格式
11. 禁止项
12. AI 自查清单
```

可根据设计规范内容删减，但不得省略：

- 文档定位
- 设计原则
- 与变量 / 相邻规范的关系
- 禁止项
- AI 自查清单

### 7.2 图表组件类文档

```txt
1. 文档定位
2. 图表定义
3. 属性摘要
4. 适用场景
5. 不适用场景
6. 数据结构
7. 视觉构成
8. 设计原则
9. 交互规则
10. 与视觉语言的关系
11. G2 / ECharts 映射
12. AI 输出格式
13. 禁止项
14. AI 自查清单
```

## 8. 输出格式

执行完成后，AI 应输出：

```txt
已更新文件
参考的设计来源和节点
补充的核心章节
与现有 Wiki 规则的对齐点
遗留问题或需要用户确认的点
```

不要输出大段设计工具原文。

## 9. 依赖 Skill

| Skill | 关系 |
|---|---|
| `doc-scaffold-skill` | 当目标 md 为空或结构缺失时，用于建立文档骨架 |
| `wiki-maintainer-skill` | 当发现跨目录规范缺口时，用于回写知识层 |
| `dependency-checker-skill` | 完成后检查引用、路径、变量依赖和冲突 |
| `visual-auditor-skill` | 对视觉语言文档进行规则一致性审查 |

## 10. 不负责事项

本 Skill 不负责：

- 在 Figma、Zero、Relay 或其他设计工具中修改设计文件。
- 创建真实 Codex 系统技能。
- 生成完整图表代码。
- 替代 Theme Token、Color、Typography 等上游规范。
- 将设计工具文案逐字翻译成 Markdown。

如果设计规范与 Wiki 已有规则冲突，应先标记冲突，不直接覆盖已有规范。

## 11. 自查清单

生成 md 前检查：

- 是否识别了正确的设计来源？
- 是否提取了正确的文件、页面、Frame 或节点信息？
- 是否读取了目标目录 README？
- 是否读取了相邻文档？
- 是否保留了 Wiki 的统一章节结构？
- 是否把设计规范内容转化为可执行规则，而不是截图说明？
- 是否对齐现有变量、字体、色彩和交互约束？
- 是否避免了模糊区间值？
- 是否补充了禁止项？
- 是否补充了 AI 输出格式或自查清单？
- 是否没有复制大段设计工具原文？

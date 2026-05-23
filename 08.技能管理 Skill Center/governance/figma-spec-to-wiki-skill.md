# Figma Spec to Wiki Skill

## 1. 文档定位

本 Skill 用于把 Figma 中的设计规范 Frame 转化为数据可视化 Wiki 中指定的 Markdown 文档。

它解决的问题是：

> 用户只提供 Figma 规范链接和目标 md 文件时，AI 能快速、准确、稳定地生成符合 Wiki 架构的规范文档。

本 Skill 属于 Execution Layer，不重新定义规范，只负责读取 Figma、提炼结构、对齐 Wiki 文档体系并写入目标文件。

## 2. 触发场景

当用户表达以下意图时触发：

- “根据这个 Figma 规范完善某个 md 文档”
- “把这个 Figma Frame 转成 Wiki 文档”
- “参考 Figma 中的设计指南补充某个视觉语言文档”
- “后续我少提供说明，你直接生成对应 md”
- “把坐标轴 / 图例 / 标签 / Tooltip 等设计规范转成 Wiki”

典型输入：

```txt
Figma URL + 目标 Markdown 文件
```

示例：

```txt
根据 Figma 这个图例设计规范，完善 01.视觉语言 Design Language/07.图例 Legend.md
```

## 3. 输入要求

最小输入：

| 输入 | 是否必需 | 说明 |
|---|---|---|
| Figma URL | 必需 | 必须包含 file key 和 node id |
| 目标 md 文件 | 必需 | Wiki 中要生成或完善的 Markdown 文件 |
| 文档类型 | 可选 | 如视觉语言、图表组件、业务场景、引擎适配 |
| 特殊约束 | 可选 | 如“不依赖主题样式”“只允许固定字号”等 |

当用户没有说明文档类型时，AI 应根据目标路径判断。

## 4. 必读 Wiki 文件

### 4.1 默认必读

```txt
00.总览 Overview/01.使用说明 How-to-use.md
00.总览 Overview/02.AI读取顺序 AI-reading-flow.md
07.文档治理 Document Governance/01.通用写作原则 General-writing-principles.md
```

### 4.2 按目标路径补充读取

| 目标目录 | 必读文件 |
|---|---|
| `01.视觉语言 Design Language/` | `01.视觉语言 Design Language/README.md`、`07.文档治理 Document Governance/04.视觉语言写法原则 Design-language-writing-guide.md` |
| `02.图表模式 Chart-type/` | `02.图表模式 Chart-type/README.md`、`07.文档治理 Document Governance/05.图表组件写法原则 Chart-component-writing-guide.md` |
| `03.业务场景 Pattern/` | `03.业务场景 Pattern/README.md`、`07.文档治理 Document Governance/06.业务场景写法原则 Scenario-writing-guide.md` |
| `04.引擎适配 Adaptation/` | `04.引擎适配 Adaptation/README.md`、`07.文档治理 Document Governance/07.引擎适配写法原则 Engine-adapter-writing-guide.md` |
| `05.执行规则 Rules/` | `05.执行规则 Rules/README.md`、`07.文档治理 Document Governance/08.AI执行规则写法原则 AI-rules-writing-guide.md` |

### 4.3 相邻文档

生成目标文档前，应读取同目录中已经完成的 1-3 个相邻文档，复用结构、语气和约束。

例如完善 `07.图例 Legend.md` 时，应读取：

- `03.色彩系统 Color.md`
- `04.字体排版 Typography.md`
- `06.坐标轴 Axis.md`

## 5. Figma 读取流程

### 5.1 提取节点信息

从 Figma URL 提取：

```txt
fileKey
nodeId
```

优先使用 Figma MCP：

1. `get_design_context` 获取结构化内容。
2. 如果内容过大或稀疏，使用 `get_metadata` 获取结构。
3. 使用 `get_screenshot` 获取视觉参考。
4. 必要时对关键子节点再次调用 `get_design_context`。

### 5.2 读取重点

重点提取：

- 页面标题。
- 定义。
- 应用场景。
- 构成元素。
- 类型。
- 布局。
- 设计原则。
- 交互原则。
- 推荐 / 不推荐案例。
- 视觉 token、尺寸、字体、颜色、状态。
- 与代码实现相关的配置概念。

不要逐字搬运 Figma 文案，应转化为 Wiki 可执行规则。

## 6. 文档生成流程

```txt
1. 识别目标 md 所在目录和文档类型
2. 读取目录 README 与写法原则
3. 读取相邻文档，提取已形成的结构和约束
4. 读取 Figma 节点结构和截图
5. 提炼 Figma 中的规范信息
6. 转换为 Wiki 标准章节
7. 对齐已有主题变量、字体、色彩、交互规则
8. 写入或完善目标 md
9. 检查引用、命名、禁止项和 AI 自查清单
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

可根据 Figma 内容删减，但不得省略：

- 文档定位
- 设计原则
- 与变量 / 相邻规范的关系
- 禁止项
- AI 自查清单

### 7.2 图表组件类文档

```txt
1. 文档定位
2. 图表定义
3. 适用场景
4. 数据结构
5. 视觉构成
6. 交互规则
7. 选型限制
8. 引擎实现映射
9. 示例
10. 自查清单
```

## 8. 输出格式

执行完成后，AI 应输出：

```txt
已更新文件
参考的 Figma 节点
补充的核心章节
与现有 Wiki 规则的对齐点
遗留问题或需要用户确认的点
```

不要输出大段 Figma 原文。

## 9. 依赖 Skill

| Skill | 关系 |
|---|---|
| `doc-scaffold-skill` | 当目标 md 为空或结构缺失时，用于建立文档骨架 |
| `wiki-maintainer-skill` | 当发现跨目录规范缺口时，用于回写知识层 |
| `dependency-checker-skill` | 完成后检查引用、路径、变量依赖和冲突 |
| `visual-auditor-skill` | 对视觉语言文档进行规则一致性审查 |

## 10. 不负责事项

本 Skill 不负责：

- 在 Figma 中修改设计文件。
- 创建真实 Codex 系统技能。
- 生成完整图表代码。
- 替代 Theme Token、Color、Typography 等上游规范。
- 将 Figma 文案逐字翻译成 Markdown。

如果 Figma 与 Wiki 已有规范冲突，应先标记冲突，不直接覆盖已有规范。

## 11. 自查清单

生成 md 前检查：

- 是否提取了正确的 Figma nodeId？
- 是否读取了目标目录 README？
- 是否读取了相邻文档？
- 是否保留了 Wiki 的统一章节结构？
- 是否把 Figma 内容转化为可执行规则，而不是截图说明？
- 是否对齐现有变量、字体、色彩和交互约束？
- 是否避免了模糊区间值？
- 是否补充了禁止项？
- 是否补充了 AI 输出格式或自查清单？
- 是否没有复制大段 Figma 原文？


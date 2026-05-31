# 文档元信息与命名规范

## 1. 文档定位

本文定义本 Wiki 的文件命名、目录命名、中文描述和 AI 检索索引规则。

目标是同时满足两类需求：

- 人类读者能通过中文标题理解内容。
- Codex、Cursor、Claude Code、Cline、Windsurf 等 AI Agent 和 CLI 工具能稳定读取、引用和搜索路径。

## 2. 当前命名状态

当前仓库已完成路径迁移，目录和文件使用机器友好的 ASCII kebab-case，例如：

- `01-design-language/color.md`
- `02-chart-type/basic/line-chart.md`

迁移前的“中文名 + 英文 slug + 空格 + 序号点号”路径保留了中文可读性，但也带来兼容风险：

- 中文路径在不同终端、插件、远程容器或 MCP 环境中可能显示不一致。
- 空格路径在 shell、脚本、自动化工具和 Markdown 链接中需要额外转义。
- 序号和混合标点会增加批量迁移、排序和模糊匹配成本。

因此，本 Wiki 使用机器友好路径承载文件系统结构，使用标题、README、`ai-file-index.md` 和 Skill 承载中文语义。

## 3. 推荐命名规则

### 3.1 新增目录

新增目录使用英文小写 kebab-case。

推荐：

```text
01-design-language/
02-chart-type/
03-pattern/
04-adaptation/
05-rules/
```

不推荐：

```text
01.视觉语言 Design Language/
04.基础图表 Basic/
```

### 3.2 新增文件

新增文件使用英文小写 kebab-case，扩展名使用 `.md`、`.ts`、`.tsx`、`.json` 等标准格式。

推荐：

```text
line-chart.md
theme-token.md
chart-builder-skill.md
metadata-naming-guide.md
```

不推荐：

```text
01.折线图 Line-chart.md
04.VibeDesign验证示例 VibeDesign-validation-examples.md
Self Check-writing-guide.md
```

### 3.3 序号使用

只有当目录或文件存在强阅读顺序时才使用序号。

推荐：

```text
00-overview/
01-design-language/
02-chart-type/
```

不推荐：

```text
01.视觉语言 Design Language/
02.图表模式 Chart-type/
```

### 3.4 中文信息存放位置

中文名、中文别名、业务描述和关键词不建议继续放入路径，应放在：

- Markdown 一级标题
- 文件 frontmatter
- 目录 README
- `ai-file-index.md`
- Skill 的触发关键词

示例：

```markdown
---
title: 折线图
aliases:
  - 趋势图
  - line chart
keywords:
  - 趋势
  - 时间序列
  - 对比
---

# 折线图
```

## 4. AI 检索规则

根目录的 `ai-file-index.md` 是中文关键词到文件路径的总索引。

AI Agent 查找文件时应按以下顺序执行：

1. 读取 `ai-file-index.md`。
2. 匹配用户输入中的中文名、英文名、业务词、图表词和工具词。
3. 命中后返回精确路径。
4. 未命中时再使用 `rg --files` 搜索路径。
5. 仍未命中时使用 `rg` 搜索正文关键词。

对应 Skill：

```text
08-skill-center/governance/file-path-finder-skill.md
```

## 5. 存量文件迁移策略

当前迁移已完成。后续如再次移动或重命名文件，应按以下顺序执行：

1. 生成完整迁移表：旧路径、新路径、中文标题、关键词。
2. 检查所有 Markdown 内链、README 导航、Skill 必读路径、依赖地图。
3. 先迁移低依赖文件，再迁移核心入口文件。
4. 每次迁移后运行链接检查。
5. 更新 `ai-file-index.md`。

迁移示例：

| 旧路径 | 建议新路径 | 中文标题 |
|---|---|---|
| `01.视觉语言 Design Language/03.色彩系统 Color.md` | `01-design-language/color.md` | 色彩系统 |
| `02.图表模式 Chart-type/04.基础图表 Basic/01.折线图 Line-chart.md` | `02-chart-type/basic/line-chart.md` | 折线图 |
| `05.执行规则 Rules/01.VibeDesign规则 VibeDesign-rules.md` | `05-rules/vibedesign-rules.md` | VibeDesign 规则 |

## 6. 自查清单

新增或迁移文档前检查：

- 路径是否只使用 ASCII 字符？
- 路径是否避免空格？
- 文件名是否使用 kebab-case？
- 中文标题是否写入正文或 frontmatter？
- 是否同步更新 `ai-file-index.md`？
- 是否同步更新相关 README、Skill 和依赖文档？

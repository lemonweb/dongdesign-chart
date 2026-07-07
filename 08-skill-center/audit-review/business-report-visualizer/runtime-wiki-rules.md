# Runtime Wiki Rules

## 1. 文档定位

本文件定义 `business-report-visualizer` 如何在运行时读取 dongDesign Chart Wiki。

它解决的是知识来源问题，不定义报告解析、图表选型、布局或视觉细则。阶段细则仍由同目录下的对应规则文件负责。

## 2. 远程 Wiki 来源

```txt
Wiki repository: https://github.com/lemonweb/dongdesign-chart
Default branch: main
Raw file pattern: https://raw.githubusercontent.com/lemonweb/dongdesign-chart/main/{repo_path}
Web file pattern: https://github.com/lemonweb/dongdesign-chart/blob/main/{repo_path}
```

## 3. 读取优先级

1. 如果当前工作区就是完整 Wiki 仓库，优先读取本地同路径文件。
2. 如果本地不是完整仓库，或用户要求“最新 Wiki”，读取 GitHub main 分支 raw 文件。
3. 如果 raw 文件不可用，使用 GitHub Web 页面或搜索接口定位文件。
4. 如果网络不可用，才读取安装包内的 `references/` 或随包辅助文件，并在输出中标注这是降级来源。

## 4. 必须读取远程 Wiki 的时机

以下时机必须读取远程 Wiki，而不是依赖记忆或 Skill 内置内容：

- 执行开始前：确认运行契约、Skill 注册关系和当前任务需要的规则入口。
- Markdown 解析前：确认输入定义、IR schema、证据链和质量标记要求。
- 图表选型前：确认图表类型、业务问题、数据结构和反模式规则。
- 布局与视觉生成前：确认设计语言、布局、组件映射、视觉增强和可读性规则。
- QA 前：确认自查清单、反模式、数据一致性和引用要求。
- 发现规则冲突、路径缺失或用户要求“按最新规范”时：重新读取 main 分支对应文件。

## 5. 路径筛选规则

按“任务阶段 → 路径前缀 → 关键词”逐层收窄，不要整库无差别读取。

| 任务阶段 | 优先路径范围 | 关键词 |
|---|---|---|
| 运行契约 | `08-skill-center/` | runtime、registry、dependency、business-report-visualizer |
| 报告解析 | `08-skill-center/audit-review/business-report-visualizer/` | input、schema、markdown、quality_flags、source_ref |
| 图表选型 | `02-chart-type/`、`03-pattern/`、`05-rules/` | trend、comparison、composition、funnel、table、anti-pattern |
| 视觉布局 | `01-design-language/`、`09-visual-enhancement/` | layout、theme、token、highlight、annotation、density |
| 输出审查 | `06-self-check/`、`05-rules/`、本 Skill 的 `qa-checklist` | checklist、evidence、misleading、readability |

无法确定路径时，先读取远程 `ai-file-index.md`、`README.md` 或 `08-skill-center/registry.md` 定位；仍无法定位时，把问题交给 `file-path-finder-skill` 或在输出中标注“路径未确认”。

## 6. 引用格式

输出中的每条 Wiki 依据必须带来源，不复制大段正文。推荐格式：

```txt
source: lemonweb/dongdesign-chart@main:{repo_path}#{section}
retrieved_at: YYYY-MM-DD
commit: <sha 或 unknown>
wiki_status: remote_current | local_full_repo | fallback_stale_possible | path_not_found
```

当同一结论来自多个文件时，只引用最直接的规则文件；不要堆叠无关来源。引用只证明规则来源，不替代业务数据来源，业务指标仍必须保留原报告的 `source_ref`。

## 7. 找不到怎么办

- 找不到文件：换用索引文件定位；仍找不到时标注 `wiki_status: path_not_found`。
- 网络不可用：使用本地或包内副本继续，但标注 `wiki_status: fallback_stale_possible`。
- 规则冲突：优先使用更具体、更靠近当前任务阶段的文件，并记录冲突路径。
- 规则缺失：不得自行补成规范；把缺口写入 `quality_flags` 或 Wiki 维护待办。
- 关键规则缺失且会影响事实、图表选型或合规审查：停步向用户确认。

## 8. 规则归属边界

| 规则类型 | 放置位置 | 原因 |
|---|---|---|
| 触发场景、总流程、必读文件索引 | `SKILL.md` | 入口必须短、稳、可路由 |
| 远程 Wiki 来源、筛选、引用、降级 | `runtime-wiki-rules.md` | 横跨所有阶段，避免在每个规则文件重复 |
| 输入字段、输入质量、缺失处理 | `input-definition.md` | 只影响输入校验 |
| Markdown 解析、指标和证据抽取 | `markdown-parser-rules.md` | 只影响文本到 IR |
| IR 数据结构 | `report-ir-schema.json` | 机器可校验契约 |
| 叙事重组 | `narrative-rules.md` | 只影响诊断故事线 |
| 图表选型 | `chart-selection-rules.md` | 只影响图表判断与下游 handoff |
| 组件映射 | `component-mapping.md` | 只影响 Visual JSON 组件契约 |
| 布局 | `bento-layout-rules.md` | 只影响页面结构 |
| 视觉风格 | `visual-style-rules.md` | 只影响视觉表达 |
| QA 与阻断条件 | `qa-checklist.md` | 只影响最终审查 |


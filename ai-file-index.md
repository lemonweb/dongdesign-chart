# AI File Index

## 1. 用途

本文件是当前 Wiki 的 AI 路径索引，用于让 Codex、Cursor、Claude Code、Cline、Windsurf 等 AI Agent 通过中文名、英文名、业务关键词或图表关键词快速定位文件路径。

当用户只输入中文关键词时，Agent 应优先读取本文件，匹配“中文名 / 英文名 / 关键词”，然后返回精确路径。

## 2. 命名迁移结论

当前仓库已迁移为机器友好的 ASCII kebab-case 路径，例如：

- `01-design-language/color.md`
- `02-chart-type/basic/line-chart.md`

迁移前的“中文名 + 英文 slug + 空格 + 序号点号”路径对人类阅读友好，但对跨 AI 工具、shell、脚本、链接迁移和自动化索引有三类风险：

- 中文路径：不同终端、插件、MCP、远程环境的编码显示可能不一致。
- 空格路径：shell、脚本、Markdown 链接、CLI 参数需要额外转义。
- 序号与混合标点：批量重排、跨目录移动、模糊搜索时容易产生不稳定引用。

当前策略：

- 存量文件：已迁移为英文小写 kebab-case 路径。
- 新增文件：继续使用英文小写 kebab-case，不使用空格和中文。
- 中文语义：写入标题、frontmatter、README、索引文件和 Skill，不放进机器路径。
- 序号：仅保留在顶层目录前缀中，例如 `00-overview`、`01-design-language`。
- 查询入口：长期维护本文件，让中文关键词可以映射到稳定路径。

推荐的新命名格式：

```text
00-overview/
01-design-language/
02-chart-type/
03-pattern/
04-adaptation/
05-rules/
06-self-check/
07-document-governance/
08-skill-center/
```

推荐的新文件格式：

```text
selection-rules.md
line-chart.md
vibedesign-rules.md
chart-builder-skill.md
```

## 3. Agent 查询规则

1. 先在本文件中匹配用户输入的中文关键词、英文关键词或同义词。
2. 如果命中多个路径，优先返回最具体的文件，其次返回目录 README。
3. 如果是图表名称，优先查 `02-chart-type/`。
4. 如果是样式、颜色、字体、坐标轴、图例、标签、提示信息，优先查 `01-design-language/`。
5. 如果是代码生成、G2、ECharts、主题模型，优先查 `04-adaptation/` 和 `08-skill-center/code-generation/`。
6. 如果是审查、自查、规范、治理、命名，优先查 `06-self-check/` 和 `07-document-governance/`。

## 4. 核心入口

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| AI 文件索引 | AI File Index | 中文查路径, 文件导航, 路径索引, Agent 查询 | `ai-file-index.md` |
| 项目根说明 | README | 根目录, 入口, 总说明 | `README.md` |
| 根设计原则 | Principle | 原则, 空文件, 待整理 | `principle.md` |
| 根设计文档 | Design | 设计, 空文件, 待整理 | `design.md` |

## 5. 总览 Overview

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| 总览 README | Overview README | 总览, 入口, Wiki 导航 | `00-overview/README.md` |
| 使用说明 | How to use | 怎么用, 入门, 使用方式 | `00-overview/how-to-use.md` |
| AI 读取顺序 | AI reading flow | AI 顺序, 必读, 上下文加载 | `00-overview/ai-reading-flow.md` |
| 图表选型决策树 | Decision tree | 选图, 决策树, 图表选择 | `00-overview/decision-tree.md` |
| 术语表 | Glossary | 术语, 名词解释, vocabulary | `00-overview/glossary.md` |

## 6. 视觉语言 Design Language

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| 视觉语言 README | Design Language README | 视觉规范, 样式入口 | `01-design-language/README.md` |
| 设计原则 | Principle | 视觉原则, 图表设计原则 | `01-design-language/principle.md` |
| 主题变量 | Theme token | token, 主题, 变量, design token | `01-design-language/theme-token.md` |
| 色彩系统 | Color | 颜色, 配色, 色板, palette | `01-design-language/color.md` |
| 字体排版 | Typography | 字体, 字号, 排版, 文本 | `01-design-language/typography.md` |
| 间距布局 | Layout | 间距, 布局, spacing, layout | `01-design-language/layout.md` |
| 坐标轴 | Axis | x 轴, y 轴, 刻度, 轴线 | `01-design-language/axis.md` |
| 图例 | Legend | 图例, legend, 系列说明 | `01-design-language/legend.md` |
| 标签 | Label | 数据标签, 标注, label | `01-design-language/label.md` |
| 提示信息 | Tooltip | tooltip, 悬浮提示, 信息提示 | `01-design-language/tooltip.md` |

## 7. 图表模式 Chart Type

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| 图表模式 README | Chart Type README | 图表目录, 图表入口 | `02-chart-type/README.md` |
| 能力矩阵 | Capability matrix | 能力, 对比, 图表能力 | `02-chart-type/capability-matrix.md` |
| 选型规则 | Selection rules | 选型, 怎么选图表, 规则 | `02-chart-type/selection-rules.md` |
| 复杂度分级 | Complexity level | 难度, 复杂度, 分级 | `02-chart-type/complexity-level.md` |
| 折线图 | Line chart | 趋势, 时间序列, line | `02-chart-type/basic/line-chart.md` |
| 柱状图 | Bar chart | 对比, 排名, bar | `02-chart-type/basic/bar-chart.md` |
| 饼图 | Pie chart | 占比, 构成, pie | `02-chart-type/basic/pie-chart.md` |
| 面积图 | Area chart | 趋势面积, 累计, area | `02-chart-type/basic/area-chart.md` |
| 雷达图 | Radar chart | 多维对比, 能力模型, radar | `02-chart-type/basic/radar-chart.md` |
| 直方图 | Histogram | 分布, 频次, histogram | `02-chart-type/statistical/histogram.md` |
| 散点图 | Scatter | 相关性, 分布, scatter | `02-chart-type/statistical/scatter.md` |
| 气泡图 | Bubble | 三变量, 气泡, bubble | `02-chart-type/statistical/bubble.md` |
| 热力图 | Heatmap | 热力, 密度, heatmap | `02-chart-type/statistical/heatmap.md` |
| 漏斗图 | Funnel | 转化, 漏斗, funnel | `02-chart-type/flow/funnel.md` |
| 桑基图 | Sankey | 流向, 路径, sankey | `02-chart-type/flow/sankey.md` |
| 柱线混合图 | Bar line chart | 双指标, 柱线, 混合图 | `02-chart-type/composite/bar-line-chart.md` |
| 双轴图 | Dual axis | 双 y 轴, 双轴, dual axis | `02-chart-type/composite/dual-axis.md` |
| 透视图 | Pivot | 透视, 多维分析, pivot | `02-chart-type/composite/pivot.md` |
| 迷你图表 | Mini chart | sparkline, 迷你趋势, 小图 | `02-chart-type/other/mini-chart.md` |
| 指标卡 | Statistics card | 指标, 卡片, 数字卡, KPI | `02-chart-type/other/statistics-card.md` |

## 8. 业务场景 Pattern

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| 业务场景 README | Pattern README | 场景入口, 业务分析 | `03-pattern/README.md` |
| 经营分析 | Business analysis | 经营, GMV, 收入, 利润 | `03-pattern/business-analysis.md` |
| 流量分析 | Traffic analysis | 流量, 访问, UV, PV | `03-pattern/traffic-analysis.md` |
| 商品分析 | Product analysis | 商品, SKU, 品类, 货品 | `03-pattern/product-analysis.md` |
| 交易分析 | Transaction analysis | 交易, 转化, 订单, 支付 | `03-pattern/transaction-analysis.md` |
| 营销活动分析 | Campaign analysis | 活动, 营销, 复盘, campaign | `03-pattern/campaign-analysis.md` |

## 9. 引擎适配 Adaptation

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| 引擎适配 README | Adaptation README | 引擎入口, 图表库适配 | `04-adaptation/README.md` |
| 通用主题模型 | Theme schema | schema, theme, 主题模型 | `04-adaptation/theme-schema.md` |
| G2 适配 | G2 adapter | AntV G2, G2, 代码适配 | `04-adaptation/g2-adapter.md` |
| ECharts 适配 | ECharts adapter | ECharts, option, 代码适配 | `04-adaptation/echarts-adapter.md` |
| 引擎映射表 | Mapping table | 字段映射, 引擎映射, adapter map | `04-adaptation/mapping-table.md` |

## 10. 执行规则 Rules

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| 执行规则 README | Rules README | 规则入口, 生成规则 | `05-rules/README.md` |
| VibeDesign 规则 | VibeDesign rules | 设计生成, VibeDesign, 视觉一致性 | `05-rules/vibedesign-rules.md` |
| VibeCode 规则 | VibeCode rules | 代码生成, VibeCode, 实现规则 | `05-rules/vibecode-rules.md` |
| 图表生成流程 | Generation flow | 生成流程, 设计流程, 图表流程 | `05-rules/generation-flow.md` |
| 禁止项 | Anti patterns | 禁止, 反模式, 不要做 | `05-rules/anti-patterns.md` |

## 11. 示例自查 Self Check

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| 示例自查 README | Self Check README | 自查入口, 检查清单 | `06-self-check/README.md` |
| 设计自查清单 | Design checklist | 设计检查, 视觉检查 | `06-self-check/design-checklist.md` |
| 代码自查清单 | Code checklist | 代码检查, 实现检查 | `06-self-check/code-checklist.md` |
| 常见错误 | Bad cases | 错误案例, 反例, bad case | `06-self-check/bad-cases.md` |
| VibeDesign 验证示例 | VibeDesign validation examples | 验证示例, VibeDesign 样例 | `06-self-check/vibedesign-validation-examples.md` |

## 12. 文档治理 Document Governance

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| 通用写作原则 | General writing principles | 写作, 通用原则, 文档规范 | `07-document-governance/general-writing-principles.md` |
| README 写法原则 | README writing guide | README, 目录说明, 入口文档 | `07-document-governance/readme-writing-guide.md` |
| 核心规则写法原则 | Core rules writing guide | 核心规则, 规则文档 | `07-document-governance/core-rules-writing-guide.md` |
| 视觉语言写法原则 | Design language writing guide | 视觉语言, 样式文档 | `07-document-governance/design-language-writing-guide.md` |
| 图表组件写法原则 | Chart component writing guide | 图表组件, 图表文档 | `07-document-governance/chart-component-writing-guide.md` |
| 业务场景写法原则 | Scenario writing guide | 业务场景, 场景文档 | `07-document-governance/scenario-writing-guide.md` |
| 引擎适配写法原则 | Engine adapter writing guide | 引擎适配, G2, ECharts | `07-document-governance/engine-adapter-writing-guide.md` |
| AI 执行规则写法原则 | AI rules writing guide | AI 规则, Agent 规则 | `07-document-governance/ai-rules-writing-guide.md` |
| 示例自查写法原则 | Self Check writing guide | 自查, 示例, 检查文档 | `07-document-governance/self-check-writing-guide.md` |
| 文档元信息与命名规范 | Metadata naming guide | 命名, metadata, 文件名, 路径规范 | `07-document-governance/metadata-naming-guide.md` |

## 13. 技能管理 Skill Center

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| Skill 注册表 | Skill registry | skill, 注册表, 技能目录 | `08-skill-center/registry.md` |
| Skill 运行契约 | Skill runtime contract | skill 契约, 运行规则 | `08-skill-center/skill-runtime-contract.md` |
| 依赖地图 | Dependency map | 依赖, skill 关系, dependency | `08-skill-center/dependency-map.md` |
| Skill 打包指南 | Skill packaging guide | skill 打包, 安装 skill, package, install | `08-skill-center/skill-packaging.md` |
| Skill 打包 Manifest | Skill package manifest | 打包配置, manifest, references | `08-skill-center/skill-package-manifest.json` |
| 文件路径查找 Skill | File path finder skill | 中文找文件, 路径检索, 文件索引 | `08-skill-center/governance/file-path-finder-skill.md` |
| Wiki 维护 Skill | Wiki maintainer skill | Wiki 维护, 文档治理 | `08-skill-center/governance/wiki-maintainer-skill.md` |
| 文档脚手架 Skill | Doc scaffold skill | 新建文档, 补齐骨架 | `08-skill-center/governance/doc-scaffold-skill.md` |
| 设计规范转 Wiki Skill | Design spec to Wiki skill | Figma, Relay, 设计规范转文档 | `08-skill-center/governance/design-spec-to-wiki-skill.md` |
| 依赖检查 Skill | Dependency checker skill | 依赖检查, 链接检查 | `08-skill-center/governance/dependency-checker-skill.md` |
| 同步规划 Skill | Sync planner skill | 同步, Figma, MCP, GitHub Pages | `08-skill-center/governance/sync-planner-skill.md` |
| 图表选择 Skill | Chart selector skill | 选图, 图表推荐 | `08-skill-center/design-efficiency/chart-selector-skill.md` |
| 图表构建 Skill | Chart builder skill | 生成图表, 图表方案 | `08-skill-center/design-efficiency/chart-builder-skill.md` |
| 看板规划 Skill | Dashboard planner skill | 看板, dashboard, 页面规划 | `08-skill-center/design-efficiency/dashboard-planner-skill.md` |
| 图表重构 Skill | Chart refactor skill | 图表优化, 重构 | `08-skill-center/design-efficiency/chart-refactor-skill.md` |
| G2 代码生成 Skill | G2 codegen skill | G2 代码, AntV | `08-skill-center/code-generation/g2-codegen-skill.md` |
| ECharts 代码生成 Skill | ECharts codegen skill | ECharts 代码, option | `08-skill-center/code-generation/echarts-codegen-skill.md` |
| 图表引擎切换 Skill | Chart engine switcher skill | G2 转 ECharts, 引擎迁移 | `08-skill-center/code-generation/chart-engine-switcher-skill.md` |
| 代码片段构建 Skill | Code snippet builder skill | snippet, 代码片段, 示例代码 | `08-skill-center/code-generation/code-snippet-builder-skill.md` |
| 视觉审查 Skill | Visual auditor skill | 视觉审查, 图表评审 | `08-skill-center/audit-review/visual-auditor-skill.md` |
| 图表样式优化 Skill | Chart style optimizer skill | 样式优化, 图表规范化 | `08-skill-center/audit-review/chart-style-optimizer-skill.md` |
| 图表合理性审查 | Chart appropriateness reviewer | 选型审查, 合理性 | `08-skill-center/audit-review/chart-appropriateness-reviewer.md` |
| 代码审查 Skill | Code review skill | 代码审查, review | `08-skill-center/audit-review/code-review-skill.md` |
| 数据看板 Skill | Data dashboard skill | 数据看板, dashboard 自动化 | `08-skill-center/scenario-automation/data-dashboard-skill.md` |
| 营销活动分析 Skill | Campaign analysis skill | 营销, 活动复盘, campaign | `08-skill-center/scenario-automation/campaign-analysis-skill.md` |

## 14. VibeCode Projects

| 中文名 | 英文名 | 关键词 | 路径 |
|---|---|---|---|
| VibeCode 项目 README | VibeCode projects README | 项目集合, demo, 原型 | `_vibecode-projects/README.md` |
| 30 天 GMV 转化 README | 30d GMV conversion README | GMV, 转化, 30 天 | `_vibecode-projects/30d-gmv-conversion/README.md` |
| 30 天 GMV 转化页面 | 30d GMV conversion page | GMV 页面, HTML, demo | `_vibecode-projects/30d-gmv-conversion/index.html` |
| 30 天 GMV Relay 设计方案 | Relay design scheme | Relay, 设计方案, GMV | `_vibecode-projects/30d-gmv-conversion/relay-design-scheme.md` |
| 可视化色板生成工具 README | Palette tool README | 色板工具, palette app | `_vibecode-projects/visualization-palette-tool/README.md` |
| 数据可视化色板生成平台说明 | Data visualization palette platform | 色板平台, 数据可视化配色 | `_vibecode-projects/visualization-palette-tool/data-visualization-palette-platform.md` |
| 色板工具 package | package json | npm, 依赖, scripts | `_vibecode-projects/visualization-palette-tool/package.json` |
| 色板工具 Vite 配置 | Vite config | vite, 构建配置 | `_vibecode-projects/visualization-palette-tool/vite.config.ts` |
| 色板工具 TypeScript 配置 | TypeScript config | tsconfig, TS 配置 | `_vibecode-projects/visualization-palette-tool/tsconfig.json` |
| 色板工具 HTML 入口 | HTML entry | index, 页面入口 | `_vibecode-projects/visualization-palette-tool/index.html` |
| 色板工具 App 组件 | App component | React, 主组件, 色板界面 | `_vibecode-projects/visualization-palette-tool/src/App.tsx` |
| 色板工具主入口 | Main entry | React 入口, main | `_vibecode-projects/visualization-palette-tool/src/main.tsx` |
| 色板工具样式 | Styles | CSS, 样式, 页面布局 | `_vibecode-projects/visualization-palette-tool/src/styles.css` |
| 色彩工具库 | Color library | color, 色彩算法, palette | `_vibecode-projects/visualization-palette-tool/src/lib/color.ts` |
| React shim | React shim | 类型兼容, shim | `_vibecode-projects/visualization-palette-tool/src/react-shim.d.ts` |
| Vite 环境声明 | Vite env | vite-env, 类型声明 | `_vibecode-projects/visualization-palette-tool/src/vite-env.d.ts` |

## 15. 后续维护建议

本仓库已经完成中文、空格和混合符号路径迁移。后续维护时：

1. 新增目录和文件继续使用英文 ASCII kebab-case。
2. 中文名、中文别名和业务关键词继续维护在本索引中。
3. 修改或移动文件后，必须同步更新本索引与相关 README、Skill 引用。

移动文件时不要只改文件名，必须同步更新：

- Markdown 内链
- README 导航
- Skill 的必读文件路径
- 依赖地图
- 外部书签或同步脚本

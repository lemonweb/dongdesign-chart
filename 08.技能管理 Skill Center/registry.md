# Skill Registry

## 1. 文档定位

本文是 `08.技能管理 Skill Center/` 的技能总注册表，用于统一登记数据可视化 Wiki 的所有 Skill 资产。

Skill Center 属于 Execution Layer（执行层），负责把 Wiki 知识转化为可执行流程。Skill 不重新定义规范，只按任务意图读取 Knowledge Layer 中的规则，并输出设计、代码、审查或治理结果。

## 2. Skill Center 目标

Skill Center 面向 CodeX / Codex、Stitch、VibeDesign、VibeCode、Zero、Figma、MCP 等 AI-Native 工作流，提供稳定、可维护、可组合的执行能力。

核心目标：

- 让 AI 能按任务意图选择正确 Skill。
- 让 Skill 能按需读取 Wiki，而不是硬编码规则。
- 支撑 VibeDesign 高一致性设计生成。
- 支撑 VibeCode 高还原代码生成。
- 支撑 Wiki 长期治理、审查、同步和自动化维护。
- 让技能依赖、调用边界和优先级可追踪。

## 3. 注册原则

### 3.1 Knowledge 与 Execution 解耦

- Wiki 是厚知识层，负责沉淀规则、标准、组件规范、场景模式和引擎适配。
- Skill 是薄执行层，负责读取规则、组织流程、产出结果。
- Skill 文件中不得复制大段规范正文，只记录执行流程、读取路径、输入输出和边界。

### 3.2 Skill 以任务意图注册

Skill 不按工具名称注册，而按用户任务意图注册。

例如：

- “帮我选图表”对应 `chart-selector-skill`
- “生成 ECharts 代码”对应 `echarts-codegen-skill`
- “检查这个图表是否合适”对应 `chart-appropriateness-reviewer`
- “批量补齐文档结构”对应 `doc-scaffold-skill`

### 3.3 Skill 必须声明依赖

每个 Skill 至少需要声明：

- 触发场景
- 输入信息
- 读取文件
- 输出结果
- 不负责的事项
- 下游可能调用的 Skill

跨 Skill 的依赖关系统一登记在 `dependency-map.md`。

### 3.4 Skill 必须遵守运行契约

所有 Skill 必须遵守 `skill-runtime-contract.md`，包括：

- 先读规则，再执行。
- 小范围修改，避免重写整篇文档。
- 不越权修改 Protected Section。
- 不把未确认推断写成规范。
- 输出前进行必要自查。

## 4. 技能分组

| 分组 | 目录 | 核心职责 |
|---|---|---|
| Design Efficiency | `design-efficiency/` | 图表选型、图表生成、看板规划、图表重构 |
| Code Generation | `code-generation/` | G2 / ECharts 代码生成、引擎切换、代码片段生成 |
| Governance | `governance/` | Wiki 维护、文档脚手架、依赖检查、同步规划 |
| Audit Review | `audit-review/` | 视觉审查、图表合理性审查、代码审查 |
| Scenario Automation | `scenario-automation/` | 数据看板、营销活动等业务场景自动化 |

## 5. 技能注册表

### 5.1 Design Efficiency

| Skill | 文件 | 优先级 | 状态 | 触发意图 |
|---|---|---|---|---|
| Chart Selector Skill | `design-efficiency/chart-selector-skill.md` | P0 | 待建设 | 根据业务问题、数据结构、分析目标选择图表 |
| Chart Builder Skill | `design-efficiency/chart-builder-skill.md` | P0 | 待建设 | 根据已选图表生成图表设计方案或组件结构 |
| Dashboard Planner Skill | `design-efficiency/dashboard-planner-skill.md` | P2 | 待建设 | 规划业务看板的信息架构、图表组合和阅读路径 |
| Chart Refactor Skill | `design-efficiency/chart-refactor-skill.md` | P2 | 待建设 | 重构已有图表，提高表达准确性、一致性和可维护性 |

### 5.2 Code Generation

| Skill | 文件 | 优先级 | 状态 | 触发意图 |
|---|---|---|---|---|
| G2 Codegen Skill | `code-generation/g2-codegen-skill.md` | P0 | 待建设 | 按 Wiki 规范生成 AntV G2 图表代码 |
| ECharts Codegen Skill | `code-generation/echarts-codegen-skill.md` | P0 | 待建设 | 按 Wiki 规范生成 ECharts 图表配置或代码 |
| Chart Engine Switcher Skill | `code-generation/chart-engine-switcher-skill.md` | P1 | 待建设 | 在 G2 / ECharts 等图表引擎之间迁移实现 |
| Code Snippet Builder Skill | `code-generation/code-snippet-builder-skill.md` | P1 | 待建设 | 生成可复用图表代码片段、示例和模板 |

### 5.3 Governance

| Skill | 文件 | 优先级 | 状态 | 触发意图 |
|---|---|---|---|---|
| Wiki Maintainer Skill | `governance/wiki-maintainer-skill.md` | P1 | 待建设 | 维护 Wiki 结构、补齐缺口、处理跨文件一致性 |
| Doc Scaffold Skill | `governance/doc-scaffold-skill.md` | P1 | 待建设 | 按文档治理规则创建或补全文档骨架 |
| Dependency Checker Skill | `governance/dependency-checker-skill.md` | P1 | 待建设 | 检查文档之间、Skill 之间的依赖关系和冲突 |
| Sync Planner Skill | `governance/sync-planner-skill.md` | P1 | 待建设 | 规划 Figma、Joyspace、GitHub Pages、MCP 等同步流程 |

### 5.4 Audit Review

| Skill | 文件 | 优先级 | 状态 | 触发意图 |
|---|---|---|---|---|
| Visual Auditor Skill | `audit-review/visual-auditor-skill.md` | P1 | 待建设 | 审查图表视觉语言、Token、布局和状态一致性 |
| Chart Appropriateness Reviewer | `audit-review/chart-appropriateness-reviewer.md` | P1 | 待建设 | 审查图表选型是否符合业务问题和数据结构 |
| Code Review Skill | `audit-review/code-review-skill.md` | P1 | 待建设 | 审查图表代码是否符合引擎适配、主题和可维护性规则 |

### 5.5 Scenario Automation

| Skill | 文件 | 优先级 | 状态 | 触发意图 |
|---|---|---|---|---|
| Data Dashboard Skill | `scenario-automation/data-dashboard-skill.md` | P2 | 待建设 | 面向经营、流量、商品、店铺、行业等数据看板自动化 |
| Campaign Analysis Skill | `scenario-automation/campaign-analysis-skill.md` | P2 | 待建设 | 面向活动提报、活动复盘、转化漏斗等营销分析场景自动化 |

## 6. 建设优先级

### 6.1 P0 核心闭环

目标：形成 VibeDesign + VibeCode 最小闭环。

优先建设：

- `design-efficiency/chart-selector-skill.md`
- `design-efficiency/chart-builder-skill.md`
- `code-generation/g2-codegen-skill.md`
- `code-generation/echarts-codegen-skill.md`

### 6.2 P1 治理增强

目标：让 Wiki 可持续生产与稳定维护。

优先建设：

- `governance/wiki-maintainer-skill.md`
- `governance/doc-scaffold-skill.md`
- `governance/dependency-checker-skill.md`
- `governance/sync-planner-skill.md`
- `audit-review/visual-auditor-skill.md`
- `audit-review/chart-appropriateness-reviewer.md`
- `audit-review/code-review-skill.md`

### 6.3 P2 业务化落地

目标：面向电商数据域与营销域落地。

优先建设：

- `design-efficiency/dashboard-planner-skill.md`
- `design-efficiency/chart-refactor-skill.md`
- `scenario-automation/data-dashboard-skill.md`
- `scenario-automation/campaign-analysis-skill.md`

## 7. 推荐调用链路

### 7.1 图表设计生成

用户需求 → `chart-selector-skill` → `chart-builder-skill` → `visual-auditor-skill`

### 7.2 图表代码生成

用户需求 → `chart-selector-skill` → `chart-builder-skill` → `g2-codegen-skill` 或 `echarts-codegen-skill` → `code-review-skill`

### 7.3 看板规划

业务场景 → `dashboard-planner-skill` → `chart-selector-skill` → `chart-builder-skill` → `visual-auditor-skill`

### 7.4 Wiki 治理维护

维护任务 → `wiki-maintainer-skill` 或 `doc-scaffold-skill` → `dependency-checker-skill` → `sync-planner-skill`

### 7.5 业务场景自动化

业务问题 → `data-dashboard-skill` 或 `campaign-analysis-skill` → `dashboard-planner-skill` → 图表设计或代码生成链路

## 8. Skill 文件标准结构

每个 Skill 文件建议采用以下结构：

1. 文档定位
2. 触发场景
3. 输入要求
4. 必读 Wiki 文件
5. 执行流程
6. 输出格式
7. 依赖 Skill
8. 不负责事项
9. 自查清单

## 9. 维护规则

- 新增 Skill 时，必须先登记到本文。
- 新增 Skill 依赖时，必须同步更新 `dependency-map.md`。
- 修改 Skill 运行边界时，必须同步检查 `skill-runtime-contract.md`。
- Skill 状态变更时，应更新本文“状态”字段。
- Skill 不直接替代 Wiki 规范；如果发现规范缺口，应回写 Knowledge Layer 对应文档。
- P0 Skill 优先补齐执行流程，P1 / P2 Skill 可先保留骨架。


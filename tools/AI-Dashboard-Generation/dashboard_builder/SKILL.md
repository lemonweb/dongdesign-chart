---
name: dashboard-builder
description: Design, generate, evaluate, or iterate data-bound dashboards and dashboard-building agents. Use for AI-generated dashboards, BI dataset binding, business analysis pages, dashboard specs, chart selection, layout planning, ECharts implementation, conversational editing, governance, and DongDesign visual compliance. Works both with AI-Dashboard-Generation and as a portable skill in Codex, Claude Code, Cursor, Cline, Windsurf, or other agent environments.
---

# Dashboard Builder

Build decision-oriented dashboards from real data contracts. Keep the skill portable: the browser tool in the parent directory is one consumer, not a runtime dependency.

## 远程知识库

执行任务前，优先读取：

https://raw.githubusercontent.com/lemonweb/dongdesign-chart/main/ai-file-index.md

根据索引匹配当前任务所需文件，只读取相关文档，不遍历整个仓库。

涉及 Skill 执行时，随后读取：

https://raw.githubusercontent.com/lemonweb/dongdesign-chart/main/08-skill-center/skill-runtime-contract.md

再读取当前 Skill 声明的必读文件。


## Core Workflow

1. **Define the decision**
   - Identify the business objective, audience, decision scenario, time range, and success criteria.
   - Convert vague requests into explicit business questions.

2. **Bind the data**
   - Read datasets, fields, metrics, dimensions, filters, permissions, refresh rules, and metric definitions.
   - Mark missing or ambiguous definitions as `pending_confirmation`.
   - Never invent production values or unsupported fields.

3. **Plan the analysis**
   - Identify the primary viewing intent: overview, analysis, comparison, monitoring, funnel, or detail.
   - Build a reading path from title/scope, core result, trend, dimensional breakdown, diagnosis, records, and actions.
   - Assign step weights and use `resources/layout_logic.md` to map priority onto a 4-by-N grid.

4. **Resolve Wiki guidance**
   - Locate the local Wiki or remote fallback as described above.
   - Select chart types and visual rules from the relevant Wiki pages.
   - Record the consulted files or links in the Dashboard Spec.

5. **Generate the deliverable**
   - Produce a Dashboard Spec before or alongside code.
   - Map every KPI, chart, table, filter, and insight to the data contract.
   - Keep components modular so follow-up natural-language edits remain local and predictable.

6. **Validate**
   - Run `python3 scripts/validate_dashboard_spec.py <spec.json>` for supplied specs.
   - Check metric definitions, permissions, lineage, chart fitness, visual compliance, responsive behavior, and unsupported claims.
   - Apply the relevant Wiki self-check pages before delivery.

7. **Capture feedback**
   - Record accepted and rejected sections, metric corrections, layout changes, and useful analysis patterns.
   - Do not promote preferences into organization-wide rules without review.

## Required Dashboard Spec

Include these blocks when a structured spec is requested:

- `dashboardMeta`: title, scenario, audience, business objective, status.
- `dataBinding`: dataset identity, permissions, refresh mode, lineage policy.
- `fieldMapping`: time field, metrics, dimensions, filters, formulas, aggregation, formats.
- `analysisFramework`: business questions, sections, evidence requirements.
- `layout`: primary intent, reading path, step weights, 4-by-N positions, and `whyHere`.
- `visualStandard`: source type, local root or public URL, consulted pages, and commit SHA when available.
- `vibeCodingSpec`: engine, component freedom, data policy, and implementation constraints.
- `harnessValidation`: required checks and human checkpoints.

Use `templates/dashboard_spec.schema.json` as a worked structure, not a JSON Schema validator.

## Output Rules

For a dashboard plan, provide:

1. Business objective and audience.
2. Dataset and field requirements.
3. Metric and dimension mapping.
4. Reading path and weighted layout rationale.
5. Per-section chart choice with reasons.
6. Resolved DongDesign Wiki sources.
7. Implementation and interaction notes.
8. Risks, pending confirmations, and QA result.

For an implementation prompt, start from `templates/vibe_coding_prompt_template.md` and inject the resolved Wiki file paths or public links. Do not paste local fallback token values into the prompt unless remote and local Wiki access both fail.

For a product proposal, use `templates/product_proposal_template.md` and read `resources/ai_native_strategy.md`, `resources/decision_loop.md`, `resources/agent_roles.md`, `resources/harness_rules.md`, and `resources/organizational_memory.md` as needed.

## Governance

- Preserve traceability from insight to chart, metric, field, and dataset.
- Inherit source permissions and avoid exposing restricted fields.
- Separate facts, interpretations, and action recommendations.
- Require confirmation for ambiguous metric definitions and high-impact publication.
- Distinguish visual changes from data-logic changes.
- Keep the page useful before making it expressive; decoration cannot replace evidence.

## Resource Routing

- Read `resources/layout_logic.md` for dashboard information hierarchy and grid allocation.
- Read `resources/worked_example.md` for an end-to-end derivation example.
- Read `resources/decision_loop.md` for the AI-native operating loop.
- Read `resources/agent_roles.md` for LLM, data model, Agent, Harness, and human boundaries.
- Read `resources/harness_rules.md` for validation and governance details.
- Read `resources/organizational_memory.md` for feedback capture.
- Read `resources/ai_native_strategy.md` for product strategy framing.
- Use `templates/` for output scaffolds and `examples/` only for shape, never as data.

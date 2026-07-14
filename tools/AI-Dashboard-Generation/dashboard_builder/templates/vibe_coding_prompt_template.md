# Vibe Coding Prompt Template for AI Native BI Dashboard

You are building an AI-generated BI dashboard page. This is not a static demo. The page must consume the provided BI data contract and must keep all business values replaceable by real dataset fields.

## Goal

Generate a high-quality, data-bound dashboard page for:

- Scenario: {{scenario}}
- Audience: {{audience}}
- Business objective: {{businessObjective}}
- Style preset: {{stylePreset}}

## Data contract

Use only the following metrics, dimensions, filters, and derived calculations:

{{dataContract}}

Rules:

- Do not hard-code business values unless marked as mock.
- Every KPI and chart must map to a metric or calculation in the data contract.
- Every insight must be traceable to supporting data.
- If data is missing, show a pending state instead of inventing values.

## Page structure

Build the page using this analysis structure:

{{analysisFramework}}

Recommended narrative order:

1. Executive conclusion
2. Core KPI overview
3. Trend evidence
4. Contribution/comparison evidence
5. Anomaly or risk diagnosis
6. Action recommendations
7. Detail table or drill-down area if needed

## Visual standard (DongDesign Wiki)

Use the resolved DongDesign Chart Wiki as the source of truth. Do not invent a palette or copy values from model memory.

- Resolved source: {{dongDesignWikiSource}}
- Consulted pages: {{dongDesignWikiPages}}
- Commit SHA when available: {{dongDesignWikiCommit}}
- Chart engine: {{chartEngine}}

Apply the tokens, chart structure, interactions, responsive behavior, and engine adapter defined by those pages. When using a project theme package, treat it as an implementation adapter and verify it against the consulted Wiki pages.

Also apply the scenario-specific preset rules:

{{visualStyleRules}}

Avoid generic flat BI stacking. Use a polished data story page with strong information hierarchy, readable typography, and scenario-specific visual rhythm within the resolved DongDesign guidance.

## Interactions

Support:

- Global date filter
- Dimension filter if provided
- Hover tooltip with metric definition
- Section-level drill-down if data contract supports it
- Natural-language edit compatibility: components should be modular and easy to replace

Implement only interactions supported by the data contract and required by the consulted Wiki pages. Keep keyboard access, hover/click behavior, filtering, drill-down, and reset states explicit.

## Responsive behavior

- Desktop: full data story layout
- Tablet: preserve hierarchy and stack secondary sections
- Mobile: show conclusion and KPI first, collapse deep analysis sections

## Governance

- Inherit BI permissions.
- Do not expose restricted fields.
- Mark unvalidated insights as tentative.
- Separate fact, interpretation, and action suggestion.

## Acceptance criteria

The output is acceptable only if:

- It binds to the data contract.
- It answers the business objective.
- It records and follows the resolved DongDesign Wiki source and consulted pages.
- It is visually better than default BI components.
- It remains readable and maintainable.
- It does not fabricate data or unsupported conclusions.

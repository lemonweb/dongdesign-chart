# Harness Rules

Harness is the governance layer that keeps AI dashboard generation useful, trustworthy, and reusable.

## Data rules

- Every displayed value must come from a bound dataset, a provided sample, or a clearly defined calculation.
- Never fabricate business data.
- If data is missing, mark the field as `待绑定` or `待确认`.
- Every insight must link back to supporting metrics and fields.
- Inherit BI dataset permissions by default.
- Do not expose row-level or sensitive fields without permission.

## Metric rules

- Every metric must have a source field or formula.
- Every aggregation must be explicit: sum, count, distinct count, average, ratio, max, min, etc.
- Every comparison must define baseline: previous period, same period last year, target, average, benchmark, etc.
- Derived metrics must show calculation logic.
- Ambiguous business metrics must ask for confirmation or mark as unresolved.

## Analysis rules

- Every dashboard section must answer a business question.
- Do not use charts for decoration only.
- Do not recommend advanced analysis unless the dataset can support it.
- Separate facts, inferred insights, and action suggestions.
- Mark confidence level when generating diagnosis or recommendations.

## Visual rules

- Visual freedom does not mean visual chaos.
- Maintain hierarchy, readability, and business clarity.
- Use style to strengthen meaning, not to hide weak analysis.
- Avoid overloading a single screen.
- Ensure chart labels, KPI numbers, and legends are readable.

## Code/vibe-coding rules

- Generated code should consume structured data contracts, not hard-coded business values.
- Separate data layer, view layer, and style layer when possible.
- Use mock data only when explicitly marked as mock.
- Preserve a path for real BI dataset replacement.
- Generated interactions must not imply unsupported backend capabilities.

## Human checkpoint rules

Require explicit confirmation when:

- Metric definitions are ambiguous.
- The page will be published to others.
- The generated page changes business logic rather than only style.
- AI recommends actions with material business consequences.
- Data permission or sensitivity is unclear.

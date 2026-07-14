# Decision Loop for AI Dashboard Generation

Map every AI dashboard task into this loop.

## 1. Goal definition

Questions:

- What business decision does this dashboard support?
- Who will read it?
- Is it for monitoring, review, diagnosis, comparison, forecast, or presentation?
- What does success look like?

Output:

- Scenario
- Audience
- Business objective
- Success criteria

## 2. Data sensing

Questions:

- Which dataset should be used?
- What are the available metrics, dimensions, filters, and time fields?
- Are metric definitions clear?
- Are there permission restrictions?

Output:

- Dataset binding
- Field mapping
- Missing field list
- Metric ambiguity list

## 3. Analysis generation

Questions:

- What analytical structure best answers the business goal?
- Which sections are necessary?
- Which charts or visual expressions match the intent?

Output:

- Analysis outline
- Section-level business questions
- Recommended visual expressions

## 4. Quantitative evaluation

Questions:

- Can the mapped data support every section?
- Are comparisons valid?
- Are time ranges and baselines consistent?
- Are insights backed by data?

Output:

- Validation result
- Unsupported claims
- Suggested corrections

## 5. Agent execution

Actions:

- Generate dashboard specification
- Generate data query plan
- Generate vibe-coding UI prompt
- Generate or modify front-end code if applicable

Output:

- Dashboard spec
- Data contract
- Implementation prompt
- Preview page

## 6. Real-time feedback

User actions:

- Edit structure
- Edit metrics
- Edit visual style
- Edit language tone
- Regenerate sections
- Lock approved sections

Output:

- Revision log
- Locked sections
- Pending issues

## 7. Review learning

Capture:

- Which sections were accepted
- Which sections were removed
- Which metric mappings were corrected
- Which style was selected
- Which final conclusion was approved

Output:

- Feedback record
- Template candidate
- Strategy candidate

## 8. Strategy evolution

Convert repeated successful patterns into:

- scenario template
- metric mapping rule
- analysis framework
- visual pattern
- Agent workflow
- Harness rule

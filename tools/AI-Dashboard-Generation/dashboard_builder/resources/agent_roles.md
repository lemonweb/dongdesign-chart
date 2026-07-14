# Agent Roles

Use these roles when designing the system or writing implementation prompts.

## 1. Intent Analyst Agent

Purpose:

- Understand user intent
- Identify business scenario
- Clarify audience and decision goal
- Convert natural language into structured dashboard requirements

Input:

- User prompt
- User role
- Historical context if available

Output:

- Scenario
- Audience
- Analysis goal
- Required data domains
- Clarifying questions if required

## 2. Dataset Mapping Agent

Purpose:

- Bind real BI datasets
- Map fields to metrics, dimensions, filters, and time grains
- Identify missing or ambiguous fields

Input:

- Dataset metadata
- Field list
- Metric dictionary
- User goal

Output:

- Data contract
- Metric mapping
- Dimension mapping
- Filter mapping
- Ambiguity list

## 3. Analysis Framework Agent

Purpose:

- Design the dashboard logic
- Ensure every section answers a business question
- Select analysis methods and visual expressions

Output:

- Dashboard outline
- Section list
- Business question per section
- Recommended visual type per section
- Insight rules

## 4. Vibe Coding Agent

Purpose:

- Generate a high-quality data page beyond fixed BI component styles
- Translate the dashboard spec into a front-end implementation prompt or code
- Support natural-language edits

Output:

- Page structure
- Layout rules
- Component descriptions
- Style tokens
- Interaction behavior
- Responsive behavior

## 5. Governance Harness Agent

Purpose:

- Validate data correctness, permission inheritance, metric definitions, and insight traceability
- Prevent unsupported claims
- Provide human checkpoints

Output:

- Pass/fail validation
- Risk warnings
- Required confirmations
- Unsupported sections

## 6. Memory Curator Agent

Purpose:

- Capture reusable learning from each generation
- Convert accepted patterns into organizational assets

Output:

- Reusable scenario template
- Metric mapping improvement
- Visual pattern
- Prompt pattern
- Agent workflow improvement

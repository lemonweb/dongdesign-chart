# AI 读取顺序

## 1. 读取目标

本文件用于指导 AI 在处理本 Wiki 相关任务时按稳定顺序读取上下文，避免跳过全局规则、误用图表类型或生成不符合设计体系的内容。

## 2. 默认读取顺序

1. `ai-file-index.md`
2. `README.md`
3. `00-overview/how-to-use.md`
4. `00-overview/decision-tree.md`
5. `00-overview/glossary.md`
6. `01-design-language/README.md`
7. `05-rules/README.md`

## 3. 按任务补充读取

### 3.1 图表选型任务

继续读取：

- `02-chart-type/capability-matrix.md`
- `02-chart-type/selection-rules.md`
- 对应具体图表文档

### 3.2 业务分析页面任务

继续读取：

- `03-pattern/README.md`
- 对应业务场景文档
- 相关图表类型文档

### 3.3 代码生成任务

继续读取：

- `04-adaptation/theme-schema.md`
- `04-adaptation/g2-adapter.md` 或 `04-adaptation/echarts-adapter.md`
- `06-self-check/code-checklist.md`

### 3.4 文档治理任务

继续读取：

- `07-document-governance/general-writing-principles.md`
- 与目标目录对应的写法原则
- `07-document-governance/metadata-naming-guide.md`

### 3.5 可视化增强任务

继续读取：

- `09-visual-enhancement/README.md`
- `09-visual-enhancement/principle.md`
- `09-visual-enhancement/relationship-patterns.md`
- `09-visual-enhancement/enhancement-decision-tree.md`
- `01-design-language/label.md`
- `01-design-language/theme-token.md`
- 对应具体图表文档

## 4. 执行原则

- 先理解业务问题，再选择图表。
- 先读取视觉语言，再生成样式。
- 先判断图表选型，再读取具体图表组件文档。
- 代码生成必须读取引擎适配规范。
- 涉及持续维护、偏好、自动化工作流时，必须先查 `ai-file-index.md`，再读取相关 Skill 或治理文件。
- 不得随机使用颜色、样式、动效和图表类型。

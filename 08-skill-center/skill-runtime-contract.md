# Skill Runtime Contract

## 1. 文档定位

本文是 `08-skill-center/` 全部 Skill 的统一运行契约。

所有 Skill 在执行前必须先读取本文件，确认运行边界、读写边界和输出规范一致。

Skill 是薄执行层，它不重新定义规则，只读取 Knowledge Layer，按用户任务意图组织执行流程并输出结果。

## 2. 适用范围

适用于本目录下的全部 Skill：

- `design-efficiency/`
- `code-generation/`
- `governance/`
- `audit-review/`
- `scenario-automation/`

如果某个 Skill 与本文冲突，以本文为准。

## 3. 通用原则

### 3.1 先读规则，执行

- 任何 Skill 在生成结果前，必须先读取自身声明的“必读 Wiki 文件”。
- 不得跳过必读文件直接产出方案、代码、审查结论或文档骨架。
- 必读文件不存在或为空时，必须标注“规范不足”，并停步等待人工补齐。

### 3.2 不复制规范正文

- Skill 文件中不得粘贴 Knowledge Layer 的大段正文。
- 当用户需要规范细节时，使用相对路径引用，例如 `01-design-language/color.md`。
- 输出结果中可以引用规范结论，但必须给出来源路径。

### 3.3 最小改动原则

- 修改文档时，优先采用“章节级”修改，而不是整篇重写。
- 不主动改变既有命名、目录结构和路径约定。
- 不批量重命名文件，除非用户明确要求并生成迁移表。

### 3.4 不越权修改

- 不修改 Protected Section（包含设计原则、Token 定义、组件元数据等核心规范）。
- 跨目录修改前，必须显式声明涉及的文件清单。
- 治理类 Skill 修改 Wiki 时，必须同步更新引用路径与 `ai-file-index.md`。

### 3.5 不把推断当规范

- 当 Wiki 未明确定义某项规则时，输出必须显式标注“推断”或“风险”。
- 不得把临时推断或个人偏好回写到核心规范文件。
- 必要时回写到 `Wiki Compliance Packet` 或人工 Review 列表。

### 3.6 输出前自查

- 每个 Skill 必须在输出前执行自身定义的“自查清单”。
- 自查不通过时，应在输出中显式说明缺口，而不是隐藏问题。

## 4. 输入与上下文

### 4.1 任务意图优先

- Skill 不按工具名注册，按用户任务意图注册。
- 同一意图允许多个 Skill 协作，按 `registry.md` 中的优先级链路调用。

### 4.2 上下文最小化

- 只读取与当前任务相关的文件，避免无关读取增加噪音。
- 大文件优先读取关键章节而非整篇。

### 4.3 输入不足时停步

- 必需输入缺失时，必须先向用户索要，而不是猜测。
- 推荐输入缺失时，可以在输出中标注“缺失项及其影响”。

## 5. 输出格式

### 5.1 结构化输出

- 输出必须有清晰章节，便于下游 Skill 接续。
- 涉及下游 Skill 调用时，必须输出标准 Handoff Packet（如 `Builder Handoff Packet`、`Visual Fidelity Packet`、`Wiki Compliance Packet`、`Same-size Generation Packet`）。

### 5.2 文件路径引用

- 引用 Wiki 文件统一使用相对路径，例如 `02-chart-type/basic/line-chart.md`。
- 引用代码符号或文件名时使用反引号。

### 5.3 风险标注

- 输出必须显式标注：
  - 已确认结论
  - 推断或假设
  - 已知风险或规范缺口
  - 需要人工确认的事项

## 6. 跨 Skill 协作

### 6.1 上下游边界

- 跨 Skill 调用必须遵守 `dependency-map.md`。
- 调用下游 Skill 时，必须传递结构化 Handoff Packet，而不是自由文本。

### 6.2 不擅自跨域

- Design Efficiency 类 Skill 不直接生成代码。
- Code Generation 类 Skill 不重新选图。
- Audit Review 类 Skill 不替代设计决策。
- Governance 类 Skill 不替代图表规范。
- Scenario Automation 类 Skill 只规划场景与组合，不替代选型与生成。

### 6.3 链路终止条件

- 链路中任意一环出现“规范不足”“输入不足”或“风险未确认”时，必须停步并交回上一层。

## 7. Wiki 治理边界

- Skill 发现规范缺口时，必须把缺口写入 `wiki-maintainer-skill` 的待办列表，而不是在执行链路中临时补写。
- Skill 不得新增、删除目录或重命名核心文件。
- 路径变更必须通过 `doc-scaffold-skill` + `dependency-checker-skill` 配合完成。

## 8. 自查清单

输出前必须确认：

- 是否读取了所有必读文件？
- 是否避免了复制规范正文？
- 是否避免了越权修改？
- 是否标注了风险与缺口？
- 是否产出了结构化 Handoff Packet？
- 是否遵守了 `registry.md` 与 `dependency-map.md` 中的边界？
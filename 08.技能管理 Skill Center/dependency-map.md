# Skill Dependency Map

## 1. 文档定位

本文记录 `08.技能管理 Skill Center/` 中各 Skill 之间的调用关系和依赖边界。

Skill 之间只传递任务意图、读取路径和输出结果，不复制 Knowledge Layer 的规范正文。

## 2. 设计规范转 Wiki 链路

### 2.1 主链路

```txt
Figma / Zero / Relay 设计规范链接 + 目标 md
→ design-spec-to-wiki-skill
→ dependency-checker-skill
→ sync-planner-skill
```

### 2.2 依赖关系

| 上游 Skill | 下游 Skill | 触发条件 |
|---|---|---|
| `design-spec-to-wiki-skill` | `doc-scaffold-skill` | 目标 md 为空、缺少基础章节或需要新建文档 |
| `design-spec-to-wiki-skill` | `wiki-maintainer-skill` | 设计规范内容暴露 Wiki 上游规范缺口 |
| `design-spec-to-wiki-skill` | `dependency-checker-skill` | 文档完成后检查引用、变量、路径和冲突 |
| `design-spec-to-wiki-skill` | `visual-auditor-skill` | 目标文档属于视觉语言规范 |
| `dependency-checker-skill` | `sync-planner-skill` | 需要提交、同步或发布到 GitHub / Pages |

### 2.3 运行边界

- `design-spec-to-wiki-skill` 负责从 Figma / Zero / Relay 等设计规范来源转成 Wiki md。
- `doc-scaffold-skill` 只负责骨架，不判断设计规范语义。
- `wiki-maintainer-skill` 负责跨目录补缺口。
- `dependency-checker-skill` 负责检查依赖，不改写核心内容。
- `sync-planner-skill` 负责同步计划，不决定文档内容。

## 3. 图表设计生成链路

### 3.1 主链路

```txt
业务问题 + 数据字段
→ chart-selector-skill
→ chart-builder-skill
→ visual-auditor-skill
```

### 3.2 代码生成延展链路

```txt
chart-builder-skill 输出的图表设计方案
→ g2-codegen-skill / echarts-codegen-skill
→ code-review-skill
```

### 3.3 依赖关系

| 上游 Skill | 下游 Skill | 触发条件 |
|---|---|---|
| `chart-selector-skill` | `chart-builder-skill` | 已完成图表选型，需要生成设计方案或组件结构 |
| `chart-selector-skill` | `chart-appropriateness-reviewer` | 图表选型存在争议、复杂图表或用户指定图表不匹配数据 |
| `chart-builder-skill` | `visual-auditor-skill` | 已生成 Figma / Relay 图表，需要审查视觉一致性 |
| `chart-builder-skill` | `g2-codegen-skill` | 用户需要 G2 代码实现 |
| `chart-builder-skill` | `echarts-codegen-skill` | 用户需要 ECharts 代码实现 |
| `g2-codegen-skill` | `code-review-skill` | G2 代码生成后需要审查 |
| `echarts-codegen-skill` | `code-review-skill` | ECharts 代码生成后需要审查 |

### 3.4 运行边界

- `chart-selector-skill` 负责判断图表类型，不生成视觉方案。
- `chart-builder-skill` 负责把图表组件文档和视觉语言转成可执行设计方案，不重新选图；输出中必须包含 `Visual Fidelity Packet`，把文字规格、图例 shape、Tooltip effect 等可验证约束传给下游。
- `visual-auditor-skill` 负责审查结果，不替代生成流程；审查时应优先检查 `Visual Fidelity Packet` 中的字号、图例形态、Tooltip 阴影和组件实例差异。
- `g2-codegen-skill` / `echarts-codegen-skill` 负责代码实现，不改变设计意图。
